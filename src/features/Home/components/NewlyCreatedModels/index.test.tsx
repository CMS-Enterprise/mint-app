import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  GetNewlyCreatedModelPlansDocument,
  GetNotificationSettingsDocument,
  GetNotificationSettingsQuery,
  GetNotificationSettingsQueryVariables,
  UserNotificationPreferenceFlag
} from 'gql/generated/graphql';
import setup from 'tests/util';

import NewlyCreatedModels from './index';

const createMockModelPlan = (
  id: string,
  name: string,
  createdDts: string,
  modifiedDts?: string | null,
  discussionsCount: number = 0
) => ({
  __typename: 'ModelPlan' as const,
  id,
  modelName: name,
  abbreviation: null,
  createdDts,
  modifiedDts,
  discussions: Array.from({ length: discussionsCount }, (_, i) => ({
    __typename: 'PlanDiscussion' as const,
    id: `discussion-${id}-${i}`
  }))
});

// Notification Settings Mocks
const mockNotificationSettingsWithInApp: MockedResponse<
  GetNotificationSettingsQuery,
  GetNotificationSettingsQueryVariables
>[] = [
  {
    request: {
      query: GetNotificationSettingsDocument
    },
    result: {
      data: {
        __typename: 'Query',
        currentUser: {
          __typename: 'CurrentUser',
          leadModelPlanCount: 0,
          notificationPreferences: {
            __typename: 'UserNotificationPreferences',
            id: 'pref-123',
            dailyDigestComplete: [],
            addedAsCollaborator: [UserNotificationPreferenceFlag.EMAIL],
            taggedInDiscussion: [],
            taggedInDiscussionReply: [],
            newDiscussionAdded: [],
            newDiscussionReply: [],
            modelPlanShared: [],
            newModelPlan: [
              UserNotificationPreferenceFlag.IN_APP,
              UserNotificationPreferenceFlag.EMAIL
            ],
            datesChanged: [],
            newDiscussionAddedNotificationType: null,
            datesChangedNotificationType: null,
            dataExchangeApproachMarkedComplete: [],
            dataExchangeApproachMarkedCompleteNotificationType: null,
            incorrectModelStatus: [],
            iddocQuestionnaireComplete: [],
            iddocQuestionnaireCompletedNotificationType: null
          }
        }
      }
    }
  }
];

const mockNotificationSettingsWithoutInApp: MockedResponse<
  GetNotificationSettingsQuery,
  GetNotificationSettingsQueryVariables
>[] = [
  {
    request: {
      query: GetNotificationSettingsDocument
    },
    result: {
      data: {
        __typename: 'Query',
        currentUser: {
          __typename: 'CurrentUser',
          leadModelPlanCount: 0,
          notificationPreferences: {
            __typename: 'UserNotificationPreferences',
            id: 'pref-123',
            dailyDigestComplete: [],
            addedAsCollaborator: [UserNotificationPreferenceFlag.EMAIL],
            taggedInDiscussion: [],
            taggedInDiscussionReply: [],
            newDiscussionAdded: [],
            newDiscussionReply: [],
            modelPlanShared: [],
            newModelPlan: [UserNotificationPreferenceFlag.EMAIL], // No IN_APP
            datesChanged: [],
            newDiscussionAddedNotificationType: null,
            datesChangedNotificationType: null,
            dataExchangeApproachMarkedComplete: [],
            dataExchangeApproachMarkedCompleteNotificationType: null,
            incorrectModelStatus: [],
            iddocQuestionnaireComplete: [],
            iddocQuestionnaireCompletedNotificationType: null
          }
        }
      }
    }
  }
];

const mockNotificationSettingsEmpty: MockedResponse<
  GetNotificationSettingsQuery,
  GetNotificationSettingsQueryVariables
>[] = [
  {
    request: {
      query: GetNotificationSettingsDocument
    },
    result: {
      data: {
        __typename: 'Query',
        currentUser: {
          __typename: 'CurrentUser',
          leadModelPlanCount: 0,
          notificationPreferences: {
            __typename: 'UserNotificationPreferences',
            id: 'pref-123',
            dailyDigestComplete: [],
            addedAsCollaborator: [],
            taggedInDiscussion: [],
            taggedInDiscussionReply: [],
            newDiscussionAdded: [],
            newDiscussionReply: [],
            modelPlanShared: [],
            newModelPlan: [], // Empty array
            datesChanged: [],
            newDiscussionAddedNotificationType: null,
            datesChangedNotificationType: null,
            dataExchangeApproachMarkedComplete: [],
            dataExchangeApproachMarkedCompleteNotificationType: null,
            incorrectModelStatus: [],
            iddocQuestionnaireComplete: [],
            iddocQuestionnaireCompletedNotificationType: null
          }
        }
      }
    }
  }
];

