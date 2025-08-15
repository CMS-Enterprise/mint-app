import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import { allMTOSolutionsMock, milestoneMock, modelID } from 'tests/mock/mto';
import VerboseMockedProvider from 'tests/MockedProvider';

import MessageProvider from 'contexts/MessageContext';

import SelectSolutionForm from './index';

describe('Select a Solution form', () => {
  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/matrix',
          element: (
            <MessageProvider>
              <SelectSolutionForm />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/model-to-operations/matrix?view=solutions&hide-milestones-without-solutions=false&type=all`
        ]
      }
    );

    const { getByText, asFragment } = render(
      <VerboseMockedProvider
        mocks={[...milestoneMock(''), ...allMTOSolutionsMock]}
        addTypename={false}
      >
        <RouterProvider router={router} />
      </VerboseMockedProvider>
    );

    await waitFor(() => {
      expect(
        getByText(
          'Any added solutions will be associated with this milestone and will also appear in the solution view of your MTO.'
        )
      ).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
