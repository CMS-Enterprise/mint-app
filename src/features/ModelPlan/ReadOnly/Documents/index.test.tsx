import React from 'react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  DocumentType,
  GetModelPlanDocumentsDocument
} from 'gql/generated/graphql';
import configureMockStore from 'redux-mock-store';

import { ASSESSMENT } from 'constants/jobCodes';
import MessageProvider from 'contexts/MessageContext';

import ReadOnlyDocuments from './index';

const modelID = 'ce3405a0-3399-4e3a-88d7-3cfc613d2905';

const mocks = [
  {
    request: {
      query: GetModelPlanDocumentsDocument,
      variables: { id: modelID }
    },
    result: {
      data: {
        modelPlan: {
          __typename: 'ModelPlan',
          id: modelID,
          isCollaborator: true,
          documents: [
            {
              __typename: 'PlanDocument',
              id: '123',
              modelPlanID: modelID,
              fileType: null,
              bucket: null,
              fileKey: null,
              virusScanned: true,
              virusClean: true,
              restricted: false,
              fileName: 'My Document',
              fileSize: 123,
              downloadUrl: null,
              documentType: DocumentType.MARKET_RESEARCH,
              isLink: false,
              url: '',
              otherType: null,
              optionalNotes: null,
              createdDts: '2022-05-12T15:01:39.190679Z',
              numLinkedSolutions: 0
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

describe('Model Plan Documents page', () => {
  it('renders without errors', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/read-view/documents',
          element: (
            <MessageProvider>
              <ReadOnlyDocuments modelID={modelID} />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [`/models/${modelID}/read-view/documents`]
      }
    );

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Documents')).toBeInTheDocument();
      expect(
        screen.getByTestId('model-plan-documents-table')
      ).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/read-view/documents',
          element: (
            <MessageProvider>
              <ReadOnlyDocuments modelID={modelID} />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [`/models/${modelID}/read-view/documents`]
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('My Document')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
