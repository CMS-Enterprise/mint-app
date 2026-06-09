import { CommonWaiverType, ModelCategory } from 'gql/generated/graphql';
import { modelPlanQuestionsDataMocks } from 'tests/mock/general';
import { describe, expect, it } from 'vitest';

import {
  CombinedConfigType,
  ModelPlanQuestionsFormTypeWithLinks
} from './_components/ModelPlanQuestionsForm';
import { QuestionType } from './_components/ModelPlanQuestionsForm/questionMap';
import { MedicarePaymentSuggestedWaivers } from './MedicarePaymentWaivers';
import {
  filterSuggestedWaiversByType,
  formattedLabel,
  formattedValue,
  getDeepChildFields,
  getFormDiffs,
  getFormStateKey,
  getMapChildrenQuestions,
  getSubQuestionFields,
  getTranslationKey,
  separateLinksByType
} from './util';

describe('ModelPlanQuestions Utilities', () => {
  describe('getTranslationKey', () => {
    it('maps link keys to their corresponding graphql translation key properties', () => {
      expect(getTranslationKey('resemblesExistingModelLinks')).toBe(
        'resemblesExistingModelWhich'
      );
      expect(getTranslationKey('participationInModelPreconditionLinks')).toBe(
        'participationInModelPreconditionWhich'
      );
    });

    it('returns the input key unaltered if no structural override definition matches', () => {
      expect(getTranslationKey('modelCategory')).toBe('modelCategory');
    });
  });

  describe('getFormStateKey', () => {
    it('maps graphql properties back to active client side form state link names', () => {
      expect(getFormStateKey('resemblesExistingModelWhich')).toBe(
        'resemblesExistingModelLinks'
      );
      expect(getFormStateKey('participationInModelPreconditionWhich')).toBe(
        'participationInModelPreconditionLinks'
      );
    });

    it('returns the input key unaltered if no form mapping overrides exist', () => {
      expect(getFormStateKey('cmsCenters')).toBe('cmsCenters');
    });
  });

  describe('formattedLabel', () => {
    it('returns the explicit configuration label property matching the parsed key', () => {
      const realConfig = {
        modelCategory: { label: 'Model Category' }
      } as unknown as CombinedConfigType;

      expect(
        formattedLabel({ combinedConfig: realConfig, key: 'modelCategory' })
      ).toBe('Model Category');
    });

    it('returns an empty string if the matched key does not exist inside configuration definitions', () => {
      const realConfig = {} as unknown as CombinedConfigType;
      expect(
        formattedLabel({ combinedConfig: realConfig, key: 'unknownField' })
      ).toBe('');
    });
  });

  describe('formattedValue', () => {
    const mockComboOptions = [
      { label: 'A. Existing Model Plan', value: '12' },
      { label: 'B. MINT Model Plan', value: 'uuid-mint-1' }
    ];

    const realConfig = {
      modelCategory: {
        options: {
          ACCOUNTABLE_CARE: 'Accountable Care',
          DISEASE_SPECIFIC_AND_EPISODIC: 'Disease-Specific & Episode-Based'
        }
      }
    } as unknown as CombinedConfigType;

    it('returns an empty string for nil or unassigned values', () => {
      expect(
        formattedValue({
          combinedConfig: realConfig,
          key: 'modelCategory',
          rawValue: null,
          comboOptions: mockComboOptions
        })
      ).toBe('');
      expect(
        formattedValue({
          combinedConfig: realConfig,
          key: 'modelCategory',
          rawValue: undefined,
          comboOptions: mockComboOptions
        })
      ).toBe('');
      expect(
        formattedValue({
          combinedConfig: realConfig,
          key: 'modelCategory',
          rawValue: [],
          comboOptions: mockComboOptions
        })
      ).toBe('');
    });

    it('returns direct literal values mapped from combo choice option objects', () => {
      expect(
        formattedValue({
          combinedConfig: realConfig,
          key: 'existingModel',
          rawValue: '12',
          comboOptions: mockComboOptions
        })
      ).toBe('A. Existing Model Plan');
    });

    it('returns static configured option dictionary labels sorted alphabetically', () => {
      const result = formattedValue({
        combinedConfig: realConfig,
        key: 'modelCategory',
        rawValue: ['DISEASE_SPECIFIC_AND_EPISODIC', 'ACCOUNTABLE_CARE'],
        comboOptions: mockComboOptions
      });
      expect(result).toBe('Accountable Care, Disease-Specific & Episode-Based');
    });

    it('falls back to returning the raw string value if no matching dictionary definition exists', () => {
      const result = formattedValue({
        combinedConfig: realConfig,
        key: 'modelCategory',
        rawValue: 'UNKNOWN_VALUE_STRING',
        comboOptions: mockComboOptions
      });
      expect(result).toBe('UNKNOWN_VALUE_STRING');
    });
  });

  describe('getMapChildrenQuestions', () => {
    const mockQuestionConfig: QuestionType = {
      field: 'isNewModel',
      childRelation: [{ field: 'resemblesExistingModel' }]
    };

    it('extracts relational child properties if current active data context has saved values', () => {
      const liveFormData = {
        resemblesExistingModel: true
      } as unknown as ModelPlanQuestionsFormTypeWithLinks;

      expect(getMapChildrenQuestions(mockQuestionConfig, liveFormData)).toEqual(
        ['resemblesExistingModel']
      );
    });

    it('returns an empty collection array if child properties have no associated data configurations', () => {
      const liveFormData = {
        resemblesExistingModel: null
      } as unknown as ModelPlanQuestionsFormTypeWithLinks;

      expect(getMapChildrenQuestions(mockQuestionConfig, liveFormData)).toEqual(
        []
      );
    });
  });

  describe('getFormDiffs', () => {
    const initialValues = {
      basicsId: 'b-1',
      generalCharacteristicsId: 'g-1',
      modelCategory: ModelCategory.ACCOUNTABLE_CARE,
      additionalModelCategories: [],
      cmsCenters: [],
      cmmiGroups: [],
      isNewModel: false,
      existingModel: null,
      resemblesExistingModelLinks: [],
      participationInModelPreconditionLinks: []
    } as unknown as ModelPlanQuestionsFormTypeWithLinks;

    it('flags basic property variations and constructs matching database modification patches', () => {
      const currentValues = {
        ...initialValues,
        modelCategory: ModelCategory.DISEASE_SPECIFIC_AND_EPISODIC
      } as unknown as ModelPlanQuestionsFormTypeWithLinks;

      const diffs = getFormDiffs(initialValues, currentValues);

      expect(diffs.withBasics).toBe(true);
      expect(diffs.basicsChanges).toEqual({
        modelCategory: ModelCategory.DISEASE_SPECIFIC_AND_EPISODIC
      });

      expect(diffs.withGeneralCharacteristics).toBe(false);
    });

    it('assigns raw values correctly across internal database identity definitions for UUID strings', () => {
      const currentValues = {
        ...initialValues,
        existingModel: 'uuid-mint-999'
      } as unknown as ModelPlanQuestionsFormTypeWithLinks;

      const diffs = getFormDiffs(initialValues, currentValues);

      expect(diffs.generalCharacteristicsChanges.currentModelPlanID).toBe(
        'uuid-mint-999'
      );
      expect(
        diffs.generalCharacteristicsChanges.existingModelID
      ).toBeUndefined();
    });

    it('converts numeric string values to numerical properties for standard model ID lookups', () => {
      const currentValues = {
        ...initialValues,
        existingModel: '42'
      } as unknown as ModelPlanQuestionsFormTypeWithLinks;

      const diffs = getFormDiffs(initialValues, currentValues);

      expect(diffs.generalCharacteristicsChanges.existingModelID).toBe(42);
      expect(
        diffs.generalCharacteristicsChanges.currentModelPlanID
      ).toBeUndefined();
    });

    it('sets structural model identification pointers to null if existingModel is entirely cleared out', () => {
      const currentValues = {
        ...initialValues,
        existingModel: ''
      } as unknown as ModelPlanQuestionsFormTypeWithLinks;

      const diffs = getFormDiffs(initialValues, currentValues);

      expect(diffs.generalCharacteristicsChanges.currentModelPlanID).toBeNull();
      expect(diffs.generalCharacteristicsChanges.existingModelID).toBeNull();
    });
  });

  describe('separateLinksByType', () => {
    it('groups string tokens into explicit database key subsets based on configuration signatures', () => {
      const targetLinks = ['12', 'uuid-mint-1'];

      const result = separateLinksByType(
        targetLinks,
        modelPlanQuestionsDataMocks.existingModelCollection,
        modelPlanQuestionsDataMocks.modelPlanCollection
      );

      expect(result.existingModelIDs).toEqual([12]);
      expect(result.currentModelPlanIDs).toEqual(['uuid-mint-1']);
    });
  });

  describe('getSubQuestionFields', () => {
    it('returns immediate child arrays and extra custom text fields matching configuration patterns', () => {
      const realConfig = {
        isNewModel: {
          options: { true: 'Yes' },
          optionsRelatedInfo: {
            true: 'resemblesExistingModelWhyHow'
          }
        },
        resemblesExistingModelWhyHow: {}
      } as unknown as CombinedConfigType;

      const result = getSubQuestionFields('isNewModel', 'true', realConfig);

      expect(result.childQuestionFields).toEqual([]);
      expect(result.optionsRelatedQuestionFields).toEqual([
        'resemblesExistingModelWhyHow'
      ]);
    });

    it('extracts deep child relation elements when mapped through functional array signatures', () => {
      const realConfig = {
        isNewModel: {
          options: { true: 'Yes' },
          childRelation: {
            true: [() => ({ gqlField: 'resemblesExistingModel' })]
          }
        },
        resemblesExistingModel: {}
      } as unknown as CombinedConfigType;

      const result = getSubQuestionFields('isNewModel', 'true', realConfig);

      expect(result.childQuestionFields).toEqual(['resemblesExistingModel']);
      expect(result.optionsRelatedQuestionFields).toEqual([]);
    });

    it('returns empty collections immediately if configuration blocks are completely missing', () => {
      const result = getSubQuestionFields('isNewModel', 'true', {} as any);
      expect(result.childQuestionFields).toEqual([]);
      expect(result.optionsRelatedQuestionFields).toEqual([]);
    });
  });

  describe('getDeepChildFields', () => {
    it('returns deeply nested down-tree field keys recursively', () => {
      const realConfig = {
        isNewModel: {
          options: { true: 'Yes' },
          optionsRelatedInfo: {
            true: 'resemblesExistingModelWhyHow'
          }
        },
        resemblesExistingModelWhyHow: {
          options: { true: 'Yes' },
          optionsRelatedInfo: {
            true: 'resemblesExistingModelHow'
          }
        },
        resemblesExistingModelHow: {}
      } as unknown as CombinedConfigType;

      const deepFields = getDeepChildFields(['isNewModel'], realConfig);

      expect(deepFields).toContain('resemblesExistingModelWhyHow');
      expect(deepFields).toContain('resemblesExistingModelHow');
    });
  });
});

