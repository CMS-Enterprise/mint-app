import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';

import { ASSESSMENT } from 'constants/jobCodes';
import { MessageProvider } from 'hooks/useMessage';
import GetModelPlanDocuments from 'queries/Documents/GetModelPlanDocuments';
import { GetModelPlanDocuments as GetModelPlanDocumentsType } from 'queries/Documents/types/GetModelPlanDocuments';
import { DocumentType } from 'types/graphql-global-types';

import { DocumentsContent } from './index';

const docMock: GetModelPlanDocumentsType = {
  modelPlan: {
    __typename: 'ModelPlan',
    id: 'f11eb129-2c80-4080-9440-439cbe1a286f',
    isCollaborator: true,
    documents: [
      {
        __typename: 'PlanDocument',
        id: '123',
        virusScanned: true,
        virusClean: true,
        fileName: 'My MINT document',
        fileType: '',
        downloadUrl: '',
        restricted: false,
        documentType: DocumentType.CONCEPT_PAPER,
        createdDts: '',
        optionalNotes: '',
        otherType: ''
      }
    ]
  }
};

const mocks = [
  {
    request: {
      query: GetModelPlanDocuments,
      variables: { id: 'f11eb129-2c80-4080-9440-439cbe1a286f' }
    },
    result: {
      data: docMock
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
      expect(screen.getByText('My MINT document')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
