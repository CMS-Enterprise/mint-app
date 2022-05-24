import React from 'react';
import { IconComment } from '@trussworks/react-uswds';
import i18next from 'i18next';
import { DateTime } from 'luxon';

import { GetModelPlans_modelPlanCollection_discussions as DiscussionType } from 'queries/types/GetModelPlans';

const formatRecentActivity = (
  date: string,
  discussions: DiscussionType[]
): React.ReactNode => {
  let discussionActivity;

  console.log(date);

  // Formatting date string of last updated model plan
  const updated = `${i18next.t(
    'home:requestsTable.updated'
  )} ${DateTime.fromISO(date).toLocaleString(DateTime.DATE_SHORT)}`;

  // Filtering for answered/unanswered question on model plan
  if (discussions.length > 0) {
    const unansweredQuestions = discussions.filter(
      (discussion: DiscussionType) => discussion.status === 'UNANSWERED'
    ).length;

    // Checking/formatting for unanswered questions
    let recentActivity: React.ReactNode = unansweredQuestions ? (
      <p>
        {unansweredQuestions}{' '}
        {i18next.t('home:requestsTable.unansweredQuestion')}
        {unansweredQuestions > 1 && 's'} {/* Adding 's' for pluraltiy */}
      </p>
    ) : (
      <></>
    );

    // Checking/formatting for answered questions
    const answeredQuestions = discussions.length - unansweredQuestions;

    recentActivity = (
      <div className="text-bold">
        {recentActivity}{' '}
        {answeredQuestions > 0 && (
          <p>
            {answeredQuestions}{' '}
            {i18next.t('home:requestsTable.answeredQuestion')}
            {answeredQuestions > 1 && 's'}
          </p>
        )}
      </div>
    );

    // Formating any questions with Icon
    discussionActivity = (
      <div className="display-flex">
        <IconComment className="text-primary margin-top-05 margin-right-05" />{' '}
        {recentActivity}
      </div>
    );
  }

  return (
    <div>
      {updated} {discussionActivity}
    </div>
  );
};

export default formatRecentActivity;
