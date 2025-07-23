import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import githubApolloClient from 'app/Clients/github';
import GetLastCommit from 'gql/externalOperations/Github/GetLastCommit';

import { filePath, owner, repo } from 'constants/github';
import { formatDateUtc } from 'utils/date';

function LatestContentUpdate({ file }: { file: string }) {
  const { t } = useTranslation('helpAndKnowledge');

  const { data, loading, error } = useQuery(GetLastCommit, {
    client: githubApolloClient,
    variables: {
      owner,
      repo,
      path: `${filePath}${file}`
    }
  });

  if (loading) return null;
  if (error) return null;

  const commitDate = formatDateUtc(
    data?.repository?.object?.history?.edges?.[0]?.node?.committedDate,
    'MM/dd/yyyy'
  );

  if (!commitDate) return null;

  return (
    <div className="text-base text-italic border-top border-gray-10 padding-top-1 margin-bottom-4">
      {t('lastUpdated', { date: commitDate })}
    </div>
  );
}

export default LatestContentUpdate;
