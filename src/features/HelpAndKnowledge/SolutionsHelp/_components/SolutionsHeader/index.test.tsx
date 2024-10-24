import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';

import { helpSolutions } from '../../solutionsMap';

import SolutionsHeader from './index';

describe('Operation Solution Help Header', () => {
  it('rendered correct information without query', () => {
    const { getByText } = render(
      <MemoryRouter
        initialEntries={['/help-and-knowledge/operational-solutions']}
      >
        <Route path="/help-and-knowledge/operational-solutions">
          <SolutionsHeader
            resultsNum={9}
            resultsMax={helpSolutions.length}
            setQuery={(query: string) => null}
            query=""
          />
        </Route>
      </MemoryRouter>
    );

    // Page results info
    expect(
      getByText('Showing 9 of 36 operational solutions')
    ).toBeInTheDocument();
  });

  it('rendered correct information with query', () => {
    const { getByText } = render(
      <MemoryRouter
        initialEntries={['/help-and-knowledge/operational-solutions']}
      >
        <Route path="/help-and-knowledge/operational-solutions">
          <SolutionsHeader
            resultsNum={1}
            resultsMax={helpSolutions.length}
            setQuery={(query: string) => null}
            query="4inn"
          />
        </Route>
      </MemoryRouter>
    );

    // Page results info
    expect(getByText('Showing 1 operational solution for')).toBeInTheDocument();
    expect(getByText('"4inn"')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={['/help-and-knowledge/operational-solutions']}
      >
        <Route path="/help-and-knowledge/operational-solutions">
          <SolutionsHeader
            resultsNum={9}
            resultsMax={helpSolutions.length}
            setQuery={(query: string) => null}
            query=""
          />
        </Route>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
