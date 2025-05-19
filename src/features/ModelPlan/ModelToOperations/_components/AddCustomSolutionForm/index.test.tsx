import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import { categoryMock } from 'tests/mock/mto';
import { modelID } from 'tests/mock/readonly';
import VerboseMockedProvider from 'tests/MockedProvider';

import MessageProvider from 'contexts/MessageContext';

import CustomSolutionForm from './index';

describe('Custom Solution form', () => {
  it('matches snapshot', async () => {
    const { getAllByTestId, getByTestId, asFragment } = render(
      <MemoryRouter initialEntries={[`/models/${modelID}/`]}>
        <MessageProvider>
          <VerboseMockedProvider mocks={[...categoryMock]} addTypename={false}>
            <Route path="/models/:modelID/">
              <CustomSolutionForm />
            </Route>
          </VerboseMockedProvider>
        </MessageProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByTestId('alert')).toBeInTheDocument();
      const selectSolutionType = getAllByTestId('Select')[0];
      const primaryCategoryOptions =
        selectSolutionType.querySelectorAll('option');

      expect(primaryCategoryOptions).toHaveLength(5);

      expect(primaryCategoryOptions[0].value).toBe('default');
      expect(primaryCategoryOptions[1].value).toBe('IT_SYSTEM');
      expect(primaryCategoryOptions[2].value).toBe('CONTRACTOR');
      expect(primaryCategoryOptions[3].value).toBe('CROSS_CUTTING_GROUP');
      expect(primaryCategoryOptions[4].value).toBe('OTHER');
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
