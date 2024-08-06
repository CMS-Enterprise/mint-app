import React from 'react';
import { Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { DateTime } from 'luxon';

import UswdsReactLink from 'components/LinkWrapper';

type PageNumberProps = {
  className?: string;
  dateISO: string | null | undefined;
  link: string;
  linkText: string;
};

const CalendarDate = ({
  className,
  dateISO,
  link,
  linkText
}: PageNumberProps) => {
  return (
    <div
      className={classNames(
        'usa-collection__item border-0 padding-0 margin-0',
        className
      )}
    >
      <div
        className="usa-collection__calendar-date"
        data-testid="collection-calendar-date"
      >
        <time dateTime={dateISO || undefined}>
          <span className="usa-collection__calendar-date-month padding-05 font-body-2xs">
            {DateTime.fromISO(dateISO || '').toFormat('MMM')}
          </span>
          <span className="usa-collection__calendar-date-day padding-05 font-body-2xs">
            {DateTime.fromISO(dateISO || '').toFormat('dd')}
          </span>
        </time>
      </div>
      <UswdsReactLink to={link}>
        <span>
          <h4 className="usa-collection__heading display-inline margin-right-1 font-body-md">
            {linkText}
          </h4>
          <Icon.ArrowForward className="top-3px" />
        </span>
      </UswdsReactLink>
    </div>
  );
};

export default CalendarDate;
