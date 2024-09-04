import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, Link } from '@trussworks/react-uswds';
import {
  GetModelCollaboratorsQuery,
  TeamRole,
  useGetModelCollaboratorsQuery
} from 'gql/gen/graphql';

import UswdsReactLink from 'components/LinkWrapper';

type GetCollaboratorsType = GetModelCollaboratorsQuery['modelPlan']['collaborators'][0];

const ContactInfo = ({
  modelID,
  isViewingTeamPage
}: {
  modelID: string;
  isViewingTeamPage: boolean;
}) => {
  const { t: h } = useTranslation('generalReadOnly');

  const { data } = useGetModelCollaboratorsQuery({
    variables: {
      id: modelID
    }
  });

  const collaborators = (data?.modelPlan?.collaborators ??
    []) as GetCollaboratorsType[];

  return (
    <div
      className="model-plan__model-leads__wrapper model-leads padding-y-1"
      data-testid="read-only-model-plan__contact-info"
    >
      <p className="font-body-xs margin-top-0 margin-bottom-3">
        {h('contactInfo.modelLeads')}
      </p>

      {collaborators
        .filter(collaborator =>
          collaborator.teamRoles.includes(TeamRole.MODEL_LEAD)
        )
        .map(collaborator => {
          return (
            <div
              key={collaborator.userAccount.username}
              className="model-lead__member margin-bottom-3"
            >
              <h3 className="system-profile__subheader margin-bottom-1">
                {collaborator.userAccount.commonName}
              </h3>
              <Link
                aria-label={h('contactInfo.sendAnEmail')}
                className="line-height-body-5"
                href={`mailto:${collaborator.userAccount.email}`}
                target="_blank"
              >
                {h('contactInfo.sendAnEmail')}
                <Icon.Launch className="margin-left-05 margin-bottom-2px text-tbottom" />
              </Link>
            </div>
          );
        })}

      {!isViewingTeamPage && (
        <UswdsReactLink
          aria-label={h('contactInfo.moreTeamMembers')}
          className="line-height-body-5 display-flex flex-align-center "
          to={`/models/${modelID}/read-only/team`}
        >
          {h('contactInfo.moreTeamMembers')}
          <Icon.ArrowForward className="margin-left-1" />
        </UswdsReactLink>
      )}
    </div>
  );
};

export default ContactInfo;
