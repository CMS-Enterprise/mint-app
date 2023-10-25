import React from 'react';

export const groupOptions = [
  { value: 'ccw', label: 'Chronic Conditions Warehouse (CCW)' },
  { value: 'cmmi', label: 'CMMI Cost Estimate' },
  {
    value: 'cbosc',
    label: 'Consolidated Business Operations Support Center (CBOSC)'
  },
  {
    value: 'dfsdm',
    label: 'Division of Financial Services and Debt Management (DFSDM)'
  },
  { value: 'ipc', label: 'Innovation Payment Contractor (IPC)' },
  {
    value: 'iddoc',
    label: 'Innovative Design, Development, and Operations Contract (IDDOC)'
  },
  { value: 'mdm', label: 'Master Data Management (MDM)' },
  { value: 'oact', label: 'Office of the Actuary (OACT)' },
  { value: 'pbg', label: 'Provider Billing Group (PBG)' }
];

export const checkGroupMap = (
  isViewingFilteredView: boolean | undefined,
  filteredQuestions: string[] | undefined,
  question: string,
  component: React.ReactNode
) => {
  // Show the question if it is included in the map
  if (isViewingFilteredView && filteredQuestions?.includes(question)) {
    return component;
  }
  // Hide the question if it is NOT included in the map
  if (isViewingFilteredView && !filteredQuestions?.includes(question)) {
    return <></>;
  }
  // Return the component if it is NOT isViewingFilteredView
  return component;
};

export const highLevelTimelineQuestions = [
  'completeICIP',
  'clearanceStarts',
  'announced',
  'applicationsStart',
  'performancePeriodStarts',
  'wrapUpEnds'
];

export const hasQuestions = (
  allQuestions: string[],
  questionsInQuestion: string[]
) => {
  if (
    allQuestions?.filter(question => questionsInQuestion.includes(question))
      .length === 0
  ) {
    return false;
  }
  return true;
};