// Model Plans Mocks
const mockWithMultipleModels = [
  {
    request: {
      query: GetNewlyCreatedModelPlansDocument
    },
    result: {
      data: {
        __typename: 'Query' as const,
        modelPlanCollection: [
          createMockModelPlan(
            'model-1',
            'Innovative Care Model',
            '2024-10-01T10:00:00Z',
            '2024-10-15T14:30:00Z',
            3
          ),
          createMockModelPlan(
            'model-2',
            'Value-Based Care Initiative',
            '2024-09-15T08:00:00Z',
            null,
            0
          ),
          createMockModelPlan(
            'model-3',
            'Primary Care First',
            '2024-08-20T12:00:00Z',
            '2024-09-01T09:00:00Z',
            1
          ),
          createMockModelPlan(
            'model-4',
            'Enhanced Oncology Model',
            '2024-07-10T16:00:00Z',
            null,
            5
          ),
          createMockModelPlan(
            'model-5',
            'Medicare Advantage Innovation',
            '2024-06-05T11:00:00Z',
            '2024-06-20T15:00:00Z',
            2
          )
        ]
      }
    }
  },
  ...mockNotificationSettingsEmpty
];

const mockWithNoModels = [
  {
    request: {
      query: GetNewlyCreatedModelPlansDocument
    },
    result: {
      data: {
        __typename: 'Query' as const,
        modelPlanCollection: []
      }
    }
  },
  ...mockNotificationSettingsEmpty
];

const mockWithFewModels = [
  {
    request: {
      query: GetNewlyCreatedModelPlansDocument
    },
    result: {
      data: {
        __typename: 'Query' as const,
        modelPlanCollection: [
          createMockModelPlan(
            'model-1',
            'Test Model',
            '2024-10-01T10:00:00Z',
            '2024-10-15T14:30:00Z',
            2
          )
        ]
      }
    }
  },
  ...mockNotificationSettingsEmpty
];

