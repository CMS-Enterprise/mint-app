import React from 'react';
import { Trans } from 'react-i18next';
import { Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';

type FollowerMessageBannerProps = {
  modelID: string;
  className?: string;
};

const FollowerMessageBanner = ({
  modelID,
  className
}: FollowerMessageBannerProps) => (
  <div
    className={classNames(
      'display-flex flex-align-center bg-info-lighter border-left-05 border-info padding-y-1 padding-x-2',
      className
    )}
    data-testid="follower-message-banner"
  >
    <Icon.Campaign className="margin-right-1 flex-no-shrink" aria-hidden />
    <span>
      <Trans
        i18nKey="collaborationArea:followerMessageBanner"
        components={{
          link1: (
            <UswdsReactLink
              to={`/models/${modelID}/collaboration-area/send-message-to-followers`}
            />
          )
        }}
      />
    </span>
  </div>
);

export default FollowerMessageBanner;
