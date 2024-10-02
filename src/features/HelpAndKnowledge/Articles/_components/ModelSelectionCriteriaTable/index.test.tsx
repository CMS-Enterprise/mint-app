import React from 'react';
import { render } from '@testing-library/react';

import ModelSectionCriteriaTable from './index';

describe('ModelSectionCriteriaTable', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<ModelSectionCriteriaTable />);

    expect(asFragment).toMatchSnapshot();
  });
});
