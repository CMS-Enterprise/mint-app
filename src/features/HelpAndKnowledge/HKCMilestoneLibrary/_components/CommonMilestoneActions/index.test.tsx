import React from 'react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render, waitFor } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import { commonMilestonesMockData } from 'tests/mock/mto';

import { ASSESSMENT } from 'constants/jobCodes';

import CommonMilestoneActions from './index';

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
const storeAssessment = mockStore({ auth: mockAuthAssessment });
const storeNotAssessment = mockStore({ auth: mockAuthNotAssessment });

describe('CommonMilestoneActions', () => {
  it('renders buttons and opens edit panel for assessment team', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <CommonMilestoneActions milestone={commonMilestonesMockData[0]} />
          )
        }
      ],
      { initialEntries: ['/'] }
    );

    const { getByText } = render(
      <MockedProvider addTypename={false}>
        <Provider store={storeAssessment}>
          <RouterProvider router={router} />
        </Provider>
      </MockedProvider>
    );

    const editBtn = getByText('Edit milestone');
    expect(editBtn).toBeInTheDocument();

    fireEvent.click(editBtn);

    await waitFor(() => {
      expect(router.state.location.search).toContain('edit=true');
    });
  });

  it('opens remove confirmation modal when delete is clicked', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <CommonMilestoneActions milestone={commonMilestonesMockData[0]} />
          )
        }
      ],
      { initialEntries: ['/'] }
    );

    const { getByText } = render(
      <MockedProvider addTypename={false}>
        <Provider store={storeAssessment}>
          <RouterProvider router={router} />
        </Provider>
      </MockedProvider>
    );

    const removeBtn = getByText('Remove milestone');
    fireEvent.click(removeBtn);

    expect(
      getByText('Are you sure you want to remove this common milestone?')
    ).toBeInTheDocument();
  });

  it('automatically closes panel/clears URL if user is not assessment team', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <CommonMilestoneActions milestone={commonMilestonesMockData[0]} />
          )
        }
      ],
      { initialEntries: ['/?edit=true'] }
    );

    render(
      <MockedProvider addTypename={false}>
        <Provider store={storeNotAssessment}>
          <RouterProvider router={router} />
        </Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(router.state.location.search).not.toContain('edit=true');
    });
  });

  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <CommonMilestoneActions milestone={commonMilestonesMockData[0]} />
          )
        }
      ],
      { initialEntries: ['/'] }
    );

    const { asFragment, getByText } = render(
      <MockedProvider addTypename={false}>
        <Provider store={storeAssessment}>
          <RouterProvider router={router} />
        </Provider>
      </MockedProvider>
    );

    expect(getByText('Edit milestone')).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });
});
