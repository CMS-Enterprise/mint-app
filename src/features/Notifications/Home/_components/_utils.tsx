import React from 'react';
import { Trans } from 'react-i18next';
import { Icon } from '@trussworks/react-uswds';
import {
  ActivityMetaData,
  AddedAsCollaboratorMeta,
  AnalyzedAuditChange,
  AnalyzedCrTdls,
  DailyDigestCompleteActivityMeta,
  DatesChangedActivityMeta,
  IddocQuestionnaireCompletedActivityMeta,
  IncorrectModelStatusActivityMeta,
  ModelPlanSharedActivityMeta,
  NewDiscussionAddedActivityMeta,
  NewDiscussionRepliedActivityMeta,
  NewModelPlanActivityMeta,
  PlanDataExchangeApproachMarkedCompleteActivityMeta,
  TaggedInDiscussionReplyActivityMeta,
  TaggedInPlanDiscussionActivityMeta,
  UserNotificationPreferenceFlag
} from 'gql/generated/graphql';

// Type guard to check union type
export const isTaggedInDiscussion = (
  data: ActivityMetaData
): data is TaggedInPlanDiscussionActivityMeta => {
  /* eslint no-underscore-dangle: 0 */
  return data.__typename === 'TaggedInPlanDiscussionActivityMeta';
};

export const isTaggedInDiscussionReply = (
  data: ActivityMetaData
): data is TaggedInDiscussionReplyActivityMeta => {
  /* eslint no-underscore-dangle: 0 */
  return data.__typename === 'TaggedInDiscussionReplyActivityMeta';
};

export const isDailyDigest = (
  data: ActivityMetaData
): data is DailyDigestCompleteActivityMeta => {
  /* eslint no-underscore-dangle: 0 */
  return data.__typename === 'DailyDigestCompleteActivityMeta';
};

export const isNewDiscussionAdded = (
  data: ActivityMetaData
): data is NewDiscussionAddedActivityMeta => {
  /* eslint no-underscore-dangle: 0 */
  return data.__typename === 'NewDiscussionAddedActivityMeta';
};

export const isNewDiscussionReply = (
  data: ActivityMetaData
): data is NewDiscussionRepliedActivityMeta => {
  /* eslint no-underscore-dangle: 0 */
  return data.__typename === 'NewDiscussionRepliedActivityMeta';
};

export const isIncorrectModelStatus = (
  data: ActivityMetaData
): data is IncorrectModelStatusActivityMeta => {
  /* eslint no-underscore-dangle: 0 */
  return data.__typename === 'IncorrectModelStatusActivityMeta';
};

export const isSharedActivity = (
  data: ActivityMetaData
): data is ModelPlanSharedActivityMeta => {
  /* eslint no-underscore-dangle: 0 */
  return data.__typename === 'ModelPlanSharedActivityMeta';
};

export const isAddingCollaborator = (
  data: ActivityMetaData
): data is AddedAsCollaboratorMeta => {
  /* eslint no-underscore-dangle: 0 */
  return data.__typename === 'AddedAsCollaboratorMeta';
};

export const isDatesChanged = (
  data: ActivityMetaData
): data is DatesChangedActivityMeta => {
  /* eslint no-underscore-dangle: 0 */
  return data.__typename === 'DatesChangedActivityMeta';
};

export const isNewModelPlan = (
  data: ActivityMetaData
): data is NewModelPlanActivityMeta => {
  /* eslint no-underscore-dangle: 0 */
  return data.__typename === 'NewModelPlanActivityMeta';
};

export const isDataExchangeApproach = (
  data: ActivityMetaData
): data is PlanDataExchangeApproachMarkedCompleteActivityMeta => {
  /* eslint no-underscore-dangle: 0 */
  return (
    data.__typename === 'PlanDataExchangeApproachMarkedCompleteActivityMeta'
  );
};

export const isIDDOCQuestionnaireCompleted = (
  data: ActivityMetaData
): data is IddocQuestionnaireCompletedActivityMeta => {
  /* eslint no-underscore-dangle: 0 */
  return data.__typename === 'IddocQuestionnaireCompletedActivityMeta';
};

