// # What to do next

// - Edit sub/category titles
// - if subcategory, deal with the move to another category

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
  resetCategoryAndSubCategoryID: () => void;
}

const MTOModalContext = createContext<MTOModalContextType>({
  // Context Default Values
  isMTOModalOpen: false,
  setMTOModalOpen: () => {},
  mtoModalType: 'category',
  setMTOModalType: () => {},
  categoryID: '',
  setCategoryID: () => {},
  subCategoryID: '',
  setSubCategoryID: () => {},
  resetCategoryAndSubCategoryID: () => {}
});

const MTOModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMTOModalOpen, setMTOModalOpen] = useState(false);
  const [mtoModalType, setMTOModalType] = useState<
    'category' | 'milestone' | 'solution' | 'solutionToMilestone'
  >('category');
  const [categoryID, setCategoryID] = useState('');
  const [subCategoryID, setSubCategoryID] = useState('');

  const resetCategoryAndSubCategoryID = () => {
    setCategoryID('');
    setSubCategoryID('');
  };

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
        setSubCategoryID,
        resetCategoryAndSubCategoryID
      }}
    >
      {children}
    </MTOModalContext.Provider>
  );
};

export { MTOModalContext, MTOModalProvider };
