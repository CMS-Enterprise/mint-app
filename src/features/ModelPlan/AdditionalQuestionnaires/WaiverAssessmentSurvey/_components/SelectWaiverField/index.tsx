import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Fieldset,
  FormGroup,
  Icon,
  Label,
  Textarea
} from '@trussworks/react-uswds';
import classNames from 'classnames';

import HelpText from 'components/HelpText';

import './index.scss';

export type SelectWaiverFieldProps = {
  /** RHF path prefix for this waiver, e.g. `waivers.${commonWaiverID}` */
  fieldPrefix: string;
  className?: string;
};

/**
 * Yes/no button group for selecting whether a model will use a waiver.
 * Must be rendered within a react-hook-form FormProvider.
 */
const SelectWaiverField = ({
  fieldPrefix,
  className
}: SelectWaiverFieldProps) => {
  const { t: waiverAssessmentSurveyMiscT } = useTranslation(
    'waiverAssessmentSurveyMisc'
  );
  const { t: generalT } = useTranslation('general');

  const { control, setValue } = useFormContext();

  const willUseWaiverField = `${fieldPrefix}.willUseWaiver`;
  const notUsingReasonField = `${fieldPrefix}.notUsingReason`;
  const fieldId = fieldPrefix.replace(/\./g, '-');

  return (
    <FormGroup className={className}>
      <Label
        id={`willUseWaiverLabel-${fieldId}`}
        htmlFor={`willUseWaiver-yes-${fieldId}`}
      >
        {waiverAssessmentSurveyMiscT('waiverInfoPanel.willUseWaiverLabel')}
      </Label>
      <HelpText id={`willUseWaiverHelpText-${fieldId}`}>
        {waiverAssessmentSurveyMiscT('waiverInfoPanel.willUseWaiverHelpText')}
      </HelpText>
      <Controller
        name={willUseWaiverField}
        control={control}
        render={({ field }) => (
          <>
            {field.value === null || field.value === undefined ? (
              <Fieldset
                className="mint-yes-no-button-group margin-top-2"
                aria-labelledby={`willUseWaiverLabel-${fieldId}`}
                aria-describedby={`willUseWaiverHelpText-${fieldId}`}
              >
                <div className="mint-yes-no-button mint-yes-no-button--yes">
                  <input
                    type="radio"
                    id={`willUseWaiver-yes-${fieldId}`}
                    data-testid={`willUseWaiver-yes-${fieldId}`}
                    {...field}
                    onChange={() =>
                      setValue(willUseWaiverField, true, { shouldDirty: true })
                    }
                    value="true"
                  />
                  <label
                    className="usa-button"
                    htmlFor={`willUseWaiver-yes-${fieldId}`}
                  >
                    <Icon.Check aria-hidden />
                    {generalT('yes')}
                  </label>
                </div>
                <div className="mint-yes-no-button mint-yes-no-button--no">
                  <input
                    type="radio"
                    id={`willUseWaiver-no-${fieldId}`}
                    data-testid={`willUseWaiver-no-${fieldId}`}
                    {...field}
                    onChange={() =>
                      setValue(willUseWaiverField, false, { shouldDirty: true })
                    }
                    value="false"
                  />
                  <label
                    className="usa-button"
                    htmlFor={`willUseWaiver-no-${fieldId}`}
                  >
                    <Icon.Close aria-hidden />
                    {generalT('no')}
                  </label>
                </div>
              </Fieldset>
            ) : (
              <>
                <p
                  className={classNames(
                    'margin-top-2 margin-bottom-05 display-flex flex-align-center text-bold',
                    field.value === true
                      ? 'text-success-darker'
                      : 'text-error-dark'
                  )}
                >
                  {field.value === true ? (
                    <Icon.Check aria-hidden className="margin-right-1" />
                  ) : (
                    <Icon.Close aria-hidden className="margin-right-1" />
                  )}
                  {field.value === true
                    ? waiverAssessmentSurveyMiscT(
                        'waiverInfoPanel.willUseWaiver_true'
                      )
                    : waiverAssessmentSurveyMiscT(
                        'waiverInfoPanel.willUseWaiver_false'
                      )}
                </p>
                <Button
                  type="button"
                  className="margin-0"
                  unstyled
                  onClick={() => {
                    setValue(willUseWaiverField, null, { shouldDirty: true });
                    setValue(notUsingReasonField, '', { shouldDirty: true });
                  }}
                >
                  {waiverAssessmentSurveyMiscT(
                    'waiverInfoPanel.changeResponse'
                  )}
                </Button>

                {field.value === false && (
                  <FormGroup>
                    <Label htmlFor={`notUsingReason-${fieldId}`}>
                      {waiverAssessmentSurveyMiscT(
                        'waiverInfoPanel.notUsingReason'
                      )}
                    </Label>

                    <Controller
                      name={notUsingReasonField}
                      control={control}
                      defaultValue=""
                      render={({ field: { ref, ...textField } }) => (
                        <Textarea
                          {...textField}
                          id={`notUsingReason-${fieldId}`}
                          data-testid={`notUsingReason-${fieldId}`}
                        />
                      )}
                    />
                  </FormGroup>
                )}
              </>
            )}
          </>
        )}
      />
    </FormGroup>
  );
};

export default SelectWaiverField;
