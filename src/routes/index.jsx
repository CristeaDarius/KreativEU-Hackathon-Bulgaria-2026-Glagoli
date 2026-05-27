import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import FullscreenLayout from '../layouts/FullscreenLayout';
import MainLayout from '../layouts/MainLayout';
import Splash from '../pages/Splash';
import Login from '../pages/Login';
import Home from '../pages/Home';
import BuildYourDay from '../pages/BuildYourDay';
import RouteMap from '../pages/RouteMap';
import Compendium from '../pages/Compendium';
import Dashboard from '../pages/Dashboard';
import Settings from '../pages/Settings';
import Questionnaire from '../pages/Questionnaire';
import NotFound from '../pages/NotFound';

const router = createBrowserRouter([
  {
    element: <FullscreenLayout />,
    children: [
      { path: '/', element: <Splash /> },
      { path: '/login', element: <Login /> },
    ],
  },
  {
    element: <MainLayout />,
    children: [
      { path: '/explore', element: <Home /> },
      { path: '/build', element: <BuildYourDay /> },
      { path: '/route-map', element: <RouteMap /> },
      { path: '/compendium', element: <Compendium /> },
      { path: '/concierge', element: <Home /> },
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/settings', element: <Settings /> },
      { path: '/questionnaire', element: <Questionnaire /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export default router;
