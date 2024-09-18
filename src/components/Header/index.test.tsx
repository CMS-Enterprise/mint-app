import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
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

describe('The Header component when logged in', () => {
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

  it('renders without crashing', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <MockedProvider mocks={notificationsMock} addTypename={false}>
          <Header />
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByRole('banner')).toHaveLength(2);
    });
  });
});

describe('When logged in', () => {
  vi.mock('@okta/okta-react', () => ({
    useOktaAuth: () => {
      return {
        authState: {
          isAuthenticated: false
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

  it('displays a login button', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <MockedProvider mocks={notificationsMock} addTypename={false}>
          <Header />
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Sign In')).toBeInTheDocument();
    });
  });
});
