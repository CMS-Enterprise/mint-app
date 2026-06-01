import React from 'react';
import { useTranslation } from 'react-i18next';
import { SummaryBoxHeading } from '@trussworks/react-uswds';
import { useGetAllCommonWaiversQuery } from 'gql/generated/graphql';

import Spinner from 'components/Spinner';

import { MedicarePaymentSuggestedWaivers } from '../../MedicarePaymentWaivers';
import { ProgramSuggestedWaivers } from '../../ProgramWaivers';

const SelectedWaiversSection = ({
  selectedWaivers,
  waiverType
}: {
  selectedWaivers: MedicarePaymentSuggestedWaivers | ProgramSuggestedWaivers;
  waiverType: string;
}) => {
  const { t: waiverAssessmentSurveyMiscT } = useTranslation(
    'waiverAssessmentSurveyMisc'
  );

  const { data, loading } = useGetAllCommonWaiversQuery();

  const generateSelectedWaiverList = selectedWaivers.map(
    waiver => waiver.commonWaiver.name
  );

  if (loading) {
    return <Spinner size="small" />;
  }

  return (
    <div className="bg-info-lighter padding-3">
      <SummaryBoxHeading headingLevel="h2" className="margin-bottom-2">
        {waiverAssessmentSurveyMiscT('selectedWaivers.heading')}
      </SummaryBoxHeading>

      <p className="line-height-sans-5 margin-top-0 margin-bottom-2 text-base-darkest">
        {waiverAssessmentSurveyMiscT('selectedWaivers.description', {
          totalWaiversCount: data?.commonWaivers?.length || 0,
          selectedWaiversCount: selectedWaivers.length,
          waiverType
        })}
      </p>

      <div className="margin-bottom-2">
        <ul
          className="margin-y-0 padding-left-3"
          style={{ columnCount: 2, columnGap: '1rem' }}
        >
          {generateSelectedWaiverList.map(waiverName => (
            <li
              key={waiverName}
              className="margin-y-0 padding-y-05 line-height-sans-5"
              style={{ breakInside: 'avoid' }}
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
