import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';
import classNames from 'classnames';

type HelpBoxProps = {
  className?: string;
};

const HelpBox = ({ className }: HelpBoxProps) => {
  const { t } = useTranslation('itSolutions');
  const history = useHistory();

  return (
    <div
      className={classNames('padding-3 bg-primary-dark text-white', className)}
    >
      <h3 className="margin-top-0">{t('helpBox.heading')}</h3>
      <p className="line-height-body-4">{t('helpBox.info')}</p>
      <Button
        type="button"
        onClick={() => history.push('/')}
        className="usa-button usa-button--outline text-white border-white border-2px bg-transparent"
      >
        {t('helpBox.button')}
      </Button>
    </div>
  );
};

export default HelpBox;
