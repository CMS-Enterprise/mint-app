import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import FilteredViewSelect from '.';

describe('FilteredViewSelect Component', () => {
  let setSelectedFilters: ReturnType<typeof vi.fn<(filters: string[]) => void>>;

  beforeEach(() => {
    setSelectedFilters = vi.fn();
  });

  it('renders dropdown with default "- Select -" value and disabled download button', () => {
    render(
      <FilteredViewSelect
        selectedFilters={[]}
        setSelectedFilters={setSelectedFilters}
      />
    );

    const select = screen.getByTestId(
      'filtered-view-select'
    ) as HTMLSelectElement;

    expect(select.value).toBe('default');
  });

  it('should able to select an option', async () => {
    const user = userEvent.setup();

    render(
      <FilteredViewSelect
        selectedFilters={[]}
        setSelectedFilters={setSelectedFilters}
      />
    );

    const select = screen.getByTestId(
      'filtered-view-select'
    ) as HTMLSelectElement;

    await user.selectOptions(select, 'cmmi');

    expect(setSelectedFilters).toHaveBeenCalled();
  });
});
