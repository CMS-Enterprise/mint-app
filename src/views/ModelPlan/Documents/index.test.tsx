import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  DocumentType,
  GetModelPlanDocumentsDocument,
  GetModelPlanDocumentsQuery
} from 'gql/gen/graphql';
import configureMockStore from 'redux-mock-store';

import { ASSESSMENT } from 'constants/jobCodes';
import { MessageProvider } from 'hooks/useMessage';

import { DocumentsContent } from './index';

type GetModelPlanDocumentsType = GetModelPlanDocumentsQuery;

const docMock: GetModelPlanDocumentsType = {
  __typename: 'Query',
  modelPlan: {
    __typename: 'ModelPlan',
    id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
    isCollaborator: true,
    documents: [
      {
        __typename: 'PlanDocument',
        id: '07d0d06f-9ecd-42a0-ad84-bc8c8ddea084',
        virusScanned: true,
        virusClean: true,
        fileName: 'My MINT document',
        fileType: '',
        downloadUrl: '',
        restricted: false,
        documentType: DocumentType.CONCEPT_PAPER,
        createdDts: '2023-02-16T13:51:31.026147Z',
        optionalNotes: '',
        otherType: '',
        numLinkedSolutions: 1,
        isLink: false,
        url: null
      },
      {
        __typename: 'PlanDocument',
        id: '9d828454-9ecd-42a0-ad84-bc8c8ddea634',
        virusScanned: true,
        virusClean: true,
        fileName: 'Second document',
        fileType: '',
        downloadUrl: '',
        restricted: false,
        documentType: DocumentType.CONCEPT_PAPER,
        createdDts: '2023-02-16T13:51:31.026147Z',
        optionalNotes: '',
        otherType: '',
        isLink: false,
        url: null,
        numLinkedSolutions: 1
      }
    ]
  }
};

const documentMocks = [
  {
    request: {
      query: GetModelPlanDocumentsDocument,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: docMock
    }
  }
];

export default documentMocks;

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
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/documents'
        ]}
      >
        <MockedProvider mocks={documentMocks} addTypename={false}>
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

    expect(asFragment()).toMatchSnapshot();
  });
});
