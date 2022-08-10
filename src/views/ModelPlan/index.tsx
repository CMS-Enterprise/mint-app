import React from 'react';
import { Grid, GridContainer } from '@trussworks/react-uswds';

import DraftModelPlansTable from './Table';

const ModelPlan = () => {
  return (
    <GridContainer>
      <Grid desktop={{ col: 12 }}>
        <DraftModelPlansTable readOnly />
      </Grid>
    </GridContainer>
  );
};

export default ModelPlan;
