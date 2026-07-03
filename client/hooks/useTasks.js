'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { taskApi } from '@/lib/api';
import { statusToStatKey } from '@/lib/utils';
import toast from 'react-hot-toast';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, todo: 0, inProgress: 0, done: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    search: '',
    sortBy: 'createdAt',
    order: 'desc',
  });

  const fetchTasks = useCallback(async (activeFilters) => {
    try {
      setLoading(true);
      const params = {};
      if (activeFilters.status !== 'all') params.status = activeFilters.status;
      if (activeFilters.priority !== 'all') params.priority = activeFilters.priority;
      if (activeFilters.search) params.search = activeFilters.search;
      if (activeFilters.sortBy) params.sortBy = activeFilters.sortBy;
      if (activeFilters.order) params.order = activeFilters.order;

      const res = await taskApi.getAll(params);
      setTasks(res.data || []);
      setStats(res.stats || { total: 0, todo: 0, inProgress: 0, done: 0 });
    } catch (err) {
      toast.error(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce search filter
  const debounceTimer = useRef(null);
  useEffect(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchTasks(filters);
    }, 300);
    return () => clearTimeout(debounceTimer.current);
  }, [filters, fetchTasks]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const createTask = async (data) => {
    const toastId = toast.loading('Creating task…');
    try {
      const res = await taskApi.create(data);
      setTasks((prev) => [res.data, ...prev]);
      const statKey = statusToStatKey(res.data.status);
      setStats((prev) => ({
        ...prev,
        total: prev.total + 1,
        [statKey]: prev[statKey] + 1,
      }));
      toast.success('Task created!', { id: toastId });
      return res.data;
    } catch (err) {
      toast.error(err.message, { id: toastId });
      throw err;
    }
  };

  const updateTask = async (id, data) => {
    const toastId = toast.loading('Updating task…');
    try {
      const res = await taskApi.update(id, data);
      setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)));
      // Refresh stats
      fetchTasks(filters);
      toast.success('Task updated!', { id: toastId });
      return res.data;
    } catch (err) {
      toast.error(err.message, { id: toastId });
      throw err;
    }
  };

  const deleteTask = async (id) => {
    const toastId = toast.loading('Deleting task…');
    try {
      await taskApi.remove(id);
      const removed = tasks.find((t) => t._id === id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      if (removed) {
        const statKey = statusToStatKey(removed.status);
        setStats((prev) => ({ ...prev, total: prev.total - 1, [statKey]: prev[statKey] - 1 }));
      }
      toast.success('Task deleted.', { id: toastId });
    } catch (err) {
      toast.error(err.message, { id: toastId });
      throw err;
    }
  };

  return {
    tasks,
    stats,
    loading,
    filters,
    updateFilter,
    createTask,
    updateTask,
    deleteTask,
    refetch: () => fetchTasks(filters),
  };
};
