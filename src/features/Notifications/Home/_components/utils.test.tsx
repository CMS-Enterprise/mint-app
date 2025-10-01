import {
  AnalyzedAuditChange as ChangeTypes,
  TableName,
  UserNotificationPreferenceFlag
} from 'gql/generated/graphql';

import {
  getUpdatedNotificationPreferences,
  pushValuesToChangesArray,
  verifyEmailParams
} from './_utils';

describe('VerifyEmailParams Util', () => {
  it('returns boolean to verify if param is valid', () => {
    const result = verifyEmailParams('DATES_CHANGED');
    expect(result).toEqual(true);

    const result2 = verifyEmailParams('NEW_DISCUSSION_ADDED');
    expect(result2).toEqual(true);

    const result3 = verifyEmailParams('INVALID_PARAM');
    expect(result3).toEqual(false);
  });
});

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

describe('getUpdatedNotificationPreferences Util', () => {
  it('returns array with added preference if not already present', () => {
    const allValues = [] as UserNotificationPreferenceFlag[];
    const chosenValue = UserNotificationPreferenceFlag.EMAIL;

    const result = getUpdatedNotificationPreferences(allValues, chosenValue);
    expect(result).toEqual([UserNotificationPreferenceFlag.EMAIL]);
  });

  it('returns array with removed preference if already present', () => {
    const allValues = [
      UserNotificationPreferenceFlag.EMAIL,
      UserNotificationPreferenceFlag.IN_APP
    ];
    const chosenValue = UserNotificationPreferenceFlag.EMAIL;

    const result = getUpdatedNotificationPreferences(allValues, chosenValue);
    expect(result).toEqual([UserNotificationPreferenceFlag.IN_APP]);
  });
});
