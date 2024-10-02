import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';
import { possibleSolutionsMock } from 'tests/mock/solutions';
import VerboseMockedProvider from 'tests/MockedProvider';

import TwoPagerMeeting from './index';

const mocks = [...possibleSolutionsMock];

describe('TwoPagerMeeting', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
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
    expect(asFragment()).toMatchSnapshot();
  });
});
