import React from 'react';
import { render, screen } from '@testing-library/react';

import ReadOnlySection from './index';

describe('The Read Only Section', () => {
  describe('As a Non-list Component', () => {
    const defaultCopyProps = {
      heading: 'React Testing is Great',
      copy: 'Lorem ipsum dolor sit amet.'
    };

    it('renders without crashing', async () => {
      render(<ReadOnlySection {...defaultCopyProps} />);

      expect(screen.getByText(defaultCopyProps.heading)).toBeInTheDocument();
      expect(screen.getByText(defaultCopyProps.copy)).toBeInTheDocument();
    });

    it('renders "No Answer Entered" if copy is empty', async () => {
      render(<ReadOnlySection {...defaultCopyProps} copy={null} />);

      expect(screen.getByText(defaultCopyProps.heading)).toBeInTheDocument();
      expect(screen.getByText('No answer entered')).toBeInTheDocument();
    });
  });

  describe('As a List Component', () => {
    const defaultListProps = {
      heading: 'Lorem ipsum dolor sit amet',
      list: true,
      listItems: ['Center for Medicare (CM)', 'CMMI']
    };

    it('renders without crashing', async () => {
      render(<ReadOnlySection {...defaultListProps} />);

      expect(screen.getByText(defaultListProps.heading)).toBeInTheDocument();
      expect(
        screen.getByText(defaultListProps.listItems[0])
      ).toBeInTheDocument();
    });

    it('renders Other entry', async () => {
      render(
        <ReadOnlySection
          {...defaultListProps}
          listItems={['Other']}
          copy="Lorem ipsum dolor sit amet."
        />
      );

      expect(screen.getByText(defaultListProps.heading)).toBeInTheDocument();
      expect(screen.getByText('Other')).toBeInTheDocument();
      expect(screen.getByTestId('other-entry')).toBeInTheDocument();
    });
  });
});
