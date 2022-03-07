import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import {
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import configureMockStore from 'redux-mock-store';

import { MessageProvider } from 'hooks/useMessage';
import GetAccessibilityRequestQuery from 'queries/GetAccessibilityRequestQuery';

import New from './index';

describe('NewDocument page', () => {
  const mockStore = configureMockStore();
  const defaultStore = mockStore({
    auth: {
      euaId: 'AAAA'
    }
  });

  const default508RequestQuery = {
    request: {
      query: GetAccessibilityRequestQuery,
      variables: {
        id: 'a11yRequest123'
      }
    },
    result: {
      data: {
        accessibilityRequest: {
          id: 'a11yRequest123',
          euaUserId: 'ABCD',
          submittedAt: new Date().toISOString(),
          name: 'My Special Request',
          system: {
            name: 'TACO',
            lcid: '123456',
            businessOwner: { name: 'Clark Kent', component: 'OIT' }
          },
          documents: [],
          testDates: [],
          statusRecord: {
            status: 'OPEN'
          }
        }
      }
    }
  };

  const buildProviders = (mocks: any, store: any) => (
    <MemoryRouter
      initialEntries={['/508/requests/a11yRequest123/documents/new']}
    >
      <MockedProvider mocks={mocks} addTypename={false}>
        <Provider store={store}>
          <Route path="/508/requests/:accessibilityRequestId/documents/new">
            <MessageProvider>
              <New />
            </MessageProvider>
          </Route>
        </Provider>
      </MockedProvider>
    </MemoryRouter>
  );

  it('renders without errors', async () => {
    render(buildProviders([default508RequestQuery], defaultStore));

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(
      screen.getByRole('heading', {
        name: 'Upload a document to My Special Request',
        level: 1
      })
    ).toBeInTheDocument();
  });

  it('renders RequestDeleted component when request is deleted', async () => {
    const deleted508RequestQuery = {
      request: {
        query: GetAccessibilityRequestQuery,
        variables: {
          id: 'a11yRequest123'
        }
      },
      result: {
        data: {
          accessibilityRequest: {
            id: 'a11yRequest123',
            euaUserId: 'ABCD',
            submittedAt: new Date().toISOString(),
            name: 'My Special Request',
            system: {
              name: 'TACO',
              lcid: '123456',
              businessOwner: { name: 'Clark Kent', component: 'OIT' }
            },
            documents: [],
            testDates: [],
            statusRecord: {
              status: 'DELETED'
            }
          }
        }
      }
    };

    render(buildProviders([deleted508RequestQuery], defaultStore));

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /The request you are looking for was deleted./i
      })
    ).toBeInTheDocument();
  });
});
