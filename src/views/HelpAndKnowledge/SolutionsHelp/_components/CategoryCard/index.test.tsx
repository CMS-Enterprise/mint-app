import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import CategoryCard from './index';

describe('Operational Solution Category Card', () => {
  const categoryRoute = 'data';

  it('rendered category name and link', () => {
    const { getByText } = render(
      <MemoryRouter>
        <CategoryCard category="Data reporting" route={categoryRoute} />
      </MemoryRouter>
    );
    expect(getByText('Data reporting')).toBeInTheDocument();
    expect(getByText('Learn more')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <CategoryCard category="Data reporting" route={categoryRoute} />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
