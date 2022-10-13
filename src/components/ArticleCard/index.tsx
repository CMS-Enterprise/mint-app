import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader
} from '@trussworks/react-uswds';
import classnames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';

import './index.scss';

type ArticleCardProps = {
  className?: string;
  isLink?: boolean;
  route: string;
  translation: string;
};

const ArticleCard = ({
  className,
  route,
  translation,
  isLink = false
}: ArticleCardProps) => {
  const { t } = useTranslation(translation);
  const history = useHistory();

  const clickHandler = (e: React.MouseEvent<HTMLElement>, url: string) => {
    const target = e.target as Element;
    if (isLink && target.getAttribute('data-testid') !== 'tag') {
      history.push(url);
    }
  };

  return (
    <Card
      containerProps={{
        className: 'radius-md shadow-2 minh-mobile'
      }}
      data-testid="article-card"
      className={classnames('desktop:grid-col-4', 'article', className, {
        'article-card--isLink': isLink
      })}
      onClick={e => clickHandler(e, `/help-and-knowledge${route}`)}
    >
      <CardHeader className="padding-x-3 padding-top-3">
        <h3 className="line-height-body-4 margin-bottom-1">{t('title')}</h3>
      </CardHeader>
      <CardBody className="padding-top-0 article__body">
        <p>{t('description')}</p>
      </CardBody>
      <CardFooter className="padding-top-2 article__footer">
        <UswdsReactLink
          to={`/help-and-knowledge${route}`}
          className="usa-button usa-button--outline"
          variant="unstyled"
        >
          {useTranslation('helpAndKnowledge').t('read')}
        </UswdsReactLink>
      </CardFooter>
    </Card>
  );
};

export default ArticleCard;
