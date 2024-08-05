import React from 'react';
import { render, waitFor } from '@testing-library/react';

import NDABanner from '.';

describe('NDA Banner Component', () => {
  it('renders NDA banner with collapsable state', async () => {
    const { getByTestId } = render(<NDABanner collapsable />);

    await waitFor(() => {
      expect(getByTestId('pre-decisional-collapse')).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(<NDABanner />);
    expect(asFragment()).toMatchSnapshot();
  });
});
