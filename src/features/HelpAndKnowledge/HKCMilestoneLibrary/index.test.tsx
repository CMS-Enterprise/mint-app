import React from 'react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import { commonMilestonesLibraryMock } from 'tests/mock/mto';

import { ASSESSMENT } from 'constants/jobCodes';
import { MessageProvider } from 'hooks/useMessage';

import HKCMilestoneLibrary from '.';

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

describe('HKC Milestone library Component', () => {
  it('renders correctly and matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/milestone-library',
          element: (
            <MessageProvider>
              <HKCMilestoneLibrary />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: ['/help-and-knowledge/milestone-library']
      }
    );

    const { getByTestId, findByRole, asFragment } = render(
      <MockedProvider
        mocks={[...commonMilestonesLibraryMock]}
        addTypename={false}
      >
        <Provider store={store2}>
          <RouterProvider router={router} />
        </Provider>
      </MockedProvider>
    );

    await waitForElementToBeRemoved(() => getByTestId('page-loading'));
    await findByRole('navigation', { name: /pagination/i });

    expect(asFragment()).toMatchSnapshot();
  });

  it('does render the filter button in the HKC milestone library', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/milestone-library',
          element: (
            <MessageProvider>
              <HKCMilestoneLibrary />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: ['/help-and-knowledge/milestone-library']
      }
    );

    const { getByRole, getByTestId } = render(
      <MockedProvider
        mocks={[...commonMilestonesLibraryMock]}
        addTypename={false}
      >
        <Provider store={store2}>
          <RouterProvider router={router} />
        </Provider>
      </MockedProvider>
    );

    await waitForElementToBeRemoved(() => getByTestId('page-loading'));

    expect(getByRole('button', { name: /filter/i })).toBeInTheDocument();
  });

  it('renders the admin section in the HKC milestone library', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/milestone-library',
          element: (
            <MessageProvider>
              <HKCMilestoneLibrary />
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
        mocks={[...commonMilestonesLibraryMock]}
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
