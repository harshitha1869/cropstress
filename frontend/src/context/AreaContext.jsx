import { createContext, useContext, useState } from "react";

const AreaContext = createContext();

export const AreaProvider = ({ children }) => {
  const [area, setArea] = useState("");

  return (
    <AreaContext.Provider value={{ area, setArea }}>
      {children}
    </AreaContext.Provider>
  );
};

export const useArea = () => useContext(AreaContext);
