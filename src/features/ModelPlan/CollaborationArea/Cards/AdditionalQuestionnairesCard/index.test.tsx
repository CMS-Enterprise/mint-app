import React from 'react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import i18next from 'i18next';
import configureMockStore from 'redux-mock-store';
import { modelID, questionnairesMockData } from 'tests/mock/general';

import { ASSESSMENT } from 'constants/jobCodes';

import AdditionalQuestionnairesCard from './index';

const mockAuthReducer = {
  isUserSet: true,
  groups: [ASSESSMENT],
  euaId: 'ABCD'
};

const mockStore = configureMockStore();
const store = mockStore({ auth: mockAuthReducer });

describe('AdditionalQuestionnairesCard', () => {
  it('renders without errors', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <AdditionalQuestionnairesCard
              modelID={modelID}
              questionnairesData={questionnairesMockData}
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
    expect(screen.getByText('1 required questionnaire')).toBeInTheDocument();
    expect(
      screen.getByText(
        i18next.t(
          'collaborationArea:additionalQuestionnairesCard.viewAllRequired'
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        i18next.t(
          'collaborationArea:additionalQuestionnairesCard.goToQuestionnaires'
        )
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
              modelID={modelID}
              questionnairesData={questionnairesMockData}
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
      `/models/${modelID}/collaboration-area/additional-questionnaires`
    );
  });
});
