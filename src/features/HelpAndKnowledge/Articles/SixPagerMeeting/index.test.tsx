import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import { possibleSolutionsMock } from 'tests/mock/mto';
import VerboseMockedProvider from 'tests/MockedProvider';

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
