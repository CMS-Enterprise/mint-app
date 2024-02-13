import React from 'react';
import { render, screen } from '@testing-library/react';
import { FundingSource } from 'gql/gen/graphql';
import i18next from 'i18next';

import { payments } from 'i18n/en-US/modelPlan/payments';

import ReadOnlySection, {
  formatListItems,
  formatListOtherItems,
  formatListTooltips
} from './index';

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

    it('renders "No additional information specified" if copy is empty', async () => {
      render(<ReadOnlySection {...defaultCopyProps} copy={null} />);

      expect(screen.getByText(defaultCopyProps.heading)).toBeInTheDocument();
      expect(
        screen.getByText('No additional information specified')
      ).toBeInTheDocument();
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

  describe('Util functions', () => {
    it('orders enum values correctly', async () => {
      const values: FundingSource[] = [
        FundingSource.OTHER,
        FundingSource.MEDICARE_PART_B_SMI_TRUST_FUND,
        FundingSource.MEDICARE_PART_A_HI_TRUST_FUND
      ];

      const expectedOrder: string[] = [
        'Medicare Part A (HI) Trust Fund',
        'Medicare Part B (SMI) Trust Fund',
        'Other'
      ];

      expect(formatListItems(payments.fundingSource, values)).toEqual(
        expectedOrder
      );
    });

    it('matches additionalInfo/other values to their corresponding values', async () => {
      const values: FundingSource[] = [
        FundingSource.OTHER,
        FundingSource.MEDICARE_PART_B_SMI_TRUST_FUND,
        FundingSource.MEDICARE_PART_A_HI_TRUST_FUND
      ];

      const allValues = {
        fundingSource: values,
        fundingSourceOther: 'Other',
        fundingSourceMedicareAInfo: 'Medicare A',
        fundingSourceMedicareBInfo: 'Medicare B'
      };

      const expectedOrder = [
        allValues.fundingSourceMedicareAInfo,
        allValues.fundingSourceMedicareBInfo,
        allValues.fundingSourceOther
      ];

      expect(
        formatListOtherItems(payments.fundingSource, values, allValues)
      ).toEqual(expectedOrder);
    });

    it('orders tooltip/optionsLabels values correctly', async () => {
      const values: FundingSource[] = [
        FundingSource.OTHER,
        FundingSource.MEDICARE_PART_B_SMI_TRUST_FUND,
        FundingSource.MEDICARE_PART_A_HI_TRUST_FUND
      ];

      const expectedOrder: string[] = [
        i18next.t<string>(
          'payments:fundingSource.optionsLabels.MEDICARE_PART_A_HI_TRUST_FUND'
        ),
        i18next.t<string>(
          'payments:fundingSource.optionsLabels.MEDICARE_PART_B_SMI_TRUST_FUND'
        ),
        ''
      ];

      expect(formatListTooltips(payments.fundingSource, values)).toEqual(
        expectedOrder
      );
    });
  });
});