describe('NewlyCreatedModels', () => {
  it('renders heading and description', async () => {
    render(
      <MemoryRouter>
        <MockedProvider mocks={mockWithNoModels}>
          <NewlyCreatedModels />
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Newly created models')).toBeInTheDocument();
    });

    expect(
      screen.getByText(
        /Check out the models created within the last six months/
      )
    ).toBeInTheDocument();
  });

  it('shows loading spinner while fetching data', () => {
    const loadingMock = [
      {
        request: {
          query: GetNewlyCreatedModelPlansDocument
        },
        result: {
          data: {
            __typename: 'Query' as const,
            modelPlanCollection: []
          }
        },
        delay: 100
      },
      ...mockNotificationSettingsEmpty
    ];

    render(
      <MemoryRouter>
        <MockedProvider mocks={loadingMock}>
          <NewlyCreatedModels />
        </MockedProvider>
      </MemoryRouter>
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('displays alert when no models exist', async () => {
    render(
      <MemoryRouter>
        <MockedProvider mocks={mockWithNoModels}>
          <NewlyCreatedModels />
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('There are no new models.')).toBeInTheDocument();
      expect(screen.getByText('Check back later.')).toBeInTheDocument();
    });
  });

  it('displays model cards after loading', async () => {
    render(
      <MemoryRouter>
        <MockedProvider mocks={mockWithMultipleModels}>
          <NewlyCreatedModels />
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Innovative Care Model')).toBeInTheDocument();
    });

    // Should display first 3 models (pagination limit is 3)
    expect(screen.getByText('Innovative Care Model')).toBeInTheDocument();
    expect(screen.getByText('Value-Based Care Initiative')).toBeInTheDocument();
    expect(screen.getByText('Primary Care First')).toBeInTheDocument();

    // Fourth and fifth models should not be visible on first page
    expect(
      screen.queryByText('Enhanced Oncology Model')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Medicare Advantage Innovation')
    ).not.toBeInTheDocument();
  });

  it('displays created date for all models', async () => {
    render(
      <MemoryRouter>
        <MockedProvider mocks={mockWithFewModels}>
          <NewlyCreatedModels />
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Created 10\/01\/2024/)).toBeInTheDocument();
    });
  });

  it('displays updated date when available', async () => {
    render(
      <MemoryRouter>
        <MockedProvider mocks={mockWithFewModels}>
          <NewlyCreatedModels />
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Updated 10\/15\/2024/)).toBeInTheDocument();
    });
  });

  it('does not display updated date when not available', async () => {
    const mockNoUpdate = [
      {
        request: {
          query: GetNewlyCreatedModelPlansDocument
        },
        result: {
          data: {
            __typename: 'Query' as const,
            modelPlanCollection: [
              createMockModelPlan(
                'model-1',
                'Test Model',
                '2024-10-01T10:00:00Z',
                null,
                0
              )
            ]
          }
        }
      },
      ...mockNotificationSettingsEmpty
    ];

    render(
      <MemoryRouter>
        <MockedProvider mocks={mockNoUpdate}>
          <NewlyCreatedModels />
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Created 10\/01\/2024/)).toBeInTheDocument();
    });

    expect(screen.queryByText(/Updated/)).not.toBeInTheDocument();
  });

  it('displays discussion count when discussions exist', async () => {
    render(
      <MemoryRouter>
        <MockedProvider mocks={mockWithFewModels}>
          <NewlyCreatedModels />
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/2 discussions/)).toBeInTheDocument();
    });
  });

  it('displays singular discussion text for one discussion', async () => {
    const mockOneDiscussion = [
      {
        request: {
          query: GetNewlyCreatedModelPlansDocument
        },
        result: {
          data: {
            __typename: 'Query' as const,
            modelPlanCollection: [
              createMockModelPlan(
                'model-1',
                'Test Model',
                '2024-10-01T10:00:00Z',
                null,
                1
              )
            ]
          }
        }
      },
      ...mockNotificationSettingsEmpty
    ];

    render(
      <MemoryRouter>
        <MockedProvider mocks={mockOneDiscussion}>
          <NewlyCreatedModels />
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/1 discussion$/)).toBeInTheDocument();
    });
  });

  it('does not display discussion count when no discussions exist', async () => {
    const mockNoDiscussions = [
      {
        request: {
          query: GetNewlyCreatedModelPlansDocument
        },
        result: {
          data: {
            __typename: 'Query' as const,
            modelPlanCollection: [
              createMockModelPlan(
                'model-1',
                'Test Model',
                '2024-10-01T10:00:00Z',
                null,
                0
              )
            ]
          }
        }
      },
      ...mockNotificationSettingsEmpty
    ];

    render(
      <MemoryRouter>
        <MockedProvider mocks={mockNoDiscussions}>
          <NewlyCreatedModels />
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Model')).toBeInTheDocument();
    });

    expect(screen.queryByText(/discussion/)).not.toBeInTheDocument();
  });

  it('renders links to model read view', async () => {
    render(
      <MemoryRouter>
        <MockedProvider mocks={mockWithFewModels}>
          <NewlyCreatedModels />
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      const link = screen.getByRole('link', { name: 'Test Model' });
      expect(link).toHaveAttribute('href', '/models/model-1/read-view');
    });
  });

  it('handles pagination correctly', async () => {
    const { user } = setup(
      <MemoryRouter>
        <MockedProvider mocks={mockWithMultipleModels}>
          <NewlyCreatedModels />
        </MockedProvider>
      </MemoryRouter>
    );

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText('Innovative Care Model')).toBeInTheDocument();
    });

    // First page should show first 3 models
    expect(screen.getByText('Innovative Care Model')).toBeInTheDocument();
    expect(screen.getByText('Value-Based Care Initiative')).toBeInTheDocument();
    expect(screen.getByText('Primary Care First')).toBeInTheDocument();
    expect(
      screen.queryByText('Enhanced Oncology Model')
    ).not.toBeInTheDocument();

    // Navigate to next page
    const nextButton = screen.getByRole('button', { name: /Next/i });
    await user.click(nextButton);

    // Second page should show next 2 models
    await waitFor(() => {
      expect(screen.getByText('Enhanced Oncology Model')).toBeInTheDocument();
    });
    expect(
      screen.getByText('Medicare Advantage Innovation')
    ).toBeInTheDocument();

    // First page models should not be visible
    expect(screen.queryByText('Innovative Care Model')).not.toBeInTheDocument();
  });

  it('does not display notification link when user has IN_APP enabled', async () => {
    const mocksWithInApp = [
      {
        request: {
          query: GetNewlyCreatedModelPlansDocument
        },
        result: {
          data: {
            __typename: 'Query' as const,
            modelPlanCollection: [
              createMockModelPlan(
                'model-1',
                'Test Model',
                '2024-10-01T10:00:00Z',
                '2024-10-15T14:30:00Z',
                2
              )
            ]
          }
        }
      },
      ...mockNotificationSettingsWithInApp
    ];

    render(
      <MemoryRouter>
        <MockedProvider mocks={mocksWithInApp}>
          <NewlyCreatedModels />
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Model')).toBeInTheDocument();
    });

    expect(
      screen.queryByText(/Get notified when a model is added to MINT/)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /Get notified/ })
    ).not.toBeInTheDocument();
  });

  it('displays notification link when user does not have IN_APP enabled', async () => {
    const mocksWithoutInApp = [
      {
        request: {
          query: GetNewlyCreatedModelPlansDocument
        },
        result: {
          data: {
            __typename: 'Query' as const,
            modelPlanCollection: [
              createMockModelPlan(
                'model-1',
                'Test Model',
                '2024-10-01T10:00:00Z',
                '2024-10-15T14:30:00Z',
                2
              )
            ]
          }
        }
      },
      ...mockNotificationSettingsWithoutInApp
    ];

    render(
      <MemoryRouter>
        <MockedProvider mocks={mocksWithoutInApp}>
          <NewlyCreatedModels />
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Model')).toBeInTheDocument();
    });

    await waitFor(() => {
      const link = screen.getByRole('link', {
        name: /Get notified when a model is added to MINT/
      });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/notifications/settings');
      expect(link).toHaveClass('margin-top-2');
    });
  });

  it('displays notification link when newModelPlan preferences are empty', async () => {
    render(
      <MemoryRouter>
        <MockedProvider mocks={mockWithFewModels}>
          <NewlyCreatedModels />
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Model')).toBeInTheDocument();
    });

    await waitFor(() => {
      const link = screen.getByRole('link', {
        name: /Get notified when a model is added to MINT/
      });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/notifications/settings');
    });
  });

  it('link navigates to notification settings page', async () => {
    const mocksWithoutInApp = [
      {
        request: {
          query: GetNewlyCreatedModelPlansDocument
        },
        result: {
          data: {
            __typename: 'Query' as const,
            modelPlanCollection: [
              createMockModelPlan(
                'model-1',
                'Test Model',
                '2024-10-01T10:00:00Z',
                '2024-10-15T14:30:00Z',
                2
              )
            ]
          }
        }
      },
      ...mockNotificationSettingsWithoutInApp
    ];

    render(
      <MemoryRouter>
        <MockedProvider mocks={mocksWithoutInApp}>
          <NewlyCreatedModels />
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      const link = screen.getByRole('link', {
        name: /Get notified when a model is added to MINT/
      });
      expect(link).toHaveAttribute('href', '/notifications/settings');
    });
  });

  it('matches snapshot with models', async () => {
    const { asFragment } = render(
      <MemoryRouter>
        <MockedProvider mocks={mockWithMultipleModels}>
          <NewlyCreatedModels />
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Innovative Care Model')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot with no models', async () => {
    const { asFragment } = render(
      <MemoryRouter>
        <MockedProvider mocks={mockWithNoModels}>
          <NewlyCreatedModels />
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('There are no new models.')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot while loading', () => {
    const loadingMock = [
      {
        request: {
          query: GetNewlyCreatedModelPlansDocument
        },
        result: {
          data: {
            __typename: 'Query' as const,
            modelPlanCollection: []
          }
        },
        delay: 100
      },
      ...mockNotificationSettingsEmpty
    ];

    const { asFragment } = render(
      <MemoryRouter>
        <MockedProvider mocks={loadingMock}>
          <NewlyCreatedModels />
        </MockedProvider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
