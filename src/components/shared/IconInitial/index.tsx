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
  teamRoles
}: IconInitialType) => {
  const { t: collaboratorsT } = useTranslation('collaborators');

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
        <p className="margin-y-0">{user}</p>
        <p className="font-body-2xs margin-y-0">
          {teamRoles &&
            teamRoles
              .map(role => {
                return collaboratorsT(`teamRole.options.${role}`);
              })
              .join(', ')}
        </p>
      </div>
    </li>
  );
};

export default IconInitial;
