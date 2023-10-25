import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import FilterViewModal from './index';

describe('Filter View Modal', () => {
  it('renders without crashing', async () => {
    const closeModal = vi.fn();
    render(<FilterViewModal filteredView="" closeModal={closeModal} />);

    await waitFor(() => {
      expect(screen.getByTestId('filter-view-modal')).toBeInTheDocument();

      const combobox = screen.getByTestId('combo-box-select');
      userEvent.selectOptions(combobox, ['cmmi']);
      expect(combobox).toHaveValue('cmmi');
    });
  });

  it('matches snapshot', async () => {
    const closeModal = vi.fn();
    const { asFragment } = render(
      <FilterViewModal filteredView="" closeModal={closeModal} />
    );

    await waitFor(() => {
      expect(screen.getByTestId('filter-view-modal')).toBeInTheDocument();

      const combobox = screen.getByTestId('combo-box-select');
      userEvent.selectOptions(combobox, ['cmmi']);
      expect(combobox).toHaveValue('cmmi');
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
