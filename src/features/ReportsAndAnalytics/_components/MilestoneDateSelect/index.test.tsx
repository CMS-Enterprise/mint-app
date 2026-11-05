import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import MilestoneDateSelect from '.';

describe('MilestoneDateSelect Component', () => {
  let setSelectedFilters: ReturnType<typeof vi.fn<(filters: string[]) => void>>;

  beforeEach(() => {
    setSelectedFilters = vi.fn();
  });

  it('renders dropdown with default "ALL_TIME" value and disabled download button', () => {
    render(
      <MilestoneDateSelect
        selectedFilters={[]}
        setSelectedFilters={setSelectedFilters}
      />
    );

    const select = screen.getByTestId(
      'milestone-needed-date-select'
    ) as HTMLSelectElement;

    expect(select.value).toBe('ALL_TIME');
  });

  it('should able to select an option', async () => {
    const user = userEvent.setup();

    render(
      <MilestoneDateSelect
        selectedFilters={[]}
        setSelectedFilters={setSelectedFilters}
      />
    );

    const select = screen.getByTestId(
      'milestone-needed-date-select'
    ) as HTMLSelectElement;

    await user.selectOptions(select, 'NEXT_30_DAYS');

    expect(setSelectedFilters).toHaveBeenCalled();
  });
});
