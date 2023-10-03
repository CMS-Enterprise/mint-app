import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';

import { helpSolutions } from '../../solutionsMap';

import SolutionHelpCard from './index';

describe('Operation Solution Help Card', () => {
  it('rendered all correct information', () => {
    const { getByText } = render(
      <MemoryRouter
        initialEntries={['/help-and-knowledge/operational-solutions']}
      >
        <Route path="/help-and-knowledge/operational-solutions">
          <SolutionHelpCard solution={helpSolutions[0]} />
        </Route>
      </MemoryRouter>
    );
    expect(getByText('4innovation')).toBeInTheDocument();
    expect(
      getByText('Applications and participant interaction')
    ).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={['/help-and-knowledge/operational-solutions']}
      >
        <Route path="/help-and-knowledge/operational-solutions">
          <SolutionHelpCard solution={helpSolutions[0]} />
        </Route>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
