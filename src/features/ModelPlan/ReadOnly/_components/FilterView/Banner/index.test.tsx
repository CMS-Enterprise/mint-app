import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import { filterGroups } from '../BodyContent/_filterGroupMapping';

import Banner from './index';

describe('Filter View Modal', () => {
  const openFilterModal = vi.fn();
  const openExportModal = vi.fn();
  it('renders without crashing', async () => {
    render(
      <Banner
        openFilterModal={openFilterModal}
        openExportModal={openExportModal}
        filteredView={'CMMI' as (typeof filterGroups)[number]}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('group-filter-banner')).toBeInTheDocument();
      expect(screen.getByText('CMMI')).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <Banner
        openFilterModal={openFilterModal}
        openExportModal={openExportModal}
        filteredView={'CMMI' as (typeof filterGroups)[number]}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('group-filter-banner')).toBeInTheDocument();
      expect(screen.getByText('CMMI')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
