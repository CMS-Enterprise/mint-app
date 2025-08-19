import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';
import { possibleSolutionsMock } from 'tests/mock/mto';
import VerboseMockedProvider from 'tests/MockedProvider';

import UtilizingSolutions from '.';

const mocks = [...possibleSolutionsMock];

describe('UtilizingSolutions', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={['/help-and-knowledge/utilizing-solutions']}
      >
        <Route path="/help-and-knowledge/utilizing-solutions">
          <VerboseMockedProvider mocks={mocks} addTypename={false}>
            <UtilizingSolutions />
          </VerboseMockedProvider>
        </Route>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
