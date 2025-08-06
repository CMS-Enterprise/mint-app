import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  dataExchangeApproachMocks as mocks,
  modelID
} from 'tests/mock/readonly';

import ReadOnlyDataExchangeApproach from './index';

describe('Read view - Data exchange approach', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[`/models/${modelID}/read-view/data-exchange-approach`]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Routes>
          <Route
            path="/models/:modelID/read-view/data-exchange-approach"
            element={<ReadOnlyDataExchangeApproach modelID={modelID}  />}
          />
        </Routes>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('data available note')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
