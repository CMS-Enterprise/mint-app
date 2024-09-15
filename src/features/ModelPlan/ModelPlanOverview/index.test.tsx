import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { ModelPlanFilter } from 'gql/gen/graphql';
import configureMockStore from 'redux-mock-store';

import {
  favoritesPlanCollectionMock,
  modelPlanCollectionMock
} from 'data/mock/general';
import { MessageProvider } from 'hooks/useMessage';

import ModelPlan from './index';

const mockAuthReducer = {
  isUserSet: true,
  groups: []
};

describe('Read Only Model Plan Overivew', () => {
  const mockStore = configureMockStore();
  const store = mockStore({ auth: mockAuthReducer });

  it('renders without errors', async () => {
    render(
      <MemoryRouter initialEntries={['/models']}>
        <MockedProvider
          mocks={[
            ...modelPlanCollectionMock(ModelPlanFilter.INCLUDE_ALL, false),
            ...favoritesPlanCollectionMock(ModelPlanFilter.INCLUDE_ALL, true)
          ]}
        >
          <Route path="/models">
            <Provider store={store}>
              <MessageProvider>
                <ModelPlan />
              </MessageProvider>
            </Provider>
          </Route>
        </MockedProvider>
      </MemoryRouter>
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
