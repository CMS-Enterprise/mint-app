import React from 'react';
import { useTranslation } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import { GetPollNotificationsDocument } from 'gql/gen/graphql';

import NavigationBar, { navLinks } from './index';

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
            isMobile
            toggle={() => !null}
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
            isMobile
            toggle={() => !null}
            signout={() => null}
            userName="A11Y"
          />
        </MockedProvider>
      </MemoryRouter>
    );

    const { t } = useTranslation();

    navLinks().forEach(route => {
      const linkTitle = t(`header:${route.label}`);
      expect(getByText(linkTitle)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(getByTestId('has-notifications')).toBeInTheDocument();
    });
  });
});
