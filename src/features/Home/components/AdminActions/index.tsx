import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Icon,
  SummaryBox,
  SummaryBoxContent,
  SummaryBoxHeading
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { useFlags } from 'launchdarkly-react-client-sdk';

import UswdsReactLink from 'components/LinkWrapper';
import { convertToLowercaseAndDashes } from 'utils/modelPlan';
import { tArray } from 'utils/translation';

const AdminActions = () => {
  const { t } = useTranslation('adminActions');

  const flags = useFlags();

  const [isExpanded, setIsExpanded] = useState(true);

  const actionsList = tArray<{
    header: string;
    description: string;
    cta: string;
    route: string;
  }>('adminActions:actions');

  const filteredActionsList = flags.ctatEnabled
    ? actionsList
    : actionsList.filter(
        action => action.route !== '/help-and-knowledge/contract-assistance'
      );

  return (
    <SummaryBox className="bg-info-lighter border-1px border-info-light radius-md padding-3">
      <div className="display-flex flex-align-center">
        <SummaryBoxHeading headingLevel="h2" className="margin-0">
          {t('title')}
        </SummaryBoxHeading>
        <Button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-controls="admin-actions-content"
          unstyled
          data-testid="admin-actions-toggle"
          className="margin-left-2 deep-underline"
        >
          {isExpanded ? (
            <div className="display-flex flex-align-center">
              {t('hideAdminActions')}
              <Icon.ExpandLess
                className="margin-left-1"
                aria-label="collapse"
              />
            </div>
          ) : (
            <div className="display-flex flex-align-center">
              {t('showAdminActions')}
              <Icon.ExpandMore className="margin-left-1" aria-label="expand" />
            </div>
          )}
        </Button>
      </div>
      {isExpanded && (
        <div id="admin-actions-content" className="margin-top-2">
          {filteredActionsList.map((section, index) => (
            <SummaryBoxContent
              key={section.header}
              className={classNames(
                index < filteredActionsList.length - 1 && 'margin-bottom-3'
              )}
            >
              <h4 className="margin-0 margin-bottom-1 line-height-sans-2">
                {section.header}
              </h4>
              <p className="margin-0 margin-bottom-1 line-height-sans-5">
                {section.description}
              </p>

              <UswdsReactLink
                variant="unstyled"
                to={section.route}
                className="display-flex flex-align-center deep-underline"
                state={{ fromHomePage: true }}
                data-testid={`to-${convertToLowercaseAndDashes(section.cta)}`}
              >
                {section.cta}
                <Icon.ArrowForward
                  className="margin-left-1"
                  aria-label="forward"
                />
              </UswdsReactLink>
            </SummaryBoxContent>
          ))}
        </div>
      )}
    </SummaryBox>
  );
};

export default AdminActions;
