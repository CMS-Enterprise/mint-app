import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import CategoryCard from './index';

describe('RelatedArticle', () => {
  const categoryRoute = 'data-reporting';

  it('rendered category name and link', () => {
    const { getByText } = render(
      <MemoryRouter>
        <CategoryCard category="Data reporting" route={categoryRoute} />
      </MemoryRouter>
    );
    expect(getByText('Data reporting')).toBeInTheDocument();
    expect(getByText('Learn more')).toBeInTheDocument();
  });

  it('renders Article Card entirely wrapped as a link', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <CategoryCard category="Data reporting" route={categoryRoute} />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
