import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Button, Icon } from '@trussworks/react-uswds';
import type {
  CommonWaiverFragment,
  CommonWaiverType
} from 'gql/generated/graphql';

import { ExistingWaiver, WaiverSelectionForm } from 'types/waivers';

import {
  getDisplayWaiversForSection,
  getRemainingUnusedWaivers
} from '../../util';
import SelectWaiverField from '../SelectWaiverField';
import UnusedWaiversTable from '../UnusedWaiversTable';

type WaiverSelectionSectionProps = {
  waiverType: CommonWaiverType;
  suggestedCommonWaivers: CommonWaiverFragment[];
  unusedWaivers: CommonWaiverFragment[];
  existingWaivers: ExistingWaiver[];
};

const WaiverSelectionSection = ({
  waiverType,
  suggestedCommonWaivers,
  unusedWaivers,
  existingWaivers
}: WaiverSelectionSectionProps) => {
  const { t: waiverAssessmentSurveyMiscT } = useTranslation(
    'waiverAssessmentSurveyMisc'
  );
  const [, setSearchParams] = useSearchParams();
  const { setValue, watch } = useFormContext<WaiverSelectionForm>();

  const formWaivers = watch('waivers');

  const displayWaivers = useMemo(
    () =>
      getDisplayWaiversForSection(
        suggestedCommonWaivers,
        unusedWaivers,
        existingWaivers,
        waiverType,
        formWaivers
      ),
    [
      suggestedCommonWaivers,
      unusedWaivers,
      existingWaivers,
      waiverType,
      formWaivers
    ]
  );

  const remainingUnusedWaivers = useMemo(
    () => getRemainingUnusedWaivers(unusedWaivers, waiverType, formWaivers),
    [unusedWaivers, waiverType, formWaivers]
  );

  const handleAddUnusedWaiver = (waiver: CommonWaiverFragment) => {
    setValue(
      `waivers.${waiver.id}`,
      { willUseWaiver: true, notUsingReason: '' },
      { shouldDirty: true }
    );
  };

  return (
    <div className="margin-bottom-5">
      <h3 className="margin-top-0 margin-bottom-3">
        {waiverAssessmentSurveyMiscT(`${waiverType}.heading`)}
      </h3>

      <div className="margin-bottom-4">
        {displayWaivers.map(waiver => (
          <div
            key={waiver.id}
            className="padding-3 border-1px border-gray-10 radius-md shadow-3 margin-bottom-2"
          >
            <div className="margin-bottom-3">
              <h5 className="margin-top-0 margin-bottom-05 text-base-dark text-normal">
                {waiverAssessmentSurveyMiscT(
                  'waiverSelectionAndConfirmation.waiverName'
                )}
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
            <SelectWaiverField fieldPrefix={`waivers.${waiver.id}`} />
          </div>
        ))}
      </div>

      <UnusedWaiversTable
        unusedWaivers={remainingUnusedWaivers}
        onAddUnusedWaiver={handleAddUnusedWaiver}
      />
    </div>
  );
};

export default WaiverSelectionSection;
