import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid } from '@trussworks/react-uswds';
import { ar } from 'vitest/dist/chunks/reporters.DAfKSDh5';

import UswdsReactLink from 'components/LinkWrapper';

import helpAndKnowledgeArticles, { ArticleCategories } from '../..';

type ResourcesByCategoryProps = {
  currentCategory?: ArticleCategories;
  className?: string;
};

const ResourcesByCategory = ({
  currentCategory,
  className
}: ResourcesByCategoryProps) => {
  const { t } = useTranslation('helpAndKnowledge');

  const gettingStartedArticles = helpAndKnowledgeArticles.filter(
    article => article.type === ArticleCategories.GETTING_STARTED
  );

  const itImplementationArticles = helpAndKnowledgeArticles.filter(
    article => article.type === ArticleCategories.IT_IMPLEMENTATION
  );

  const modelConceptAndDesignArticles = helpAndKnowledgeArticles.filter(
    article => article.type === ArticleCategories.MODEL_CONCEPT_AND_DESIGN
  );

  return (
    <div className="padding-y-105 border-top-2px border-gray-10 margin-top-2">
      <h4>{!currentCategory ? t('browseByCategory') : t('otherCategories')}</h4>
      <Grid row>
        <Grid desktop={{ col: 4 }}>
          <div className="display-block">
            <UswdsReactLink to="/help-and-knowledge/articles?category=getting-started">
              {t(`helpCategories.${ArticleCategories.GETTING_STARTED}`)}
            </UswdsReactLink>
            <p className="margin-y-1">
              {t('numResources', {
                count: gettingStartedArticles.length
              })}
            </p>
          </div>
        </Grid>

        <Grid desktop={{ col: 4 }}>
          <div className="display-block">
            <UswdsReactLink to="/help-and-knowledge/articles?category=it-implementation">
              {t(`helpCategories.${ArticleCategories.IT_IMPLEMENTATION}`)}
            </UswdsReactLink>{' '}
            <p className="margin-y-1">
              {t('numResources', {
                count: itImplementationArticles.length
              })}
            </p>
          </div>
        </Grid>

        <Grid desktop={{ col: 4 }}>
          <div className="display-block">
            <UswdsReactLink to="/help-and-knowledge/articles?category=model-concept-and-design">
              {t(
                `helpCategories.${ArticleCategories.MODEL_CONCEPT_AND_DESIGN}`
              )}
            </UswdsReactLink>{' '}
            <p className="margin-top-1 margin-bottom-0">
              {t('numResources', {
                count: modelConceptAndDesignArticles.length
              })}
            </p>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default ResourcesByCategory;
