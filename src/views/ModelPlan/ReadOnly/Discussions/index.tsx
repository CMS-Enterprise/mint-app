import React, { useState } from 'react';

import Discussions from 'views/ModelPlan/Discussions';

const ReadOnlyDiscussions = ({ modelID }: { modelID: string }) => {
  const [isDiscussionOpen, setIsDiscussionOpen] = useState(true);

  return (
    <div
      className="read-only-model-plan--discussions"
      data-testid="read-only-model-plan--discussions"
    >
      <Discussions
        modelID={modelID}
        readOnly
        closeModal={() => setIsDiscussionOpen(false)}
      />
    </div>
  );
};

export default ReadOnlyDiscussions;
