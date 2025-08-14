import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';

import { ArticleCategories } from '../..';

import HelpCategoryTag from './index';

describe('HelpCategoryTag', () => {
  it('renders without errors', async () => {
    const { getByText, getByTestId } = render(
      <MemoryRouter>
        <HelpCategoryTag type={ArticleCategories.GETTING_STARTED} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByText('Getting started')).toBeInTheDocument();
      expect(getByTestId('tag')).toBeInTheDocument();
      expect(getByText('Getting started').closest('a')).toHaveAttribute(
        'href',
        '/help-and-knowledge/articles?category=getting-started'
      );
    });
  });
});
