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

import HelpAndKnowledgeCategoryTag from 'components/HelpAndKnowledgeCategoryTag';
import UswdsReactLink from 'components/LinkWrapper';
import { ArticleTypeProps } from 'views/HelpAndKnowledge/Articles';

import './index.scss';

type ArticleCardProps = {
  className?: string;
  route: string;
  translation: string;
  isLink?: boolean;
  tag?: boolean;
};

const ArticleCard = ({
  className,
  type,
  route,
  translation,
  isLink = false,
  tag = true
}: ArticleCardProps & ArticleTypeProps) => {
  const { t } = useTranslation(translation);
  const history = useHistory();

  const clickHandler = (e: React.MouseEvent<HTMLElement>, url: string) => {
    const target = e.target as Element;
    if (isLink && target.getAttribute('data-testid') !== 'tag') {
      history.push(`/help-and-knowledge${url}`);
    }
  };

  return (
    <Card
      containerProps={{
        className: 'radius-md shadow-2 minh-mobile padding-3'
      }}
      data-testid="article-card"
      className={classnames('desktop:grid-col-4', 'article', className, {
        'article-card--isLink': isLink
      })}
      onClick={e => clickHandler(e, route)}
    >
      <CardHeader className="padding-0">
        <h3 className="line-height-body-4 margin-bottom-1">{t('title')}</h3>
      </CardHeader>
      {tag && <HelpAndKnowledgeCategoryTag type={type} />}

      <CardBody className="padding-x-0 article__body">
        <p>{t('description')}</p>
      </CardBody>
      <CardFooter className="padding-x-0 padding-top-2 padding-bottom-0">
        <UswdsReactLink
          to="#"
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
