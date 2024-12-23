import React, { createContext, useState } from 'react';
import { MTORowType } from 'features/ModelPlan/ModelToOperations/_components/Table/columns';

interface MTOModalContextType {
  isMTOModalOpen: boolean;
  setMTOModalOpen: (isOpen: boolean) => void;
  mtoModalState: {
    categoryID: string;
    categoryName?: string;
    rowType?: MTORowType;
    subCategoryID: string;
    type:
      | 'category'
      | 'milestone'
      | 'solution'
      | 'solutionToMilestone'
      | 'editMilestone'
      | 'editCategoryTitle'
      | 'removeCategory'
      | 'removeSubcategory';
  };
  setMTOModalState: (
    state: Partial<MTOModalContextType['mtoModalState']>
  ) => void;
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
    type: 'category'
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
    type: 'category'
  });

  const setMTOModalState = (
    state: Partial<MTOModalContextType['mtoModalState']>
  ) => {
    setMtoModalStateInternal(prevState => ({ ...prevState, ...state }));
  };

  const resetMTOModalState = () => {
    setMtoModalStateInternal({
      categoryID: '',
      categoryName: '',
      rowType: 'category',
      subCategoryID: '',
      type: 'category'
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
