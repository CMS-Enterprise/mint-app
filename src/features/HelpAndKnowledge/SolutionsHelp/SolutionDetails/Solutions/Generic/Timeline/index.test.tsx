import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';
import { helpSolutions } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import GenericTimeline from '.';

describe('Generic Timeline Components', () => {
  it.each(helpSolutions)(
    `matches the snapshot`,
    async solutionTimelineComponent => {
      if (solutionTimelineComponent.key !== 'outlookMailbox') {
        const { asFragment } = render(
          <MemoryRouter
            initialEntries={[
              `/help-and-knowledge/operational-solutions?solution=${solutionTimelineComponent.route}&section=timeline`
            ]}
          >
            <Route path="/help-and-knowledge/operational-solutions">
              <GenericTimeline solution={solutionTimelineComponent} />
            </Route>
          </MemoryRouter>
        );
        expect(asFragment()).toMatchSnapshot(solutionTimelineComponent.name);
      }
    }
  );
});
