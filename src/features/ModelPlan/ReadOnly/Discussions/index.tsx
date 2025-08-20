import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Discussions from 'features/ModelPlan/Discussions';

const ReadOnlyDiscussions = ({ modelID }: { modelID?: string }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const discussionID = params.get('discussionID');

  const { modelID: modelIDFromParams } = useParams();

  return (
    <div
      className="read-only-model-plan--discussions"
      data-testid="read-only-model-plan--discussions"
    >
      <Discussions
        modelID={modelID || modelIDFromParams || ''}
        readOnly
        discussionID={discussionID || 'discussion-readonly'}
      />
    </div>
  );
};

export default ReadOnlyDiscussions;
