import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import {
  render,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import configureMockStore from 'redux-mock-store';

import { ASSESSMENT } from 'constants/jobCodes';
import { possibleSolutionsMock } from 'data/mock/solutions';
import { MessageProvider } from 'hooks/useMessage';
import GetOperationalSolution from 'queries/ITSolutions/GetOperationalSolution';
import { OpSolutionStatus } from 'types/graphql-global-types';
import VerboseMockedProvider from 'utils/testing/MockedProvider';
import documentMocks from 'views/ModelPlan/Documents/index.test';

import needQuestionAndAnswerMock from '../_components/NeedQuestionAndAnswer/mocks';

import LinkDocuments from '.';

const modelID = 'ce3405a0-3399-4e3a-88d7-3cfc613d2905';
const operationalNeedID = '081cb879-bd6f-4ead-b9cb-3a299de76390';
const operationalSolutionID = '081cb879-bd6f-4ead-b9cb-3a299de76390';

const operationalSolution = {
  __typename: 'OperationalSolution',
  id: operationalSolutionID,
  name: null,
  key: null,
  needed: true,
  pocName: 'John Doe',
  pocEmail: 'j.doe@oddball.io',
  nameOther: 'My custom solution',
  isCommonSolution: true,
  isOther: false,
  otherHeader: null,
  status: OpSolutionStatus.COMPLETED,
  documents: [
    {
      id: '07d0d06f-9ecd-42a0-ad84-bc8c8ddea084',
      virusScanned: false,
      virusClean: false,
      fileName: 'My MINT document',
      fileType: 'application/pdf',
      downloadUrl:
        'http://minio:9005/mint-app-file-uploads/636c77fd-b8cb-4660-ab1d-07f8fa574a08?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20',
      restricted: false,
      documentType: 'ICIP_DRAFT',
      createdDts: '2023-02-16T13:51:31.026147Z',
      numLinkedSolutions: 0,
      isOther: false,
      otherHeader: null,
      optionalNotes: null,
      otherType: null,
      __typename: 'PlanDocument'
    }
  ],
  mustFinishDts: '2022-05-12T15:01:39.190679Z',
  mustStartDts: '2022-05-12T15:01:39.190679Z',
  operationalSolutionSubtasks: []
};

const operationalSolutionMocks = [
  {
    request: {
      query: GetOperationalSolution,
      variables: {
        id: operationalSolutionID
      }
    },
    result: {
      data: {
        operationalSolution
      }
    }
  }
];

export default operationalSolutionMocks;

const mocks = [
  ...documentMocks,
  ...needQuestionAndAnswerMock,
  ...operationalSolutionMocks,
  ...possibleSolutionsMock
];

const mockAuthReducer = {
  isUserSet: true,
  groups: [ASSESSMENT],
  euaId: 'ABCD'
};

const mockStore = configureMockStore();
const store = mockStore({ auth: mockAuthReducer });

describe('IT Solutions Link Documents', () => {
  it('renders correctly', async () => {
    const { getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/${operationalSolutionID}/link-documents`
          }
        ]}
      >
        <VerboseMockedProvider mocks={mocks} addTypename={false}>
          <Provider store={store}>
            <Route path="/models/:modelID/task-list/it-solutions/:operationalNeedID/:operationalSolutionID/link-documents">
              <MessageProvider>
                <LinkDocuments />
              </MessageProvider>
            </Route>
          </Provider>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    // Link mutation button disabled if state === original state of selections
    const linkButton = getByTestId('link-documents-button');
    expect(linkButton).toHaveAttribute('disabled');

    // Wait for page to load
    await waitForElementToBeRemoved(() => getByTestId('page-loading'));

    // Click checkbox table cell to toggle document selection
    const solutionDocument1 = getByTestId(
      'link-document-9d828454-9ecd-42a0-ad84-bc8c8ddea634'
    );

    userEvent.click(solutionDocument1);

    const solutionDocument2 = getByTestId(
      'link-document-07d0d06f-9ecd-42a0-ad84-bc8c8ddea084'
    );

    await waitFor(() => {
      expect(solutionDocument1).not.toBeChecked();
      expect(solutionDocument2).toBeChecked();
      expect(linkButton).not.toHaveAttribute('disabled');
    });
  });

  it('matches snapshot', async () => {
    const { asFragment, getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/${operationalSolutionID}/link-documents`
          }
        ]}
      >
        <VerboseMockedProvider mocks={mocks} addTypename={false}>
          <Provider store={store}>
            <Route path="/models/:modelID/task-list/it-solutions/:operationalNeedID/:operationalSolutionID/link-documents">
              <MessageProvider>
                <LinkDocuments />
              </MessageProvider>
            </Route>
          </Provider>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    // Wait for page to load
    await waitForElementToBeRemoved(() => getByTestId('page-loading'));

    // Click checkbox table cell to toggle document selection
    const solutionDocument1 = getByTestId(
      'link-document-9d828454-9ecd-42a0-ad84-bc8c8ddea634'
    );
    userEvent.click(solutionDocument1);

    expect(asFragment()).toMatchSnapshot();
  });
});
