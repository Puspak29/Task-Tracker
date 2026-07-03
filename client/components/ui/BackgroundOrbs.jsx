'use client';

export default function BackgroundOrbs() {
  return (
    <>
      <div className="fixed rounded-full pointer-events-none z-0 filter blur-[120px] w-[600px] h-[600px] bg-brand/8 top-[-200px] left-[-150px]" />
      <div className="fixed rounded-full pointer-events-none z-0 filter blur-[120px] w-[500px] h-[500px] bg-brand/5 bottom-[-100px] right-[-150px]" />
    </>
  );
}
