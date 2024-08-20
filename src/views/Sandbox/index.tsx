import React, { useEffect } from 'react';
import { GridContainer } from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';
import ModelPlanCard from 'views/ModelPlan/CollaborationArea/Cards/ModelPlan';

const Sandbox = () => {
  useEffect(() => {
    document.title = 'Sandbox';
  }, []);

  return (
    <MainContent>
      <GridContainer>
        <ModelPlanCard modelID="123" />
      </GridContainer>
    </MainContent>
  );
};

export default Sandbox;
