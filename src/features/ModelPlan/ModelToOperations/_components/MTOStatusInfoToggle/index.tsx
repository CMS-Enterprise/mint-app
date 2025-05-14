import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { transform } from 'lodash';

import { tObject } from 'utils/translation';

type ImplementationStatusType = {
  status: string;
  description: string;
};

interface ImplementationStatus {
  [key: string]: ImplementationStatusType;
}

type ImplementationStatusProps = {
  type?: 'solution' | 'milestone';
  className?: string;
  slim?: boolean;
};

// Component for togglable information regarding IT Solution statuses and their descriptions
const MTOStatusInfoToggle = ({
  type = 'solution',
  className,
  slim
}: ImplementationStatusProps) => {
  const { t } = useTranslation('modelToOperationsMisc');

  // Toggle the collapsed state of implementation status info
  const [infoToggle, setInfoToggle] = useState<boolean>(false);

  const statusType =
    type === 'solution' ? 'solutionStatuses' : 'milestoneStatuses';

  // Fetches statuses and translations as object to map through and render as list
  const mtostatus = tObject<keyof ImplementationStatus, Record<string, string>>(
    `modelToOperationsMisc:${statusType}`
  );

  return (
    <Grid desktop={{ col: slim ? 6 : 12 }} className={classNames(className)}>
      <button
        type="button"
        data-testid="toggle-need-answer"
        onClick={() => setInfoToggle(!infoToggle)}
        className={classNames(
          'usa-button usa-button--unstyled display-flex flex-align-center text-ls-1 deep-underline margin-bottom-1 margin-top-3',
          {
            'text-bold': infoToggle
          }
        )}
      >
        {infoToggle ? (
          <Icon.ExpandMore className="margin-right-05" />
        ) : (
          <Icon.ExpandLess
            className="margin-right-05"
            style={{ transform: 'rotate(90deg)' }}
          />
        )}
        {type === 'solution'
          ? t('solutionStatusButton')
          : t('milestoneStatusButton')}
      </button>

      {infoToggle && (
        <div className="margin-left-neg-2px padding-1">
          <div className="border-left-05 border-base-dark padding-left-2 padding-y-0">
            <ul className="padding-left-2 margin-0">
              {Object.keys(mtostatus).map((status: string) => (
                <li className="margin-y-1" key={status}>
                  <span className="text-bold">{mtostatus[status].status}</span>:
                  <span className="margin-left-1">
                    {mtostatus[status].description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Grid>
  );
};

export default MTOStatusInfoToggle;
