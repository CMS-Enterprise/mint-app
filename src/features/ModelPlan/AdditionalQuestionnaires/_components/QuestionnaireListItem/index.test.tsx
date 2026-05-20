import React from 'react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render } from '@testing-library/react';
import { DataExchangeApproachStatus } from 'gql/generated/graphql';
import configureMockStore from 'redux-mock-store';
import { modelID } from 'tests/mock/general';

import { ASSESSMENT } from 'constants/jobCodes';
import { QuestionnaireName } from 'types/questionnaires';

import QuestionnaireListItem from './index';

const mockAuthAssessment = {
  isUserSet: true,
  groups: [ASSESSMENT],
  euaId: 'ABCD'
};

const mockStore = configureMockStore();
const store = mockStore({ auth: mockAuthAssessment });

const mockProps = {
  status: DataExchangeApproachStatus.READY,
  questionnaireName: 'dataExchangeApproach' as QuestionnaireName
};

describe('QuestionnaireListItem', () => {
  it('match snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/additional-questionnaires',
          element: <QuestionnaireListItem {...mockProps} />
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/additional-questionnaires`
        ]
      }
    );

    const { asFragment } = render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
