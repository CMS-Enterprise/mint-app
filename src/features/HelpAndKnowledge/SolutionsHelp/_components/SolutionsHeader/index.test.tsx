import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render } from '@testing-library/react';

import { helpSolutions } from '../../solutionsMap';

import SolutionsHeader from './index';

describe('Operation Solution Help Header', () => {
  it('rendered correct information without query', () => {
    const resultsNum = 9;
    const resultsMax = Object.keys(helpSolutions).length;

    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/operational-solutions',
          element: (
            <SolutionsHeader
              resultsNum={resultsNum}
              resultsMax={resultsMax}
              setQuery={(query: string) => null}
              query=""
            />
          )
        }
      ],
      {
        initialEntries: ['/help-and-knowledge/operational-solutions']
      }
    );

    const { getByText } = render(<RouterProvider router={router} />);

    // Page results info - dynamically constructed based on props
    expect(
      getByText(`Showing ${resultsNum} of ${resultsMax} operational solutions`)
    ).toBeInTheDocument();
  });

  it('rendered correct information with query', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/operational-solutions',
          element: (
            <SolutionsHeader
              resultsNum={1}
              resultsMax={Object.keys(helpSolutions).length}
              setQuery={(query: string) => null}
              query="4inn"
            />
          )
        }
      ],
      {
        initialEntries: ['/help-and-knowledge/operational-solutions']
      }
    );

    const { getByText } = render(<RouterProvider router={router} />);

    // Page results info
    expect(getByText('Showing 1 operational solution for')).toBeInTheDocument();
    expect(getByText('"4inn"')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/operational-solutions',
          element: (
            <SolutionsHeader
              resultsNum={9}
              resultsMax={Object.keys(helpSolutions).length}
              setQuery={(query: string) => null}
              query=""
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
