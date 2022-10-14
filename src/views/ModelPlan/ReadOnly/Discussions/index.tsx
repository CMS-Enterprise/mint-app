import React from 'react';

import Discussions from 'views/ModelPlan/Discussions';

const ReadOnlyDiscussions = ({ modelID }: { modelID: string }) => {
  return (
    <div
      className="read-only-model-plan--discussions"
      data-testid="read-only-model-plan--discussions"
    >
      <Discussions modelID={modelID} readOnly />
    </div>
  );
};

export default ReadOnlyDiscussions;
