import basics from 'i18n/en-US/modelPlan/basics';
import beneficiaries from 'i18n/en-US/modelPlan/beneficiaries';
import generalCharacteristics from 'i18n/en-US/modelPlan/generalCharacteristics';
import modelPlan from 'i18n/en-US/modelPlan/modelPlan';
import opsEvalAndLearning from 'i18n/en-US/modelPlan/opsEvalAndLearning';
import participantsAndProviders from 'i18n/en-US/modelPlan/participantsAndProviders';
import payments from 'i18n/en-US/modelPlan/payments';

import {
  dataFormatter,
  headerFormatter,
  selectFilteredFields
} from '../useFetchCSVData';

describe('fetch csv utils', () => {
  const allPlanTranslation = {
    generalCharacteristics,
    payments,
    participantsAndProviders
  };

  it('translates boolean values', () => {
    const data = {
      payments: {
        waiverOnlyAppliesPartOfPayment: true,
        waiveBeneficiaryCostSharingForAnyServices: false
      }
    };

    const returnData = {
      payments: {
        waiverOnlyAppliesPartOfPayment: 'Yes',
        waiveBeneficiaryCostSharingForAnyServices: 'No'
      }
    };

    expect(dataFormatter(data, allPlanTranslation)).toEqual(returnData);
  });

  it('translates unconfigured boolean values', () => {
    const data = {
      discussionReply: {
        isAssessment: false
      }
    };

    const returnData = {
      discussionReply: {
        isAssessment: 'No'
      }
    };

    expect(dataFormatter(data, allPlanTranslation)).toEqual(returnData);
  });

  it('translates date values', () => {
    const data = {
      payments: {
        paymentStartDate: '2029-05-12T15:01:39.190679Z'
      }
    };

    const returnData = {
      payments: {
        paymentStartDate: '05/12/2029'
      }
    };
    expect(dataFormatter(data, allPlanTranslation)).toEqual(returnData);
  });

  it('formats export timestamp values without translation metadata', () => {
    const data = {
      prepareForClearance: {
        latestClearanceDts: '2029-05-12T15:01:39.190679Z'
      },
      modelToOperations: {
        readyForReviewDTS: '2029-05-12T15:01:39.190679Z'
      },
      basics: {
        readyForClearanceDts: '2029-05-12T15:01:39.190679Z'
      }
    };

    const returnData = {
      prepareForClearance: {
        latestClearanceDts: '05/12/2029'
      },
      modelToOperations: {
        readyForReviewDTS: '05/12/2029'
      },
      basics: {
        readyForClearanceDts: '05/12/2029'
      }
    };

    expect(dataFormatter(data, allPlanTranslation)).toEqual(returnData);
  });

  it('translates a single enum value', () => {
    const data = {
      payments: {
        expectedCalculationComplexityLevel: 'MIDDLE'
      }
    };

    const returnData = {
      payments: {
        expectedCalculationComplexityLevel: 'Middle level'
      }
    };

    expect(dataFormatter(data, allPlanTranslation)).toEqual(returnData);
  });

  it('translates an array of enum values', () => {
    const data = {
      payments: {
        payRecipients: ['PROVIDERS', 'BENEFICIARIES', 'PARTICIPANTS']
      }
    };

    const returnData = {
      payments: {
        payRecipients: 'Providers, Beneficiaries, Participants'
      }
    };

    expect(dataFormatter(data, allPlanTranslation)).toEqual(returnData);
  });

  it('translates Existing Model Links names', () => {
    const data = {
      generalCharacteristics: {
        resemblesExistingModelWhich: {
          names: [
            'Accountable Care Organization Realizing Equity, Access, and Community Health Model (ACO REACH) ',
            'Accountable Health Communities Model (AHC)',
            'Advance Payment ACO Model',
            'Bundled Payment for Care Improvement Advanced (BPCI-A)'
          ]
        }
      }
    };

    const returnData = {
      generalCharacteristics: {
        resemblesExistingModelWhich:
          'Accountable Care Organization Realizing Equity, Access, and Community Health Model (ACO REACH) , Accountable Health Communities Model (AHC), Advance Payment ACO Model, Bundled Payment for Care Improvement Advanced (BPCI-A)'
      }
    };

    expect(dataFormatter(data, allPlanTranslation)).toEqual(returnData);
  });

  it('adds Other to existing model links when the other option is selected', () => {
    const data = {
      generalCharacteristics: {
        resemblesExistingModelWhich: {
          names: ['Existing model']
        },
        resemblesExistingModelOtherSelected: true,
        participationInModelPreconditionWhich: {
          names: ['Precondition model']
        },
        participationInModelPreconditionOtherSelected: true
      }
    };

    const returnData = {
      generalCharacteristics: {
        resemblesExistingModelWhich: 'Existing model, Other',
        resemblesExistingModelOtherSelected: 'Yes',
        participationInModelPreconditionWhich: 'Precondition model, Other',
        participationInModelPreconditionOtherSelected: 'Yes'
      }
    };

    expect(dataFormatter(data, allPlanTranslation)).toEqual(returnData);
  });

  it('translates a header value from field name', () => {
    const data = 'payments.payRecipients';

    const returnData = 'Who will you pay?';

    expect(headerFormatter(data, allPlanTranslation)).toEqual(returnData);
  });

  it('filtered the header columns on the presence of a filter group', () => {
    const returnData = [
      'nameHistory',
      'beneficiaries.beneficiaries',
      'beneficiaries.diseaseSpecificGroup',
      'beneficiaries.beneficiariesOther',
      'beneficiaries.beneficiariesNote',
      'beneficiaries.numberPeopleImpacted',
      'beneficiaries.estimateConfidence',
      'beneficiaries.confidenceNote',
      'beneficiaries.beneficiaryOverlap',
      'beneficiaries.beneficiaryOverlapNote',
      'beneficiaries.precedenceRules',
      'beneficiaries.precedenceRulesYes',
      'beneficiaries.precedenceRulesNo',
      'beneficiaries.precedenceRulesNote'
    ];

    expect(
      selectFilteredFields(
        {
          nameHistory: modelPlan.nameHistory,
          basics,
          generalCharacteristics,
          participantsAndProviders,
          beneficiaries,
          opsEvalAndLearning,
          payments
        },
        'mdm'
      )
    ).toEqual(returnData);
  });
});
