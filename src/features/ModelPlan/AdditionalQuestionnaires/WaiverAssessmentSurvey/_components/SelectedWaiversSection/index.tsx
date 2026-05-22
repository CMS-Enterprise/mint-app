import React from 'react';
import { useTranslation } from 'react-i18next';
import { SummaryBoxHeading } from '@trussworks/react-uswds';
import { Waiver } from 'gql/generated/graphql';

// TODO: replace below with real waiver data once ready
const MOCK_WAIVER_NAMES = [
  'super long survey name Waiver 1',
  'short Waiver 2',
  'Waiver 3'
];

const SelectedWaiversSection = ({ allWaivers }: { allWaivers: Waiver[] }) => {
  const { t: waiverAssessmentSurveyMiscT } = useTranslation(
    'waiverAssessmentSurveyMisc'
  );

  return (
    <div className="bg-info-lighter padding-3">
      <SummaryBoxHeading headingLevel="h2" className="margin-bottom-2">
        {waiverAssessmentSurveyMiscT('selectedWaivers.heading')}
      </SummaryBoxHeading>

      <p className="line-height-sans-5 margin-top-0 margin-bottom-2 text-base-darkest">
        {waiverAssessmentSurveyMiscT('selectedWaivers.description', {
          selectedWaiversCount: allWaivers.length,
          // TODO: the logic here will change once data is ready
          totalWaiversCount: allWaivers.length
        })}
      </p>

      <div className="display-flex flex-row flex-wrap margin-bottom-2">
        {MOCK_WAIVER_NAMES.map(waiverName => (
          <ul key={waiverName} className="grid-col-6 margin-y-0 padding-x-3">
            <li className="margin-y-0 padding-y-05">{waiverName}</li>
          </ul>
        ))}
      </div>

      <p className="line-height-sans-5 margin-y-0 text-base-darkest">
        {waiverAssessmentSurveyMiscT('selectedWaivers.summary')}
      </p>
    </div>
  );
};

export default SelectedWaiversSection;
