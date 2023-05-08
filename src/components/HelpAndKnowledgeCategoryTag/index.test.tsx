import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';

import HelpAndKnowledgeCategoryTag from './index';

describe('HelpAndKnowledgeCategoryTag', () => {
  it('renders without errors', async () => {
    const { getByText, getByTestId } = render(
      <MemoryRouter>
        <HelpAndKnowledgeCategoryTag type="gettingStarted" />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByText('Getting started')).toBeInTheDocument();
      expect(getByTestId('tag')).toBeInTheDocument();
      expect(getByText('Getting started').closest('a')).toHaveAttribute(
        'href',
        expect.stringMatching('/help-and-knowledge/getting-started')
      );
    });
  });
});
