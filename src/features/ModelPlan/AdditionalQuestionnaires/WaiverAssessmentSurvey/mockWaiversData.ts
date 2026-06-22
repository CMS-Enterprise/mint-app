import {
  CommonWaiverFragment,
  CommonWaiverType,
  GetCommonWaiverQuery,
  GetWaiversQuery
} from 'gql/generated/graphql';

/**
 * Mock data for testing waiver assessment survey.
 *
 * TODO: Delete this file and associated imports when the waiver selection feature is complete.
 */

export const MOCK_WAIVERS_ENABLED = false;

const WAIVER_ASSESSMENT_SURVEY_ID = 'a1b2c3d4-0000-0000-0000-000000000001';

export const suggestedMedicareWaiver: CommonWaiverFragment = {
  __typename: 'CommonWaiver',
  id: '11111111-1111-1111-1111-111111111111',
  name: 'Suggested Medicare Payment Waiver',
  waiverType: CommonWaiverType.MEDICARE_PAYMENT
};

export const unusedMedicareWaiver: CommonWaiverFragment = {
  __typename: 'CommonWaiver',
  id: '22222222-2222-2222-2222-222222222222',
  name: 'Unused Medicare Payment Waiver',
  waiverType: CommonWaiverType.MEDICARE_PAYMENT
};

export const suggestedProgramWaiver: CommonWaiverFragment = {
  __typename: 'CommonWaiver',
  id: '33333333-3333-3333-3333-333333333333',
  name: 'Suggested Program Waiver',
  waiverType: CommonWaiverType.PROGRAM_MEDICARE_BE
};

export const unusedProgramWaiver: CommonWaiverFragment = {
  __typename: 'CommonWaiver',
  id: '44444444-4444-4444-4444-444444444444',
  name: 'Unused Program Waiver',
  waiverType: CommonWaiverType.PROGRAM_MEDICARE_BE
};

export const suggestedMedicaidWaiver: CommonWaiverFragment = {
  __typename: 'CommonWaiver',
  id: '55555555-5555-5555-5555-555555555555',
  name: 'Suggested Medicaid Payment Waiver',
  waiverType: CommonWaiverType.MEDICAID_PAYMENT
};

export const unusedMedicaidWaiver: CommonWaiverFragment = {
  __typename: 'CommonWaiver',
  id: '66666666-6666-6666-6666-666666666666',
  name: 'Unused Medicaid Payment Waiver',
  waiverType: CommonWaiverType.MEDICAID_PAYMENT
};

const waiverSelectionCommonWaivers: CommonWaiverFragment[] = [
  suggestedMedicareWaiver,
  unusedMedicareWaiver,
  suggestedProgramWaiver,
  unusedProgramWaiver,
  suggestedMedicaidWaiver,
  unusedMedicaidWaiver
];

const commonWaiverDetailsById: Map<string, CommonWaiverFragment> = new Map(
  waiverSelectionCommonWaivers.map(waiver => [
    waiver.id,
    {
      __typename: 'CommonWaiver',
      id: waiver.id,
      name: waiver.name,
      description: `${waiver.name} description`,
      participationAgreementLanguageLink: 'https://example.com/pal',
      cmmiWaiverPointOfContact: 'Jane Doe',
      waiverType: waiver.waiverType,
      waiverFocus: 'Site of care',
      whatIsWaived: 'Some regulation',
      hasStandardizationEffort: true,
      hasClaimsDataOrRREGAnalysis: 'Yes',
      isUsedInActiveModels: false
    }
  ])
);

/**
 * Returns mock GetWaivers data for local UI development.
 */
export const getWaiversMockData = (modelPlanID: string): GetWaiversQuery => ({
  __typename: 'Query',
  modelPlan: {
    __typename: 'ModelPlan',
    id: modelPlanID,
    questionnaires: {
      __typename: 'Questionnaires',
      waiverAssessmentSurvey: {
        __typename: 'WaiverAssessmentSurvey',
        id: WAIVER_ASSESSMENT_SURVEY_ID,
        waivers: [
          {
            __typename: 'Waiver',
            id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
            commonWaiverID: suggestedMedicareWaiver.id,
            willUseWaiver: true,
            notUsingReason: null,
            commonWaiver: {
              __typename: 'CommonWaiver',
              id: suggestedMedicareWaiver.id,
              name: suggestedMedicareWaiver.name,
              waiverType: CommonWaiverType.MEDICARE_PAYMENT,
              waiverFocus: 'Site of care'
            }
          }
        ]
      }
    },
    waiverInfo: {
      __typename: 'WaiverInfo',
      suggestedCommonWaivers: [
        suggestedMedicareWaiver,
        suggestedProgramWaiver,
        suggestedMedicaidWaiver
      ],
      unusedCommonWaivers: [
        unusedMedicareWaiver,
        unusedProgramWaiver,
        unusedMedicaidWaiver
      ]
    }
  }
});

/**
 * Returns mock GetCommonWaiver data for the waiver info panel.
 */
export const getCommonWaiverMockData = (
  commonWaiverID: string
): GetCommonWaiverQuery | null => {
  const commonWaiver = commonWaiverDetailsById.get(commonWaiverID);

  if (!commonWaiver) {
    return null;
  }

  return {
    __typename: 'Query',
    commonWaiver
  };
};
