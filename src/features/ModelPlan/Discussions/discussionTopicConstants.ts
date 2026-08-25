import { DiscussionTopicType } from 'gql/generated/graphql';

// Waiver assessment survey remains a valid backend enum for existing records and
// change history, but is intentionally omitted from the new-discussion dropdown for now.
export const DISCUSSION_TOPICS_HIDDEN_FROM_UI: DiscussionTopicType[] = [
  DiscussionTopicType.WAIVER_ASSESSMENT_SURVEY
];
