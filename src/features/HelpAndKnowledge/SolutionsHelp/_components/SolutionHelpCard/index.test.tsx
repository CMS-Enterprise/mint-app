import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
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
    const { getByText } = render(
      <MemoryRouter
        initialEntries={['/help-and-knowledge/operational-solutions']}
      >
        <Route path="/help-and-knowledge/operational-solutions">
          <VerboseMockedProvider mocks={mocks} addTypename={false}>
            <SolutionHelpCard solution={solutionToTest} />
          </VerboseMockedProvider>
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
          <VerboseMockedProvider mocks={mocks} addTypename={false}>
            <SolutionHelpCard solution={solutionToTest} />
          </VerboseMockedProvider>
        </Route>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
