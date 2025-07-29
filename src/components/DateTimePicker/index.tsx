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
  formValue: string | undefined | null;
  isDateInPast: boolean;
  alertIcon?: boolean; // Whether to show the warning icon
  alertText?: boolean; // Whether to show the warning text. Sometimes we want to render the warning text under a different parent/UI element - outside the scope of this component
  className?: string;
};

/*
  This component is a wrapper around the ReactDatePicker component.
  It is used to display a date picker with an optional warning icon and alert. Default is true
  The warning icon and alert are only displayed if the date is in the past.
*/
const DateTimePicker = ({
  id,
  name,
  formValue,
  isDateInPast,
  alertIcon = true,
  alertText = true,
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

  return (
    <div>
      <div className={classNames('display-flex margin-top-1', className)}>
        <ReactDatePicker
          {...props}
          ref={datePickerRef}
          id={id}
          name={name}
          open={isOpen}
          onClickOutside={() => setIsOpen(false)}
          onSelect={() => setIsOpen(false)}
          selected={formValue ? new Date(formValue) : null}
          aria-label={generalT('datePicker.label')}
          popperPlacement="bottom-start"
        />

        {isDateInPast && alertIcon && (
          <div className="mint-datetime-picker-warning">
            <Tooltip label={generalT('dateWarning')} asCustom={CustomDiv}>
              <Icon.Warning
                size={3}
                className="text-warning-dark"
                aria-label={generalT('datePicker.warning')}
              />
            </Tooltip>
          </div>
        )}

        <Button
          type="button"
          unstyled
          className="text-black padding-0 margin-left-1 margin-top-0"
          aria-label={generalT('datePicker.open')}
          disabled={props.disabled}
          onClick={() => (isOpen ? setIsOpen(false) : setIsOpen(true))}
        >
          <Icon.CalendarToday size="3" />
        </Button>
      </div>

      {isDateInPast && alertText && (
        <Alert
          type="warning"
          className="margin-top-2"
          headingLevel="h4"
          role="alert"
          slim
          aria-label={generalT('datePicker.warning')}
        >
          {generalT('dateWarning')}
        </Alert>
      )}
    </div>
  );
};

export default DateTimePicker;
