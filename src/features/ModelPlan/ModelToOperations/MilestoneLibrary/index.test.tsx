import React from 'react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import { commonMilestonesMock, suggestedMilestonesMock } from 'tests/mock/mto';

import { ASSESSMENT } from 'constants/jobCodes';
import { MessageProvider } from 'hooks/useMessage';

import MilestoneLibrary from '.';

const mockAuthAssessment = {
  isUserSet: true,
  groups: [ASSESSMENT],
  euaId: 'ABCD'
};

const mockAuthNotAssessment = {
  isUserSet: true,
  groups: [],
  euaId: 'EFGH'
};

const mockStore = configureMockStore();
const store1 = mockStore({ auth: mockAuthAssessment });
const store2 = mockStore({ auth: mockAuthNotAssessment });

describe('MilestoneCardGroup Component', () => {
  it('renders correctly and matches snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/milestone-library',
          element: (
            <MessageProvider>
              <MilestoneLibrary />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/model-to-operations/milestone-library'
        ]
      }
    );

    const { asFragment } = render(
      <MockedProvider
        mocks={[...suggestedMilestonesMock, ...commonMilestonesMock]}
        addTypename={false}
      >
        <Provider store={store2}>
          <RouterProvider router={router} />
        </Provider>
      </MockedProvider>
    );

    // Match the snapshot
    expect(asFragment()).toMatchSnapshot();
  });

  it('does not render the filter button in the MTO milestone library', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/milestone-library',
          element: (
            <MessageProvider>
              <MilestoneLibrary />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/model-to-operations/milestone-library'
        ]
      }
    );

    render(
      <MockedProvider
        mocks={[...suggestedMilestonesMock, ...commonMilestonesMock]}
        addTypename={false}
      >
        <Provider store={store2}>
          <RouterProvider router={router} />
        </Provider>
      </MockedProvider>
    );

    expect(
      screen.queryByRole('button', { name: /filter/i })
    ).not.toBeInTheDocument();
  });

  it('does not render the admin section in the MTO milestone library', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/milestone-library',
          element: (
            <MessageProvider>
              <MilestoneLibrary />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/model-to-operations/milestone-library'
        ]
      }
    );

    render(
      <MockedProvider
        mocks={[...suggestedMilestonesMock, ...commonMilestonesMock]}
        addTypename={false}
      >
        <Provider store={store1}>
          <RouterProvider router={router} />
        </Provider>
      </MockedProvider>
    );

    expect(screen.queryByText(/Admin actions/i)).not.toBeInTheDocument();
  });

  it('renders the admin section in the HKC milestone library', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/milestone-library',
          element: (
            <MessageProvider>
              <MilestoneLibrary />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: ['/help-and-knowledge/milestone-library']
      }
    );

    const { getByText } = render(
      <MockedProvider
        mocks={[...suggestedMilestonesMock, ...commonMilestonesMock]}
        addTypename={false}
      >
        <Provider store={store1}>
          <RouterProvider router={router} />
        </Provider>
      </MockedProvider>
    );

    expect(getByText(/Admin actions/i)).toBeInTheDocument();
  });
});
