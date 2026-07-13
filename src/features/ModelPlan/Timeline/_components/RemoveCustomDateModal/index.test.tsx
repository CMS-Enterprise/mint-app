import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import { customDateMocks } from 'tests/mock/general';

import RemoveCustomDateModal from '.';

describe('RemoveCustomDateModal Component', () => {
  it('matches snapshot', () => {
    render(
      <MockedProvider mocks={customDateMocks}>
        <RemoveCustomDateModal
          isModalOpen
          closeModal={() => {}}
          customDateID="test-id"
          onDeleteSuccess={() => {}}
        />
      </MockedProvider>
    );

    const modal = screen.getByTestId('remove-custom-date-modal');
    expect(modal).toMatchSnapshot();
  });
});
