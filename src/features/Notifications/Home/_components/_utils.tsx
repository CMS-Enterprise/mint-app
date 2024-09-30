import React from 'react';
import { Trans } from 'react-i18next';
import { Icon } from '@trussworks/react-uswds';
import {
  AddedAsCollaboratorMeta,
  AnalyzedAuditChange,
  AnalyzedCrTdls,
  DailyDigestCompleteActivityMeta,
  DatesChangedActivityMeta,
  ModelPlanSharedActivityMeta,
  NewDiscussionRepliedActivityMeta,
  NewModelPlanActivityMeta,
  TaggedInDiscussionReplyActivityMeta,
  TaggedInPlanDiscussionActivityMeta
} from 'gql/generated/graphql';

type MetaDataType =
  | TaggedInDiscussionReplyActivityMeta
  | TaggedInPlanDiscussionActivityMeta
  | DailyDigestCompleteActivityMeta
  | NewDiscussionRepliedActivityMeta
  | ModelPlanSharedActivityMeta
  | AddedAsCollaboratorMeta
  | NewModelPlanActivityMeta
  | DatesChangedActivityMeta;

// Type guard to check union type
export const isTaggedInDiscussion = (
  data: MetaDataType
): data is TaggedInPlanDiscussionActivityMeta => {
  /* eslint no-underscore-dangle: 0 */
  return data.__typename === 'TaggedInPlanDiscussionActivityMeta';
};

export const isTaggedInDiscussionReply = (
  data: MetaDataType
): data is TaggedInDiscussionReplyActivityMeta => {
  /* eslint no-underscore-dangle: 0 */
  return data.__typename === 'TaggedInDiscussionReplyActivityMeta';
};

export const isDailyDigest = (
  data: MetaDataType
): data is DailyDigestCompleteActivityMeta => {
  /* eslint no-underscore-dangle: 0 */
  return data.__typename === 'DailyDigestCompleteActivityMeta';
};

export const isNewDiscussionReply = (
  data: MetaDataType
): data is NewDiscussionRepliedActivityMeta => {
  /* eslint no-underscore-dangle: 0 */
  return data.__typename === 'NewDiscussionRepliedActivityMeta';
};

export const isSharedActivity = (
  data: MetaDataType
): data is ModelPlanSharedActivityMeta => {
  /* eslint no-underscore-dangle: 0 */
  return data.__typename === 'ModelPlanSharedActivityMeta';
};

export const isAddingCollaborator = (
  data: MetaDataType
): data is AddedAsCollaboratorMeta => {
  /* eslint no-underscore-dangle: 0 */
  return data.__typename === 'AddedAsCollaboratorMeta';
};

export const isDatesChanged = (
  data: MetaDataType
): data is DatesChangedActivityMeta => {
  /* eslint no-underscore-dangle: 0 */
  return data.__typename === 'DatesChangedActivityMeta';
};

export const isNewModelPlan = (
  data: MetaDataType
): data is NewModelPlanActivityMeta => {
  /* eslint no-underscore-dangle: 0 */
  return data.__typename === 'NewModelPlanActivityMeta';
};

