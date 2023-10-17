import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';

import HelpCategoryTag from './index';

describe('HelpCategoryTag', () => {
  it('renders without errors', async () => {
    const { getByText, getByTestId } = render(
      <MemoryRouter>
        <HelpCategoryTag type="getting-started" />
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
