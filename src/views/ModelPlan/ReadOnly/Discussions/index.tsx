import React from 'react';
import { useLocation } from 'react-router-dom';

import Discussions from 'views/ModelPlan/Discussions';

const ReadOnlyDiscussions = ({ modelID }: { modelID: string }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const discussionID = params.get('discussionID');

  return (
    <div
      className="read-only-model-plan--discussions"
      data-testid="read-only-model-plan--discussions"
    >
      <Discussions modelID={modelID} readOnly discussionID={discussionID} />
    </div>
  );
};

export default ReadOnlyDiscussions;
