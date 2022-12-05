import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { mount } from 'enzyme';
import { mockFlags, resetLDMocks } from 'jest-launchdarkly-mock';
import configureMockStore from 'redux-mock-store';

import UswdsReactLink from 'components/LinkWrapper';
import { ASSESSMENT } from 'constants/jobCodes';
import { MessageProvider } from 'hooks/useMessage';
import { Flags } from 'types/flags';
import Table from 'views/ModelPlan/Table';

import Home from './index';

const defaultFlags: Flags = {
  hideItLeadExperience: false
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
          expect(component.text()).toContain('Model plans');
        });
      });
    });
  });
});
