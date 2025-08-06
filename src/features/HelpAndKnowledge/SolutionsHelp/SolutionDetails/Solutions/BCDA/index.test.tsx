import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render } from '@testing-library/react';
import { helpSolutions } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import { MtoCommonSolutionKey } from 'gql/generated/graphql';

import BCDATimeLine from './index';

describe('The MTOWarning component', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/help-and-knowledge/operational-solutions?solution=beneficiary-claims-data-api&section=timeline'
        ]}
      >
        <Routes>
          <Route
            path="/models/:modelID/collaboration-area/task-list/ops-eval-and-learning"
            element={<BCDATimeLine solution={helpSolutions[MtoCommonSolutionKey.BCDA]}  />}
          />
        </Routes>
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
