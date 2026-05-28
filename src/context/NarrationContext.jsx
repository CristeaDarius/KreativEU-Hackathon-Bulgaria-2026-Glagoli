import React, { createContext, useContext, useRef, useState } from 'react';

const NarrationContext = createContext({
  setNarrationKeys: () => {},
  getNarrationKeys: () => [],
  activeKey: null,
  setActiveKey: () => {},
});

export const NarrationProvider = ({ children }) => {
  const keysRef = useRef([]);
  const [activeKey, setActiveKey] = useState(null);

  const setNarrationKeys = (keys) => { keysRef.current = keys; };
  const getNarrationKeys = () => keysRef.current;

  return (
    <NarrationContext.Provider value={{ setNarrationKeys, getNarrationKeys, activeKey, setActiveKey }}>
      {children}
    </NarrationContext.Provider>
  );
};

export const useNarration = () => useContext(NarrationContext);
