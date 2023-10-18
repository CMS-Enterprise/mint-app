import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import HelpBreadcrumb from './index';

describe('HelpBreadcrumb', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <HelpBreadcrumb />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
