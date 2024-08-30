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
import CollapsableLink from 'components/shared/CollapsableLink';
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

  const [isViewMoreTeamMembers, setIsViewMoreTeamMembers] = useState(false);

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

  const firstEightCollaborators = collaborators.slice(0, 8);

  const remainingCollaborators = collaborators.slice(8);

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
            {firstEightCollaborators.map(collaborator => (
              <Grid
                desktop={{ col: 3 }}
                tablet={{ col: 6 }}
                mobile={{ col: 12 }}
              >
                <Avatar
                  user={collaborator.userAccount.commonName}
                  teamRoles={collaborator.teamRoles}
                  conciseRoles
                  className="margin-y-05"
                />
              </Grid>
            ))}

            {remainingCollaborators.length > 0 && (
              <CollapsableLink
                id="collaoration-team-card"
                className="width-full margin-bottom-2"
                label={collaborationAreaT('teamCard.viewMoreTeamMembers', {
                  count: remainingCollaborators.length
                })}
                closeLabel={collaborationAreaT('teamCard.viewFewerTeamMembers')}
                labelPosition="bottom"
                setParentOpen={setIsViewMoreTeamMembers}
                styleLeftBar={false}
              >
                <div className="margin-bottom-1">
                  <Grid row>
                    {remainingCollaborators.map(collaborator => (
                      <Grid
                        desktop={{ col: 3 }}
                        tablet={{ col: 6 }}
                        mobile={{ col: 12 }}
                      >
                        <Avatar
                          user={collaborator.userAccount.commonName}
                          teamRoles={collaborator.teamRoles}
                          conciseRoles
                          className="margin-y-05"
                        />
                      </Grid>
                    ))}
                  </Grid>
                </div>
              </CollapsableLink>
            )}
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
