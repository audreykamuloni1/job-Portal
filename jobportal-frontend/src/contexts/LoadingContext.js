import React, { createContext, useState, useContext, useCallback } from 'react';

const LoadingContext = createContext({
  isLoading: false,
  showLoading: () => {},
  hideLoading: () => {},
});

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...'); // Optional message

  // Using useCallback to prevent unnecessary re-renders of consumers if these functions were passed directly
  const showLoading = useCallback((message = 'Loading...') => {
    setLoadingMessage(message);
    setIsLoading(true);
  }, []);

  const hideLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading, loadingMessage }}>
      {children}
    </LoadingContext.Provider>
  );
};
