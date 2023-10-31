import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import {
  Card,
  CardHeader,
  Grid,
  IconMailOutline,
  Link
} from '@trussworks/react-uswds';

import GetModelPlanCollaborators from 'queries/Collaborators/GetModelCollaborators';
import {
  GetModelCollaborators,
  GetModelCollaborators_modelPlan_collaborators as CollaboratorsType
} from 'queries/Collaborators/types/GetModelCollaborators';
import { TeamRole } from 'types/graphql-global-types';
import { collaboratorsOrderedByModelLeads } from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

import './index.scss';

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
          <IconMailOutline className="margin-left-05 margin-bottom-2px text-tbottom" />
        </Link>
      </CardHeader>
      <div>
        <p className="margin-y-0">
          {collaborator.teamRoles
            .map((role: TeamRole) => {
              return collaboratorsT(`teamRole.options.${role}`);
            })
            .join(', ')}
        </p>
      </div>
    </Card>
  );
};

const FilteredViewGroupings = ({
  collaborators,
  role
}: {
  collaborators: CollaboratorsType[];
  role: TeamRole.MODEL_LEAD | TeamRole.PAYMENT;
}) => {
  const { t } = useTranslation('generalReadOnly');
  return (
    <div className="margin-bottom-3">
      <h3 className="margin-top-0 margin-bottom-2">
        {role === TeamRole.MODEL_LEAD
          ? t('contactInfo.modelLeads')
          : t('contactInfo.payment')}
      </h3>
      <Grid row gap style={{ rowGap: '2rem' }}>
        {collaborators.length === 0 && role === TeamRole.PAYMENT && (
          <em className="text-base">{t('contactInfo.emptyState')}</em>
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
                    <IconMailOutline className="margin-left-05 margin-bottom-2px text-tbottom" />
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
  const { data, loading, error } = useQuery<GetModelCollaborators>(
    GetModelPlanCollaborators,
    {
      variables: {
        id: modelID
      }
    }
  );

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
      <h2 className="margin-top-0 margin-bottom-4">
        <Trans i18nKey="modelSummary:navigation.team" />
      </h2>
      {isViewingFilteredView ? (
        <>
          <FilteredViewGroupings
            role={TeamRole.MODEL_LEAD}
            collaborators={collaborators.filter(c =>
              c.teamRoles.includes(TeamRole.MODEL_LEAD)
            )}
          />
          {filteredView === 'ipc' && (
            <FilteredViewGroupings
              role={TeamRole.PAYMENT}
              collaborators={collaborators.filter(c =>
                c.teamRoles.includes(TeamRole.PAYMENT)
              )}
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
