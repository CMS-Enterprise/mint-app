import React from 'react';
import { useTranslation } from 'react-i18next';

import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';

const TermsAndConditions = () => {
  const { t } = useTranslation('termsAndConditions');
  return (
    <MainContent className="grid-container line-height-body-5">
      <PageHeading>{t('heading')}</PageHeading>
      <h2>{t('subheading')}</h2>
      <p className="margin-y-4">{t('unauthorizedUse')}</p>
      <p className="margin-y-4">{t('socialMediaUse')}</p>
      <p className="margin-y-4">{t('consent')}</p>
      <p className="margin-y-4">{t('infoStorage')}</p>
    </MainContent>
  );
};

export default TermsAndConditions;
