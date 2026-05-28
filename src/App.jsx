import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import { NarrationProvider } from './context/NarrationContext';

const App = () => {
  return (
    <NarrationProvider>
      <RouterProvider router={router} />
    </NarrationProvider>
  );
};

export default App;
