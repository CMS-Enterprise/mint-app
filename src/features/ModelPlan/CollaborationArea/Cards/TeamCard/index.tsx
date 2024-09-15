import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Grid
} from '@trussworks/react-uswds';
import {
  GetModelCollaboratorsQuery,
  useGetModelCollaboratorsQuery
} from 'gql/gen/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import { Avatar } from 'components/Avatar';
import CollapsableLink from 'components/CollapsableLink';
import Spinner from 'components/Spinner';

type ModelPlanCardType = {
  modelID: string;
  // Can optionally pass in collaborators, or have collaboratos query in the component iteself
  collaborators?: GetModelCollaboratorsQuery['modelPlan']['collaborators'];
};

const TeamCard = ({ modelID, collaborators }: ModelPlanCardType) => {
  const { t: collaborationAreaT } = useTranslation('collaborationArea');

  const { data, loading } = useGetModelCollaboratorsQuery({
    variables: {
      id: modelID
    },
    skip: !!collaborators
  });

  const teamCollaborators = data?.modelPlan?.collaborators || collaborators;

  if (loading && !teamCollaborators)
    return (
      <Grid
        desktop={{ col: 6 }}
        className="padding-1 display-flex flex-column flex-align-center flex-justify-center height-mobile"
      >
        <Spinner data-testid="team-loading" />
      </Grid>
    );

  if (!teamCollaborators) return null;

  const firstEightCollaborators = teamCollaborators.slice(0, 8);

  const remainingCollaborators = teamCollaborators.slice(8);

  return (
    <>
      <Card
        gridLayout={{ desktop: { col: 12 } }}
        className="collaboration-area__card card--team minh-0"
      >
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
                key={collaborator.userAccount.id}
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
                id="collaboration-team-card"
                data-testid="collaboration-team-card"
                className="width-full margin-bottom-2"
                label={collaborationAreaT('teamCard.viewMoreTeamMembers', {
                  count: remainingCollaborators.length
                })}
                closeLabel={collaborationAreaT('teamCard.viewFewerTeamMembers')}
                labelPosition="bottom"
                styleLeftBar={false}
                childClassName="padding-top-0"
              >
                <div className="margin-bottom-1">
                  <Grid row>
                    {remainingCollaborators.map(collaborator => (
                      <Grid
                        desktop={{ col: 3 }}
                        tablet={{ col: 6 }}
                        mobile={{ col: 12 }}
                        key={collaborator.userAccount.id}
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
            to={{
              pathname: `/models/${modelID}/collaboration-area/collaborators/add-collaborator`,
              state: { fromCollaborationArea: true }
            }}
            className="usa-button"
            variant="unstyled"
            data-testid="add-collaborator"
          >
            {collaborationAreaT('teamCard.addMember')}
          </UswdsReactLink>
          <UswdsReactLink
            to={`/models/${modelID}/collaboration-area/collaborators`}
            className="usa-button usa-button--outline margin-left-0"
            variant="unstyled"
            data-testid="manage-collaborators"
          >
            {collaborationAreaT('teamCard.manageTeam')}
          </UswdsReactLink>
        </CardFooter>
      </Card>
    </>
  );
};

export default TeamCard;
