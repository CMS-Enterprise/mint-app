import React from 'react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import {
  allMTOSolutionsMock,
  categoryMock,
  milestoneMock,
  modelID
} from 'tests/mock/mto';

import MessageProvider from 'contexts/MessageContext';

import EditMilestoneForm from '.';

const mockStore = configureMockStore([]);

describe('EditMilestoneForm', () => {
  const store = mockStore({
    auth: {
      euaId: 'TEST',
      name: 'Test User'
    }
  });

  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/matrix',
          element: (
            <MessageProvider>
              <EditMilestoneForm
                closeModal={() => {}}
                setIsDirty={() => {}}
                setCloseDestination={vi.fn()}
                setFooter={() => {}}
                submitted={{ current: false }}
              />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/model-to-operations/matrix?view=milestones&edit-milestone=123`
        ]
      }
    );

    const { asFragment } = render(
      <Provider store={store}>
        <MockedProvider
          mocks={[
            ...milestoneMock('123'),
            ...categoryMock,
            ...allMTOSolutionsMock
          ]}
          addTypename={false}
        >
          <RouterProvider router={router} />
        </MockedProvider>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Milestone 1')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
