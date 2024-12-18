import React, { createContext, useState } from 'react';

interface MTOModalContextType {
  isMTOModalOpen: boolean;
  setMTOModalOpen: (isOpen: boolean) => void;
  mtoModalType:
    | 'category'
    | 'milestone'
    | 'solution'
    | 'solutionToMilestone'
    | 'editCategoryTitle';
  setMTOModalType: (
    type:
      | 'category'
      | 'milestone'
      | 'solution'
      | 'solutionToMilestone'
      | 'editCategoryTitle'
  ) => void;
  categoryID: string;
  setCategoryID: (id: string) => void;
  subCategoryID: string;
  setSubCategoryID: (id: string) => void;
  categoryName: string;
  setCategoryName: (id: string) => void;
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
  categoryName: '',
  setCategoryName: () => {},
  resetCategoryAndSubCategoryID: () => {}
});

const MTOModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMTOModalOpen, setMTOModalOpen] = useState(false);
  const [mtoModalType, setMTOModalType] = useState<
    | 'category'
    | 'milestone'
    | 'solution'
    | 'solutionToMilestone'
    | 'editCategoryTitle'
  >('category');
  const [categoryID, setCategoryID] = useState('');
  const [subCategoryID, setSubCategoryID] = useState('');
  const [categoryName, setCategoryName] = useState('');

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
        categoryName,
        setCategoryName,
        resetCategoryAndSubCategoryID
      }}
    >
      {children}
    </MTOModalContext.Provider>
  );
};

export { MTOModalContext, MTOModalProvider };
