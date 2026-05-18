import React, { createContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import SolutionPanel from 'features/ModelPlan/ReadOnly/MTOSolutions/SolutionPanel';

import Sidepanel from 'components/Sidepanel';

interface MTOSolutionPanelContextType {
  openViewSolutionModal: (solutionID: string) => void;
}

const MTOSolutionPanelContext = createContext<MTOSolutionPanelContextType>({
  openViewSolutionModal: () => {}
});

const MTOSolutionPanelProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { t: modelToOperationsMiscT } = useTranslation('modelToOperationsMisc');

  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);

  const solutionParam = params.get('view-solution');

  const [isModalOpen, setIsModalOpen] = useState(!!solutionParam);

  const closeModal = () => {
    params.delete('view-solution');
    navigate({ search: params.toString() });
    setIsModalOpen(false);
  };

  const openViewSolutionModal = (id: string) => {
    params.set('view-solution', id);
    navigate({ search: params.toString() });
    setIsModalOpen(true);
  };

  return (
    <MTOSolutionPanelContext.Provider
      value={{
        openViewSolutionModal
      }}
    >
      <>
        <Sidepanel
          isOpen={isModalOpen}
          closeModal={closeModal}
          ariaLabel={modelToOperationsMiscT('modal.editSolution.heading')}
          testid="view-solution-sidepanel"
          modalHeading={modelToOperationsMiscT('modal.editSolution.heading')}
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
