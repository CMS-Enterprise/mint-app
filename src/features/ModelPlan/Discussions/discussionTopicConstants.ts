import { DiscussionTopicType } from 'gql/generated/graphql';

// Waiver assessment survey remains a valid backend enum for existing records and
// change history, but is intentionally omitted from the new-discussion dropdown for now.
const DISCUSSION_TOPICS_HIDDEN_FROM_UI: DiscussionTopicType[] = [
  DiscussionTopicType.WAIVER_ASSESSMENT_SURVEY
];

export default DISCUSSION_TOPICS_HIDDEN_FROM_UI;
