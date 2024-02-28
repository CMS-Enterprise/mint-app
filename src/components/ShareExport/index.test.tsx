import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import Sinon from 'sinon';

import allMocks, { modelID, summaryMock } from 'data/mock/readonly';
import GetOperationalNeeds from 'queries/ITSolutions/GetOperationalNeeds';
import { GetOperationalNeeds as GetOperationalNeedsType } from 'queries/ITSolutions/types/GetOperationalNeeds';
import {
  OperationalNeedKey,
  OperationalSolutionKey,
  OpSolutionStatus
} from 'types/graphql-global-types';
import VerboseMockedProvider from 'utils/testing/MockedProvider';
import setup from 'utils/testing/setup';

import ShareExportModal from './index';

const mockStore = configureMockStore();
const store = mockStore({ auth: { euaId: 'MINT' } });

const opNeedsData: GetOperationalNeedsType = {
  modelPlan: {
    __typename: 'ModelPlan',
    id: modelID,
    isCollaborator: true,
    modelName: 'My excellent plan that I just initiated',
    operationalNeeds: [
      {
        __typename: 'OperationalNeed',
        id: '123',
        modelPlanID: modelID,
        name: 'Recruit participants',
        key: OperationalNeedKey.RECRUIT_PARTICIPANTS,
        nameOther: null,
        needed: true,
        modifiedDts: '2022-05-12T15:01:39.190679Z',
        solutions: [
          {
            __typename: 'OperationalSolution',
            id: '123',
            status: OpSolutionStatus.IN_PROGRESS,
            name: 'Shared Systems',
            key: OperationalSolutionKey.SHARED_SYSTEMS,
            otherHeader: '',
            mustStartDts: null,
            mustFinishDts: null,
            operationalSolutionSubtasks: [],
            needed: true,
            nameOther: null,
            pocEmail: null,
            pocName: null,
            createdBy: '',
            createdDts: ''
          }
        ]
      }
    ]
  }
};

const operationalNeedMock = [
  {
    request: {
      query: GetOperationalNeeds,
      variables: { id: modelID }
    },
    result: {
      data: opNeedsData
    }
  }
];

describe('ShareExportModal', () => {
  // Stubing Math.random that occurs in Truss Tooltip component for deterministic output
  Sinon.stub(Math, 'random').returns(0.5);

  it('renders modal with prepopulated filter', async () => {
    const { user, getByText, getByTestId } = setup(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            `/models/${modelID}/read-only/model-basics?filter-view=ccw`
          ]}
        >
          <VerboseMockedProvider
            mocks={[...allMocks, ...summaryMock, ...operationalNeedMock]}
            addTypename={false}
          >
            <Route path="/models/:modelID/read-only/model-basics">
              <ShareExportModal
                modelID={modelID}
                closeModal={() => null}
                filteredView="ccw"
                setStatusMessage={() => null}
              />
            </Route>
          </VerboseMockedProvider>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(async () => {
      // Select new filter group option
      const exportButton = getByTestId('export-button');
      await user.click(exportButton);

      // Renders default Fitler group option if supplied
      expect(
        getByText('My excellent plan that I just initiated')
      ).toBeInTheDocument();
      const combobox = getByTestId('combo-box-select');
      expect(combobox).toHaveValue('ccw');

      // Select new filter group option
      await user.selectOptions(combobox, ['cmmi']);
      expect(combobox).toHaveValue('cmmi');

      // Check if export is disabled
      const exportSubmit = getByTestId('export-model-plan');
      expect(exportSubmit).toBeDisabled();

      // Select new filter group option
      const pdfCheckbox = getByTestId('share-export-modal-file-type-pdf');
      await user.click(pdfCheckbox);

      expect(exportSubmit).not.toBeDisabled();
    });
  });

  it('matches the snapshot', async () => {
    const { asFragment, getByText } = render(
      <MemoryRouter
        initialEntries={[`/models/${modelID}/read-only/model-basics`]}
      >
        <VerboseMockedProvider
          mocks={[...allMocks, ...summaryMock]}
          addTypename={false}
        >
          <Route path="/models/:modelID/read-only/model-basics">
            <ShareExportModal
              modelID={modelID}
              closeModal={() => null}
              setStatusMessage={() => null}
            />
          </Route>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByText('Testing Model Summary')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('matches the snapshot', async () => {
    const { asFragment, getByText } = render(
      <MemoryRouter
        initialEntries={[`/models/${modelID}/read-only/model-basics`]}
      >
        <VerboseMockedProvider
          mocks={[...allMocks, ...summaryMock]}
          addTypename={false}
        >
          <Route path="/models/:modelID/read-only/model-basics">
            <ShareExportModal
              modelID={modelID}
              closeModal={() => null}
              setStatusMessage={() => null}
            />
          </Route>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByText('Testing Model Summary')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
