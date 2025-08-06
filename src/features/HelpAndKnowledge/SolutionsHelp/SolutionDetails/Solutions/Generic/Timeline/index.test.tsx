import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render } from '@testing-library/react';
import { helpSolutionsArray } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import { MtoCommonSolutionKey } from 'gql/generated/graphql';

import GenericTimeline from '.';

describe('Generic Timeline Components', () => {
  it.each(helpSolutionsArray)(
    `matches the snapshot`,
    async solutionTimelineComponent => {
      if (
        solutionTimelineComponent.key !== MtoCommonSolutionKey.OUTLOOK_MAILBOX
      ) {
        const { asFragment } = render(
          <MemoryRouter
            initialEntries={[
              `/help-and-knowledge/operational-solutions?solution-key=${solutionTimelineComponent.key}&section=timeline`
            ]}
          >
            <Routes>
          <Route
            path="/help-and-knowledge/operational-solutions"
            element={<GenericTimeline solution={solutionTimelineComponent}  />}
          />
        </Routes>
          </MemoryRouter>
        );
        expect(asFragment()).toMatchSnapshot(solutionTimelineComponent.name);
      }
    }
  );
});
