import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { categoryMock } from 'tests/mock/mto';
import { modelID } from 'tests/mock/readonly';
import VerboseMockedProvider from 'tests/MockedProvider';

import MessageProvider from 'contexts/MessageContext';

import EditCategoryTitleForm from './index';

describe('Custom Catergory form', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={[`/models/${modelID}/`]}>
        <MessageProvider>
          <VerboseMockedProvider
            mocks={[...[...categoryMock]]}
            addTypename={false}
          >
            <Routes>
          <Route
            path="/models/:modelID/"
            element={<EditCategoryTitleForm  />}
          />
        </Routes>
          </VerboseMockedProvider>
        </MessageProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Current title')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
