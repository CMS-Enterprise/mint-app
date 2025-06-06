import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import AccessibilityStatement from '.';

describe('AccessibilityStatement', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <AccessibilityStatement />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
