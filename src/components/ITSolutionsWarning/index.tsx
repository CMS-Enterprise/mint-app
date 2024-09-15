import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { useFlags } from 'launchdarkly-react-client-sdk';

import Alert from 'components/Alert';

import './index.scss';

interface ITSolutionsWarningType {
  className?: string;
  id: string;
  onClick: () => void;
}

const ITSolutionsWarning = ({
  className,
  id,
  onClick
}: ITSolutionsWarningType) => {
  const { t } = useTranslation('opSolutionsMisc');

  const flags = useFlags();

  if (flags.hideITLeadExperience) {
    return <></>;
  }

  return (
    <Alert
      type="warning"
      className={classNames('it-solutions-warning', className)}
    >
      {t('warningRedirect')}
      <Button
        type="button"
        id={id}
        className="usa-button usa-button--unstyled"
        onClick={onClick}
      >
        {t('goToITSolutions')}
      </Button>
    </Alert>
  );
};

export default ITSolutionsWarning;
