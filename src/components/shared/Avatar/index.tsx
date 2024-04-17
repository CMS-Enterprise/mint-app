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
  const avatarColors = (username: string): string => {
    // Calculate the hash value of the username
    const hashValue: number = hashString(username);
    // Map the hash value to an index in the palette array
    const index: number = hashValue % palette.length;
    // Retrieve and return the color from the palette
    return palette[index];
  };

  const sharedClassnames =
    'display-flex flex-align-center flex-justify-center minw-4 circle-4';

  if (isAssessment) {
    return (
      <div
        className={`${sharedClassnames} bg-primary ${className ?? ''}`}
        data-testid="avatar--assessment"
      >
        <Icon.Star className="text-white" size={3} />
      </div>
    );
  }

  if (user === 'MINT') {
    return (
      <div
        className={`${sharedClassnames} bg-mint-cool-50v ${className ?? ''}`}
        data-testid="avatar--mint-admin"
      >
        <Icon.Eco className="text-white" size={3} />
      </div>
    );
  }

  return (
    <div
      className={`${sharedClassnames} ${avatarColors(user)} ${className ?? ''}`}
      data-testid="avatar--basic"
    >
      {getUserInitials(user)}
    </div>
  );
};

type AvatarProps = {
  user: string;
  className?: string;
  teamRoles?: TeamRole[];
  isAssessment?: boolean;
};

export const Avatar = ({
  user,
  className,
  teamRoles,
  isAssessment
}: AvatarProps) => {
  const { t: collaboratorsT } = useTranslation('collaborators');
  const { t: discussionsMiscT } = useTranslation('discussionsMisc');

  const modelLeadFirst = teamRoles
    ? [
        ...teamRoles.filter((role: TeamRole) => role === TeamRole.MODEL_LEAD),
        ...teamRoles.filter((role: TeamRole) => role !== TeamRole.MODEL_LEAD)
      ]
    : [];

  return (
    <div
      className={`display-flex ${className ?? ''} ${
        teamRoles ? 'flex-align-start' : 'flex-align-center'
      }`}
    >
      <AvatarCircle
        user={user}
        className="margin-right-1"
        isAssessment={isAssessment}
      />
      <div className="margin-y-0">
        <span>
          {isAssessment && `${discussionsMiscT('assessment')} | `}
          {user}
        </span>
        {teamRoles && (
          <p className="font-body-2xs margin-y-0">
            {modelLeadFirst
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
