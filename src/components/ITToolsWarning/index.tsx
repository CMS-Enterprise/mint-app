import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Button } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { useFlags } from 'launchdarkly-react-client-sdk';

import './index.scss';

interface ITToolsWarningType {
  className?: string;
  id: string;
  onClick: () => void;
}

const ITToolsWarning = ({ className, id, onClick }: ITToolsWarningType) => {
  const { t } = useTranslation('itSolutions');

  const flags = useFlags();

  if (flags.hideITLeadExperience) {
    return <></>;
  }

  return (
    <Alert type="warning" className={classNames('it-tools-warning', className)}>
      {t('warningRedirect')}
      <Button
        type="button"
        id={id}
        className="usa-button usa-button--unstyled"
        onClick={onClick}
      >
        {t('goToITTools')}
      </Button>
    </Alert>
  );
};

export default ITToolsWarning;
