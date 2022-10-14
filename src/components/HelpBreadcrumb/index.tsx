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
  text?: string;
};

export default function HelpBreadcrumb({
  className,
  text
}: HelpBreadcrumbProps) {
  const history = useHistory();
  const newTab = history.length === 1;
  const { t } = useTranslation('helpAndKnowledge');
  const handleClick = () => {
    if (newTab) {
      window.close();
    } else {
      history.push('/help-and-knowledge');
    }
  };
  return (
    <Button
      type="button"
      unstyled
      onClick={() => handleClick()}
      className={classNames(className)}
    >
      {newTab ? (
        <>
          <IconClose className="margin-right-05 margin-top-6 text-tbottom" />
          {t('close')}
        </>
      ) : (
        <BreadcrumbBar variant="wrap">
          <Breadcrumb>
            <BreadcrumbLink asCustom={UswdsReactLink} to="/">
              <span>{t('heading')}</span>
            </BreadcrumbLink>
          </Breadcrumb>
          <Breadcrumb current>{text}</Breadcrumb>
        </BreadcrumbBar>
      )}
    </Button>
  );
}
