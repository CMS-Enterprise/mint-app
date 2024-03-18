import React from 'react';
import { Trans } from 'react-i18next';
import { Icon } from '@trussworks/react-uswds';
import {
  GetNotifications_currentUser_notifications_notifications_activity_metaData as MetaDataType,
  GetNotifications_currentUser_notifications_notifications_activity_metaData_DailyDigestCompleteActivityMeta as DailyDigestCompleteActivityType,
  GetNotifications_currentUser_notifications_notifications_activity_metaData_TaggedInDiscussionReplyActivityMeta as TaggedInDiscussionReplyActivityType,
  GetNotifications_currentUser_notifications_notifications_activity_metaData_TaggedInPlanDiscussionActivityMeta as TaggedInDiscussionActivityType
} from 'gql/gen/types/GetNotifications';

// Type guard to check union type
export const isTaggedInDiscussion = (
  data:
    | TaggedInDiscussionReplyActivityType
    | TaggedInDiscussionActivityType
    | DailyDigestCompleteActivityType
): data is TaggedInDiscussionActivityType => {
  /* eslint no-underscore-dangle: 0 */
  return data.__typename === 'TaggedInPlanDiscussionActivityMeta';
};

export const isTaggedInDiscussionReply = (
  data:
    | TaggedInDiscussionReplyActivityType
    | TaggedInDiscussionActivityType
    | DailyDigestCompleteActivityType
): data is TaggedInDiscussionReplyActivityType => {
  /* eslint no-underscore-dangle: 0 */
  return data.__typename === 'TaggedInDiscussionReplyActivityMeta';
};

export const isDailyDigest = (
  data:
    | TaggedInDiscussionReplyActivityType
    | TaggedInDiscussionActivityType
    | DailyDigestCompleteActivityType
): data is DailyDigestCompleteActivityType => {
  /* eslint no-underscore-dangle: 0 */
  return data.__typename === 'DailyDigestCompleteActivityMeta';
};

export const activityText = (data: MetaDataType) => {
  if (isTaggedInDiscussion(data)) {
    return (
      <Trans
        i18nKey="notifications:index.activityType.taggedInDiscussion.text"
        values={{ modelName: data.modelPlan.modelName }}
      />
    );
  }
  if (isTaggedInDiscussionReply(data)) {
    return (
      <Trans
        i18nKey="notifications:index.activityType.taggedInDiscussionReply.text"
        values={{ modelName: data.modelPlan.modelName }}
      />
    );
  }
  if (isDailyDigest(data)) {
    return (
      <Trans i18nKey="notifications:index.activityType.dailyDigestComplete.text" />
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
  if (isTaggedInDiscussion(data)) {
    return (
      <>
        <Trans i18nKey="notifications:index.activityType.taggedInDiscussion.cta" />
        <Icon.ArrowForward className="margin-left-1" aria-hidden />
      </>
    );
  }
  if (isTaggedInDiscussionReply(data)) {
    return (
      <>
        <Trans i18nKey="notifications:index.activityType.taggedInDiscussionReply.cta" />
        <Icon.ArrowForward className="margin-left-1" aria-hidden />
      </>
    );
  }
  if (isDailyDigest(data)) {
    return (
      <>
        <Trans i18nKey="notifications:index.activityType.dailyDigestComplete.cta" />
        {isExpanded ? (
          <Icon.ExpandLess className="margin-left-1" aria-hidden />
        ) : (
          <Icon.ExpandMore className="margin-left-1" aria-hidden />
        )}
      </>
    );
  }
  return <></>;
};

// export const translatePlanSections = (section: string) => {
//   switch (section) {
//     case 'plan_basics':
//       return notificationsT('index.dailyDigest.planSections.plan_basics');
//     case 'plan_payments':
//       return notificationsT('index.dailyDigest.planSections.plan_payments');
//     case 'plan_ops_eval_and_learning':
//       return notificationsT(
//         'index.dailyDigest.planSections.plan_ops_eval_and_learning'
//       );
//     case 'plan_participants_and_providers':
//       return notificationsT(
//         'index.dailyDigest.planSections.plan_participants_and_providers'
//       );
//     case 'plan_beneficiaries':
//       return notificationsT(
//         'index.dailyDigest.planSections.plan_beneficiaries'
//       );
//     case 'plan_general_characteristics':
//       return notificationsT(
//         'index.dailyDigest.planSections.plan_general_characteristics'
//       );
//     default:
//       return '';
//   }
// };

export const TranslateStatusChange = ({
  status
}: {
  status: string | null;
}) => {
  switch (status) {
    case 'PLAN_DRAFT':
      return (
        <Trans i18nKey="notifications:index.dailyDigest.statusChange.plan_draft" />
      );
    case 'PLAN_COMPLETE':
      return (
        <Trans i18nKey="notifications:index.dailyDigest.statusChange.plan_complete" />
      );
    case 'ICIP_COMPLETE':
      return (
        <Trans i18nKey="notifications:index.dailyDigest.statusChange.icip_complete" />
      );
    case 'INTERNAL_CMMI_CLEARANCE':
      return (
        <Trans i18nKey="notifications:index.dailyDigest.statusChange.internal_cmmi_clearance" />
      );
    case 'CMS_CLEARANCE':
      return (
        <Trans i18nKey="notifications:index.dailyDigest.statusChange.cms_clearance" />
      );
    case 'HHS_CLEARANCE':
      return (
        <Trans i18nKey="notifications:index.dailyDigest.statusChange.hhs_clearance" />
      );
    case 'OMB_ASRF_CLEARANCE':
      return (
        <Trans i18nKey="notifications:index.dailyDigest.statusChange.omb_asrf_clearance" />
      );
    case 'CLEARED':
      return (
        <Trans i18nKey="notifications:index.dailyDigest.statusChange.cleared" />
      );
    case 'ANNOUNCED':
      return (
        <Trans i18nKey="notifications:index.dailyDigest.statusChange.announced" />
      );
    default:
      return <></>;
  }
};
