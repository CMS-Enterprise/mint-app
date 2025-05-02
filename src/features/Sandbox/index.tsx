import React, { useEffect } from 'react';
import { GridContainer } from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';

const Sandbox = () => {
  useEffect(() => {
    document.title = 'Sandbox';
  }, []);

  return (
    <MainContent>
      <GridContainer className="margin-y-6">
        <div />
      </GridContainer>
    </MainContent>
  );
};

export default Sandbox;
