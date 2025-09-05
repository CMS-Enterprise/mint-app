import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  GetNotificationSettingsDocument,
  GetNotificationSettingsQuery,
  UserNotificationPreferenceFlag
} from 'gql/generated/graphql';
import setup from 'tests/util';

import MessageProvider from 'contexts/MessageContext';

import NotificationSettings from '.';

type NotificationPerferenceType =
  GetNotificationSettingsQuery['currentUser']['notificationPreferences'];

const notificationPreferences: NotificationPerferenceType = {
  __typename: 'UserNotificationPreferences',
  id: '123',
  dailyDigestComplete: [
    UserNotificationPreferenceFlag.EMAIL,
    UserNotificationPreferenceFlag.IN_APP
  ],
  addedAsCollaborator: [
    UserNotificationPreferenceFlag.EMAIL,
    UserNotificationPreferenceFlag.IN_APP
  ],
  taggedInDiscussion: [
    UserNotificationPreferenceFlag.EMAIL,
    UserNotificationPreferenceFlag.IN_APP
  ],
  taggedInDiscussionReply: [
    UserNotificationPreferenceFlag.EMAIL,
    UserNotificationPreferenceFlag.IN_APP
  ],
  newDiscussionReply: [
    UserNotificationPreferenceFlag.EMAIL,
    UserNotificationPreferenceFlag.IN_APP
  ],
  modelPlanShared: [
    UserNotificationPreferenceFlag.EMAIL,
    UserNotificationPreferenceFlag.IN_APP
  ],
  newModelPlan: [],
  datesChanged: [],
  datesChangedNotificationType: null,
  dataExchangeApproachMarkedComplete: [
    UserNotificationPreferenceFlag.EMAIL,
    UserNotificationPreferenceFlag.IN_APP
  ],
  dataExchangeApproachMarkedCompleteNotificationType: null,
  incorrectModelStatus: [UserNotificationPreferenceFlag.EMAIL]
};

const notificationsSettingsMock = [
  {
    request: {
      query: GetNotificationSettingsDocument
    },
    result: {
      data: {
        currentUser: {
          notificationPreferences
        }
      }
    }
  }
];

describe('Notification Settings Page', () => {
  it('renders without errors and unchecks an item', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/notifications/settings',
          element: (
            <MessageProvider>
              <NotificationSettings />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [`/notifications/settings`]
      }
    );

    const { user } = setup(
      <MockedProvider mocks={notificationsSettingsMock} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('notification-setting-email-dailyDigestComplete')
      ).toBeChecked();

      expect(
        screen.getByTestId('notification-setting-in-app-dailyDigestComplete')
      ).toBeChecked();

      expect(
        screen.getByTestId('notification-setting-email-incorrectModelStatus')
      ).toBeChecked();

      expect(
        screen.getByTestId('notification-setting-email-newModelPlan')
      ).not.toBeChecked();

      expect(
        screen.getByTestId('notification-setting-email-datesChanged')
      ).not.toBeChecked();

      expect(
        screen.getByTestId('notification-setting-whichModel-datesChanged')
      ).toBeDisabled();
    });

    await user.click(
      screen.getByTestId('notification-setting-email-dailyDigestComplete')
    );
    await user.click(
      screen.getByTestId('notification-setting-email-incorrectModelStatus')
    );
    await user.click(
      screen.getByTestId('notification-setting-email-newModelPlan')
    );
    await user.click(
      screen.getByTestId('notification-setting-email-datesChanged')
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('notification-setting-email-dailyDigestComplete')
      ).not.toBeChecked();

      expect(
        screen.getByTestId('notification-setting-email-incorrectModelStatus')
      ).not.toBeChecked();

      expect(
        screen.getByTestId('notification-setting-email-newModelPlan')
      ).toBeChecked();

      expect(
        screen.getByTestId('notification-setting-email-datesChanged')
      ).toBeChecked();
      expect(
        screen.getByTestId('notification-setting-whichModel-datesChanged')
      ).not.toBeDisabled();
    });
  });

  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/notifications/settings',
          element: (
            <MessageProvider>
              <NotificationSettings />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [`/notifications/settings`]
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={notificationsSettingsMock} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('notification-setting-email-dailyDigestComplete')
      ).toBeChecked();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
