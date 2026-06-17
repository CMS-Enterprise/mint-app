import React from 'react';
import { Controller, useForm } from 'react-hook-form';
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

type WaiverSelectionFields = {
  willUseWaiver: boolean | null;
  notUsingReason: string;
};

export type SelectWaiverFieldProps = {
  className?: string;
};

/**
 * Yes/no button group for selecting whether a model will use a waiver.
 * Must be rendered within a react-hook-form FormProvider for willUseWaiver and notUsingReason.
 */
const SelectWaiverField = ({ className }: SelectWaiverFieldProps) => {
  const { t: waiverAssessmentSurveyMiscT } = useTranslation(
    'waiverAssessmentSurveyMisc'
  );
  const { t: generalT } = useTranslation('general');

  const { control, setValue, register } = useForm<WaiverSelectionFields>({
    defaultValues: {
      willUseWaiver: null,
      notUsingReason: ''
    }
  });

  return (
    <FormGroup className={className}>
      <Label id="willUseWaiverLabel" htmlFor="willUseWaiver-yes">
        {waiverAssessmentSurveyMiscT('waiverInfoPanel.willUseWaiverLabel')}
      </Label>
      <HelpText id="willUseWaiverHelpText">
        {waiverAssessmentSurveyMiscT('waiverInfoPanel.willUseWaiverHelpText')}
      </HelpText>
      <Controller
        name="willUseWaiver"
        control={control}
        render={({ field }) => (
          <>
            {field.value === null ? (
              <Fieldset
                className="mint-yes-no-button-group margin-top-2"
                aria-labelledby="willUseWaiverLabel"
                aria-describedby="willUseWaiverHelpText"
              >
                <div className="mint-yes-no-button mint-yes-no-button--yes">
                  <input
                    type="radio"
                    id="willUseWaiver-yes"
                    data-testid="willUseWaiver-yes"
                    {...field}
                    onChange={() => setValue('willUseWaiver', true)}
                    value="true"
                  />
                  <label className="usa-button" htmlFor="willUseWaiver-yes">
                    <Icon.Check aria-hidden />
                    {generalT('yes')}
                  </label>
                </div>
                <div className="mint-yes-no-button mint-yes-no-button--no">
                  <input
                    type="radio"
                    id="willUseWaiver-no"
                    data-testid="willUseWaiver-no"
                    {...field}
                    onChange={() => setValue('willUseWaiver', false)}
                    value="false"
                  />
                  <label className="usa-button" htmlFor="willUseWaiver-no">
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
                    setValue('willUseWaiver', null);
                    setValue('notUsingReason', '');
                  }}
                >
                  {waiverAssessmentSurveyMiscT(
                    'waiverInfoPanel.changeResponse'
                  )}
                </Button>

                {field.value === false && (
                  <FormGroup>
                    <Label htmlFor="notUsingReason">
                      {waiverAssessmentSurveyMiscT(
                        'waiverInfoPanel.notUsingReason'
                      )}
                    </Label>
                    <Textarea
                      {...register('notUsingReason')}
                      id="notUsingReason"
                      data-testid="notUsingReason"
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
