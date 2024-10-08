import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Icon,
  Link
} from '@trussworks/react-uswds';
import classnames from 'classnames';
import { ArticleCategories } from 'features/HelpAndKnowledge/Articles';
import HelpCategoryTag from 'features/HelpAndKnowledge/Articles/_components/HelpCategoryTag';

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
            {t(`externalResources.${translation}.heading`)}
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
          <Link
            className="usa-button usa-button--outline"
            aria-label={t('viewOnSharePoint')}
            variant="unstyled"
            target="_blank"
            href={route}
          >
            {t('viewOnSharePoint')}
            <Icon.Launch className="margin-left-05" />
          </Link>
        </CardFooter>
      </div>
    </Card>
  );
};

export default ExternalResourceCard;
