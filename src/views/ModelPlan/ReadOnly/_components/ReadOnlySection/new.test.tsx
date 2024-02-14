import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  FundingSource,
  ParticipantsType,
  RecruitmentType
} from 'gql/gen/graphql';
import i18next from 'i18next';

import { participantsAndProviders } from 'i18n/en-US/modelPlan/participantsAndProviders';
import { payments } from 'i18n/en-US/modelPlan/payments';
import { TranslationPlan } from 'types/translation';

import ReadOnlySectionNew, {
  formatListItems,
  formatListOtherItems,
  formatListTooltips,
  getRelatedUneededQuestions,
  isHiddenByParentCondition
} from './new';

const defaultProps = {
  config: participantsAndProviders.modelApplicationLevel,
  namespace: 'participantsAndProviders' as keyof TranslationPlan,
  values: {
    participants: [
      ParticipantsType.CONVENER,
      ParticipantsType.STATES,
      ParticipantsType.OTHER
    ],
    medicareProviderType: 'My medicare',
    modelApplicationLevel: 'Top level',
    recruitmentMethod: [RecruitmentType.OTHER],
    recruitmentOther: 'Other recruitment'
  }
};

describe('The Read Only Section', () => {
  describe('As a Non-list Component', () => {
    it('renders without crashing', async () => {
      render(<ReadOnlySectionNew {...defaultProps} />);

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

      render(<ReadOnlySectionNew {...emptyData} />);

      expect(
        screen.getByText(
          i18next.t<string>(
            'participantsAndProviders:modelApplicationLevel.label'
          )
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          i18next.t<string>('miscellaneous:noAdditionalInformation')
        )
      ).toBeInTheDocument();
    });
  });

  describe('As a List Component', () => {
    it('renders Other entry', async () => {
      const listData = { ...defaultProps };

      listData.config = participantsAndProviders.recruitmentMethod;

      render(<ReadOnlySectionNew {...listData} />);

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

    it('gets a list of realted, unneeded questions', async () => {
      const value: ParticipantsType[] = [
        ParticipantsType.CONVENER,
        ParticipantsType.STATES,
        ParticipantsType.OTHER
      ];

      const expectedQuestions: string[] = [
        i18next.t<string>('participantsAndProviders:medicareProviderType.label')
      ];

      const relatedQuestions = getRelatedUneededQuestions(
        participantsAndProviders.participants,
        value,
        'participantsAndProviders'
      );

      expect(relatedQuestions).toEqual(expectedQuestions);
    });

    it('return true for question that is hidden and conditional on a parent question', async () => {
      const expectedEvaluation = true;

      const childQuestion = isHiddenByParentCondition(
        participantsAndProviders.medicareProviderType,
        defaultProps.values
      );

      expect(childQuestion).toEqual(expectedEvaluation);
    });

    it('return false for question is shown and not conditional', async () => {
      const expectedEvaluation = false;

      const childQuestion = isHiddenByParentCondition(
        participantsAndProviders.participants,
        defaultProps.values
      );

      expect(childQuestion).toEqual(expectedEvaluation);
    });
  });
});
