import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import { possibleSolutionsMock } from 'tests/mock/solutions';

import VerboseMockedProvider from 'utils/testing/MockedProvider';

import SixPagerMeeting from './index';

const mocks = [...possibleSolutionsMock];

describe('SixPagerMeeting', () => {
  it('matches the snapshot', async () => {
    const { asFragment, getByTestId } = render(
      <MemoryRouter>
        <VerboseMockedProvider mocks={mocks} addTypename={false}>
          <SixPagerMeeting />
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() => getByTestId('page-loading'));

    expect(asFragment()).toMatchSnapshot();
  });
});
