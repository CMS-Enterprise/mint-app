import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, IconExpandLess, IconExpandMore } from '@trussworks/react-uswds';
import classNames from 'classnames';

type ImplementationStatusType = {
  status: string;
  description: string;
};

interface ImplementationStatus {
  [key: string]: ImplementationStatusType;
}

type ImplementationStatusProps = {
  className?: string;
};

// Component for togglable information regarding IT Solution statuses and their descriptions
const ImplementationStatuses = ({ className }: ImplementationStatusProps) => {
  const { t } = useTranslation('itSolutions');

  // Toggle the collapsed state of implementation status info
  const [infoToggle, setInfoToggle] = useState<boolean>(false);

  // Fetches statuses and translations as object to map through and render as list
  const implentationStatuses: ImplementationStatus = t(
    'itSolutions:solutionStatuses',
    {
      returnObjects: true
    }
  );

  return (
    <Grid desktop={{ col: 6 }} className={classNames(className)}>
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
          <IconExpandMore className="margin-right-05" />
        ) : (
          <IconExpandLess className="margin-right-05 needs-question__rotate" />
        )}
        {t('summaryBox.implementationStatuses')}
      </button>

      {infoToggle && (
        <div className="margin-left-neg-2px padding-1">
          <div className="border-left-05 border-base-dark padding-left-2 padding-y-0">
            <ul className="padding-left-2 margin-0">
              {Object.keys(implentationStatuses).map((status: string) => (
                <li className="margin-y-1">
                  <span className="text-bold">
                    {implentationStatuses[status].status}
                  </span>
                  :
                  <span className="margin-left-1">
                    {implentationStatuses[status].description}
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

export default ImplementationStatuses;
