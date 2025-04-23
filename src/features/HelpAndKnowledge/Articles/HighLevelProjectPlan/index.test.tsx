import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import { possibleSolutionsMock } from 'tests/mock/mto';
import VerboseMockedProvider from 'tests/MockedProvider';

import HighLevelProjectPlan from '.';

const mocks = [...possibleSolutionsMock];

describe('High Level Project Plan Article', () => {
  it('matches snapshot', async () => {
    const { asFragment, getByTestId } = render(
      <MemoryRouter
        initialEntries={['/help-and-knowledge/high-level-project-plan']}
      >
        <Route path="/help-and-knowledge/high-level-project-plan">
          <VerboseMockedProvider mocks={mocks} addTypename={false}>
            <HighLevelProjectPlan />
          </VerboseMockedProvider>
        </Route>
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() => getByTestId('page-loading'));

    expect(asFragment()).toMatchSnapshot();
  });
});
