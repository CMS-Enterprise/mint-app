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
          <span className="usa-collection__calendar-date-month padding-05">
            {DateTime.fromISO(dateISO || '').toFormat('MMM')}
          </span>
          <span className="usa-collection__calendar-date-day padding-05">
            {DateTime.fromISO(dateISO || '').toFormat('dd')}
          </span>
        </time>
      </div>
      <UswdsReactLink to={link} className="display-flex flex-align-center">
        <h4 className="usa-collection__heading">{linkText}</h4>
        <Icon.ArrowForward />
      </UswdsReactLink>
    </div>
  );
};

export default CalendarDate;
