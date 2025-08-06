import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render } from '@testing-library/react';
import setup from 'tests/util';

import { helpSolutionsArray } from '../../solutionsMap';

import SolutionHelpCardGroup from './index';

describe('Operation Solution Help Card Group', () => {
  it('rendered all correct information even after pagination', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/operational-solutions',
          element: (
            <SolutionHelpCardGroup
              solutions={helpSolutionsArray}
              setResultsNum={() => null}
            />
          )
        }
      ],
      {
        initialEntries: ['/help-and-knowledge/operational-solutions']
      }
    );

    const { user, getByText, getByLabelText, queryByText } = setup(
      <RouterProvider router={router} />
    );

    // Solution visible on page one
    expect(getByText('4innovation')).toBeInTheDocument();
    expect(getByText('Chronic Conditions Warehouse')).toBeInTheDocument();
    expect(getByText('Centralized Data Exchange')).toBeInTheDocument();

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
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/operational-solutions',
          element: (
            <SolutionHelpCardGroup
              solutions={helpSolutionsArray}
              setResultsNum={() => null}
            />
          )
        }
      ],
      {
        initialEntries: ['/help-and-knowledge/operational-solutions']
      }
    );

    const { asFragment } = render(<RouterProvider router={router} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
