import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { mount } from 'enzyme';
import { ModelPlanFilter } from 'gql/gen/graphql';
import configureMockStore from 'redux-mock-store';

import UswdsReactLink from 'components/LinkWrapper';
import { ASSESSMENT } from 'constants/jobCodes';
import { modelPlanCollectionMock } from 'data/mock/general';
import { MessageProvider } from 'hooks/useMessage';
import Table from 'views/ModelPlan/Table';

import Home from './index';

vi.mock('@okta/okta-react', () => ({
  useOktaAuth: () => {
    return {
      authState: {
        isAuthenticated: true
      },
      oktaAuth: {
        getUser: async () => {},
        logout: async () => {}
      }
    };
  }
}));

describe('The home page', () => {
  describe('is a basic user', () => {
    const mockAuthReducer = {
      isUserSet: true,
      groups: []
    };

    describe('User is logged in', () => {
      it('renders the correct components', async () => {
        const mockStore = configureMockStore();
        const store = mockStore({ auth: mockAuthReducer });
        let component: any;
        await act(async () => {
          component = mount(
            <MemoryRouter initialEntries={['/']} initialIndex={0}>
              <MockedProvider
                mocks={[
                  ...modelPlanCollectionMock(ModelPlanFilter.INCLUDE_ALL),
                  ...modelPlanCollectionMock(ModelPlanFilter.COLLAB_ONLY)
                ]}
                addTypename={false}
              >
                <Provider store={store}>
                  <MessageProvider>
                    <Home />
                  </MessageProvider>
                </Provider>
              </MockedProvider>
            </MemoryRouter>
          );

          component.update();
          expect(component.find(UswdsReactLink).exists()).toEqual(true);
          expect(component.find(Table).exists()).toBeTruthy();
          expect(component.text()).toContain('My model plans');
        });
      });
    });
  });

  describe('is a admin user', () => {
    const mockAuthReducer = {
      isUserSet: true,
      groups: [ASSESSMENT]
    };

    describe('User is logged in', () => {
      it('renders the correct components', async () => {
        const mockStore = configureMockStore();
        const store = mockStore({ auth: mockAuthReducer });
        let component: any;
        await act(async () => {
          component = mount(
            <MemoryRouter initialEntries={['/']} initialIndex={0}>
              <MockedProvider
                mocks={[
                  ...modelPlanCollectionMock(ModelPlanFilter.INCLUDE_ALL),
                  ...modelPlanCollectionMock(ModelPlanFilter.COLLAB_ONLY)
                ]}
                addTypename={false}
              >
                <Provider store={store}>
                  <MessageProvider>
                    <Home />
                  </MessageProvider>
                </Provider>
              </MockedProvider>
            </MemoryRouter>
          );

          component.update();
          expect(component.find(UswdsReactLink).exists()).toEqual(true);
          expect(component.find(Table).exists()).toBeTruthy();
          const header = component.find('h2').at(1).text();
          expect(header).toContain('All model plans');
        });
      });
    });
  });
});
