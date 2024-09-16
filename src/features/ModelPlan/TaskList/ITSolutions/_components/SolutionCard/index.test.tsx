import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import {
  render,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import { OperationalSolutionKey } from 'gql/generated/graphql';
import { possibleSolutionsMock } from 'tests/mock/solutions';

import VerboseMockedProvider from 'utils/testing/MockedProvider';

import SolutionCard, { SolutionCardType } from '.';

const modelID = 'ce3405a0-3399-4e3a-88d7-3cfc613d2905';
const operationalNeedID = 'f92a8a35-86de-4e03-a81a-bd8bec2e30e3';

const solution: SolutionCardType = {
  __typename: 'OperationalSolution',
  id: '9d3b71c0-2bd0-4390-a40f-9f6befe8e83e',
  name: 'Research, Measurement, Assessment, Design, and Analysis',
  key: OperationalSolutionKey.RMADA,
  pocName: 'Alicia Thomas',
  pocEmail: 'at.mint@oddball.io',
  isOther: false,
  isCommonSolution: true,
  otherHeader: null,
  needed: true,
  nameOther: null
};

const mocks = [...possibleSolutionsMock];

describe('Operational Solutions SolutionCard', () => {
  it('renders default card correctly', async () => {
    const { getByText, getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/collaboration-area/task-list/it-solutions/${operationalNeedID}/solution-implementation-details`
        ]}
      >
        <Route path="/models/:modelID/collaboration-area/task-list/it-solutions/:operationalNeedID/solution-implementation-details">
          <VerboseMockedProvider mocks={mocks} addTypename={false}>
            <SolutionCard solution={solution} />
          </VerboseMockedProvider>
        </Route>
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() => getByTestId('spinner'));

    await waitFor(() => {
      expect(
        getByText('Research, Measurement, Assessment, Design, and Analysis')
      ).toBeInTheDocument();
      expect(getByText('Alicia Thomas')).toBeInTheDocument();
      expect(getByText('at.mint@oddball.io')).toBeInTheDocument();
    });
  });

  it('renders custom card correctly', async () => {
    const { getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/collaboration-area/task-list/it-solutions/${operationalNeedID}/solution-implementation-details`
        ]}
      >
        <Route path="/models/:modelID/collaboration-area/task-list/it-solutions/:operationalNeedID/solution-implementation-details">
          <VerboseMockedProvider mocks={mocks} addTypename={false}>
            <SolutionCard solution={solution} addingCustom />
          </VerboseMockedProvider>
        </Route>
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() => getByTestId('spinner'));

    await waitFor(() => {
      expect(getByTestId('custom-solution-card')).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const { asFragment, getByText, getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/collaboration-area/task-list/it-solutions/${operationalNeedID}/solution-implementation-details`
        ]}
      >
        <Route path="/models/:modelID/collaboration-area/task-list/it-solutions/:operationalNeedID/solution-implementation-details">
          <VerboseMockedProvider mocks={mocks} addTypename={false}>
            <SolutionCard solution={solution} />
          </VerboseMockedProvider>
        </Route>
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() => getByTestId('spinner'));

    await waitFor(() => {
      expect(
        getByText('Research, Measurement, Assessment, Design, and Analysis')
      ).toBeInTheDocument();
      expect(getByText('Alicia Thomas')).toBeInTheDocument();
      expect(getByText('at.mint@oddball.io')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
