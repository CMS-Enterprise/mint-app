import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';

import { ASSESSMENT } from 'constants/jobCodes';
import { MessageProvider } from 'hooks/useMessage';
import GetModelPlan from 'queries/GetModelPlan';
import {
  CMMIGroup,
  CMSCenter,
  ModelCategory,
  ModelStatus
} from 'types/graphql-global-types';

import { DocumentsContent } from './index';

const mocks = [
  {
    request: {
      query: GetModelPlan,
      variables: { id: 'f11eb129-2c80-4080-9440-439cbe1a286f' }
    },
    result: {
      data: {
        modelPlan: {
          modelName: 'My excellent plan that I just initiated',
          __typename: 'ModelPlan',
          id: 'f11eb129-2c80-4080-9440-439cbe1a286f',
          status: ModelStatus.PLAN_DRAFT,
          modelCategory: ModelCategory.PRIMARY_CARE_TRANSFORMATION,
          cmmiGroups: [
            CMMIGroup.STATE_INNOVATIONS_GROUP,
            CMMIGroup.POLICY_AND_PROGRAMS_GROUP
          ],
          cmsCenters: [CMSCenter.CENTER_FOR_MEDICARE, CMSCenter.OTHER],
          cmsOther: 'The Center for Awesomeness ',
          archived: false,
          basics: null,
          documents: []
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

describe('Model Plan Documents page', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/f11eb129-2c80-4080-9440-439cbe1a286f/documents'
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Provider store={store}>
            <MessageProvider>
              <Route path="/models/:modelID/documents">
                <DocumentsContent />
              </Route>
            </MessageProvider>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
