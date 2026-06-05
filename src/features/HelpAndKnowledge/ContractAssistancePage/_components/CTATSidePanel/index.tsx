import React from 'react';
import { useTranslation } from 'react-i18next';

import Sidepanel from 'components/Sidepanel';

const CtatSidePanel = ({
  isOpen,
  closeModal
}: {
  isOpen: boolean;
  closeModal: () => void;
}) => {
  const { t: ctatSidePanelT } = useTranslation('contractAssistance');
  return (
    <Sidepanel
      isOpen={isOpen}
      closeModal={closeModal}
      ariaLabel={ctatSidePanelT('ctatSidePanel.heading')}
      testid="ctat-sidepanel"
      modalHeading={ctatSidePanelT('ctatSidePanel.heading')}
    >
      <div>CTAT Side Panel</div>
    </Sidepanel>
  );
};

export default CtatSidePanel;
