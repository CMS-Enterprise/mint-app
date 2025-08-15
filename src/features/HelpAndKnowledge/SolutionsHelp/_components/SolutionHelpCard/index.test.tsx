import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render } from '@testing-library/react';
import { MtoCommonSolutionKey } from 'gql/generated/graphql';
import { pointsOfContact, possibleSolutionsMock } from 'tests/mock/mto';
import VerboseMockedProvider from 'tests/MockedProvider';

import { helpSolutions, HelpSolutionType } from '../../solutionsMap';

import SolutionHelpCard from './index';

const mocks = [...possibleSolutionsMock];

describe('Operation Solution Help Card', () => {
  const solutionToTest = {
    ...helpSolutions[MtoCommonSolutionKey.INNOVATION],
    pointsOfContact
  } as HelpSolutionType;

  it('rendered all correct information', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/operational-solutions',
          element: (
            <VerboseMockedProvider mocks={mocks} addTypename={false}>
              <SolutionHelpCard solution={solutionToTest} />
            </VerboseMockedProvider>
          )
        }
      ],
      {
        initialEntries: ['/help-and-knowledge/operational-solutions']
      }
    );

    const { getByText } = render(<RouterProvider router={router} />);
    expect(getByText('4innovation')).toBeInTheDocument();
    expect(
      getByText('Applications and participant interaction')
    ).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/operational-solutions',
          element: (
            <VerboseMockedProvider mocks={mocks} addTypename={false}>
              <SolutionHelpCard solution={solutionToTest} />
            </VerboseMockedProvider>
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
