import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
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
        const router = createMemoryRouter(
          [
            {
              path: '/help-and-knowledge/operational-solutions',
              element: <GenericTimeline solution={solutionTimelineComponent} />
            }
          ],
          {
            initialEntries: [
              `/help-and-knowledge/operational-solutions?solution-key=${solutionTimelineComponent.key}&section=timeline`
            ]
          }
        );

        const { asFragment } = render(<RouterProvider router={router} />);

        expect(asFragment()).toMatchSnapshot(solutionTimelineComponent.name);
      }
    }
  );
});
