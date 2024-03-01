import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { TeamRole } from 'gql/gen/graphql';

import { getUserInitials } from 'utils/modelPlan';

type IconInitialType = {
  user: string;
  index?: number;
  className?: string;
  teamRoles?: TeamRole[];
  hasBoldUsername?: boolean;
};

export const arrayOfColors: string[] = [
  'bg-accent-cool-lighter',
  'bg-secondary-lighter',
  'bg-primary-lighter',
  'bg-accent-warm-lighter'
];

const IconInitial = ({
  user,
  index = 0,
  className,
  teamRoles,
  hasBoldUsername
}: IconInitialType) => {
  const { t: collaboratorsT } = useTranslation('collaborators');

  const modelLeadFirst = teamRoles && [
    ...teamRoles.filter((role: TeamRole) => role === TeamRole.MODEL_LEAD),
    ...teamRoles.filter((role: TeamRole) => role !== TeamRole.MODEL_LEAD)
  ];

  return (
    <li
      className={classNames(
        'display-flex',
        { 'flex-align-center': !teamRoles },
        { 'flex-align-start': teamRoles },
        className
      )}
      key={user}
    >
      <div
        className={`display-flex flex-align-center flex-justify-center circle-4 margin-right-1 ${
          arrayOfColors[index % arrayOfColors.length]
        }`}
      >
        {getUserInitials(user)}
      </div>
      <div className="margin-y-0">
        <p className={`margin-y-0 ${hasBoldUsername ? 'text-bold' : ''}`}>
          {user}
        </p>
        <p className="font-body-2xs margin-y-0">
          {teamRoles &&
            modelLeadFirst!
              .map(role => {
                return collaboratorsT(`teamRoles.options.${role}`);
              })
              .join(', ')}
        </p>
      </div>
    </li>
  );
};

export default IconInitial;
