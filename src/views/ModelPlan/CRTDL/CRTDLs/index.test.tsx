import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';

import { ASSESSMENT } from 'constants/jobCodes';
import { MessageProvider } from 'hooks/useMessage';
import GetCRDTLs from 'queries/CRTDL/GetCRDTLs';
import GetModelPlanBase from 'queries/GetModelPlanBase';
import { TaskStatus } from 'types/graphql-global-types';

import CRTDL from '..';

const modelID = 'f11eb129-2c80-4080-9440-439cbe1a286f';

const mocks = [
  {
    request: {
      query: GetModelPlanBase,
      variables: { id: modelID }
    },
    result: {
      data: {
        modelPlan: {
          __typename: 'ModelPlan',
          id: modelID,
          modelName: 'My Plan',
          modifiedDts: '',
          status: TaskStatus.IN_PROGRESS
        }
      }
    }
  },
  {
    request: {
      query: GetCRDTLs,
      variables: { id: modelID }
    },
    result: {
      data: {
        modelPlan: {
          __typename: 'ModelPlan',
          id: modelID,
          modelName: 'My Plan',
          isCollaborator: true,
          crTdls: [
            {
              __typename: 'PlanCrTdl',
              id: '123',
              modelPlanID: modelID,
              title: 'My CR',
              idNumber: 'CR123',
              dateInitiated: '2022-07-30T05:00:00Z',
              note: 'note'
            }
          ]
        }
      }
    }
  }
];

const mockAuthReducer = {
  isUserSet: true,
  groups: [ASSESSMENT],
  euaId: 'ABCD'
};

const mockStore = configureMockStore();
const store = mockStore({ auth: mockAuthReducer });

describe('Model Plan CR and TDL page', () => {
  it('matches snapshot', async () => {
    const { asFragment, getByTestId } = render(
      <MemoryRouter initialEntries={[`/models/${modelID}/cr-and-tdl`]}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <MessageProvider>
            <Route path="/models/:modelID/cr-and-tdl">
              <Provider store={store}>
                <CRTDL />
              </Provider>
            </Route>
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByTestId('cr-tdl-table')).toHaveTextContent('My CR');
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
