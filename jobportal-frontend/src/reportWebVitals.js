const reportWebVitals = (onPerfEntry) => {
   // Checks if onPerfEntry is a function before proceeding
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry); // Measures Cumulative Layout Shift (CLS)
      getFID(onPerfEntry);  // Measures First Input Delay (FID)
      getFCP(onPerfEntry); // Measures First Contentful Paint (FCP)
      getLCP(onPerfEntry); // Measures Largest Contentful Paint (LCP)
      getTTFB(onPerfEntry); // Measures Time to First Byte (TTFB)
    });
  }
};

// Exports the function for use in other parts of the application
export default reportWebVitals;