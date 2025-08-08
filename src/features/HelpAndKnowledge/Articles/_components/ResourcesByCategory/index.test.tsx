import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import i18next from 'i18next';

import helpAndKnowledgeArticles, { ArticleCategories } from '../..';

import ResourcesByCategory from './index';

describe('ResourcesByCategory', () => {
  it('renders the component correctly with no current category', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/articles',
          element: <ResourcesByCategory />
        }
      ],
      {
        initialEntries: ['/help-and-knowledge/articles']
      }
    );

    render(<RouterProvider router={router} />);

    expect(
      screen.getByText(i18next.t('helpAndKnowledge:browseByCategory'))
    ).toBeInTheDocument();
  });

  it('renders the component correctly with a current category', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/articles',
          element: (
            <ResourcesByCategory
              currentCategory={ArticleCategories.GETTING_STARTED}
              className="custom-class"
            />
          )
        }
      ],
      {
        initialEntries: ['/help-and-knowledge/articles']
      }
    );

    render(<RouterProvider router={router} />);

    expect(
      screen.getByText(i18next.t('helpAndKnowledge:otherCategories'))
    ).toBeInTheDocument();
  });

  it('renders the correct amount of articles in the categories', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/articles',
          element: <ResourcesByCategory />
        }
      ],
      {
        initialEntries: ['/help-and-knowledge/articles']
      }
    );

    render(<RouterProvider router={router} />);

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
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/articles',
          element: (
            <ResourcesByCategory
              currentCategory={ArticleCategories.GETTING_STARTED}
              className="custom-class"
            />
          )
        }
      ],
      {
        initialEntries: ['/help-and-knowledge/articles']
      }
    );

    const { asFragment } = render(<RouterProvider router={router} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
