import React from 'react';
import { Icon } from '@trussworks/react-uswds';

import getAvatarColorsFromUsername from 'utils/avatarColors';
import { getUserInitials } from 'utils/modelPlan';

const AvatarCircle = ({ user }: { user: string }) => {
  return (
    <>
      {user === 'MINT' ? (
        <div className="display-flex flex-align-center flex-justify-center minw-4 circle-4 bg-mint-cool-50v">
          <Icon.Eco className="text-white" size={3} />
        </div>
      ) : (
        <div
          className={`display-flex flex-align-center flex-justify-center minw-4 circle-4 ${getAvatarColorsFromUsername(
            user
          )}`}
        >
          {getUserInitials(user)}
        </div>
      )}
    </>
  );
};

export default AvatarCircle;
