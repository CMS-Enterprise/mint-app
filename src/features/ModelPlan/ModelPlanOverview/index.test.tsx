import React from 'react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { ModelPlanFilter } from 'gql/generated/graphql';
import configureMockStore from 'redux-mock-store';
import {
  favoritesPlanCollectionMock,
  modelPlanCollectionMock
} from 'tests/mock/general';

import MessageProvider from 'contexts/MessageContext';

import ModelPlan from './index';

const mockAuthReducer = {
  isUserSet: true,
  groups: []
};

describe('Read Only Model Plan Overivew', () => {
  const mockStore = configureMockStore();
  const store = mockStore({ auth: mockAuthReducer });

  it('renders without errors', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models',
          element: (
            <Provider store={store}>
              <MessageProvider>
                <ModelPlan />
              </MessageProvider>
            </Provider>
          )
        }
      ],
      {
        initialEntries: ['/models']
      }
    );

    render(
      <MockedProvider
        mocks={[
          ...modelPlanCollectionMock(ModelPlanFilter.INCLUDE_ALL, false),
          ...favoritesPlanCollectionMock(ModelPlanFilter.INCLUDE_ALL)
        ]}
      >
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('model-plan-overview')).toBeInTheDocument();
      expect(
        screen.getByText('CMMI Models and Demonstrations')
      ).toBeInTheDocument();
      expect(screen.getByText('All models')).toBeInTheDocument();
    });
  });
});
