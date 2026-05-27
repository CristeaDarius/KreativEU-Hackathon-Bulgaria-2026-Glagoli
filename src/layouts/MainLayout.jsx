import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

const MainLayout = () => {
  const { pathname } = useLocation();
  const isMap = pathname === '/route-map';

  return (
    <div className="h-dvh w-full bg-surface-dim flex justify-center overflow-hidden">
      <div className="relative h-dvh w-full max-w-[430px] bg-background text-on-surface flex flex-col overflow-hidden font-['Manrope'] antialiased shadow-[0_0_48px_rgba(0,38,46,0.12)]">
        <TopBar />
        <main className={`flex-1 min-h-0 ${isMap ? 'overflow-hidden' : 'overflow-y-auto custom-scrollbar pb-24'}`}>
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
};

export default MainLayout;
