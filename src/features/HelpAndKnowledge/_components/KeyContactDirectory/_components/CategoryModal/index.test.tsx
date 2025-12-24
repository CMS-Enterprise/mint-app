import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import {
  keyContactCategoriesMock,
  keyContactCategoryMockData
} from 'tests/mock/general';

import CategoryModal from '.';

describe('CategoryModal Component', () => {
  it('should render add key contact category when in add mode', () => {
    <CategoryModal isOpen closeModal={() => {}} mode="add" />;

    const { getByText, queryByText } = render(
      <MockedProvider mocks={keyContactCategoriesMock} addTypename={false}>
        <CategoryModal isOpen closeModal={() => {}} mode="add" />
      </MockedProvider>
    );
    expect(getByText('Add a subject category')).toBeInTheDocument();
    expect(
      getByText(
        'Add an overall category or topic for subject matter experts (e.g. “Quality” or “Medicare Advantage”).'
      )
    ).toBeInTheDocument();
    expect(getByText('Subject category title')).toBeInTheDocument();
    expect(getByText('Add subject category')).toBeInTheDocument();
    expect(queryByText('Rename a subject category')).not.toBeInTheDocument();
  });

  it('should render edit key contact category when in edit mode', () => {
    const { getByText, queryByText } = render(
      <MockedProvider mocks={keyContactCategoriesMock} addTypename={false}>
        <CategoryModal
          isOpen
          closeModal={() => {}}
          mode="edit"
          category={keyContactCategoryMockData[0]}
        />
      </MockedProvider>
    );
    expect(getByText('Rename a subject category')).toBeInTheDocument();
    expect(getByText('Current category title:')).toBeInTheDocument();
    expect(getByText('Save changes')).toBeInTheDocument();
    expect(queryByText('Add a subject category')).not.toBeInTheDocument();
  });

  it('matches snapshot', () => {
    render(
      <MockedProvider mocks={keyContactCategoriesMock} addTypename={false}>
        <CategoryModal isOpen closeModal={() => {}} mode="add" />
      </MockedProvider>
    );

    const modal = screen.getByTestId('sme-category-modal');
    expect(modal).toMatchSnapshot();
  });
});
