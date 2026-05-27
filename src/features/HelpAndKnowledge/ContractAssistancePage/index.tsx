import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { GridContainer, Icon } from '@trussworks/react-uswds';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { AppState } from 'stores/reducers/rootReducer';

import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import { isAssessment } from 'utils/user';

import AdminTicketManagementSection from './_components/AdminTicketManagementSection';
import UserSubmittedTicketsSection from './_components/UserSubmittedTicketsSection';
import { ContractAssistanceTicket } from './constants';

const ContractAssistancePage = () => {
  const { t: hkcT } = useTranslation('helpAndKnowledge');
  const { groups } = useSelector((state: AppState) => state.auth);
  const flags = useFlags();
  const isAssessmentTeam = isAssessment(groups, flags);

  const adminTickets: ContractAssistanceTicket[] = [];
  const userTickets: ContractAssistanceTicket[] = [];

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

        {isAssessmentTeam && (
          <AdminTicketManagementSection tickets={adminTickets} />
        )}
        <UserSubmittedTicketsSection tickets={userTickets} />
      </GridContainer>
    </MainContent>
  );
};

export default ContractAssistancePage;
