import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Button, FormGroup, Icon } from '@trussworks/react-uswds';
import type { GetWaiversQuery } from 'gql/generated/graphql';

import Alert from 'components/Alert';
import CheckboxField from 'components/CheckboxField';
import { WaiverSelectionForm } from 'types/waivers';

import { getSuggestedOrInUseWaivers, getUnselectedWaivers } from '../../util';
import OtherWaiversTable from '../OtherWaiversTable';
import SelectWaiverField from '../SelectWaiverField';

export type SelectedWaiver =
  GetWaiversQuery['modelPlan']['waiverInfo']['commonWaivers'][number];

const WaiverSelectionSection = ({
  waiverSelection
}: {
  waiverSelection: SelectedWaiver[];
}) => {
  const { t: waiverAssessmentSurveyMiscT } = useTranslation(
    'waiverAssessmentSurveyMisc'
  );
  const [, setSearchParams] = useSearchParams();
  const { setValue, watch } = useFormContext<WaiverSelectionForm>();

  const formWaivers = watch('waivers');

  const suggestedOrInUseWaivers = useMemo(
    () => getSuggestedOrInUseWaivers(waiverSelection, formWaivers),
    [waiverSelection, formWaivers]
  );

  const remainingUnusedWaivers = useMemo(
    () => getUnselectedWaivers(waiverSelection, formWaivers),
    [waiverSelection, formWaivers]
  );

  const handleAddUnusedWaiver = (waiver: SelectedWaiver) => {
    setValue(
      `waivers.${waiver.id}`,
      {
        willUseWaiver: true,
        notUsingReason: waiver.notUsingReason ?? '',
        usingReason: waiver.usingReason ?? ''
      },
      { shouldDirty: true }
    );
  };

  return (
    <div className="margin-bottom-5">
      <div>
        <h3 className="margin-top-0 margin-bottom-05">
          {waiverAssessmentSurveyMiscT(
            `waiverSelectionAndConfirmation.suggestedWaivers.heading`
          )}
        </h3>

        <p className="margin-top-0 margin-bottom-3">
          {waiverAssessmentSurveyMiscT(
            `waiverSelectionAndConfirmation.suggestedWaivers.description`
          )}
        </p>
      </div>

      <div className="margin-bottom-4">
        {suggestedOrInUseWaivers.length === 0 && (
          <Alert type="warning" slim className="margin-bottom-2">
            {waiverAssessmentSurveyMiscT(
              `waiverSelectionAndConfirmation.suggestedWaivers.emptyAlert`
            )}

            <FormGroup className="margin-y-0">
              <CheckboxField
                id="confirm-empty"
                data-testid="confirm-empty"
                name="isComplete"
                checked={!!watch('isEmptyWaiversConfirmed')}
                value="true"
                label={waiverAssessmentSurveyMiscT(
                  `waiverSelectionAndConfirmation.suggestedWaivers.emptyCheckbox`
                )}
                onChange={e => {
                  setValue('isEmptyWaiversConfirmed', e.target.checked, {
                    shouldDirty: true
                  });
                }}
                onBlur={() => null}
              />
            </FormGroup>
          </Alert>
        )}

        {suggestedOrInUseWaivers.length > 0 &&
          suggestedOrInUseWaivers.map(waiver => (
            <div
              key={waiver.id}
              className="padding-3 border-1px border-gray-10 radius-md shadow-3 margin-bottom-2"
            >
              <div className="margin-bottom-3">
                <h5 className="margin-top-0 margin-bottom-05 text-base-dark text-normal">
                  {waiverAssessmentSurveyMiscT(`${waiver.waiverType}.heading`)}
                </h5>

                <p className="mint-body-large margin-top-0 margin-bottom-1">
                  {waiver.name}
                </p>

                <Button
                  type="button"
                  className="margin-top-0 deep-underline"
                  unstyled
                  onClick={() => {
                    setSearchParams(prev => {
                      const nextParams = new URLSearchParams(prev);
                      nextParams.set('waiverId', waiver.id);
                      return nextParams;
                    });
                  }}
                >
                  {waiverAssessmentSurveyMiscT(
                    'waiverSelectionAndConfirmation.learnMoreAboutThisWaiver'
                  )}
                  <Icon.ArrowForward
                    className="margin-left-0"
                    aria-label="forward"
                  />
                </Button>
              </div>

              <SelectWaiverField
                className="border-top-1px border-base-light"
                fieldPrefix={`waivers.${waiver.id}`}
                isFromUnusedWaivers={waiver.isSuggested === false}
              />
            </div>
          ))}
      </div>

      <OtherWaiversTable
        unusedWaivers={remainingUnusedWaivers}
        onAddUnusedWaiver={handleAddUnusedWaiver}
      />
    </div>
  );
};

export default WaiverSelectionSection;
