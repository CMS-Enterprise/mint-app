import React from 'react';

const TeamMembersList = ({ team }: { team: string[] }) => {
  const arrayOfColors = [
    'bg-accent-cool-lighter',
    'bg-secondary-lighter',
    'bg-primary-lighter',
    'bg-accent-warm-lighter'
  ];

  return (
    <>
      {team.map((name, index) => {
        return (
          <li
            className="display-flex flex-align-center margin-bottom-1"
            key={name}
          >
            <div
              className={`display-flex flex-align-center flex-justify-center circle-4 margin-right-1 ${
                arrayOfColors[index % arrayOfColors.length]
              }`}
            >
              {/* Takes first letter of first and last name */}
              {/* i.e. Steve Rogers == SR */}
              {name
                ?.match(/(\b\S)?/g)
                ?.join('')
                ?.match(/(^\S|\S$)?/g)
                ?.join('')
                ?.toUpperCase()}
            </div>
            <p className="margin-y-0">{name}</p>
          </li>
        );
      })}
    </>
  );
};

export default TeamMembersList;
