import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Grid
} from '@trussworks/react-uswds';
import {
  TaskStatus,
  useGetModelCollaboratorsQuery,
  useGetModelPlanQuery
} from 'gql/gen/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import Modal from 'components/Modal';
import { Avatar } from 'components/shared/Avatar';
import ShareExportModal from 'components/ShareExport';
import Spinner from 'components/Spinner';
import { getITSolutionsStatus } from 'views/ModelPlan/TaskList';
import { TaskListStatusTag } from 'views/ModelPlan/TaskList/_components/TaskListItem';

import '../index.scss';

type ModelPlanCardType = {
  modelID: string;
};

const TeamCard = ({ modelID }: ModelPlanCardType) => {
  const { t: collaborationAreaT } = useTranslation('collaborationArea');

  const { data, loading } = useGetModelCollaboratorsQuery({
    variables: {
      id: modelID
    }
  });

  const modelPlan = data?.modelPlan;

  if (loading && !modelPlan)
    return (
      <Grid
        desktop={{ col: 6 }}
        className="padding-1 display-flex flex-column flex-align-center flex-justify-center height-mobile"
      >
        <Spinner />
      </Grid>
    );

  if (!modelPlan) return null;

  const { collaborators } = modelPlan;

  return (
    <>
      <Card gridLayout={{ desktop: { col: 12 } }} className="card--model-plan">
        <CardHeader>
          <h3 className="usa-card__heading">
            {collaborationAreaT('teamCard.heading')}
          </h3>

          <p>{collaborationAreaT('teamCard.body')}</p>
        </CardHeader>

        <CardBody>
          <Grid row>
            {collaborators.map(collaborator => (
              <Grid col={3}>
                <Avatar
                  user={collaborator.userAccount.commonName}
                  teamRoles={collaborator.teamRoles}
                  conciseRoles
                  className="margin-y-05"
                />
              </Grid>
            ))}
          </Grid>
        </CardBody>

        <CardFooter>
          <UswdsReactLink
            to={`/models/${modelID}/collaboration-area/collaborators/add-collaborator`}
            className="usa-button"
            variant="unstyled"
            data-testid="to-add-collaborator"
          >
            {collaborationAreaT('teamCard.addMember')}
          </UswdsReactLink>
          <UswdsReactLink
            to={`/models/${modelID}/collaboration-area/collaborators`}
            className="usa-button usa-button--outline margin-left-0"
            variant="unstyled"
            data-testid="to-add-collaborator"
          >
            {collaborationAreaT('teamCard.manageTeam')}
          </UswdsReactLink>
        </CardFooter>
      </Card>
    </>
  );
};

export default TeamCard;
