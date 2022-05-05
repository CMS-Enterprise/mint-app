import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { mount } from 'enzyme';
import { mockFlags, resetLDMocks } from 'jest-launchdarkly-mock';
import configureMockStore from 'redux-mock-store';

import UswdsReactLink from 'components/LinkWrapper';
import { ADMIN_PROD } from 'constants/jobCodes';
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

    describe('User is logged in', () => {
      it('renders the correct components', async () => {
        mockFlags({ ...defaultFlags });
        const mockStore = configureMockStore();
        const store = mockStore({ auth: mockAuthReducer });
        let component: any;
        await act(async () => {
          component = mount(
            <MemoryRouter initialEntries={['/']} initialIndex={0}>
              <MockedProvider>
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
          expect(component.find('hr').exists()).toBeTruthy();
          expect(component.find(Table).exists()).toBeTruthy();
          expect(component.text()).toContain('My draft model plans');
        });
      });
    });
  });

  describe('is a admin user', () => {
    const mockAuthReducer = {
      isUserSet: true,
      groups: [ADMIN_PROD]
    };

    describe('User is logged in', () => {
      it('renders the correct components', async () => {
        mockFlags({ ...defaultFlags });
        const mockStore = configureMockStore();
        const store = mockStore({ auth: mockAuthReducer });
        let component: any;
        await act(async () => {
          component = mount(
            <MemoryRouter initialEntries={['/']} initialIndex={0}>
              <MockedProvider>
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
          expect(component.find('hr').exists()).toBeTruthy();
          expect(component.find(Table).exists()).toBeTruthy();
          expect(component.text()).toContain('Draft model plans');
        });
      });
    });
  });
});
