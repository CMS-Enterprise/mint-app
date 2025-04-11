import React, { createContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import MilestonePanel from 'features/ModelPlan/ReadOnly/MTOMilestones/MilestonePanel';

import Sidepanel from 'components/Sidepanel';

interface MTOMilestonePanelContextType {
  openEditMilestoneModal: (milestoneID: string) => void;
  setMilestoneID: (milestoneID: string) => void;
}

const MTOMilestonePanelContext = createContext<MTOMilestonePanelContextType>({
  openEditMilestoneModal: () => {},
  setMilestoneID: () => {}
});

const MTOMilestonePanelProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { t: modelToOperationsMiscT } = useTranslation('modelToOperationsMisc');

  const history = useHistory();

  const params = new URLSearchParams(history.location.search);

  const milestoneParam = params.get('view-milestone');

  const [isModalOpen, setIsModalOpen] = useState(!!milestoneParam);

  const [milestoneID, setMilestoneID] = useState<string>('');

  useEffect(() => {
    if (milestoneParam === milestoneID) {
      setIsModalOpen(true);
    }
  }, [milestoneParam, milestoneID, setIsModalOpen]);

  const closeModal = () => {
    params.delete('view-milestone');
    history.push({ search: params.toString() });
    setIsModalOpen(false);
  };

  const openEditMilestoneModal = (id: string) => {
    params.set('view-milestone', id);
    history.push({ search: params.toString() });
    setIsModalOpen(true);
  };

  return (
    <MTOMilestonePanelContext.Provider
      value={{
        openEditMilestoneModal,
        setMilestoneID
      }}
    >
      <>
        <Sidepanel
          isOpen={isModalOpen}
          closeModal={closeModal}
          ariaLabel={modelToOperationsMiscT(
            'milestoneLibrary.aboutThisMilestone'
          )}
          testid="edit-milestone-sidepanel"
          modalHeading={modelToOperationsMiscT(
            'milestoneLibrary.aboutThisMilestone'
          )}
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
