import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { mount, ReactWrapper, shallow } from 'enzyme';
import { mockFlags, resetLDMocks } from 'jest-launchdarkly-mock';
import configureMockStore from 'redux-mock-store';

import UswdsReactLink from 'components/LinkWrapper';
import { MessageProvider } from 'hooks/useMessage';
import { Flags } from 'types/flags';
import Table from 'views/ModelPlan/Table';

import Home from './index';

const defaultFlags: Flags = {
  downgrade508Tester: false,
  downgrade508User: false,
  downgradeGovTeam: false,
  sandbox: true
} as Flags;

describe('The home page', () => {
  beforeEach(() => {
    resetLDMocks();
  });
  describe('is a basic user', () => {
    const mockAuthReducer = {
      isUserSet: true,
      groups: []
    };

    it('renders without crashing', () => {
      const mockStore = configureMockStore();
      const store = mockStore({ auth: mockAuthReducer });
      const renderComponent = () =>
        shallow(
          <MemoryRouter initialEntries={['/']} initialIndex={0}>
            <Provider store={store}>
              <MessageProvider>
                <Home />
              </MessageProvider>
            </Provider>
          </MemoryRouter>
        );
      expect(renderComponent).not.toThrow();
    });

    describe('User is logged in', () => {
      it('renders the correct components', async () => {
        mockFlags({ ...defaultFlags });
        const mockStore = configureMockStore();
        const store = mockStore({ auth: mockAuthReducer });
        let component: any;
        await act(async () => {
          component = mount(
            <MemoryRouter initialEntries={['/']} initialIndex={0}>
              <Provider store={store}>
                <MessageProvider>
                  <Home />
                </MessageProvider>
              </Provider>
            </MemoryRouter>
          );
          component.update();
          expect(component.find(UswdsReactLink).exists()).toEqual(true);
          expect(component.find('hr').exists()).toBeTruthy();
          expect(component.find(Table).exists()).toBeTruthy();
        });
      });
    });
  });
});
