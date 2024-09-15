import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';

import { helpSolutions } from '../../solutionsMap';

import Timeline from '.';

describe('Operational Solutions Timeline Components', () => {
  it.each(helpSolutions)(
    `matches the snapshot`,
    async solutionTimelineComponent => {
      const { asFragment } = render(
        <MemoryRouter
          initialEntries={[
            `/help-and-knowledge/operational-solutions?solution=${solutionTimelineComponent.route}&section=timeline`
          ]}
        >
          <Route path="/help-and-knowledge/operational-solutions">
            <Timeline solution={solutionTimelineComponent} />
          </Route>
        </MemoryRouter>
      );

      expect(asFragment()).toMatchSnapshot(solutionTimelineComponent.name);
    }
  );
});
