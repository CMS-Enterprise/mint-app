import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';

import './index.scss';

interface ITToolsWarningType {
  className?: string;
  route: string;
}

const ITToolsWarning = ({ className, route }: ITToolsWarningType) => {
  const { t } = useTranslation('itTools');

  return (
    <Alert type="warning" className={classNames('it-tools-warning', className)}>
      {t('warningRedirect')}
      <UswdsReactLink to={route}>{t('goToITTools')}.</UswdsReactLink>
    </Alert>
  );
};

export default ITToolsWarning;
