import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  generalCharacteristicMocks as mocks,
  modelID
} from 'tests/mock/readonly';

import ReadOnlyGeneralCharacteristics from './index';

describe('Read Only Model Plan Summary -- General Characteristics', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/read-view/general-characteristics`
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Routes>
          <Route
            path="/models/:modelID/read-view/general-characteristics"
            element={<ReadOnlyGeneralCharacteristics modelID={modelID}  />}
          />
        </Routes>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('tasklist-tag')).toHaveTextContent(
        'In progress'
      );
      expect(
        screen.getByText(
          'Accountable Care Organizations (ACOs): General Information'
        )
      ).toBeInTheDocument();
    });
  });
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/read-view/general-characteristics`
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Routes>
          <Route
            path="/models/:modelID/read-view/general-characteristics"
            element={<ReadOnlyGeneralCharacteristics modelID={modelID}  />}
          />
        </Routes>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId('tasklist-tag')).toHaveTextContent(
        'In progress'
      );
      expect(
        screen.getByText(
          'Accountable Care Organizations (ACOs): General Information'
        )
      ).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
