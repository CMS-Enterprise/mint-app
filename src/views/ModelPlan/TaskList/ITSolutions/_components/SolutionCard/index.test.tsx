import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';

import { OperationalSolutionKey } from 'types/graphql-global-types';

import SolutionCard, { SolutionCardType } from '.';

const modelID = 'ce3405a0-3399-4e3a-88d7-3cfc613d2905';
const operationalNeedID = 'f92a8a35-86de-4e03-a81a-bd8bec2e30e3';

const solution: SolutionCardType = {
  __typename: 'OperationalSolution',
  id: '9d3b71c0-2bd0-4390-a40f-9f6befe8e83e',
  name: 'Internal staff',
  key: OperationalSolutionKey.SHARED_SYSTEMS,
  pocName: 'John Mint',
  pocEmail: 'john.mint@oddball.io',
  isOther: false,
  otherHeader: null,
  needed: true,
  nameOther: null
};

describe('IT Solutions SolutionCard', () => {
  it('renders default card correctly', async () => {
    const { getByText } = render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/solution-implementation-details`
        ]}
      >
        <Route path="/models/:modelID/task-list/it-solutions/:operationalNeedID/solution-implementation-details">
          <SolutionCard solution={solution} />
        </Route>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByText('Internal staff')).toBeInTheDocument();
      expect(getByText('John Mint')).toBeInTheDocument();
      expect(getByText('john.mint@oddball.io')).toBeInTheDocument();
    });
  });

  it('renders custom card correctly', async () => {
    const { getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/solution-implementation-details`
        ]}
      >
        <Route path="/models/:modelID/task-list/it-solutions/:operationalNeedID/solution-implementation-details">
          <SolutionCard solution={solution} addingCustom />
        </Route>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByTestId('custom-solution-card')).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/solution-implementation-details`
        ]}
      >
        <Route path="/models/:modelID/task-list/it-solutions/:operationalNeedID/solution-implementation-details">
          <SolutionCard solution={solution} />
        </Route>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
