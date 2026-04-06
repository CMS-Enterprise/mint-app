import { MilestoneSuggestionReason, TableName } from 'gql/generated/graphql';

import { formatMilestoneAnswers } from './suggestedMilestone';

describe('SuggestedMilestone Util', () => {
  describe('formatMilestoneAnswers', () => {
    it('groups multiple answers for the same field into one', () => {
      const mockSingleReason: MilestoneSuggestionReason[] = [
        {
          __typename: 'MilestoneSuggestionReason',
          table: TableName.PLAN_BASICS,
          field: 'model_type',
          question: 'What is the model type?',
          answer: 'Voluntary'
        },
        {
          __typename: 'MilestoneSuggestionReason',
          table: TableName.PLAN_BASICS,
          field: 'model_type',
          question: 'What is the model type?',
          answer: 'Mandatory'
        }
      ];

      const result = formatMilestoneAnswers(mockSingleReason);

      expect(result.answers).toHaveLength(1);
      expect(result.answers[0].answers).toEqual(['Voluntary', 'Mandatory']);
      expect(result.isMultiQuestions).toBe(false);
      expect(result.scrollElement).toBe(result.answers[0].questionKey);
    });

    it('identifies multi-question scenarios when fields differ', () => {
      const mockMultiReasons: MilestoneSuggestionReason[] = [
        {
          __typename: 'MilestoneSuggestionReason',
          table: TableName.PLAN_PAYMENTS,
          field: 'model_type',
          question: 'What is the payment type?',
          answer: 'Check'
        },
        {
          __typename: 'MilestoneSuggestionReason',
          table: TableName.PLAN_PAYMENTS,
          field: 'pay_recipients',
          question: 'Who are the recipients?',
          answer: 'Providers'
        }
      ];

      const result = formatMilestoneAnswers(mockMultiReasons);

      expect(result.answers).toHaveLength(2);
      expect(result.isMultiQuestions).toBe(true);
      expect(result.scrollElement).toBe('appealgrouplabel');
    });

    it('returns an empty array and undefined values if no reasons are provided', () => {
      const result = formatMilestoneAnswers([]);

      expect(result.answers).toEqual([]);
      expect(result.isMultiQuestions).toBe(false);
      expect(result.scrollElement).toBeUndefined();
    });

    it('ignores reasons with missing answers', () => {
      const mockMultiReasons: MilestoneSuggestionReason[] = [
        {
          __typename: 'MilestoneSuggestionReason',
          table: TableName.PLAN_PAYMENTS,
          field: 'model_type',
          question: 'What is the payment type?',
          answer: 'Check'
        },
        {
          __typename: 'MilestoneSuggestionReason',
          table: TableName.PLAN_PAYMENTS,
          field: 'pay_recipients',
          question: 'Who are the recipients?',
          answer: ''
        }
      ];

      const result = formatMilestoneAnswers(mockMultiReasons);
      expect(result.answers).toHaveLength(1);
      expect(result.answers[0].question).toBe('What is the payment type?');
    });
  });
});
