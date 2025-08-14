import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';

import { ArticleCategories } from '../..';

import HelpCategoryTag from './index';

describe('HelpCategoryTag', () => {
  it('renders without errors', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <HelpCategoryTag type={ArticleCategories.GETTING_STARTED} />
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    const { getByText, getByTestId } = render(
      <RouterProvider router={router} />
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
