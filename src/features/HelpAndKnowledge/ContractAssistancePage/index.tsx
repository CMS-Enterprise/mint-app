import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { GridContainer, Icon } from '@trussworks/react-uswds';
import NotFound from 'features/NotFound';
import {
  useGetCtatRequestsAdminQuery,
  useGetCtatRequestsRequesterQuery
} from 'gql/generated/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { AppState } from 'stores/reducers/rootReducer';

import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageLoading from 'components/PageLoading';
import { isAssessment } from 'utils/user';

import AdminTicketManagementSection from './_components/AdminTicketManagementSection';
import CtatTicketViewPanel from './_components/CTATSidePanel/CtatTicketViewPanel';
import UserSubmittedTicketsSection from './_components/UserSubmittedTicketsSection';
import { mapCtatRequestsToContractAssistanceTickets } from './utils';

const ContractAssistancePage = () => {
  const { t } = useTranslation('contractAssistance');
  const { t: hkcT } = useTranslation('helpAndKnowledge');
  const { groups } = useSelector((state: AppState) => state.auth);
  const flags = useFlags();
  const isAssessmentTeam = isAssessment(groups, flags);
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const closeTicketViewPanel = useCallback(() => {
    navigate(`/help-and-knowledge/contract-assistance${location.search}`, {
      replace: true
    });
  }, [navigate, location.search]);

  const {
    data: requesterData,
    loading: requesterLoading,
    error: requesterError
  } = useGetCtatRequestsRequesterQuery();

  const {
    data: adminData,
    loading: adminLoading,
    error: adminError
  } = useGetCtatRequestsAdminQuery({
    skip: !isAssessmentTeam
  });

  const userTickets = useMemo(
    () =>
      mapCtatRequestsToContractAssistanceTickets(
        requesterData?.ctatRequestsRequester.ctatRequests ?? []
      ),
    [requesterData]
  );

  const adminTickets = useMemo(
    () =>
      mapCtatRequestsToContractAssistanceTickets(
        adminData?.ctatRequestsAdmin.ctatRequests ?? []
      ),
    [adminData]
  );

  const loading = requesterLoading || (isAssessmentTeam && adminLoading);
  const error = requesterError || adminError;

  if (loading) {
    return <PageLoading />;
  }

  if (error) {
    return <NotFound errorMessage={error.message} />;
  }

  return (
    <MainContent>
      <GridContainer>
        <Breadcrumbs
          items={[BreadcrumbItemOptions.HELP_CENTER]}
          customItem={t('hkcHeading')}
        />
        <h1 className="margin-bottom-2 margin-top-5 line-height-large">
          {t('hkcHeading')}
        </h1>
        <p className="mint-body-large margin-bottom-2 margin-top-05">
          {t('description')}
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

      {ticketId && (
        <CtatTicketViewPanel
          ticketId={ticketId}
          closeModal={closeTicketViewPanel}
          isAdmin={isAssessmentTeam}
        />
      )}
    </MainContent>
  );
};

export default ContractAssistancePage;
