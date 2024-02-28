/*
Context wrapper for altering state throughout the app when printing/exporting PDF
*/

import React, { createContext, useState } from 'react';

type PrintPDFWrapperProps = {
  children: React.ReactNode;
};

// Create the print/PDF context, default to false/not exporting
export const PrintPDFContext = createContext<{
  isPrintPDF: boolean;
  setPrintPDF: (isSet: boolean) => void;
}>({
  isPrintPDF: false,
  setPrintPDF: () => null
});

const PrintPDFWrapper = ({ children }: PrintPDFWrapperProps) => {
  const [isPrintPDF, setPrintPDF] = useState<boolean>(false);

  return (
    // The Provider gives access to the context to its children
    <PrintPDFContext.Provider value={{ isPrintPDF, setPrintPDF }}>
      {children}
    </PrintPDFContext.Provider>
  );
};

export default PrintPDFWrapper;
