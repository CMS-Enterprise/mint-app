import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
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
          <Route path="/help-and-knowledge/operational-solutions">
            <GenericAbout solution={solutionAboutComponent} />
          </Route>
        </MemoryRouter>
      );
      expect(asFragment()).toMatchSnapshot(solutionAboutComponent.name);
    }
  );
});
