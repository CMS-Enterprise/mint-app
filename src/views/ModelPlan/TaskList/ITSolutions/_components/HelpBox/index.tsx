import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';

type HelpBoxProps = {
  className?: string;
};

const HelpBox = ({ className }: HelpBoxProps) => {
  const { t } = useTranslation('opSolutionsMisc');

  return (
    <div
      className={classNames('padding-3 bg-primary-dark text-white', className)}
    >
      <h3 className="margin-top-0">{t('helpBox.heading')}</h3>
      <p className="line-height-body-4">{t('helpBox.info')}</p>

      <UswdsReactLink
        className="usa-button usa-button--outline text-white border-white border-2px bg-transparent"
        variant="unstyled"
        data-testid="add-new-operational-need"
        to={`${window.location.pathname}/add-an-operational-need`}
      >
        {t('helpBox.button')}
      </UswdsReactLink>
    </div>
  );
};

export default HelpBox;
