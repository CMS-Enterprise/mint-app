import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Grid, Icon, Link } from '@trussworks/react-uswds';
import { TeamRole, useGetModelCollaboratorsQuery } from 'gql/generated/graphql';

import Alert from 'components/Alert';
import { Avatar } from 'components/Avatar';
import CollapsableLink from 'components/CollapsableLink';
import PageNumber from 'components/PageNumber';
import Spinner from 'components/Spinner';
import { tArray } from 'utils/translation';

const AboutCompletingDataExchange = () => {
  const { t } = useTranslation('dataExchangeApproachMisc');
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const { modelID } = useParams<{ modelID: string }>();

  const history = useHistory();

  const expandItems = tArray(
    'dataExchangeApproachMisc:aboutCompletingDataExchange.whyDoINeedThisFormItems'
  );

  const { data, loading } = useGetModelCollaboratorsQuery({
    variables: {
      id: modelID
    }
  });

  const itLeadsAndArchitects = data?.modelPlan?.collaborators?.filter(
    collaborator =>
      collaborator.teamRoles.includes(TeamRole.IT_LEAD) ||
      collaborator.teamRoles.includes(TeamRole.SOLUTION_ARCHITECT)
  );

  return (
    <>
      <h2 className="margin-bottom-2 margin-top-7">
        {t('aboutCompletingDataExchange.heading')}
      </h2>

      <p>{t('aboutCompletingDataExchange.description')}</p>

      <CollapsableLink
        id="complete-data-form-why"
        horizontalCaret
        className="margin-top-3"
        childClassName="padding-top-0"
        label={t('aboutCompletingDataExchange.whyDoINeedThisForm')}
      >
        <ul className="margin-0">
          {expandItems.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </CollapsableLink>

      <h3 className="margin-top-4 margin-bottom-0">
        {t('aboutCompletingDataExchange.whosInvolved')}
      </h3>

      <p>{t('aboutCompletingDataExchange.whosInvolvedDescription')}</p>

      <Link
        aria-label={t('aboutCompletingDataExchange.email')}
        className="line-height-body-5"
        href="mailto:MINTTeam@cms.hhs.gov"
        target="_blank"
      >
        {t('aboutCompletingDataExchange.email')}
        <Icon.MailOutline className="margin-left-1 text-tbottom" />
      </Link>

      <Grid row gap>
        <Grid desktop={{ col: 6 }} tablet={{ col: 6 }}>
          <h4 className="margin-bottom-1">
            {t('aboutCompletingDataExchange.modelTeam')}
          </h4>

          <p className="margin-top-0">
            {t('aboutCompletingDataExchange.modelTeamDescription')}
          </p>
        </Grid>

        <Grid desktop={{ col: 6 }} tablet={{ col: 6 }}>
          <h4 className="margin-bottom-1">
            {t('aboutCompletingDataExchange.itLead')}
          </h4>

          {loading && <Spinner />}

          {!loading && (
            <div>
              {itLeadsAndArchitects && itLeadsAndArchitects.length > 0 ? (
                itLeadsAndArchitects?.map(collaborator => (
                  <Avatar
                    user={collaborator.userAccount.commonName}
                    teamRoles={collaborator.teamRoles.filter(
                      role =>
                        role === TeamRole.IT_LEAD ||
                        role === TeamRole.SOLUTION_ARCHITECT
                    )}
                    conciseRoles
                    className="margin-y-05"
                    key={collaborator.userAccount.id}
                  />
                ))
              ) : (
                <div>
                  <p className="text-italic text-base margin-top-0">
                    {t('aboutCompletingDataExchange.noLeadAssigned')}
                  </p>
                  <Alert type="info" slim className="margin-top-1 text-normal">
                    {t('aboutCompletingDataExchange.pleaseContactBSG')}
                  </Alert>
                </div>
              )}
            </div>
          )}
        </Grid>
      </Grid>

      <div className="margin-top-6 margin-bottom-3">
        <Button
          type="button"
          onClick={() =>
            history.push(
              `/models/${modelID}/collaboration-area/data-exchange-approach/collecting-and-sending-data`
            )
          }
        >
          {miscellaneousT('next')}
        </Button>
      </div>

      <Button
        type="button"
        className="usa-button usa-button--unstyled"
        onClick={() => history.push(`/models/${modelID}/collaboration-area`)}
      >
        <Icon.ArrowBack className="margin-right-1" aria-hidden />

        {miscellaneousT('saveAndReturnToCollaborationArea')}
      </Button>

      <PageNumber currentPage={1} totalPages={4} className="margin-y-6" />
    </>
  );
};

export default AboutCompletingDataExchange;
