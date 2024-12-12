// # What to do next

// - need to reset categoryID in MTOModalContext when the modal closes

import React, { createContext, useState } from 'react';

interface MTOModalContextType {
  isMTOModalOpen: boolean;
  setMTOModalOpen: (isOpen: boolean) => void;
  mtoModalType: 'category' | 'milestone' | 'solution' | 'solutionToMilestone';
  setMTOModalType: (
    type: 'category' | 'milestone' | 'solution' | 'solutionToMilestone'
  ) => void;
  categoryID: string;
  setCategoryID: (id: string) => void;
  subCategoryID: string;
  setSubCategoryID: (id: string) => void;
}

const MTOModalContext = createContext<MTOModalContextType>({
  // Context Default Values
  isMTOModalOpen: false,
  setMTOModalOpen: (isMTOModalOpen: boolean) => {},
  mtoModalType: 'category',
  setMTOModalType: (
    mtoModalType: 'category' | 'milestone' | 'solution' | 'solutionToMilestone'
  ) => {},
  categoryID: '',
  setCategoryID: (id: string) => {},
  subCategoryID: '',
  setSubCategoryID: (id: string) => {}
});

const MTOModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMTOModalOpen, setMTOModalOpen] = useState(false);
  const [mtoModalType, setMTOModalType] = useState<
    'category' | 'milestone' | 'solution' | 'solutionToMilestone'
  >('category');
  const [categoryID, setCategoryID] = useState('');
  const [subCategoryID, setSubCategoryID] = useState('');

  return (
    <MTOModalContext.Provider
      value={{
        isMTOModalOpen,
        setMTOModalOpen,
        mtoModalType,
        setMTOModalType,
        categoryID,
        setCategoryID,
        subCategoryID,
        setSubCategoryID
      }}
    >
      {children}
    </MTOModalContext.Provider>
  );
};

export { MTOModalContext, MTOModalProvider };
