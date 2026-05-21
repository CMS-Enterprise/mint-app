import React from 'react';
import { GridContainer } from '@trussworks/react-uswds';

import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import MainContent from 'components/MainContent';

const ContractAssistancePage = () => {
  return (
    <MainContent>
      <GridContainer>
        <Breadcrumbs
          items={[BreadcrumbItemOptions.CONTRACT_ASSISTANCE]}
          // customItem={hkcT('milestoneLibrary.hkcHeading')}
        />
        <h1>Contract Assistance</h1>
      </GridContainer>
    </MainContent>
  );
};

export default ContractAssistancePage;
