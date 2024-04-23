import { GetNotifications_currentUser_notifications_notifications_activity_metaData_DailyDigestCompleteActivityMeta_analyzedAudits_changes as ChangeTypes } from 'gql/gen/types/GetNotifications';

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
            commonName: 'Mint Doe'
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
        readyForReview: ['plan_basics'],
        readyForClearance: []
      }
    };
    const expectedReturnArray = ['crTdls', 'readyForReview', 'planDiscussions'];
    expect(pushValuesToChangesArray(object)).toEqual(expectedReturnArray);
  });
});
