import React from 'react';
import { Trans } from 'react-i18next';
import { Icon, SummaryBox } from '@trussworks/react-uswds';
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
  <SummaryBox
    className={classNames(
      'display-flex flex-align-center padding-y-1 padding-x-3',
      className
    )}
    data-testid="follower-message-banner"
  >
    <div className="display-flex flex-align-center">
      <Icon.Campaign
        size={3}
        className="margin-right-2 text-info-darker"
        aria-hidden
      />
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
  </SummaryBox>
);

export default FollowerMessageBanner;
