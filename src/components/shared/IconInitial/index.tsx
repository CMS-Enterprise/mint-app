import React from 'react';
import classNames from 'classnames';

type IconInitialType = {
  user: string;
  index?: number;
  className?: string;
};

const IconInitial = ({ user, index = 0, className }: IconInitialType) => {
  const arrayOfColors = [
    'bg-accent-cool-lighter',
    'bg-secondary-lighter',
    'bg-primary-lighter',
    'bg-accent-warm-lighter'
  ];

  return (
    <li
      className={classNames(
        'display-flex flex-align-center margin-bottom-1',
        className
      )}
      key={user}
    >
      <div
        className={`display-flex flex-align-center flex-justify-center circle-4 margin-right-1 ${
          arrayOfColors[index % arrayOfColors.length]
        }`}
      >
        {/* Takes first letter of first and last name */}
        {/* i.e. Steve Rogers == SR */}
        {user
          ?.match(/(\b\S)?/g)
          ?.join('')
          ?.match(/(^\S|\S$)?/g)
          ?.join('')
          ?.toUpperCase()}
      </div>
      <p className="margin-y-0">{user}</p>
    </li>
  );
};

export default IconInitial;
