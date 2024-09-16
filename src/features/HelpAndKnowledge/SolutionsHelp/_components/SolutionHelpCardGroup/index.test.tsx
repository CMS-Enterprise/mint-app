import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';
import setup from 'tests/util';

import { helpSolutions } from '../../solutionsMap';

import SolutionHelpCardGroup from './index';

describe('Operation Solution Help Card Group', () => {
  it('rendered all correct information even after pagination', async () => {
    const { user, getByText, getByLabelText, queryByText } = setup(
      <MemoryRouter
        initialEntries={['/help-and-knowledge/operational-solutions']}
      >
        <Route path="/help-and-knowledge/operational-solutions">
          <SolutionHelpCardGroup
            solutions={helpSolutions}
            setResultsNum={() => null}
          />
        </Route>
      </MemoryRouter>
    );

    // Solution visible on page one
    expect(getByText('4innovation')).toBeInTheDocument();
    expect(getByText('Chronic Conditions Warehouse')).toBeInTheDocument();
    expect(getByText('CMS Box')).toBeInTheDocument();

    // solution not visible on page 2
    expect(
      queryByText('Expanded Data Feedback Reporting')
    ).not.toBeInTheDocument();

    // Click to page 2
    const page2Button = getByLabelText('Page 2');
    await user.click(page2Button);

    expect(getByText('Expanded Data Feedback Reporting')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={['/help-and-knowledge/operational-solutions']}
      >
        <Route path="/help-and-knowledge/operational-solutions">
          <SolutionHelpCardGroup
            solutions={helpSolutions}
            setResultsNum={() => null}
          />
        </Route>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
