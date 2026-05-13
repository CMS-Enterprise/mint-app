import React, { createContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import MilestonePanel from 'features/ModelPlan/ReadOnly/MTOMilestones/MilestonePanel';

import Sidepanel from 'components/Sidepanel';

interface MTOMilestonePanelContextType {
  openEditMilestoneModal: (milestoneID: string) => void;
}

const MTOMilestonePanelContext = createContext<MTOMilestonePanelContextType>({
  openEditMilestoneModal: () => {}
});

const MTOMilestonePanelProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { t: modelToOperationsMiscT } = useTranslation('modelToOperationsMisc');

  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);

  const milestoneParam = params.get('view-milestone');

  const [isModalOpen, setIsModalOpen] = useState(!!milestoneParam);

  const closeModal = () => {
    params.delete('view-milestone');
    navigate({ search: params.toString() });
    setIsModalOpen(false);
  };

  const openEditMilestoneModal = (id: string) => {
    params.set('view-milestone', id);
    navigate({ search: params.toString() });
    setIsModalOpen(true);
  };

  return (
    <MTOMilestonePanelContext.Provider
      value={{
        openEditMilestoneModal
      }}
    >
      <>
        <Sidepanel
          isOpen={isModalOpen}
          closeModal={closeModal}
          ariaLabel={modelToOperationsMiscT('modal.editMilestone.heading')}
          testid="view-milestone-sidepanel"
          modalHeading={modelToOperationsMiscT('modal.editMilestone.heading')}
          noScrollable
        >
          <MilestonePanel closeModal={closeModal} />
        </Sidepanel>
      </>
      {children}
    </MTOMilestonePanelContext.Provider>
  );
};

export { MTOMilestonePanelContext, MTOMilestonePanelProvider };
