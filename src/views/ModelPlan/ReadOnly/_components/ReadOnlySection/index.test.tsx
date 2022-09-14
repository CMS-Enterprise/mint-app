import React from 'react';
import { render, screen } from '@testing-library/react';

import ReadOnlySection from './index';

describe('The Read Only Section', () => {
  const defaultCopyProps = {
    heading: 'React Testing is Great',
    copy: 'Lorem ipsum dolor sit amet.'
  };
  const defaultListProps = {
    heading: 'React Testing is Great',
    list: true,
    listItems: ['Center for Medicare (CM)', 'Spiderman']
  };

  it('renders non-list component without crashing', async () => {
    render(<ReadOnlySection {...defaultCopyProps} />);

    expect(screen.getByText(defaultCopyProps.heading)).toBeInTheDocument();
    expect(screen.getByText(defaultCopyProps.copy)).toBeInTheDocument();
  });

  it('renders list component without crashing', async () => {
    render(<ReadOnlySection {...defaultListProps} />);

    expect(screen.getByText(defaultListProps.heading)).toBeInTheDocument();
    expect(screen.getByText(defaultListProps.listItems[0])).toBeInTheDocument();
  });
});
