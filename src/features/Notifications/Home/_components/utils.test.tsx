import {
  AnalyzedAuditChange as ChangeTypes,
  TableName
} from 'gql/generated/graphql';

import { pushValuesToChangesArray } from './_utils';

describe('PushValuesToChangesArray Util', () => {
  const defaultObject: ChangeTypes = {
    __typename: 'AnalyzedAuditChange',
    modelPlan: null,
    documents: null,
    crTdls: null,
    planSections: null,
    modelLeads: null,
    planDiscussions: null
  };

  it('returns only added, oldName, and statusChanges', () => {
    const object: ChangeTypes = {
      ...defaultObject,
      modelLeads: {
        __typename: 'AnalyzedModelLeads',
        added: [
          {
            __typename: 'AnalyzedModelLeadInfo',
            id: '00',
            commonName: 'Mint Doe',
            userAccount: {
              __typename: 'UserAccount',
              id: '00',
              email: 'mint@doe.oddball.io',
              familyName: 'Doe',
              givenName: 'MINT',
              locale: 'en',
              zoneInfo: 'America/New_York',
              commonName: 'Mint Doe',
              username: 'MINT'
            }
          }
        ]
      },
      modelPlan: {
        __typename: 'AnalyzedModelPlan',
        oldName: 'oldName',
        statusChanges: ['PLAN_COMPLETE']
      }
    };
    const expectedReturnArray = ['added', 'oldName', 'statusChanges'];
    expect(pushValuesToChangesArray(object)).toEqual(expectedReturnArray);
  });

  it('returns only crTdls, planDiscussions and readyForReview', () => {
    const object: ChangeTypes = {
      ...defaultObject,
      crTdls: {
        __typename: 'AnalyzedCrTdls',
        activity: true
      },
      planDiscussions: {
        __typename: 'AnalyzedPlanDiscussions',
        activity: true
      },
      planSections: {
        __typename: 'AnalyzedPlanSections',
        updated: [],
        readyForReview: [TableName.PLAN_BASICS],
        readyForClearance: []
      }
    };
    const expectedReturnArray = ['crTdls', 'readyForReview', 'planDiscussions'];
    expect(pushValuesToChangesArray(object)).toEqual(expectedReturnArray);
  });
});
