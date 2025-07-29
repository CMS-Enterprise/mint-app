import React, { forwardRef, useRef, useState } from 'react';
import ReactDatePicker, { DatePickerProps } from 'react-datepicker';
import { useTranslation } from 'react-i18next';
import { Alert, Button, Icon, Tooltip } from '@trussworks/react-uswds';
import classNames from 'classnames';

import 'react-datepicker/dist/react-datepicker.css';
import './index.scss';

type DateTimePickerProps = DatePickerProps & {
  id: string;
  name: string;
  label: string;
  value: string | undefined | null;
  isDateInPast: boolean;
  className?: string;
};

const DateTimePicker = ({
  id,
  name,
  label,
  value,
  isDateInPast,
  className,
  ...props
}: DateTimePickerProps) => {
  const { t: generalT } = useTranslation('general');

  const [isOpen, setIsOpen] = useState(false);

  const datePickerRef = useRef<ReactDatePicker>(null);

  const CustomDivForwardRef: React.ForwardRefRenderFunction<HTMLDivElement> = (
    { ...tooltipProps },
    ref
  ) => <div ref={ref} {...tooltipProps} />;

  const CustomDiv = forwardRef<HTMLDivElement>(CustomDivForwardRef);

  const classes = classNames('mint-datepicker-warning', {
    'margin-left-1': isDateInPast
  });

  return (
    <div>
      <div className={classNames('display-flex margin-top-1', className)}>
        <ReactDatePicker
          {...props}
          ref={datePickerRef}
          open={isOpen}
          onClickOutside={() => setIsOpen(false)}
          onSelect={() => setIsOpen(false)}
          selected={value ? new Date(value) : null}
          aria-label="Date picker"
        />

        {isDateInPast && (
          <div className={classes}>
            <Tooltip label={generalT('dateWarning')} asCustom={CustomDiv}>
              <Icon.Warning
                size={3}
                className="text-warning-dark"
                aria-label="warning"
              />
            </Tooltip>
          </div>
        )}

        <Button
          type="button"
          unstyled
          className="text-black padding-0 margin-left-1 margin-top-0"
          aria-label="Open date picker"
          onClick={() => (isOpen ? setIsOpen(false) : setIsOpen(true))}
        >
          <Icon.CalendarToday size="3" />
        </Button>
      </div>

      {isDateInPast && (
        <Alert
          type="warning"
          className="margin-top-2"
          headingLevel="h4"
          slim
          aria-label="Date is in the past"
        >
          {generalT('dateWarning')}
        </Alert>
      )}
    </div>
  );
};

export default DateTimePicker;
