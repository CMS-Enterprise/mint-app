import React from 'react';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import { mount, shallow } from 'enzyme';
import { GetPollNotificationsDocument } from 'gql/generated/graphql';

import Header from './index';

const notificationsMock = [
  {
    request: {
      query: GetPollNotificationsDocument
    },
    result: {
      data: {
        currentUser: {
          notifications: {
            numUnreadNotifications: 1
          }
        }
      }
    }
  }
];

vi.mock('@okta/okta-react', () => ({
  useOktaAuth: () => {
    return {
      authState: {
        isAuthenticated: true
      },
      oktaAuth: {
        getUser: async () => ({
          name: 'John Doe'
        }),
        logout: async () => {}
      }
    };
  }
}));

describe('The Header component', () => {
  it('renders without crashing', () => {
    shallow(
      <MemoryRouter initialEntries={['/']}>
        <MockedProvider mocks={notificationsMock} addTypename={false}>
          <Header />
        </MockedProvider>
      </MemoryRouter>
    );
  });

  describe('When logged in', () => {
    it('displays a login button', async () => {
      const { getByTestId } = render(
        <MemoryRouter initialEntries={['/pre-decisional-notice']}>
          <MockedProvider mocks={notificationsMock} addTypename={false}>
            <Header />
          </MockedProvider>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(getByTestId('signout-link')).toHaveTextContent('Sign Out');
      });
    });

    test.skip('displays the users name', async done => {
      let component: any;
      await act(async () => {
        component = mount(
          <MemoryRouter>
            <MockedProvider mocks={notificationsMock} addTypename={false}>
              <Header />
            </MockedProvider>
          </MemoryRouter>
        );
      });
      setImmediate(() => {
        component.update();
        expect(component.text().includes('John Doe')).toBe(true);
        done();
      });
    });
  });
});
