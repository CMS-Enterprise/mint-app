import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { MtoCommonSolutionSubject } from 'gql/generated/graphql';

import CategoryCard from './index';

describe('Operational Solution Category Card', () => {
  it('rendered category name and link', () => {
    const { getByText } = render(
      <MemoryRouter>
        <CategoryCard categoryKey={MtoCommonSolutionSubject.DATA} />
      </MemoryRouter>
    );
    expect(getByText('Data')).toBeInTheDocument();
    expect(getByText('Learn more')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <CategoryCard categoryKey={MtoCommonSolutionSubject.DATA} />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
