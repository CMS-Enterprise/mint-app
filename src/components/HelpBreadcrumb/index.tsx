import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  IconClose
} from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';

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
      history.push(home ? '/' : '/help-and-knowledge');
    }
  };
  return (
    <Button
      type="button"
      unstyled
      onClick={() => handleClick()}
      className={classNames(className)}
    >
      {newTab || newTabOnly ? (
        <>
          <IconClose className="margin-right-05 margin-top-6 text-tbottom" />
          {t('close')}
        </>
      ) : (
        <BreadcrumbBar variant="wrap">
          <Breadcrumb>
            <BreadcrumbLink asCustom={UswdsReactLink} to="/">
              <span>{home ? t('home') : t('heading')}</span>
            </BreadcrumbLink>
          </Breadcrumb>
          <Breadcrumb current>{text}</Breadcrumb>
        </BreadcrumbBar>
      )}
    </Button>
  );
}
