import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import { MessageProvider } from 'hooks/useMessage';
import GetPlanDocumentByModelID from 'queries/Documents/GetPlanDocumentByModelID';
import { GetModelPlanDocumentByModelID_readPlanDocumentByModelID as DocumentByModelIDArrayTypes } from 'queries/Documents/types/GetModelPlanDocumentByModelID';

import ReadOnlyDocuments from './index';

const modelID = 'f11eb129-2c80-4080-9440-439cbe1a286f';

const mocks = [
  {
    request: {
      query: GetPlanDocumentByModelID,
      variables: { id: modelID }
    },
    result: {
      data: {
        readPlanDocumentByModelID: [
          {
            __typename: 'PlanDocument',
            id: '123',
            modelPlanID: modelID,
            fileType: null,
            bucket: null,
            fileKey: null,
            virusScanned: null,
            virusClean: null,
            fileName: null,
            fileSize: null,
            documentType: null,
            otherType: null,
            optionalNotes: null,
            createdDts: null
          }
        ]
      }
    }
  }
];

describe('Model Plan Documents page', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={[`/models/${modelID}/read-only/documents`]}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <MessageProvider>
            <Route path="/models/:modelID/read-only/documents">
              <ReadOnlyDocuments modelID={modelID} />
            </Route>
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('Documents')).toBeInTheDocument();
      expect(screen.getByTestId('no-documents')).toBeInTheDocument();
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
