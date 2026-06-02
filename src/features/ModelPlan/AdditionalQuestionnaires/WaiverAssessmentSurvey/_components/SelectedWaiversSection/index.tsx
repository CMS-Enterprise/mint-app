import React from 'react';
import { useTranslation } from 'react-i18next';
import { SummaryBoxHeading } from '@trussworks/react-uswds';
import { useGetAllCommonWaiversQuery } from 'gql/generated/graphql';

import Spinner from 'components/Spinner';

import type { MedicaidPaymentSuggestedWaivers } from '../../MedicaidPaymentWaivers';
import type { MedicarePaymentSuggestedWaivers } from '../../MedicarePaymentWaivers';
import type { ProgramSuggestedWaivers } from '../../ProgramWaivers';

const SelectedWaiversSection = ({
  selectedWaivers,
  waiverType,
  waiverTypeText,
  children
}: {
  selectedWaivers:
    | MedicarePaymentSuggestedWaivers
    | ProgramSuggestedWaivers
    | MedicaidPaymentSuggestedWaivers;
  waiverType: string;
  waiverTypeText: string;
  children?: React.ReactNode;
}) => {
  const { t: waiverAssessmentSurveyMiscT } = useTranslation(
    'waiverAssessmentSurveyMisc'
  );

  const { data, loading } = useGetAllCommonWaiversQuery();

  const filteredCommonWaivers = data?.commonWaivers.filter(
    waiver => waiver.waiverType === waiverType
  );

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
          totalWaiversCount: filteredCommonWaivers?.length || 0,
          selectedWaiversCount: selectedWaivers.length,
          waiverType: waiverTypeText
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

      {children}
    </div>
  );
};

export default SelectedWaiversSection;
