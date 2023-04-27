import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, DatePicker, Label } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { Field } from 'formik';

import { isDateInPast } from 'utils/date';

import DatePickerWarning from '../DatePickerWarning';
import FieldErrorMsg from '../FieldErrorMsg';
import FieldGroup from '../FieldGroup';

interface ITSolutionsFormComponentType {
  id: string;
  className?: string;
  fieldName: string;
  label: string;
  boldLabel?: boolean;
  subLabel?: string;
  placeHolder?: boolean;
  handleOnBlur: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
  value: string | null;
  formikValue: string | null;
  error: string;
  warning?: boolean;
  half?: boolean;
}

export const MINTDatePicker = ({
  id,
  className,
  fieldName,
  label,
  boldLabel = true,
  subLabel,
  placeHolder = false,
  handleOnBlur,
  value,
  formikValue,
  error,
  warning = true,
  half
}: ITSolutionsFormComponentType) => {
  const { t: h } = useTranslation('draftModelPlan');

  return (
    <>
      <FieldGroup
        scrollElement={fieldName}
        error={!!error}
        className={classNames(className, 'margin-right-4', {
          'desktop:grid-col-6 padding-right-4': half
        })}
      >
        <Label
          htmlFor={id}
          id={`label-${id}`}
          className={classNames('usa-legend margin-top-0', {
            'text-normal': !boldLabel
          })}
        >
          {label}
        </Label>
        {subLabel && (
          <p className="text-normal margin-bottom-1 margin-top-0 ">
            {subLabel}
          </p>
        )}
        {placeHolder && (
          <div className="usa-hint" id="appointment-date-hint">
            {h('datePlaceholder')}
          </div>
        )}
        <FieldErrorMsg>{error}</FieldErrorMsg>
        <div className="position-relative">
          <Field
            as={DatePicker}
            aria-labelledby={`label-${id} appointment-date-hint`}
            error={+!!error}
            id={id}
            maxLength={50}
            name={fieldName}
            defaultValue={value}
            onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleOnBlur(e, fieldName);
            }}
          />
          {isDateInPast(formikValue) && (
            <DatePickerWarning label={h('dateWarning')} />
          )}
        </div>
      </FieldGroup>

      {warning && isDateInPast(formikValue) && (
        <Alert type="warning" className="margin-top-4">
          {h('dateWarning')}
        </Alert>
      )}
    </>
  );
};

export default MINTDatePicker;
