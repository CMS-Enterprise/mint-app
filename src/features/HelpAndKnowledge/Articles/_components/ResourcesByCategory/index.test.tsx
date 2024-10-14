import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import i18next from 'i18next';

import helpAndKnowledgeArticles, { ArticleCategories } from '../..';

import ResourcesByCategory from './index';

describe('ResourcesByCategory', () => {
  it('renders the component correctly with no current category', () => {
    render(
      <MemoryRouter initialEntries={['/help-and-knowledge/articles']}>
        <Route path="/help-and-knowledge/articles">
          <ResourcesByCategory />
        </Route>
      </MemoryRouter>
    );

    expect(
      screen.getByText(i18next.t('helpAndKnowledge:browseByCategory'))
    ).toBeInTheDocument();
  });

  it('renders the component correctly with a current category', () => {
    render(
      <MemoryRouter initialEntries={['/help-and-knowledge/articles']}>
        <Route path="/help-and-knowledge/articles">
          <ResourcesByCategory
            currentCategory={ArticleCategories.GETTING_STARTED}
            className="custom-class"
          />
        </Route>
      </MemoryRouter>
    );

    expect(
      screen.getByText(i18next.t('helpAndKnowledge:otherCategories'))
    ).toBeInTheDocument();
  });

  it('renders the correct amount of articles in the categories', () => {
    render(
      <MemoryRouter initialEntries={['/help-and-knowledge/articles']}>
        <Route path="/help-and-knowledge/articles">
          <ResourcesByCategory />
        </Route>
      </MemoryRouter>
    );

    expect(
      screen.getAllByText(
        `${helpAndKnowledgeArticles.filter(article => article.type === ArticleCategories.GETTING_STARTED).length} resources`
      ).length
    ).toBeGreaterThan(0);

    expect(
      screen.getAllByText(
        `${helpAndKnowledgeArticles.filter(article => article.type === ArticleCategories.IT_IMPLEMENTATION).length} resources`
      ).length
    ).toBeGreaterThan(0);

    expect(
      screen.getAllByText(
        `${helpAndKnowledgeArticles.filter(article => article.type === ArticleCategories.MODEL_CONCEPT_AND_DESIGN).length} resources`
      ).length
    ).toBeGreaterThan(0);
  });

  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/help-and-knowledge/articles']}>
        <Route path="/help-and-knowledge/articles">
          <ResourcesByCategory
            currentCategory={ArticleCategories.GETTING_STARTED}
            className="custom-class"
          />
        </Route>
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
