import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { filePath, owner, repo } from 'constants/github';
import { formatDateUtc } from 'utils/date';

function LatestContentUpdate({ file }: { file: string }) {
  const { t } = useTranslation('helpAndKnowledge');

  const [commitDate, setCommitDate] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    // GitHub API endpoint for commits affecting a specific file
    const url = `https://api.github.com/repos/${owner}/${repo}/commits?path=${filePath}${file}&per_page=1`;

    fetch(url)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch commit data');
        }
        return res.json();
      })
      .then(data => {
        if (data.length > 0) {
          setCommitDate(
            formatDateUtc(data[0].commit.committer.date, 'MM/dd/yyyy')
          );
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true));
  }, [file]);

  if (error) return null;
  if (!commitDate) return null;

  return (
    <div className="text-base text-italic border-top border-gray-10 padding-top-1 margin-bottom-4">
      {t('lastUpdated', { date: commitDate })}
    </div>
  );
}

export default LatestContentUpdate;
