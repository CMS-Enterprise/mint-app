import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { categoryMock, modelID } from 'tests/mock/mto';
import VerboseMockedProvider from 'tests/MockedProvider';

import MessageProvider from 'contexts/MessageContext';

import CustomCategoryForm from './index';

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
            element={<CustomCategoryForm  />}
          />
        </Routes>
          </VerboseMockedProvider>
        </MessageProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          'Choose a primary category if you are adding a sub-category, or choose "None" if you are adding a primary category.'
        )
      ).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
