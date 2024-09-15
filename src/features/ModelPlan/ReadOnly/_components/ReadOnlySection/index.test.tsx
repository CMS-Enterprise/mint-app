import React from 'react';
import { render, screen } from '@testing-library/react';
import { FundingSource, OverlapType, RecruitmentType } from 'gql/generated/graphql';
import i18next from 'i18next';

import { participantsAndProviders } from 'i18n/en-US/modelPlan/participantsAndProviders';
import { payments } from 'i18n/en-US/modelPlan/payments';
import { Bool } from 'types/translation';

import {
  checkIfParentContainsChildClosure,
  formatListOtherValues,
  formatListTooltips,
  formatListValues,
  getRelatedUneededQuestions,
  isHiddenByParentCondition
} from './util';
import ReadOnlySection from '.';

const defaultProps = {
  field: 'modelApplicationLevel',
  translations: participantsAndProviders,
  values: {
    providerOverlap: OverlapType.NO,
    providerOverlapHierarchy: 'Overlap heirarchy',
    modelApplicationLevel: 'Top level',
    recruitmentMethod: [RecruitmentType.OTHER],
    recruitmentOther: 'Other recruitment'
  }
};

describe('The Read Only Section', () => {
  describe('As a Non-list Component', () => {
    it('renders without crashing', async () => {
      render(<ReadOnlySection {...defaultProps} />);

      expect(
        screen.getByText(
          i18next.t<string>(
            'participantsAndProviders:modelApplicationLevel.label'
          )
        )
      ).toBeInTheDocument();
      expect(screen.getByText('Top level')).toBeInTheDocument();
    });

    it('renders "No additional information specified" if copy is empty', async () => {
      const emptyData = { ...defaultProps };

      emptyData.values.modelApplicationLevel = '';

      render(<ReadOnlySection {...emptyData} />);

      expect(
        screen.getByText(
          i18next.t<string>(
            'participantsAndProviders:modelApplicationLevel.label'
          )
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(i18next.t<string>('miscellaneous:na'))
      ).toBeInTheDocument();
    });
  });

  describe('As a List Component', () => {
    it('renders Other entry', async () => {
      const listData = { ...defaultProps };

      listData.field = 'recruitmentMethod';

      render(<ReadOnlySection {...listData} />);

      expect(
        screen.getByText(
          i18next.t<string>('participantsAndProviders:recruitmentMethod.label')
        )
      ).toBeInTheDocument();
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

      expect(formatListValues(payments.fundingSource, values)).toEqual(
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
        formatListOtherValues(payments.fundingSource, values, allValues)
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
          'payments:fundingSource.tooltips.MEDICARE_PART_A_HI_TRUST_FUND'
        ),
        i18next.t<string>(
          'payments:fundingSource.tooltips.MEDICARE_PART_B_SMI_TRUST_FUND'
        ),
        ''
      ];

      expect(formatListTooltips(payments.fundingSource, values)).toEqual(
        expectedOrder
      );
    });

    it('gets a list of realted, unneeded questions', async () => {
      const value: OverlapType[] = [OverlapType.NO];

      const expectedQuestions: string[] = [
        i18next.t<string>(
          'participantsAndProviders:providerOverlapHierarchy.label'
        )
      ];

      const relatedQuestions = getRelatedUneededQuestions(
        participantsAndProviders.providerOverlap,
        value
      );

      expect(relatedQuestions).toEqual(expectedQuestions);
    });

    it('return true for question that is hidden and conditional on a parent question', async () => {
      const expectedEvaluation = true;

      const childQuestion = isHiddenByParentCondition(
        participantsAndProviders.providerOverlapHierarchy,
        defaultProps.values
      );

      expect(childQuestion).toEqual(expectedEvaluation);
    });

    it('return false for question is shown and not conditional', async () => {
      const expectedEvaluation = false;

      const childQuestion = isHiddenByParentCondition(
        participantsAndProviders.providerOverlap,
        defaultProps.values
      );

      expect(childQuestion).toEqual(expectedEvaluation);
    });

    it('compares closures of parent/child translation configuration, child should now be shown', async () => {
      const expectedEvaluation = true;

      const childQuestion = checkIfParentContainsChildClosure(
        Bool.true,
        participantsAndProviders.gainsharePayments,
        participantsAndProviders.gainsharePaymentsTrack
      );

      expect(childQuestion).toEqual(expectedEvaluation);
    });
  });
});
