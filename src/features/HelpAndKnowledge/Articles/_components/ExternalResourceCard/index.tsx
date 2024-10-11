import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Icon
} from '@trussworks/react-uswds';
import classnames from 'classnames';
import { ArticleCategories } from 'features/HelpAndKnowledge/Articles';
import HelpCategoryTag from 'features/HelpAndKnowledge/Articles/_components/HelpCategoryTag';

import ExternalLink from 'components/ExternalLink';
import TruncatedText from 'components/TruncatedText';

type ExternalResourceCardProps = {
  className?: string;
  route: string;
  translation: string;
  tag?: boolean;
  type: ArticleCategories;
};

const ExternalResourceCard = ({
  className,
  type,
  route,
  translation,
  tag = true
}: ExternalResourceCardProps) => {
  const { t } = useTranslation('helpAndKnowledge');

  return (
    <Card
      containerProps={{
        className: 'radius-md shadow-2 minh-mobile padding-0'
      }}
      data-testid="article-card"
      className={classnames('desktop:grid-col-4', 'article', className)}
    >
      <div className="display-flex flex-align-center bg-base-lightest padding-x-3 text-base-dark">
        <Icon.Launch className="margin-right-05" /> {t('externalResource')}
      </div>

      <div className="padding-x-3 padding-bottom-3 display-flex flex-column height-full">
        <CardHeader className="padding-0">
          <h3 className="line-height-body-4 margin-bottom-1 margin-top-3">
            {t(`externalResources.${translation}.title`)}
          </h3>
        </CardHeader>

        {tag && <HelpCategoryTag type={type} />}

        <CardBody className="padding-x-0 article__body padding-top-2">
          <TruncatedText
            charLimit={110}
            id={translation}
            text={t(`externalResources.${translation}.description`)}
          />
        </CardBody>

        <CardFooter className="padding-x-0 padding-top-2 padding-bottom-0">
          <ExternalLink
            className="usa-button usa-button--outline"
            asButton
            aria-label={t('viewOnSharePoint')}
            variant="unstyled"
            href={route}
          >
            {t('viewOnSharePoint')}
          </ExternalLink>
        </CardFooter>
      </div>
    </Card>
  );
};

export default ExternalResourceCard;
