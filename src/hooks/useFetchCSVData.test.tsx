import payments from 'i18n/en-US/modelPlan/payments';

import {
  dataFormatter,
  headerFormatter,
  selectFilteredFields
} from './useFetchCSVData';

describe('fetch csv utils', () => {
  const allPlanTranslation = {
    payments
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

  it('translates a header value from field name', () => {
    const data = 'payments.payRecipients';

    const returnData = 'Who will you pay? Select all that apply.';

    expect(headerFormatter(data, allPlanTranslation)).toEqual(returnData);
  });

  it('filtered the header columns on the presence of a filter group', () => {
    const returnData = [
      'modelPlan.nameHistory',
      'beneficiaries.beneficiaries',
      'beneficiaries.beneficiariesOther',
      'beneficiaries.beneficiariesNote',
      'beneficiaries.numberPeopleImpacted',
      'beneficiaries.estimateConfidence',
      'beneficiaries.beneficiaryOverlap',
      'beneficiaries.beneficiaryOverlapNote',
      'beneficiaries.precedenceRules'
    ];

    expect(selectFilteredFields(allPlanTranslation, 'mdm')).toEqual(returnData);
  });
});
