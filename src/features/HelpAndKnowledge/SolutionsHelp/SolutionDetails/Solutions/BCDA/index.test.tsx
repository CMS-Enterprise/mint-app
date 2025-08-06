import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render } from '@testing-library/react';
import { helpSolutions } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import { MtoCommonSolutionKey } from 'gql/generated/graphql';

import BCDATimeLine from './index';

describe('The MTOWarning component', () => {
  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/task-list/ops-eval-and-learning',
          element: (
            <BCDATimeLine solution={helpSolutions[MtoCommonSolutionKey.BCDA]} />
          )
        }
      ],
      {
        initialEntries: [
          '/help-and-knowledge/operational-solutions?solution=beneficiary-claims-data-api&section=timeline'
        ]
      }
    );

    const { asFragment } = render(<RouterProvider router={router} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
