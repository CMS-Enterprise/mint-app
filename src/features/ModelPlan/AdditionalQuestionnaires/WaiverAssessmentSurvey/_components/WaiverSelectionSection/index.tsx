import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Button, Icon } from '@trussworks/react-uswds';
import type {
  CommonWaiverType,
  SuggestedCommonWaiverFragment
} from 'gql/generated/graphql';

import { filterSuggestedWaiversByType } from '../../util';
import SelectWaiverField from '../SelectWaiverField';
import UnusedWaiversTable from '../UnusedWaiversTable';
import WaiverInfoPanel from '../WaiverInfoPanel';

const WaiverSelectionSection = ({
  waiverType,
  waivers,
  suggestedCommonWaivers
}: {
  waiverType: CommonWaiverType;
  waivers: SuggestedCommonWaiverFragment[];
  suggestedCommonWaivers: SuggestedCommonWaiverFragment[];
}) => {
  const { t: waiverAssessmentSurveyMiscT } = useTranslation(
    'waiverAssessmentSurveyMisc'
  );
  const [, setSearchParams] = useSearchParams();

  const filteredWaivers = filterSuggestedWaiversByType(
    suggestedCommonWaivers,
    waiverType
  );

  return (
    <div className="margin-bottom-5">
      <WaiverInfoPanel
        waiverInfo={{
          willUseWaiver: null,
          notUsingReason: ''
        }}
      />
      <h3 className="margin-top-0 margin-bottom-3">
        {waiverAssessmentSurveyMiscT(`${waiverType}.heading`)}
      </h3>

      <div className="margin-bottom-4">
        {waivers.slice(0, 2).map(waiver => (
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

      <UnusedWaiversTable unusedWaivers={filteredWaivers} />
    </div>
  );
};

export default WaiverSelectionSection;
