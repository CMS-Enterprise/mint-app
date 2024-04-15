import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@trussworks/react-uswds';
import { TeamRole } from 'gql/gen/graphql';

import { getUserInitials } from 'utils/modelPlan';

type AvatarCircleProps = {
  user: string;
  className?: string;
  isAssessment?: boolean;
};

export const AvatarCircle = ({
  user,
  className,
  isAssessment
}: AvatarCircleProps) => {
  // Color palette for user identification
  const palette: string[] = [
    'bg-red-cool-10',
    'bg-blue-10',
    'bg-orange-warm-10',
    'bg-yellow-5',
    'bg-green-5'
  ];

  // Hashes a string to generate a numeric value
  const hashString = (inputString: string): number => {
    // Remove leading and trailing spaces, and replace spaces with an empty string
    const trimmedString: string = inputString.trim().replace(/\s/g, '');

    // Initial hash value
    let hash: number = 5381;

    // Iterate over each character in the trimmed string
    for (let i = 0; i < trimmedString.length; i += 1) {
      const char = trimmedString.charCodeAt(i);
      // Update the hash value using DJB2 algorithm
      hash = hash * 33 + char;
    }

    // Ensure the hash is non-negative
    return Math.abs(hash);
  };

  // Gets a color from the palette based on a username
  const getAvatarColorsFromUsername = (username: string): string => {
    // Calculate the hash value of the username
    const hashValue: number = hashString(username);
    // Map the hash value to an index in the palette array
    const index: number = hashValue % palette.length;
    // Retrieve and return the color from the palette
    return palette[index];
  };

  if (isAssessment) {
    return (
      <div
        className={`display-flex flex-align-center flex-justify-center minw-4 circle-4 bg-primary ${
          className ?? ''
        }`}
      >
        <Icon.Star className="text-white" size={3} />
      </div>
    );
  }

  if (user === 'MINT') {
    return (
      <div
        className={`display-flex flex-align-center flex-justify-center minw-4 circle-4 bg-mint-cool-50v ${
          className ?? ''
        }`}
      >
        <Icon.Eco className="text-white" size={3} />
      </div>
    );
  }

  return (
    <div
      className={`display-flex flex-align-center flex-justify-center minw-4 circle-4 ${
        className ?? ''
      } ${getAvatarColorsFromUsername(user)} `}
    >
      {getUserInitials(user)}
    </div>
  );
};

type AvatarProps = {
  user: string;
  className?: string;
  teamRoles?: TeamRole[];
};

export const Avatar = ({ user, className, teamRoles }: AvatarProps) => {
  const { t: collaboratorsT } = useTranslation('collaborators');

  const modelLeadFirst = teamRoles && [
    ...teamRoles.filter((role: TeamRole) => role === TeamRole.MODEL_LEAD),
    ...teamRoles.filter((role: TeamRole) => role !== TeamRole.MODEL_LEAD)
  ];

  return (
    <div
      className={`display-flex ${className ?? ''} ${
        teamRoles ? 'flex-align-start' : 'flex-align-center'
      }`}
    >
      <AvatarCircle user={user} className="margin-right-1" />
      <div className="margin-y-0">
        <p className="margin-y-0">{user}</p>
        {teamRoles && (
          <p className="font-body-2xs margin-y-0">
            {modelLeadFirst!
              .map(role => {
                return collaboratorsT(`teamRoles.options.${role}`);
              })
              .join(', ')}
          </p>
        )}
      </div>
    </div>
  );
};
