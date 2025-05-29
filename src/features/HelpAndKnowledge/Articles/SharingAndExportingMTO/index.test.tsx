import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import SharingAndExportingMTO from '.';

describe('SharingAndExportingMTO', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <SharingAndExportingMTO />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
