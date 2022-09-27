import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import {
  Card,
  CardHeader,
  IconMailOutline,
  Link
} from '@trussworks/react-uswds';

import SectionWrapper from 'components/shared/SectionWrapper';
import GetModelPlanCollaborators from 'queries/Collaborators/GetModelCollaborators';
import {
  GetModelCollaborators,
  GetModelCollaborators_modelPlan_collaborators as CollaboratorsType
} from 'queries/Collaborators/types/GetModelCollaborators';
import { TeamRole } from 'types/graphql-global-types';
import { translateTeamRole } from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

const TeamGroupings = ({
  role,
  collaborators
}: {
  role: TeamRole;
  collaborators: CollaboratorsType[];
}) => {
  const { t } = useTranslation('generalReadOnly');
  return (
    <SectionWrapper className="padding-bottom-3 border-bottom-1px border-base-light margin-bottom-4">
      <h2 className="margin-top-0 margin-bottom-4">
        {role === TeamRole.MODEL_LEAD
          ? t('contactInfo.modelLeads')
          : translateTeamRole(role)}
      </h2>
      {collaborators
        .filter(c => c.teamRole === role)
        .map(collaborator => {
          return (
            <Card
              containerProps={{
                className: 'radius-md padding-2 margin-bottom-3 margin-x-0'
              }}
            >
              <CardHeader className="padding-0">
                <h3 className="margin-0">{collaborator.fullName}</h3>
                <Link
                  aria-label={collaborator.email}
                  className="margin-0 line-height-body-5"
                  href={`mailto:${collaborator.email}`}
                  target="_blank"
                >
                  {collaborator.email}
                  <IconMailOutline className="margin-left-05 margin-bottom-2px text-tbottom" />
                </Link>
              </CardHeader>
            </Card>
          );
        })}
    </SectionWrapper>
  );
};

const ReadOnlyTeamInfo = ({ modelID }: { modelID: string }) => {
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
      {collaborators.map(c => {
        return (
          <TeamGroupings role={c.teamRole} collaborators={collaborators} />
        );
      })}
    </div>
  );
};

export default ReadOnlyTeamInfo;
