'use client';

import Spline from '@splinetool/react-spline/next';

export default function Home() {
  return (
    <main className="w-full h-screen overflow-hidden">
      <Spline
        scene="/scene.splinecode"
        wasmPath="/"
      />
    </main>
  );
}
