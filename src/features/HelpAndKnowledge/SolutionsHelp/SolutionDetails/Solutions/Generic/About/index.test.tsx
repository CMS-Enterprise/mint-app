import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render } from '@testing-library/react';
import { helpSolutionsArray } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import GenericAbout from '.';

describe('Generic About Components', () => {
  it.each(helpSolutionsArray)(
    `matches the snapshot`,
    async solutionAboutComponent => {
      const { asFragment } = render(
        <MemoryRouter
          initialEntries={[
            `/help-and-knowledge/operational-solutions?solution-key=${solutionAboutComponent.key}&section=about`
          ]}
        >
          <Routes>
          <Route
            path="/help-and-knowledge/operational-solutions"
            element={<GenericAbout solution={solutionAboutComponent}  />}
          />
        </Routes>
        </MemoryRouter>
      );
      expect(asFragment()).toMatchSnapshot(solutionAboutComponent.name);
    }
  );
});
