import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render } from '@testing-library/react';

import { helpSolutionsArray } from '../../solutionsMap';

import Timeline from '.';

describe('Operational Solutions Timeline Components', () => {
  it.each(helpSolutionsArray)(
    `matches the snapshot`,
    async solutionTimelineComponent => {
      const { asFragment } = render(
        <MemoryRouter
          initialEntries={[
            `/help-and-knowledge/operational-solutions?solution-key=${solutionTimelineComponent.key}&section=timeline`
          ]}
        >
          <Routes>
          <Route
            path="/help-and-knowledge/operational-solutions"
            element={<Timeline solution={solutionTimelineComponent}  />}
          />
        </Routes>
        </MemoryRouter>
      );

      expect(asFragment()).toMatchSnapshot(solutionTimelineComponent.name);
    }
  );
});
