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
  isFromUnusedWaivers?: boolean;
};

/**
 * Yes/no button group for selecting whether a model will use a waiver.
 * Must be rendered within a react-hook-form FormProvider.
 */
const SelectWaiverField = ({
  fieldPrefix,
  className,
  isFromUnusedWaivers
}: SelectWaiverFieldProps) => {
  const { t: waiverAssessmentSurveyMiscT } = useTranslation(
    'waiverAssessmentSurveyMisc'
  );
  const { t: generalT } = useTranslation('general');

  const { control, setValue } = useFormContext();

  const willUseWaiverField = `${fieldPrefix}.willUseWaiver`;

  const reasonFieldName = isFromUnusedWaivers
    ? 'usingReason'
    : 'notUsingReason';

  const fieldId = fieldPrefix.replace(/\./g, '-');

  return (
    <FormGroup className={className}>
      <div className="margin-bottom-3">
        <Label
          id={`willUseWaiverLabel-${fieldId}`}
          htmlFor={`willUseWaiver-yes-${fieldId}`}
          className="margin-top-2"
        >
          {waiverAssessmentSurveyMiscT('waiverInfoPanel.willUseWaiverLabel')}
        </Label>
        <HelpText id={`willUseWaiverHelpText-${fieldId}`}>
          {waiverAssessmentSurveyMiscT('waiverInfoPanel.willUseWaiverHelpText')}
        </HelpText>
      </div>

      <Controller
        name={willUseWaiverField}
        control={control}
        render={({ field }) => (
          <>
            {(field.value === null || field.value === undefined) && (
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
                      setValue(willUseWaiverField, true, {
                        shouldDirty: true
                      })
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
                      setValue(willUseWaiverField, false, {
                        shouldDirty: true
                      })
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
            )}

            {field.value !== null && field.value !== undefined && (
              <>
                <div className="display-flex flex-align-center">
                  <p
                    className={classNames(
                      'margin-top-0 margin-bottom-05 margin-right-2 display-flex flex-align-center text-bold',
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
                    className="margin-top-0 margin-bottom-05 deep-underline"
                    unstyled
                    onClick={() => {
                      setValue(willUseWaiverField, null, { shouldDirty: true });
                      setValue(`${fieldPrefix}.${reasonFieldName}`, '', {
                        shouldDirty: true
                      });
                    }}
                  >
                    {waiverAssessmentSurveyMiscT(
                      isFromUnusedWaivers
                        ? 'waiverInfoPanel.removeWaiver'
                        : 'waiverInfoPanel.changeResponse'
                    )}
                  </Button>
                </div>

                {(field.value === false || isFromUnusedWaivers) && (
                  <FormGroup>
                    <Label htmlFor={`${reasonFieldName}-${fieldId}`}>
                      {waiverAssessmentSurveyMiscT(
                        isFromUnusedWaivers
                          ? 'waiverInfoPanel.usingReason'
                          : 'waiverInfoPanel.notUsingReason'
                      )}
                    </Label>

                    <Controller
                      name={`${fieldPrefix}.${reasonFieldName}`}
                      control={control}
                      defaultValue=""
                      render={({ field: { ref, ...textField } }) => (
                        <Textarea
                          {...textField}
                          id={`${reasonFieldName}-${fieldId}`}
                          data-testid={`${reasonFieldName}-${fieldId}`}
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
