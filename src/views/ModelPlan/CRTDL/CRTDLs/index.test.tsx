import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';

import { MessageProvider } from 'hooks/useMessage';
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
  }
];

describe('Model Plan CR and TDL page', () => {
  it('matches snapshot', async () => {
    const { asFragment, getByTestId } = render(
      <MemoryRouter initialEntries={[`/models/${modelID}/cr-and-tdl`]}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <MessageProvider>
            <Route path="/models/:modelID/cr-and-tdl">
              <CRTDL />
            </Route>
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByTestId('model-plan-name')).toHaveTextContent('My Plan');
    });

    await waitFor(() => {
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
