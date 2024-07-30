import React, { useEffect, useState } from 'react';
import { Button } from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';
import ProviderAndSupplierModal from 'views/ModelPlan/TaskList/ParticipantsAndProviders/_component/ProviderAndSupplierModal';

const Sandbox = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.title = 'Sandbox';
  }, []);

  return (
    <MainContent>
      <Button type="button" unstyled onClick={() => setIsOpen(true)}>
        Click me
      </Button>
      <ProviderAndSupplierModal
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
      />
    </MainContent>
  );
};

export default Sandbox;
