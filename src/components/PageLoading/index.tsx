import React from 'react';
import { useTranslation } from 'react-i18next';

import Spinner from 'components/Spinner';

type PageLoadingProps = {
  testId?: string;
};

const PageLoading = ({ testId }: PageLoadingProps) => {
  const { t } = useTranslation('general');
  return (
    <div className="margin-y-10" data-testid={testId || 'page-loading'}>
      <div className="text-center">
        <Spinner size="xl" aria-valuetext={t('pageLoading')} aria-busy />
      </div>

      <h1 className="margin-top-6 text-center">{t('pageLoading')}</h1>
    </div>
  );
};

export default PageLoading;
