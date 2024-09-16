import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import helpAndKnowledgeArticles from 'features/HelpAndKnowledge/Articles';

import ArticleCard from './index';

describe('RelatedArticle', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <ArticleCard {...helpAndKnowledgeArticles[0]} />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders Article Card entirely wrapped as a link', () => {
    const { container } = render(
      <MemoryRouter>
        <ArticleCard {...helpAndKnowledgeArticles[0]} isLink />
      </MemoryRouter>
    );

    expect(
      container.getElementsByClassName('article-card--isLink').length
    ).toBe(1);
  });
});
