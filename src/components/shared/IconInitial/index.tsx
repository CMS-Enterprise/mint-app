import React from 'react';
import classNames from 'classnames';

import { getUserInitials } from 'utils/modelPlan';

type IconInitialType = {
  user: string;
  index?: number;
  className?: string;
};

export const arrayOfColors: string[] = [
  'bg-accent-cool-lighter',
  'bg-secondary-lighter',
  'bg-primary-lighter',
  'bg-accent-warm-lighter'
];

const IconInitial = ({ user, index = 0, className }: IconInitialType) => {
  return (
    <li
      className={classNames('display-flex flex-align-center', className)}
      key={user}
    >
      <div
        className={`display-flex flex-align-center flex-justify-center circle-4 margin-right-1 ${
          arrayOfColors[index % arrayOfColors.length]
        }`}
      >
        {getUserInitials(user)}
      </div>
      <p className="margin-y-0">{user}</p>
    </li>
  );
};

export default IconInitial;
