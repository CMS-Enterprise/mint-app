import React from 'react';
import { render } from '@testing-library/react';

import FormPageHeader from './index';

describe('FormPageHeader', () => {
  it('renders correctly and matches snapshot', () => {
    const { asFragment, getByText } = render(
      <FormPageHeader header="Test Header" currentPage={1} totalPages={5} />
    );

    // Check if the header text is rendered
    expect(getByText('Test Header')).toBeInTheDocument();

    // Check if the page information is rendered correctly
    expect(getByText('(Page 1 of 5)')).toBeInTheDocument();

    // Create a snapshot
    expect(asFragment()).toMatchSnapshot();
  });
});
