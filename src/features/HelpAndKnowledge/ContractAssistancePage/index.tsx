import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  ButtonGroup,
  GridContainer,
  Icon
} from '@trussworks/react-uswds';

import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';

import ContractAssistanceTicketsTable from './_components/ContractAssistanceTicketsTable';

const ContractAssistancePage = () => {
  const { t: hkcT } = useTranslation('helpAndKnowledge');

  return (
    <MainContent>
      <GridContainer>
        <Breadcrumbs
          items={[BreadcrumbItemOptions.HELP_CENTER]}
          customItem={hkcT('contractAssistance.hkcHeading')}
        />
        <h1 className="margin-bottom-2 margin-top-5 line-height-large">
          {hkcT('contractAssistance.hkcHeading')}
        </h1>
        <p className="mint-body-large margin-bottom-2 margin-top-05">
          {hkcT('contractAssistance.description')}
        </p>
        <div className="margin-bottom-6">
          <UswdsReactLink to="/help-and-knowledge" data-testid="return-to-hkc">
            <span>
              <Icon.ArrowBack
                className="top-3px margin-right-1"
                aria-label="back"
              />
              {hkcT('milestoneLibrary.returnToHkc')}
            </span>
          </UswdsReactLink>
        </div>
        <div className="admin-section padding-3 bg-primary-lighter radius-md">
          <div className="display-flex flex-justify flex-align-center">
            <h2 className="margin-x-0 margin-top-0 margin-bottom-3">
              {hkcT('contractAssistance.adminActions.title')}
            </h2>
            <Icon.LocalPolice size={4} className="text-primary-light" />
          </div>
          <ButtonGroup type="segmented" className="margin-bottom-2">
            {/* TODO: Add logic to determine which button should be active */}
            <Button type="button">
              {hkcT('contractAssistance.adminActions.tabs.all', { count: 0 })}
            </Button>
            <Button type="button" outline>
              {hkcT('contractAssistance.adminActions.tabs.open', {
                count: 0
              })}
            </Button>
            <Button type="button" outline>
              {hkcT('contractAssistance.adminActions.tabs.unassigned', {
                count: 0
              })}
            </Button>
            <Button type="button" outline>
              {hkcT('contractAssistance.adminActions.tabs.myTickets', {
                count: 0
              })}
            </Button>
            <Button type="button" outline>
              {hkcT('contractAssistance.adminActions.tabs.closed', {
                count: 0
              })}
            </Button>
          </ButtonGroup>
          {/* ADMIN SECTION */}
          <ContractAssistanceTicketsTable tickets={[]} isAdmin />
        </div>
        <ContractAssistanceTicketsTable tickets={[]} isAdmin={false} />
      </GridContainer>
    </MainContent>
  );
};

export default ContractAssistancePage;
