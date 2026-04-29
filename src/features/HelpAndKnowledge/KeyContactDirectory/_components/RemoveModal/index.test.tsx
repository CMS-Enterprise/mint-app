import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import {
  keyContactCategoryMockData,
  keyContactsMock,
  keyContactsMockData
} from 'tests/mock/general';

import RemoveModal from '.';

const mocks = [...keyContactsMock];

describe('RemoveModal Component', () => {
  it('should render sme context when given key contact', () => {
    const { getByText, queryByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RemoveModal
          isModalOpen
          closeModal={() => {}}
          removedObject={keyContactsMockData[0]}
        />
      </MockedProvider>
    );
    expect(
      getByText('Are you sure you want to remove this SME?')
    ).toBeInTheDocument();
    expect(getByText('This action cannot be undone.')).toBeInTheDocument();
    expect(getByText('SME to be removed:')).toBeInTheDocument();
    expect(getByText('Aliza Kim')).toBeInTheDocument();
    expect(
      queryByText('Are you sure you want to remove this subject category?')
    ).not.toBeInTheDocument();
  });

  it('should render category context when given key contact category', () => {
    const { getByText, queryByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RemoveModal
          isModalOpen
          closeModal={() => {}}
          removedObject={keyContactCategoryMockData[0]}
        />
      </MockedProvider>
    );
    expect(
      getByText('Are you sure you want to remove this subject category?')
    ).toBeInTheDocument();
    expect(getByText('Category to be removed:')).toBeInTheDocument();
    expect(
      queryByText('This action cannot be undone.')
    ).not.toBeInTheDocument();
    expect(
      queryByText('Are you sure you want to remove this SME?')
    ).not.toBeInTheDocument();
  });

  it('matches snapshot', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RemoveModal
          isModalOpen
          closeModal={() => {}}
          removedObject={keyContactsMockData[0]}
        />
      </MockedProvider>
    );

    const modal = screen.getByTestId('remove-key-contact-directory-modal');
    expect(modal).toMatchSnapshot();
  });
});
