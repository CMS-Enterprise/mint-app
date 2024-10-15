import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import { possibleSolutionsMock } from 'tests/mock/solutions';
import VerboseMockedProvider from 'tests/MockedProvider';

import TwoPagerMeeting from './index';

const mocks = [...possibleSolutionsMock];

describe('TwoPagerMeeting', () => {
  it('matches the snapshot', async () => {
    const { asFragment, getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          '/help-and-knowledge/about-2-page-concept-papers-and-review-meetings'
        ]}
      >
        <Route path="/help-and-knowledge/about-2-page-concept-papers-and-review-meetings">
          <VerboseMockedProvider mocks={mocks} addTypename={false}>
            <TwoPagerMeeting />
          </VerboseMockedProvider>
        </Route>
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() => getByTestId('page-loading'));

    expect(asFragment()).toMatchSnapshot();
  });
});
