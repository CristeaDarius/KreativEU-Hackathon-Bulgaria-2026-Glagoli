import React from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from '../components/TopBar';

const MainLayout = () => {
  return (
    <div className="h-dvh w-full bg-surface-dim flex justify-center overflow-hidden">
      <div className="relative h-dvh w-full max-w-[430px] bg-background text-on-surface flex flex-col overflow-hidden font-['Manrope'] antialiased shadow-[0_0_48px_rgba(0,38,46,0.12)]">
        <TopBar />
        <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
