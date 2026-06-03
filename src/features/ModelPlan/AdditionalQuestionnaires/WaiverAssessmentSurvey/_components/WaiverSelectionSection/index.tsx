import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon } from '@trussworks/react-uswds';

import { waiverAssessmentSurveyType } from '../../WaiverSelectionAndConfirmation';
import UnusedWaiversTable from '../UnusedWaiversTable';

const WaiverSelectionSection = ({
  waiverHeading,
  waivers
}: {
  waiverHeading: string;
  waivers: waiverAssessmentSurveyType;
}) => {
  const { t: waiverAssessmentSurveyMiscT } = useTranslation(
    'waiverAssessmentSurveyMisc'
  );

  return (
    <div className="margin-bottom-5">
      <h3 className="margin-top-0 margin-bottom-3">
        {waiverAssessmentSurveyMiscT(`${waiverHeading}.heading`)}
      </h3>

      <div className="margin-bottom-4">
        {waivers.waivers.map(waiver => (
          <div
            key={waiver.commonWaiverID}
            className="padding-3 border-1px border-gray-10 radius-md shadow-3 margin-bottom-2"
          >
            <div className="margin-bottom-3">
              <h5 className="margin-top-0 margin-bottom-05 text-base-dark text-normal">
                {waiverAssessmentSurveyMiscT(
                  'waiverSelectionAndConfirmation.waiverName'
                )}
              </h5>

              <p className="mint-body-large margin-top-0 margin-bottom-1">
                {waiver.commonWaiver.name}
              </p>

              <Button
                type="button"
                className="margin-top-0 deep-underline"
                unstyled
                onClick={() => {}}
              >
                {waiverAssessmentSurveyMiscT(
                  'waiverSelectionAndConfirmation.learnMoreAboutThisWaiver'
                )}
                <Icon.ArrowForward
                  className="top-3px margin-left-1"
                  aria-label="forward"
                />
              </Button>
            </div>

            <div>reusable Do you plan to use component goes here</div>
          </div>
        ))}
      </div>

      <UnusedWaiversTable unusedWaivers={waivers.suggestedWaivers} />
    </div>
  );
};

export default WaiverSelectionSection;
