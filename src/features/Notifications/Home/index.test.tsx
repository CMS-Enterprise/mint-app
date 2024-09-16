import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { act, render, screen, waitFor } from '@testing-library/react';
import { GetNotificationsDocument } from 'gql/generated/graphql';
import setup from 'tests/setup';

import { MessageProvider } from 'hooks/useMessage';

import NotificationsHome from '.';

const notificationsMock = [
  {
    request: {
      query: GetNotificationsDocument
    },
    result: {
      data: {
        currentUser: {
          notifications: {
            numUnreadNotifications: 2,
            notifications: [
              {
                __typename: 'UserNotification',
                id: '899e4490-ff42-4f95-8044-b7d5b730bde2',
                isRead: false,
                inAppSent: true,
                emailSent: true,
                createdDts: '2022-03-27T18:09:03.015689Z',
                activity: {
                  activityType: 'TAGGED_IN_DISCUSSION',
                  entityID: '279ba41b-232a-49b2-9607-a3951d301218',
                  actorID: 'ea9e9dc6-d245-44c6-99cb-417829961213',
                  actorUserAccount: {
                    commonName: 'MINT Doe'
                  },
                  metaData: {
                    __typename: 'TaggedInPlanDiscussionActivityMeta',
                    version: 0,
                    type: 'TAGGED_IN_DISCUSSION',
                    modelPlanID: '885a177f-cee4-4904-9196-4950824c3ad6',
                    modelPlan: {
                      modelName: 'Excellent Model'
                    },
                    discussionID: '279ba41b-232a-49b2-9607-a3951d301218',
                    content: 'First Notification'
                  }
                }
              },
              {
                __typename: 'UserNotification',
                id: 'a4c30d98-c4fd-47b5-b81c-57059c4c28a1',
                isRead: false,
                inAppSent: true,
                emailSent: true,
                createdDts: '2022-03-27T18:09:03.015689Z',
                activity: {
                  activityType: 'TAGGED_IN_DISCUSSION',
                  entityID: 'ccf6830b-5c20-4394-84d6-78e0c9f31ec5',
                  actorID: 'ea9e9dc6-d245-44c6-99cb-417829961213',
                  actorUserAccount: {
                    commonName: 'MINT Doe'
                  },
                  metaData: {
                    __typename: 'TaggedInPlanDiscussionActivityMeta',
                    version: 0,
                    type: 'TAGGED_IN_DISCUSSION',
                    modelPlanID: '885a177f-cee4-4904-9196-4950824c3ad6',
                    modelPlan: {
                      modelName: 'Great Model'
                    },
                    discussionID: 'ccf6830b-5c20-4394-84d6-78e0c9f31ec5',
                    content: 'Second Notification'
                  }
                }
              }
            ]
          }
        }
      }
    }
  }
];

describe('Notification Page', () => {
  it('renders without errors', async () => {
    await act(async () => {
      setup(
        <MemoryRouter initialEntries={[`/notifications`]}>
          <MockedProvider mocks={notificationsMock} addTypename={false}>
            <Route path="/notifications">
              <MessageProvider>
                <NotificationsHome />
              </MessageProvider>
            </Route>
          </MockedProvider>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('notification-index')).toBeInTheDocument();
        expect(screen.getByText(/Excellent Model/i)).toBeInTheDocument();
        expect(screen.getByText(/Second Notification/i)).toBeInTheDocument();
      });
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={[`/notifications`]}>
        <MockedProvider mocks={notificationsMock} addTypename={false}>
          <Route path="/notifications">
            <MessageProvider>
              <NotificationsHome />
            </MessageProvider>
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('notification-index')).toBeInTheDocument();
      expect(screen.getByText(/Excellent Model/i)).toBeInTheDocument();
      expect(screen.getByText(/Second Notification/i)).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
