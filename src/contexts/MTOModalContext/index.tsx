import React, { createContext, useState } from 'react';
import { MTOModalType } from 'features/ModelPlan/ModelToOperations/_components/FormModal';

interface MTOModalContextType {
  isMTOModalOpen: boolean;
  setMTOModalOpen: (isOpen: boolean) => void;
  mtoModalType: MTOModalType;
  setMTOModalType: (type: MTOModalType) => void;
  categoryID: string;
  setCategoryID: (id: string) => void;
  subCategoryID?: string;
  setSubCategoryID: (id?: string | undefined) => void;
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
  subCategoryID: undefined,
  setSubCategoryID: () => {},
  categoryName: '',
  setCategoryName: () => {},
  resetCategoryAndSubCategoryID: () => {}
});

const MTOModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMTOModalOpen, setMTOModalOpen] = useState(false);
  const [mtoModalType, setMTOModalType] = useState<MTOModalType>('category');
  const [categoryID, setCategoryID] = useState('');
  const [subCategoryID, setSubCategoryID] = useState<string | undefined>(
    undefined
  );
  const [categoryName, setCategoryName] = useState('');

  const resetCategoryAndSubCategoryID = () => {
    setCategoryID('');
    setSubCategoryID(undefined);
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