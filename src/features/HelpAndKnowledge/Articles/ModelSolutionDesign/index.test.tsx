import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';
import { possibleSolutionsMock } from 'tests/mock/mto';
import VerboseMockedProvider from 'tests/MockedProvider';

import ModelSolutionDesign from '.';

const mocks = [...possibleSolutionsMock];

describe('ModelSolutionDesign', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={['/help-and-knowledge/model-and-solution-design']}
      >
        <Route path="/help-and-knowledge/model-and-solution-design">
          <VerboseMockedProvider mocks={mocks} addTypename={false}>
            <ModelSolutionDesign />
          </VerboseMockedProvider>
        </Route>
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
