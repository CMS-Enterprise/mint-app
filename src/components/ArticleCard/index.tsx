import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Tag
} from '@trussworks/react-uswds';
import classnames from 'classnames';

import HelpTag from 'components/HelpTag';
import UswdsReactLink from 'components/LinkWrapper';
import { ArticleTypeProps } from 'views/HelpAndKnowledge/Articles';

import './index.scss';

type ArticleCardProps = {
  className?: string;
  isLink?: boolean;
  route: string;
  translation: string;
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

  return (
    <Card
      containerProps={{
        className: 'radius-md shadow-2 minh-mobile padding-3'
      }}
      data-testid="article-card"
      className={classnames('desktop:grid-col-4', 'article', className, {
        'article-card--isLink': isLink
      })}
      onClick={() => history.push(`/help-and-knowledge${route}`)}
    >
      <CardHeader className="padding-0">
        <h3 className="line-height-body-4 margin-bottom-1">{t('title')}</h3>
      </CardHeader>
      {tag && <HelpTag type={type} />}

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
