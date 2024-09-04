import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, Grid, Icon, Link } from '@trussworks/react-uswds';
import {
  GetModelCollaboratorsQuery,
  TeamRole,
  useGetModelCollaboratorsQuery
} from 'gql/gen/graphql';

import { collaboratorsOrderedByModelLeads } from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

import './index.scss';

type CollaboratorsType = GetModelCollaboratorsQuery['modelPlan']['collaborators'][0];

const MemberCards = ({ collaborator }: { collaborator: CollaboratorsType }) => {
  const { t: collaboratorsT } = useTranslation('collaborators');

  return (
    <Card
      containerProps={{
        className: 'radius-md padding-2 margin-bottom-3 margin-x-0'
      }}
    >
      <CardHeader className="padding-top-0 padding-x-0 padding-bottom-2 margin-bottom-2 border-bottom-2px border-gray-10">
        <h3 className="margin-0">{collaborator.userAccount.commonName}</h3>
        <Link
          aria-label={collaborator.userAccount.email}
          className="margin-0 line-height-body-5"
          href={`mailto:${collaborator.userAccount.email}`}
          target="_blank"
        >
          {collaborator.userAccount.email}
          <Icon.MailOutline className="margin-left-05 margin-bottom-2px text-tbottom" />
        </Link>
      </CardHeader>
      <div>
        <p className="margin-y-0">
          {collaborator.teamRoles
            .map((role: TeamRole) => {
              return collaboratorsT(`teamRoles.options.${role}`);
            })
            .join(', ')}
        </p>
      </div>
    </Card>
  );
};

const FilteredViewGroupings = ({
  collaborators,
  role,
  heading
}: {
  collaborators: CollaboratorsType[];
  role: TeamRole.MODEL_LEAD | TeamRole.PAYMENT | TeamRole.CM_FFS_COUNTERPART;
  heading: string;
}) => {
  const { t } = useTranslation('generalReadOnly');
  return (
    <div className="margin-bottom-3">
      <h3 className="margin-top-0 margin-bottom-2">{heading}</h3>
      <Grid row gap style={{ rowGap: '2rem' }}>
        {collaborators.length === 0 && role === TeamRole.PAYMENT && (
          <em className="text-base">{t('contactInfo.emptyStatePayment')}</em>
        )}
        {collaborators.length === 0 && role === TeamRole.CM_FFS_COUNTERPART && (
          <em className="text-base">{t('contactInfo.emptyStateCMFFS')}</em>
        )}
        {collaborators
          .filter(c => c.teamRoles.includes(role))
          .map((collaborator, index) => {
            return (
              // eslint-disable-next-line react/no-array-index-key
              <React.Fragment key={index}>
                <Grid desktop={{ col: 6 }}>
                  <p className="margin-y-0 font-body-sm text-bold">
                    {collaborator.userAccount.commonName}
                  </p>
                  <Link
                    aria-label={collaborator.userAccount.email}
                    className="margin-0 line-height-body-5"
                    href={`mailto:${collaborator.userAccount.email}`}
                    target="_blank"
                  >
                    {collaborator.userAccount.email}
                    <Icon.MailOutline className="margin-left-05 margin-bottom-2px text-tbottom" />
                  </Link>
                </Grid>
              </React.Fragment>
            );
          })}
      </Grid>
    </div>
  );
};

const ReadOnlyTeamInfo = ({
  modelID,
  isViewingFilteredView,
  filteredView
}: {
  modelID: string;
  isViewingFilteredView?: boolean;
  filteredView?: string;
}) => {
  const { t } = useTranslation('generalReadOnly');
  const { data, loading, error } = useGetModelCollaboratorsQuery({
    variables: {
      id: modelID
    }
  });

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial />;
  }

  const collaborators = (data?.modelPlan?.collaborators ??
    []) as CollaboratorsType[];

  return (
    <div
      className="read-only-model-plan--team-info"
      data-testid="read-only-model-plan--team-info"
    >
      {isViewingFilteredView ? (
        <>
          <FilteredViewGroupings
            role={TeamRole.MODEL_LEAD}
            collaborators={collaborators.filter(c =>
              c.teamRoles.includes(TeamRole.MODEL_LEAD)
            )}
            heading={t('contactInfo.modelLeads')}
          />
          {filteredView === 'ipc' && (
            <FilteredViewGroupings
              role={TeamRole.PAYMENT}
              collaborators={collaborators.filter(c =>
                c.teamRoles.includes(TeamRole.PAYMENT)
              )}
              heading={t('contactInfo.payment')}
            />
          )}
          {filteredView === 'dfsdm' && (
            <FilteredViewGroupings
              role={TeamRole.CM_FFS_COUNTERPART}
              collaborators={collaborators.filter(c =>
                c.teamRoles.includes(TeamRole.CM_FFS_COUNTERPART)
              )}
              heading={t('contactInfo.cmFFS')}
            />
          )}
        </>
      ) : (
        collaboratorsOrderedByModelLeads(collaborators).map(collaborator => {
          return (
            <MemberCards key={collaborator.id} collaborator={collaborator} />
          );
        })
      )}
    </div>
  );
};

export default ReadOnlyTeamInfo;
