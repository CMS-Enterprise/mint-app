import React from 'react';

import {
  GetModelPlanDiscussions_modelPlan_collaborators as CollaboratorsType,
  GetModelPlanDiscussions_modelPlan_discussions as DiscussionType,
  GetModelPlanDiscussions_modelPlan_discussions_replies as ReplyType
} from 'queries/Discussions/types/GetModelPlanDiscussions';
import { DiscussionStatus } from 'types/graphql-global-types';

type FormatDiscussionProps = {
  discussionsContent: DiscussionType[];
  status: DiscussionStatus;
};

const FormatDiscussion = ({
  discussionsContent,
  status
}: FormatDiscussionProps) => {
  return <div>FormatDiscussion</div>;
};

export default FormatDiscussion;
