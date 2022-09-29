import React from 'react';
import { useTranslation } from 'react-i18next';

import { TaskListStatusTag } from 'views/ModelPlan/TaskList/_components/TaskListItem';
import { NotFoundPartial } from 'views/NotFound';

const ReadOnlyPayments = ({ modelID }: { modelID: string }) => {
  const { t } = useTranslation('payments');
  const { t: h } = useTranslation('draftModelPlan');

  const { data, loading, error } = useQuery<GetAllParticipantsTypes>(
    GetAllParticipants,
    {
      variables: {
        id: modelID
      }
    }
  );

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial />;
  }

  return (
    <div
      className="read-only-model-plan--participants-and-providers"
      data-testid="read-only-model-plan--participants-and-providers"
    >
      <div className="display-flex flex-justify flex-align-start">
        <h2 className="margin-top-0 margin-bottom-4">{t('heading')}</h2>
        {/* {status && <TaskListStatusTag status={status} />} */}
      </div>
    </div>
  );
};

export default ReadOnlyPayments;