export const activityText = (data: MetaDataType) => {
  if (isAddingCollaborator(data)) {
    return (
      <Trans
        i18nKey="notifications:index.activityType.ADDED_AS_COLLABORATOR.text"
        values={{ modelName: data.modelPlan.modelName }}
      />
    );
  }
  if (isDailyDigest(data)) {
    return (
      <Trans i18nKey="notifications:index.activityType.DAILY_DIGEST_COMPLETE.text" />
    );
  }
  if (isDatesChanged(data)) {
    return (
      <Trans
        i18nKey="notifications:index.activityType.DATES_CHANGED.text"
        values={{ modelName: data.modelPlan.modelName }}
      />
    );
  }
  if (isSharedActivity(data)) {
    return (
      <Trans
        i18nKey="notifications:index.activityType.MODEL_PLAN_SHARED.text"
        values={{ modelName: data.modelPlan.modelName }}
      />
    );
  }
  if (isNewDiscussionReply(data)) {
    return (
      <Trans
        i18nKey="notifications:index.activityType.NEW_DISCUSSION_REPLY.text"
        values={{ modelName: data.modelPlan.modelName }}
      />
    );
  }
  if (isNewModelPlan(data)) {
    return (
      <Trans
        i18nKey="notifications:index.activityType.NEW_MODEL_PLAN.text"
        values={{ modelName: data.modelPlan.modelName }}
      />
    );
  }
  if (isTaggedInDiscussion(data)) {
    return (
      <Trans
        i18nKey="notifications:index.activityType.TAGGED_IN_DISCUSSION.text"
        values={{ modelName: data.modelPlan.modelName }}
      />
    );
  }
  if (isTaggedInDiscussionReply(data)) {
    return (
      <Trans
        i18nKey="notifications:index.activityType.TAGGED_IN_DISCUSSION_REPLY.text"
        values={{ modelName: data.modelPlan.modelName }}
      />
    );
  }

  return '';
};

export const ActivityCTA = ({
  data,
  isExpanded
}: {
  data: MetaDataType;
  isExpanded: boolean;
}) => {
  if (isAddingCollaborator(data)) {
    return (
      <>
        <Trans i18nKey="notifications:index.activityType.ADDED_AS_COLLABORATOR.cta" />
        <Icon.ArrowForward className="margin-left-1" aria-hidden />
      </>
    );
  }
  if (isDailyDigest(data)) {
    return isExpanded ? (
      <>
        <Trans i18nKey="notifications:index.activityType.DAILY_DIGEST_COMPLETE.cta.hide" />
        <Icon.ExpandLess className="margin-left-1" aria-hidden />
      </>
    ) : (
      <>
        <Trans i18nKey="notifications:index.activityType.DAILY_DIGEST_COMPLETE.cta.view" />
        <Icon.ExpandMore className="margin-left-1" aria-hidden />
      </>
    );
  }

  if (isDatesChanged(data)) {
    return isExpanded ? (
      <>
        <Trans i18nKey="notifications:index.activityType.DATES_CHANGED.cta.hide" />
        <Icon.ExpandLess className="margin-left-1" aria-hidden />
      </>
    ) : (
      <>
        <Trans i18nKey="notifications:index.activityType.DATES_CHANGED.cta.view" />
        <Icon.ExpandMore className="margin-left-1" aria-hidden />
      </>
    );
  }

  if (isSharedActivity(data)) {
    return (
      <>
        <Trans i18nKey="notifications:index.activityType.MODEL_PLAN_SHARED.cta" />
        <Icon.ArrowForward className="margin-left-1" aria-hidden />
      </>
    );
  }

  if (isNewModelPlan(data)) {
    return (
      <>
        <Trans i18nKey="notifications:index.activityType.NEW_MODEL_PLAN.cta" />
        <Icon.ArrowForward className="margin-left-1" aria-hidden />
      </>
    );
  }
  if (isNewDiscussionReply(data)) {
    return (
      <>
        <Trans i18nKey="notifications:index.activityType.NEW_DISCUSSION_REPLY.cta" />
        <Icon.ArrowForward className="margin-left-1" aria-hidden />
      </>
    );
  }

  if (isTaggedInDiscussion(data)) {
    return (
      <>
        <Trans i18nKey="notifications:index.activityType.TAGGED_IN_DISCUSSION.cta" />
        <Icon.ArrowForward className="margin-left-1" aria-hidden />
      </>
    );
  }
  if (isTaggedInDiscussionReply(data)) {
    return (
      <>
        <Trans i18nKey="notifications:index.activityType.TAGGED_IN_DISCUSSION_REPLY.cta" />
        <Icon.ArrowForward className="margin-left-1" aria-hidden />
      </>
    );
  }

  return <></>;
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
