import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { act, render, screen, waitFor } from '@testing-library/react';
import {
  GetNotificationSettingsDocument,
  UserNotificationPreferenceFlag
} from 'gql/generated/graphql';
import setup from 'tests/util';

import MessageProvider from 'contexts/MessageContext';

import NotificationSettings from '.';

const notificationsSettingsMock = [
  {
    request: {
      query: GetNotificationSettingsDocument
    },
    result: {
      data: {
        currentUser: {
          notificationPreferences: {
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
            datesChangedNotificationType: null
          }
        }
      }
    }
  }
];

describe('Notification Settings Page', () => {
  it('renders without errors and unchecks an item', async () => {
    await act(async () => {
      const { user } = setup(
        <MemoryRouter initialEntries={[`/notifications/settings`]}>
          <MockedProvider mocks={notificationsSettingsMock} addTypename={false}>
            <Route path="/notifications/settings">
              <MessageProvider>
                <NotificationSettings />
              </MessageProvider>
            </Route>
          </MockedProvider>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(
          screen.getByTestId('notification-setting-email-dailyDigestComplete')
        ).toBeChecked();

        expect(
          screen.getByTestId('notification-setting-in-app-dailyDigestComplete')
        ).toBeChecked();

        expect(
          screen.getByTestId('notification-setting-email-newModelPlan')
        ).not.toBeChecked();

        expect(
          screen.getByTestId('notification-setting-email-datesChanged')
        ).not.toBeChecked();
        expect(
          screen.getByTestId('notification-setting-whichModel')
        ).toBeDisabled();
      });

      await user.click(
        screen.getByTestId('notification-setting-email-dailyDigestComplete')
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
          screen.getByTestId('notification-setting-email-newModelPlan')
        ).toBeChecked();

        expect(
          screen.getByTestId('notification-setting-email-datesChanged')
        ).toBeChecked();
        expect(
          screen.getByTestId('notification-setting-whichModel')
        ).not.toBeDisabled();
      });
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={[`/notifications/settings`]}>
        <MockedProvider mocks={notificationsSettingsMock} addTypename={false}>
          <Route path="/notifications/settings">
            <MessageProvider>
              <NotificationSettings />
            </MessageProvider>
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('notification-setting-email-dailyDigestComplete')
      ).toBeChecked();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
