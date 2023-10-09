import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import { possibleSolutionsMock } from 'data/mock/solutions';
import VerboseMockedProvider from 'utils/testing/MockedProvider';

import SixPagerMeeting from './index';

const mocks = [...possibleSolutionsMock];

describe('SixPagerMeeting', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <VerboseMockedProvider mocks={mocks} addTypename={false}>
          <SixPagerMeeting />
        </VerboseMockedProvider>
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
