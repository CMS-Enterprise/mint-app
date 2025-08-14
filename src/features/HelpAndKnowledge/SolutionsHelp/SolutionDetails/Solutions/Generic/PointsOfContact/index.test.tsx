import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';
import { helpSolutionsArray } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import { possibleSolutionsMock } from 'tests/mock/mto';
import VerboseMockedProvider from 'tests/MockedProvider';

import PointsOfContact from '.';

const mocks = [...possibleSolutionsMock];

describe('Generic Points of Contact Components', () => {
  it.each(helpSolutionsArray)(
    `matches the snapshot`,
    async solutionPoCComponent => {
      const { asFragment } = render(
        <MemoryRouter
          initialEntries={[
            `/help-and-knowledge/operational-solutions?solution-key=${solutionPoCComponent.key}&section=points-of-contact`
          ]}
        >
          <Route path="/help-and-knowledge/operational-solutions">
            <VerboseMockedProvider mocks={mocks} addTypename={false}>
              <PointsOfContact solution={solutionPoCComponent} />
            </VerboseMockedProvider>
          </Route>
        </MemoryRouter>
      );
      expect(asFragment()).toMatchSnapshot(solutionPoCComponent.name);
    }
  );
});
