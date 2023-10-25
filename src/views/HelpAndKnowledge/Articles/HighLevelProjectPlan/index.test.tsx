import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';

import { possibleSolutionsMock } from 'data/mock/solutions';
import VerboseMockedProvider from 'utils/testing/MockedProvider';

import HighLevelProjectPlan from '.';

const mocks = [...possibleSolutionsMock];

describe('High Level Project Plan Article', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(
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
    expect(asFragment()).toMatchSnapshot();
  });
});
