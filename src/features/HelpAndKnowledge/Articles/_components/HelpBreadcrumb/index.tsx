import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';

import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';

type HelpBreadcrumbProps = {
  className?: string;
  home?: boolean;
  text?: string;
  newTabOnly?: boolean;
};

export default function HelpBreadcrumb({
  className,
  home,
  text,
  newTabOnly = false
}: HelpBreadcrumbProps) {
  const navigate = useNavigate();
  const newTab = window.history.length === 1;
  const { t } = useTranslation('helpAndKnowledge');
  const handleClick = () => {
    if (newTab || newTabOnly) {
      window.close();
    } else {
      navigate(home ? '/' : '/help-and-knowledge', { replace: true });
    }
  };

  return (
    <Button
      type="button"
      unstyled
      onClick={() => handleClick()}
      className={classNames(className, {
        'margin-top-6': newTab || newTabOnly
      })}
    >
      {newTab || newTabOnly ? (
        <>
          <Icon.Close
            className="margin-right-05 text-tbottom"
            aria-label="close"
          />
          {t('close')}
        </>
      ) : (
        <Breadcrumbs
          items={[BreadcrumbItemOptions.HELP_CENTER]}
          customItem={text}
        />
      )}
    </Button>
  );
}
