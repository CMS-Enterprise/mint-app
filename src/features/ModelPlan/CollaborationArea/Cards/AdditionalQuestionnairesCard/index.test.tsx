import React from 'react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { DataExchangeApproachStatus } from 'gql/generated/graphql';
import i18next from 'i18next';
import configureMockStore from 'redux-mock-store';

import { ASSESSMENT } from 'constants/jobCodes';

import AdditionalQuestionnairesCard, { QuestionnairesType } from './index';

const mockAuthReducer = {
  isUserSet: true,
  groups: [ASSESSMENT],
  euaId: 'ABCD'
};

const mockStore = configureMockStore();
const store = mockStore({ auth: mockAuthReducer });

const questionnairesMock: QuestionnairesType = {
  __typename: 'Questionnaires',
  dataExchangeApproach: {
    __typename: 'PlanDataExchangeApproach',
    id: '123',
    status: DataExchangeApproachStatus.IN_PROGRESS,
    modifiedDts: null,
    modifiedByUserAccount: null
  }
};

describe('AdditionalQuestionnairesCard', () => {
  it('renders without errors', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <AdditionalQuestionnairesCard
              modelID="123"
              questionnairesData={questionnairesMock}
            />
          )
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    );

    expect(
      screen.getByText(
        i18next.t('collaborationArea:additionalQuestionnairesCard.heading')
      )
    ).toBeInTheDocument();
  });

  it('renders the correct links', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <AdditionalQuestionnairesCard
              modelID="123"
              questionnairesData={questionnairesMock}
            />
          )
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    );

    expect(
      screen.getByTestId('view-all-required-questionnaires')
    ).toHaveAttribute(
      'href',
      `/models/123/collaboration-area/additional-questionnaires`
    );
  });
});
