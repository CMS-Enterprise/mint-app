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
import { MessageProvider } from 'hooks/useMessage';
import GetModelPlanDocuments from 'queries/Documents/GetModelPlanDocuments';
import { GetModelPlanDocuments as GetModelPlanDocumentsType } from 'queries/Documents/types/GetModelPlanDocuments';
import GetOperationalSolution from 'queries/ITSolutions/GetOperationalSolution';
import { DocumentType, OpSolutionStatus } from 'types/graphql-global-types';
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
      optionalNotes: null,
      otherType: null,
      __typename: 'PlanDocument'
    }
  ],
  mustFinishDts: '2022-05-12T15:01:39.190679Z',
  mustStartDts: '2022-05-12T15:01:39.190679Z'
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
  ...operationalSolutionMocks
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
    const { getByTestId, getByText } = render(
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
    const solutionDocument = getByText('My MINT document');
    userEvent.click(solutionDocument);

    await waitFor(() => {
      expect(linkButton).not.toHaveAttribute('disabled');
    });

    // const datePicker = getAllByTestId('date-picker-external-input')[0];
    // userEvent.type(datePicker, '12/10/2030');

    // await waitFor(() => {
    //   expect(datePicker).toHaveValue('12/10/2030');
    // });

    // const atRisk = getByRole('radio', { name: 'At risk' });
    // const backlog = getByRole('radio', { name: 'Backlog' });
    // userEvent.click(backlog);

    // await waitFor(() => {
    //   expect(atRisk).not.toBeChecked();
    //   expect(backlog).toBeChecked();
    // });
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

    expect(asFragment()).toMatchSnapshot();
  });
});