describe('filterSuggestedWaiversByType', () => {
  it('filters suggested waivers by waiver type', () => {
    const mockSuggestedWaivers: MedicarePaymentSuggestedWaivers = [
      {
        __typename: 'SuggestedWaiver',
        id: '111',
        commonWaiver: {
          __typename: 'CommonWaiver',
          waiverType: CommonWaiverType.MEDICARE_PAYMENT,
          name: 'Common Waiver 1',
          id: '123'
        },
        commonWaiverID: '123'
      },
      {
        __typename: 'SuggestedWaiver',
        id: '222',
        commonWaiver: {
          __typename: 'CommonWaiver',
          waiverType: CommonWaiverType.PROGRAM_MEDICARE_BE,
          name: 'Common Waiver 2',
          id: '124'
        },
        commonWaiverID: '124'
      },
      {
        __typename: 'SuggestedWaiver',
        id: '333',
        commonWaiver: {
          __typename: 'CommonWaiver',
          waiverType: CommonWaiverType.MEDICAID_PAYMENT,
          name: 'Common Waiver 3',
          id: '125'
        },
        commonWaiverID: '125'
      }
    ];

    const medicareWaivers = filterSuggestedWaiversByType(
      mockSuggestedWaivers,
      'MEDICARE_PAYMENT'
    );

    expect(medicareWaivers).toEqual([
      {
        __typename: 'SuggestedWaiver',
        id: '111',
        commonWaiver: {
          __typename: 'CommonWaiver',
          waiverType: CommonWaiverType.MEDICARE_PAYMENT,
          name: 'Common Waiver 1',
          id: '123'
        },
        commonWaiverID: '123'
      }
    ]);

    const programWaivers = filterSuggestedWaiversByType(
      mockSuggestedWaivers,
      'PROGRAM_MEDICARE_BES'
    );

    expect(programWaivers).toEqual([
      {
        __typename: 'SuggestedWaiver',
        id: '222',
        commonWaiver: {
          __typename: 'CommonWaiver',
          waiverType: CommonWaiverType.PROGRAM_MEDICARE_BE,
          name: 'Common Waiver 2',
          id: '124'
        },
        commonWaiverID: '124'
      }
    ]);

    const medicaidWaivers = filterSuggestedWaiversByType(
      mockSuggestedWaivers,
      'MEDICAID_PAYMENT'
    );

    expect(medicaidWaivers).toEqual([
      {
        __typename: 'SuggestedWaiver',
        id: '333',
        commonWaiver: {
          __typename: 'CommonWaiver',
          waiverType: CommonWaiverType.MEDICAID_PAYMENT,
          name: 'Common Waiver 3',
          id: '125'
        },
        commonWaiverID: '125'
      }
    ]);
  });
});
