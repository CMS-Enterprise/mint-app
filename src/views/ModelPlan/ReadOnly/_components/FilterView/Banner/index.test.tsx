import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import { filterGroups } from '../BodyContent/_filterGroupMapping';

import Banner from './index';

describe('Filter View Modal', () => {
  it('renders without crashing', async () => {
    const openFilterModal = jest.fn();
    render(
      <Banner
        openFilterModal={openFilterModal}
        filteredView={'CMMI' as typeof filterGroups[number]}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('group-filter-banner')).toBeInTheDocument();
      expect(screen.getByText('CMMI')).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const openFilterModal = jest.fn();
    const { asFragment } = render(
      <Banner
        openFilterModal={openFilterModal}
        filteredView={'CMMI' as typeof filterGroups[number]}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('group-filter-banner')).toBeInTheDocument();
      expect(screen.getByText('CMMI')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
