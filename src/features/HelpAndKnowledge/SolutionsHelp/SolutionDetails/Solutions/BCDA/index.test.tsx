import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';
import { helpSolutions } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import BCDATimeLine from './index';

describe('The MTOWarning component', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/help-and-knowledge/operational-solutions?solution=beneficiary-claims-data-api&section=timeline'
        ]}
      >
        <Route path="/models/:modelID/collaboration-area/task-list/ops-eval-and-learning">
          <BCDATimeLine solution={helpSolutions[3]} />
        </Route>
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
