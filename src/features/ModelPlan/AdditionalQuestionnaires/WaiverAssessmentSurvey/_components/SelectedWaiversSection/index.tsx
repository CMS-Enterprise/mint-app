import React from 'react';
import { useTranslation } from 'react-i18next';
import { SummaryBoxHeading } from '@trussworks/react-uswds';

import { SuggestedWaivers } from '../../MedicarePaymentWaivers';

const SelectedWaiversSection = ({
  allWaivers,
  selectedWaivers
}: {
  allWaivers: SuggestedWaivers;
  selectedWaivers: SuggestedWaivers;
}) => {
  const { t: waiverAssessmentSurveyMiscT } = useTranslation(
    'waiverAssessmentSurveyMisc'
  );

  const generateAllWaiverList = allWaivers.map(
    waiver => waiver.commonWaiver.name
  );

  return (
    <div className="bg-info-lighter padding-3">
      <SummaryBoxHeading headingLevel="h2" className="margin-bottom-2">
        {waiverAssessmentSurveyMiscT('selectedWaivers.heading')}
      </SummaryBoxHeading>

      <p className="line-height-sans-5 margin-top-0 margin-bottom-2 text-base-darkest">
        {waiverAssessmentSurveyMiscT('selectedWaivers.description', {
          totalWaiversCount: allWaivers.length,
          selectedWaiversCount: selectedWaivers.length
        })}
      </p>

      <div className="margin-bottom-2">
        <ul className="grid-row grid-gap-2 margin-y-0 padding-x-3">
          {generateAllWaiverList.map(waiverName => (
            <li
              key={waiverName}
              className="tablet:grid-col-6 margin-y-0 padding-y-05 line-height-sans-5"
            >
              {waiverName}
            </li>
          ))}
        </ul>
      </div>

      <p className="line-height-sans-5 margin-y-0 text-base-darkest">
        {waiverAssessmentSurveyMiscT('selectedWaivers.summary')}
      </p>
    </div>
  );
};

export default SelectedWaiversSection;
