import React, { createContext, useState } from 'react';
import { MTOModalType } from 'features/ModelPlan/ModelToOperations/_components/FormModal';
import { MTORowType } from 'features/ModelPlan/ModelToOperations/_components/MatrixTable/columns';

export interface MTOModalState {
  categoryID: string;
  categoryName?: string;
  milestoneID?: string;
  modalType: MTOModalType;
  rowType: MTORowType;
  subCategoryID: string;
  modalCalledFrom?: 'solution-library';
  toggleRow?: (index: string, forceOpen?: boolean) => void;
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
    modalType: 'category',
    toggleRow: () => {}
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
    modalType: 'category',
    toggleRow: () => {}
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
      modalType: 'category',
      toggleRow: () => {}
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
