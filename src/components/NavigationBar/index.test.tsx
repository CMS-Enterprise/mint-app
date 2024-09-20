import React from 'react';
import { useTranslation } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import { GetPollNotificationsDocument } from 'gql/generated/graphql';

import NavigationBar, { getActiveTab, navLinks } from './index';

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

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: String) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {})
      }
    };
  }
}));

vi.mock('launchdarkly-react-client-sdk', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useFlags: () => {
    return {
      systemProfile: true,
      help: true,
      notificationsEnabled: true
    };
  }
}));

describe('The NavigationBar component', () => {
  it('renders without errors', async () => {
    const { getByTestId } = render(
      <MemoryRouter initialEntries={['/']}>
        <MockedProvider mocks={notificationsMock} addTypename={false}>
          <NavigationBar
            expandMobileSideNav={() => null}
            isMobile
            signout={() => null}
            userName="A11Y"
          />
        </MockedProvider>
      </MemoryRouter>
    );

    expect(getByTestId('navigation-bar')).toBeInTheDocument();
  });

  it('displays every navigation element', async () => {
    const { getByText, getByTestId } = render(
      <MemoryRouter initialEntries={['/system/making-a-request']}>
        <MockedProvider mocks={notificationsMock} addTypename={false}>
          <NavigationBar
            expandMobileSideNav={() => null}
            isMobile
            signout={() => null}
            userName="A11Y"
          />
        </MockedProvider>
      </MemoryRouter>
    );

    const { t } = useTranslation();

    navLinks.forEach(route => {
      const linkTitle = t(`header:${route.label}`);
      expect(getByText(linkTitle)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(getByTestId('has-notifications')).toBeInTheDocument();
    });
  });
});

describe('getActiveTab', () => {
  it('should return true for the home route when pathname is the home route', () => {
    const route = '/';
    const pathname = '/';
    expect(getActiveTab(route, pathname)).toBe(true);
  });

  it('should return true for the home route when pathname includes a home route', () => {
    const route = '/';
    const pathname = '/collaboration-area/123';
    expect(getActiveTab(route, pathname)).toBe(true);
  });

  it('should return false for the home route when pathname does not match or include a home route', () => {
    const route = '/';
    const pathname = '/other-route';
    expect(getActiveTab(route, pathname)).toBe(false);
  });

  it('should return true when currentBaseRoute matches baseRoute and pathname does not include any home routes', () => {
    const route = '/some-route';
    const pathname = '/some-route/123';
    expect(getActiveTab(route, pathname)).toBe(true);
  });

  it('should return false when currentBaseRoute does not match baseRoute', () => {
    const route = '/some-route';
    const pathname = '/different-route/123';
    expect(getActiveTab(route, pathname)).toBe(false);
  });

  it('should return false when pathname includes a home route', () => {
    const route = '/some-route';
    const pathname = '/collaboration-area/123';
    expect(getActiveTab(route, pathname)).toBe(false);
  });
});
