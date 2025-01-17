import React, { createContext, useState } from 'react';
import { MTOModalType } from 'features/ModelPlan/ModelToOperations/_components/FormModal';
import { MTORowType } from 'features/ModelPlan/ModelToOperations/_components/MatrixTable/columns';

export interface MTOModalState {
  modalType: MTOModalType;
  categoryID: string;
  subCategoryID: string;
  categoryName?: string;
  milestoneID?: string;
  rowType: MTORowType;
}

interface MTOModalContextType {
  isMTOModalOpen: boolean;
  setMTOModalOpen: (isOpen: boolean) => void;
  mtoModalState: MTOModalState;
  setMTOModalState: (state: Partial<MTOModalState>) => void;
  resetMTOModalState: () => void;
}

const MTOModalContext = createContext<MTOModalContextType>({
  isMTOModalOpen: false,
  setMTOModalOpen: () => {},
  mtoModalState: {
    categoryID: '',
    categoryName: '',
    rowType: 'category',
    subCategoryID: '',
    modalType: 'category'
  },
  setMTOModalState: () => {},
  resetMTOModalState: () => {}
});

const MTOModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMTOModalOpen, setMTOModalOpen] = useState(false);
  const [mtoModalState, setMtoModalStateInternal] = useState<
    MTOModalContextType['mtoModalState']
  >({
    categoryID: '',
    categoryName: '',
    rowType: 'category',
    subCategoryID: '',
    modalType: 'category'
  });

  const setMTOModalState = (state: Partial<MTOModalState>) => {
    setMtoModalStateInternal((prevState: MTOModalState) => ({
      ...prevState,
      ...state
    }));
  };

  const resetMTOModalState = () => {
    setMtoModalStateInternal({
      categoryID: '',
      categoryName: '',
      rowType: 'category',
      subCategoryID: '',
      modalType: 'category'
    });
  };

  return (
    <MTOModalContext.Provider
      value={{
        isMTOModalOpen,
        setMTOModalOpen,
        mtoModalState,
        setMTOModalState,
        resetMTOModalState
      }}
    >
      {children}
    </MTOModalContext.Provider>
  );
};

export { MTOModalContext, MTOModalProvider };
