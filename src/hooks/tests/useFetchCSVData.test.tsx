import { OverlapType } from 'gql/generated/graphql';

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
  removedUnneededData,
  selectFilteredFields
} from '../useFetchCSVData';

describe('fetch csv utils', () => {
  const allPlanTranslation = {
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
        resemblesExistingModelWhich: {
          names:
            'Accountable Care Organization Realizing Equity, Access, and Community Health Model (ACO REACH) , Accountable Health Communities Model (AHC), Advance Payment ACO Model, Bundled Payment for Care Improvement Advanced (BPCI-A)'
        }
      }
    };

    expect(dataFormatter(data, allPlanTranslation)).toEqual(returnData);
  });

  it('translates a header value from field name', () => {
    const data = 'payments.payRecipients';

    const returnData = 'Who will you pay? Select all that apply.';

    expect(headerFormatter(data, allPlanTranslation)).toEqual(returnData);
  });

  it('removes unneeded data/conditional data', () => {
    const dataFields = [
      'participantsAndProviders.providerOverlap',
      'participantsAndProviders.providerOverlapHierarchy'
    ];

    const data = {
      participantsAndProviders: {
        providerOverlap: [OverlapType.NO]
      }
    };

    const returnData = ['participantsAndProviders.providerOverlap'];

    expect(removedUnneededData(data, allPlanTranslation, dataFields)).toEqual(
      returnData
    );
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
