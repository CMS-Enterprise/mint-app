import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Grid, GridContainer } from '@trussworks/react-uswds';
import HelpBreadcrumb from 'features/HelpAndKnowledge/Articles/_components/HelpBreadcrumb';
import NotFound from 'features/NotFound';

import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';

import HelpCardGroup from '../_components/HelpCardGroup';
import ResourcesByCategory from '../_components/ResourcesByCategory';
import helpAndKnowledgeArticles, {
  ArticleCategories,
  articleCategories
} from '..';

const AllArticles = () => {
  const { t } = useTranslation('helpAndKnowledge');

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const category = params.get('category');

  const resources = useMemo(() => {
    return category
      ? helpAndKnowledgeArticles.filter(article => article.type === category)
      : helpAndKnowledgeArticles;
  }, [category]);

  if (category && !articleCategories.includes(category as ArticleCategories)) {
    return <NotFound />;
  }

  return (
    <MainContent>
      <GridContainer>
        <Grid>
          <HelpBreadcrumb
            text={category ? t(`helpCategories.${category}`) : t(`${'all'}`)}
          />
          <PageHeading>
            {category ? t(`helpCategories.${category}`) : t(`${'all'}`)}
          </PageHeading>

          <HelpCardGroup
            className="margin-y-2"
            tag={!category}
            pagination
            resources={resources}
          />
        </Grid>

        <ResourcesByCategory currentCategory={category as ArticleCategories} />
      </GridContainer>
    </MainContent>
  );
};

export default AllArticles;