export const getNavUrl = (metaData: ActivityMetaData) => {
  switch (metaData.__typename) {
    case 'AddedAsCollaboratorMeta':
      return `/models/${metaData.modelPlanID}/collaboration-area`;

    case 'ModelPlanSharedActivityMeta':
    case 'NewModelPlanActivityMeta':
      return `/models/${metaData.modelPlanID}/read-view`;

    case 'PlanDataExchangeApproachMarkedCompleteActivityMeta':
      return `/models/${metaData.modelPlan.id}/read-view/data-exchange-approach`;

    case 'IddocQuestionnaireCompletedActivityMeta':
      return `/models/${metaData.modelPlanID}/read-view/iddoc-questionnaire`;

    case 'TaggedInPlanDiscussionActivityMeta':
    case 'TaggedInDiscussionReplyActivityMeta':
    case 'NewDiscussionAddedActivityMeta':
    case 'NewDiscussionRepliedActivityMeta':
      return `/models/${metaData.modelPlanID}/read-view/discussions?discussionID=${metaData.discussionID}`;

    default:
      return '/';
  }
};

export const UnsubscribableActivities = {
  DATA_EXCHANGE_APPROACH_MARKED_COMPLETE: 'dataExchangeApproachMarkedComplete',
  DATES_CHANGED: 'datesChanged',
  IDDOC_QUESTIONNAIRE_COMPLETED: 'iddocQuestionnaireComplete',
  INCORRECT_MODEL_STATUS: 'incorrectModelStatus',
  NEW_DISCUSSION_ADDED: 'newDiscussionAdded',
  NEW_MODEL_PLAN: 'newModelPlan'
} as const;

export type UnsubscribableActivityType = keyof typeof UnsubscribableActivities;

export const verifyEmailParams = (
  emailParams: string | null
): emailParams is UnsubscribableActivityType => {
  return (
    emailParams !== null &&
    Object.keys(UnsubscribableActivities).includes(emailParams)
  );
};

const activityI18nKeybases = {
  AddedAsCollaboratorMeta:
    'notifications:index.activityType.ADDED_AS_COLLABORATOR',
  TaggedInDiscussionReplyActivityMeta:
    'notifications:index.activityType.TAGGED_IN_DISCUSSION_REPLY',
  TaggedInPlanDiscussionActivityMeta:
    'notifications:index.activityType.TAGGED_IN_DISCUSSION',
  DailyDigestCompleteActivityMeta:
    'notifications:index.activityType.DAILY_DIGEST_COMPLETE',
  NewDiscussionAddedActivityMeta:
    'notifications:index.activityType.NEW_DISCUSSION_ADDED',
  NewDiscussionRepliedActivityMeta:
    'notifications:index.activityType.NEW_DISCUSSION_REPLY',
  IncorrectModelStatusActivityMeta:
    'notifications:index.activityType.INCORRECT_MODEL_STATUS',
  ModelPlanSharedActivityMeta:
    'notifications:index.activityType.MODEL_PLAN_SHARED',
  NewModelPlanActivityMeta: 'notifications:index.activityType.NEW_MODEL_PLAN',
  DatesChangedActivityMeta: 'notifications:index.activityType.DATES_CHANGED',
  PlanDataExchangeApproachMarkedCompleteActivityMeta:
    'notifications:index.activityType.DATA_EXCHANGE_APPROACH_MARKED_COMPLETE',
  IddocQuestionnaireCompletedActivityMeta:
    'notifications:index.activityType.IDDOC_QUESTIONNAIRE_COMPLETED'
};

export const activityText = (data: ActivityMetaData) => {
  let additionalProps;
  switch (data.__typename) {
    case 'DailyDigestCompleteActivityMeta':
      additionalProps = {};
      break;
    case 'NewDiscussionAddedActivityMeta':
      additionalProps = { values: { modelName: data.modelPlanName } };
      break;
    default:
      additionalProps = { values: { modelName: data.modelPlan?.modelName } };
      break;
  }
  return (
    <Trans
      i18nKey={`${activityI18nKeybases[data.__typename]}.text`}
      {...additionalProps}
    />
  );
};

