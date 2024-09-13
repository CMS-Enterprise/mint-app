import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { GetPollNotificationsDocument } from 'gql/gen/graphql';

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
    render(
      <MemoryRouter initialEntries={['/']}>
        <MockedProvider mocks={notificationsMock} addTypename={false}>
          <Header />
        </MockedProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  describe('When logged in', () => {
    it('displays a login button', async () => {
      render(
        <MemoryRouter initialEntries={['/pre-decisional-notice']}>
          <MockedProvider mocks={notificationsMock} addTypename={false}>
            <Header />
          </MockedProvider>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('login-button')).toBeInTheDocument();
      });
    });
  });
});
