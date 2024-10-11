import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
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
  const history = useHistory();
  const newTab = history.length === 1;
  const { t } = useTranslation('helpAndKnowledge');
  const handleClick = () => {
    if (newTab || newTabOnly) {
      window.close();
    } else {
      history.replace(home ? '/' : '/help-and-knowledge');
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
          <Icon.Close className="margin-right-05 text-tbottom" />
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
