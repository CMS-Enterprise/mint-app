import React from 'react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import { modelID, questionnairesMock } from 'tests/mock/general';

import { ASSESSMENT } from 'constants/jobCodes';

import AdditionalQuestionnaires from './index';

const mockAuthAssessment = {
  isUserSet: true,
  groups: [ASSESSMENT],
  euaId: 'ABCD'
};

const mockStore = configureMockStore();
const store = mockStore({ auth: mockAuthAssessment });

describe('AdditionalQuestionnaires', () => {
  it('renders without errors', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/additional-questionnaires',
          element: <AdditionalQuestionnaires />
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/additional-questionnaires`
        ]
      }
    );

    render(
      <MockedProvider mocks={questionnairesMock}>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: 'Additional questionnaires'
        })
      ).toBeInTheDocument();
    });
    expect(screen.getByText('Data exchange approach')).toBeInTheDocument();
    expect(screen.getByText('4i and ACO-OS')).toBeInTheDocument();
    expect(
      screen.getByTestId('about-completing-data-exchange')
    ).toBeInTheDocument();
  });

  it('match snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/additional-questionnaires',
          element: <AdditionalQuestionnaires />
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/additional-questionnaires`
        ]
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={questionnairesMock}>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: 'Additional questionnaires'
        })
      ).toBeInTheDocument();
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
