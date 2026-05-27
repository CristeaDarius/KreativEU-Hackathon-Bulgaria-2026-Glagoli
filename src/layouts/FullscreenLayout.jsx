import React from 'react';
import { Outlet } from 'react-router-dom';

const FullscreenLayout = () => (
  <div className="h-dvh w-full bg-surface-dim flex justify-center overflow-hidden">
    <div className="h-dvh max-h-dvh w-full max-w-[430px] bg-background overflow-y-auto custom-scrollbar shadow-[0_0_48px_rgba(0,38,46,0.12)]">
      <Outlet />
    </div>
  </div>
);

export default FullscreenLayout;
