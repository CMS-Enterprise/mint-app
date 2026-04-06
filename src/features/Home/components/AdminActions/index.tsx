import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Icon,
  SummaryBox,
  SummaryBoxContent,
  SummaryBoxHeading
} from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import { tArray } from 'utils/translation';

const AdminActions = () => {
  const { t } = useTranslation('adminActions');

  const actionsList = tArray<{
    header: string;
    description: string;
    cta: string;
    route: string;
  }>('adminActions:actions');

  return (
    <SummaryBox className="bg-info-lighter border-1px border-info-light radius-md padding-3">
      <SummaryBoxHeading headingLevel="h2" className="margin-bottom-2">
        {t('title')}
      </SummaryBoxHeading>
      {actionsList.map((section, index) => (
        <SummaryBoxContent
          key={section.header}
          className={classNames(
            index < actionsList.length - 1 && 'margin-bottom-3'
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
          >
            {section.cta}
            <Icon.ArrowForward className="margin-left-1" aria-label="forward" />
          </UswdsReactLink>
        </SummaryBoxContent>
      ))}
    </SummaryBox>
  );
};

export default AdminActions;
