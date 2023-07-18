import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';

import summaryMock, { modelID } from 'data/mock/readonly';
import VerboseMockedProvider from 'utils/testing/MockedProvider';

import ShareExportModal from './index';

describe('ShareExportModal', () => {
  it('renders modal with prepopulated filter', async () => {
    const { getByText } = render(
      <MemoryRouter>
        <VerboseMockedProvider mocks={[...summaryMock]} addTypename={false}>
          <ShareExportModal
            modelID={modelID}
            closeModal={() => null}
            filteredView="ccw"
          />
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByText('Testing Model Summary')).toBeInTheDocument();
      // setTimeout(() => {
      const combobox = screen.getByTestId('combo-box-select');
      expect(combobox).toHaveValue('ccw');
      // }, 10);
    });
  });

  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <VerboseMockedProvider mocks={[...summaryMock]} addTypename={false}>
          <ShareExportModal modelID={modelID} closeModal={() => null} />
        </VerboseMockedProvider>
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
