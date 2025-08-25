import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render } from '@testing-library/react';
import helpAndKnowledgeArticles from 'features/HelpAndKnowledge/Articles';

import ArticleCard from './index';

describe('RelatedArticle', () => {
  it('matches the snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <ArticleCard {...helpAndKnowledgeArticles[0]} key="article-1" />
          )
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    const { asFragment } = render(<RouterProvider router={router} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders Article Card entirely wrapped as a link', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <ArticleCard
              {...helpAndKnowledgeArticles[0]}
              isLink
              key="article-2"
            />
          )
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    const { container } = render(<RouterProvider router={router} />);

    expect(
      container.getElementsByClassName('article-card--isLink').length
    ).toBe(1);
  });
});
