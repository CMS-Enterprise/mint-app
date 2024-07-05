import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Grid, GridContainer } from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import HelpBreadcrumb from 'views/HelpAndKnowledge/Articles/_components/HelpBreadcrumb';
import NotFound from 'views/NotFound';

import HelpCardGroup from '../_components/HelpCardGroup';
import { ArticleCategories, articleCategories } from '..';

const AllArticles = () => {
  const { t } = useTranslation('helpAndKnowledge');

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const category = params.get('category');

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
            filter={category}
          />
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default AllArticles;
