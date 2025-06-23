import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { waitFor } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import { echimpCRsAndTDLsMock } from 'tests/mock/general';
import {
  mtoMatrixMock,
  possibleSolutionsMock,
  solutionAndMilestoneMock
} from 'tests/mock/mto';
import allMocks, {
  dataExchangeApproachMocks,
  modelID,
  summaryMock
} from 'tests/mock/readonly';
import VerboseMockedProvider from 'tests/MockedProvider';
import setup from 'tests/util';

import MessageProvider from 'contexts/MessageContext';

import ShareExportModal from './index';

const mockStore = configureMockStore();
const store = mockStore({ auth: { euaId: 'MINT' } });

describe('ShareExportModal', () => {
  it('renders modal with prepopulated filter', async () => {
    const { user, getByText, getByTestId } = setup(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            `/models/${modelID}/read-only/model-basics?filter-view=ccw`
          ]}
        >
          <VerboseMockedProvider
            mocks={[
              ...allMocks,
              ...dataExchangeApproachMocks,
              ...summaryMock,
              ...mtoMatrixMock,
              ...possibleSolutionsMock,
              ...solutionAndMilestoneMock,
              ...echimpCRsAndTDLsMock
            ]}
            addTypename={false}
          >
            <Route path="/models/:modelID/read-only/model-basics">
              <MessageProvider>
                <ShareExportModal
                  modelID={modelID}
                  closeModal={() => null}
                  filteredView="ccw"
                  setStatusMessage={() => null}
                />
              </MessageProvider>
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
      expect(getByText('Testing Model Summary')).toBeInTheDocument();
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

  it.skip('matches the snapshot', async () => {
    const { asFragment, getByText } = setup(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            `/models/${modelID}/read-only/model-basics?filter-view=ccw`
          ]}
        >
          <VerboseMockedProvider
            mocks={[
              ...allMocks,
              ...dataExchangeApproachMocks,
              ...summaryMock,
              ...mtoMatrixMock,
              ...possibleSolutionsMock,
              ...solutionAndMilestoneMock,
              ...echimpCRsAndTDLsMock
            ]}
            addTypename={false}
          >
            <Route path="/models/:modelID/read-only/model-basics">
              <MessageProvider>
                <ShareExportModal
                  modelID={modelID}
                  closeModal={() => null}
                  filteredView="ccw"
                  setStatusMessage={() => null}
                />
              </MessageProvider>
            </Route>
          </VerboseMockedProvider>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(getByText('Testing Model Summary')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
