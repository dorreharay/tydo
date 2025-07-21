import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface NavigationContextType {
  initialMessage: string | null;
  setInitialMessage: (message: string | null) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [initialMessage, setInitialMessage] = useState<string | null>(null);

  return (
    <NavigationContext.Provider value={{ initialMessage, setInitialMessage }}>
      {children}
    </NavigationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};