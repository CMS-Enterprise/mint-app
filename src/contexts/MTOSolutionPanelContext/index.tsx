import React, { createContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import SolutionPanel from 'features/ModelPlan/ReadOnly/MTOSolutions/SolutionPanel';

import Sidepanel from 'components/Sidepanel';

interface MTOSolutionPanelContextType {
  openViewSolutionModal: (solutionID: string) => void;
  setViewSolutionID: (solutionID: string) => void;
}

const MTOSolutionPanelContext = createContext<MTOSolutionPanelContextType>({
  openViewSolutionModal: () => {},
  setViewSolutionID: () => {}
});

const MTOSolutionPanelProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { t: modelToOperationsMiscT } = useTranslation('modelToOperationsMisc');

  const history = useHistory();

  const params = new URLSearchParams(history.location.search);

  const solutionParam = params.get('view-solution');

  const [isModalOpen, setIsModalOpen] = useState(!!solutionParam);

  const [solutionID, setViewSolutionID] = useState<string>('');

  useEffect(() => {
    if (solutionParam === solutionID) {
      setIsModalOpen(true);
    }
  }, [solutionParam, solutionID, setIsModalOpen]);

  const closeModal = () => {
    params.delete('view-solution');
    history.push({ search: params.toString() });
    setIsModalOpen(false);
  };

  const openViewSolutionModal = (id: string) => {
    params.set('view-solution', id);
    history.push({ search: params.toString() });
    setIsModalOpen(true);
  };

  return (
    <MTOSolutionPanelContext.Provider
      value={{
        openViewSolutionModal,
        setViewSolutionID
      }}
    >
      <>
        <Sidepanel
          isOpen={isModalOpen}
          closeModal={closeModal}
          ariaLabel={modelToOperationsMiscT('modal.editSolution.solutionTitle')}
          testid="view-solution-sidepanel"
          modalHeading={modelToOperationsMiscT(
            'modal.editSolution.solutionTitle'
          )}
          noScrollable
        >
          <SolutionPanel closeModal={closeModal} />
        </Sidepanel>
      </>
      {children}
    </MTOSolutionPanelContext.Provider>
  );
};

export { MTOSolutionPanelContext, MTOSolutionPanelProvider };