export const ActivityCTA = ({
  data,
  isExpanded
}: {
  data: ActivityMetaData;
  isExpanded: boolean;
}) => {
  switch (data.__typename) {
    case 'DailyDigestCompleteActivityMeta':
    case 'DatesChangedActivityMeta':
    case 'IncorrectModelStatusActivityMeta':
      return isExpanded ? (
        <>
          <Trans
            i18nKey={`${activityI18nKeybases[data.__typename]}.cta.hide`}
          />
          <Icon.ExpandLess
            className="margin-left-1"
            aria-hidden
            aria-label="collapse"
          />
        </>
      ) : (
        <>
          <Trans
            i18nKey={`${activityI18nKeybases[data.__typename]}.cta.view`}
          />
          <Icon.ExpandMore
            className="margin-left-1"
            aria-hidden
            aria-label="expand"
          />
        </>
      );

    default:
      return (
        <>
          <Trans i18nKey={`${activityI18nKeybases[data.__typename]}.cta`} />
          <Icon.ArrowForward
            className="margin-left-1"
            aria-hidden
            aria-label="forward"
          />
        </>
      );
  }
};

type ChangesArrayType =
  | 'oldName'
  | 'added'
  | 'count'
  | 'crTdls'
  | 'planDiscussions'
  | 'readyForReview'
  | 'readyForClearance'
  | 'updated'
  | 'statusChanges';

/**
 * In the Daily Digest Notification center, we want to show only the first five changes and hide everything else under a `+X more changes`.
 *
 * In order to determine what actually changed, this function does the following:
 * * combs through the `changes` object
 * * filters out any values that are empty string, null, and empty arrays, indicating there is no change
 * * puts remaining values into an array.
 *
 * Further splicing of the array will then only show the first five changes and the rest will be under the `+X more changes`
 *
 * A few exceptions:
 * * Model Lead changes are important and prepending it to the front of the array ensures that a model lead addition will always show up, rather than being spliced out.
 *     * Model Lead being added to the Model Plan. The object looks like the following:
 *     ```
 *        "modelLeads": {
            "added": [
                {
                    ...
                    "commonName": "MINT Doe"
                }
            ]
          },
        ```
 * * `crTdls` and `planDisucssions`'s object are identical. So rather than having its object go through the filter, this function will push the key if it is 'crTdls' & 'planDiscussions'

      ```
      "crTdls": {
          "activity": true
      },
      "planDiscussions": {
          "activity": true
      }
      ```
 *
 *
 * @param {object} changes object passed in from `analyzedAudits`.
 * @returns `ChangesArrayType[]`
 */
export const pushValuesToChangesArray = (
  obj: AnalyzedAuditChange
): ChangesArrayType[] => {
  const changesArray: ChangesArrayType[] = [];

  const pushValues = (innerObj: AnalyzedAuditChange | AnalyzedCrTdls) => {
    Object.entries(innerObj).forEach(([key, value]) => {
      if (key !== '__typename') {
        // Ignore key values that where the key is '__typename'
        if (Array.isArray(value) && value.length > 0) {
          // Ignore empty arrays (i.e. [])
          if (key === 'added') {
            // Model Lead added is important, so pushed to the front of array to ensure it will always be shown
            changesArray.unshift(key);
          } else {
            changesArray.push(key as ChangesArrayType);
          }
        } else if (typeof value === 'string' && value.trim() !== '') {
          // Push the key if only the value is not an empty string (i.e. '')
          changesArray.push(key as ChangesArrayType);
        } else if (typeof value === 'number') {
          changesArray.push(key as ChangesArrayType);
        } else if (typeof value === 'boolean' && value) {
          changesArray.push(key as ChangesArrayType);
        } else if (value !== null && typeof value === 'object') {
          if (key === 'crTdls' || key === 'planDiscussions') {
            // Push the key if it is 'crTdls' & 'planDiscussions'
            changesArray.push(key);
          } else {
            // push the object into the function
            pushValues(value);
          }
        }
      }
    });
  };
  pushValues(obj);
  return changesArray;
};

export const getUpdatedNotificationPreferences = (
  allValues: UserNotificationPreferenceFlag[],
  chosenValue: UserNotificationPreferenceFlag
) => {
  return allValues.includes(chosenValue)
    ? allValues.filter(value => value !== chosenValue)
    : [...allValues, chosenValue];
};
