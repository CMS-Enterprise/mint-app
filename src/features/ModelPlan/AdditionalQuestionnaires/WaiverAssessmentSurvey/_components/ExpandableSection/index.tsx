import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Button,
  ComboBox,
  Fieldset,
  FormGroup,
  Icon,
  Label,
  Radio,
  TextInput
} from '@trussworks/react-uswds';
import {
  CmsCenter,
  ModelCategory,
  TranslationDataType,
  TranslationFormType
} from 'gql/generated/graphql';

import BooleanRadioRHF from 'components/BooleanRadioForm/BooleanRadioRHF';
import CheckboxField from 'components/CheckboxField';
import MultiSelect from 'components/MultiSelect';
import TextAreaField from 'components/TextAreaField';
import Tooltip from 'components/Tooltip';
import {
  Bool,
  getKeys,
  isTranslationFieldPropertiesWithOptions,
  isTranslationFieldPropertiesWithOptionsAndChildren
} from 'types/translation';
import {
  composeMultiSelectOptions,
  convertCamelCaseToKebabCase
} from 'utils/modelPlan';

import {
  getDeepChildFields,
  getSubQuestionFields,
  getTranslationKey
} from '../../util';
import {
  CombinedConfigType,
  defaultFormValues,
  ModelPlanQuestionsFormTypeWithLinks
} from '../ModelPlanQuestionsForm';
import {
  MULTI_SELECT_WITH_OTHER,
  QuestionFieldType,
  QuestionType
} from '../ModelPlanQuestionsForm/questionMap';

type FormFieldType = Extract<
  QuestionFieldType,
  keyof ModelPlanQuestionsFormTypeWithLinks
>;

const ExpandableSection = ({
  questionGroup,
  config,
  setValue,
  control,
  comboOptions = []
}: {
  questionGroup: QuestionType[];
  config: CombinedConfigType;
  setValue: ReturnType<
    typeof useForm<ModelPlanQuestionsFormTypeWithLinks>
  >['setValue'];
  control: ReturnType<
    typeof useForm<ModelPlanQuestionsFormTypeWithLinks>
  >['control'];
  comboOptions?: { value: string; label: string }[];
}) => {
  const { t: waiverAssessmentSurveyMiscT } = useTranslation(
    'waiverAssessmentSurveyMisc'
  );

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <Button
        type="button"
        unstyled
        className="display-flex flex-align-center deep_underline margin-top-0 margin-bottom-2"
        onClick={() => setIsExpanded(prev => !prev)}
      >
        <span>
          {waiverAssessmentSurveyMiscT(
            `modelPlanQuestions.${isExpanded ? 'hideQuestions' : 'updateAnswers'}`
          )}
        </span>

        {!isExpanded ? (
          <Icon.ExpandMore aria-hidden aria-label="expand" />
        ) : (
          <Icon.ExpandLess aria-hidden aria-label="collapse" />
        )}
      </Button>

      {isExpanded &&
        questionGroup.map(question => (
          <ModelPlanQuestionItem
            key={question.field}
            question={question.field}
            config={config}
            setValue={setValue}
            control={control}
            comboOptions={comboOptions}
          />
        ))}
    </div>
  );
};

const ModelPlanQuestionItem = ({
  question,
  config,
  setValue,
  control,
  comboOptions = []
}: {
  question: QuestionFieldType;
  config: CombinedConfigType;
  setValue: ReturnType<
    typeof useForm<ModelPlanQuestionsFormTypeWithLinks>
  >['setValue'];
  control: ReturnType<
    typeof useForm<ModelPlanQuestionsFormTypeWithLinks>
  >['control'];
  comboOptions?: { value: string; label: string }[];
}) => {
  const translationKey = getTranslationKey(question);
  const currentConfig = config[translationKey as keyof CombinedConfigType];

  const fieldValue = useWatch({
    control,
    name: question as FormFieldType
  });

  const primaryCategoryValue = useWatch({
    control,
    name: 'modelCategory'
  });

  const hasOptions = isTranslationFieldPropertiesWithOptions(currentConfig);

  const fieldValueArray = (
    Array.isArray(fieldValue) ? fieldValue : []
  ) as unknown[];

  const fieldValueString =
    fieldValue !== null &&
    fieldValue !== undefined &&
    !Array.isArray(fieldValue)
      ? String(fieldValue)
      : '';

  const kebabName = convertCamelCaseToKebabCase(question);

  const filteredOptions = hasOptions
    ? getKeys(currentConfig.options).filter(option =>
        question === 'additionalModelCategories'
          ? (option as unknown as ModelCategory) !==
            ModelCategory.TO_BE_DETERMINED
          : true
      )
    : [];

  const subQuestionFields = getSubQuestionFields(question, fieldValue, config);
  const { childQuestionFields, optionsRelatedQuestionFields } =
    subQuestionFields;

  const previousSubQuestionFields = useRef(subQuestionFields);

  const { removedChildQuestionFields, removedOptionsRelatedQuestionFields } =
    useMemo(() => {
      const immediateRemovedChildren =
        previousSubQuestionFields.current.childQuestionFields.filter(
          field => !childQuestionFields.includes(field)
        );
      const immediateRemovedOptions =
        previousSubQuestionFields.current.optionsRelatedQuestionFields.filter(
          field => !optionsRelatedQuestionFields.includes(field)
        );

      return {
        removedChildQuestionFields: [
          ...immediateRemovedChildren,
          ...getDeepChildFields(immediateRemovedChildren, config)
        ],
        removedOptionsRelatedQuestionFields: [
          ...immediateRemovedOptions,
          ...getDeepChildFields(immediateRemovedOptions, config)
        ]
      };
    }, [childQuestionFields, optionsRelatedQuestionFields, config]);

  previousSubQuestionFields.current = subQuestionFields;

  const shouldUseComboOptions =
    question === 'existingModel' ||
    question === 'resemblesExistingModelLinks' ||
    question === 'participationInModelPreconditionLinks';

  /**
   * Clean up all subfields values when a parent question value has changed.
   */
  useEffect(() => {
    const allRemovedFields = [
      ...removedChildQuestionFields,
      ...removedOptionsRelatedQuestionFields
    ];

    if (allRemovedFields.length > 0) {
      allRemovedFields.forEach(field => {
        setValue(
          field,
          defaultFormValues[field as keyof ModelPlanQuestionsFormTypeWithLinks]
        );
      });
    }
  }, [
    removedChildQuestionFields,
    removedOptionsRelatedQuestionFields,
    setValue
  ]);

  if (!currentConfig) return null;

  return (
    <FormGroup className="margin-top-4">
      <Label htmlFor={kebabName} className="text-normal">
        {currentConfig.label}
      </Label>

      {currentConfig.sublabel && (
        <span className="usa-hint display-block text-normal">
          {currentConfig.sublabel}
        </span>
      )}

      <Controller
        name={question as FormFieldType}
        key={question}
        control={control}
        render={({ field: { ref, ...field } }) => {
          const { formType } = currentConfig;
          const isDataBoolean =
            currentConfig.dataType === TranslationDataType.BOOLEAN;

          return (
            <>
              {hasOptions && (
                <>
                  <Fieldset>
                    {formType === TranslationFormType.RADIO &&
                      !isDataBoolean &&
                      filteredOptions.map(option => {
                        const relatedField = optionsRelatedQuestionFields.find(
                          otherQuestion =>
                            otherQuestion ===
                            currentConfig.optionsRelatedInfo?.[
                              option as keyof typeof currentConfig.optionsRelatedInfo
                            ]
                        );

                        return (
                          <div
                            className="display-flex flex-column"
                            key={option}
                          >
                            <div className="display-flex flex-align-center">
                              <Radio
                                {...field}
                                id={`${kebabName}-${option}`}
                                data-testid={`${kebabName}-${option}`}
                                className="margin-right-1"
                                value={option}
                                label={
                                  <span
                                    className="display-flex flex-align-center"
                                    style={{ gap: '4px' }}
                                  >
                                    {
                                      currentConfig.options[
                                        option as keyof typeof currentConfig.options
                                      ]
                                    }
                                    {currentConfig.tooltips?.[option] && (
                                      <Tooltip
                                        label={currentConfig.tooltips[option]}
                                        position="right"
                                      >
                                        <Icon.Info
                                          className="text-base-light"
                                          aria-label="info"
                                        />
                                      </Tooltip>
                                    )}
                                  </span>
                                }
                                checked={field.value === option}
                              />
                            </div>

                            {relatedField && (
                              <div className="margin-left-4 margin-top-neg-3">
                                <ModelPlanQuestionItem
                                  question={relatedField}
                                  config={config}
                                  control={control}
                                  setValue={setValue}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}

                    {formType === TranslationFormType.RADIO &&
                      isDataBoolean && (
                        <div className="display-flex">
                          <BooleanRadioRHF
                            {...field}
                            field={field.name}
                            value={field.value as unknown as boolean}
                            options={
                              currentConfig.options as unknown as Record<
                                Bool,
                                string
                              >
                            }
                            setValue={setValue}
                            className="margin-right-1"
                          />
                        </div>
                      )}

                    {formType === TranslationFormType.CHECKBOX &&
                      filteredOptions.map(option => {
                        const relatedField = optionsRelatedQuestionFields.find(
                          otherQuestion =>
                            otherQuestion ===
                            currentConfig.optionsRelatedInfo?.[
                              option as keyof typeof currentConfig.optionsRelatedInfo
                            ]
                        );

                        const childFields = childQuestionFields.filter(
                          child => {
                            if (
                              isTranslationFieldPropertiesWithOptionsAndChildren(
                                currentConfig
                              )
                            ) {
                              const relations =
                                currentConfig.childRelation?.[option];
                              return relations?.some(
                                (fn: any) => fn().gqlField === child
                              );
                            }
                            return false;
                          }
                        );

                        const isOptionDisabled =
                          question === 'additionalModelCategories' &&
                          (option as unknown as ModelCategory) ===
                            primaryCategoryValue;

                        return (
                          <div
                            className="display-flex flex-column"
                            key={option}
                          >
                            <div className="display-flex flex-align-center">
                              <CheckboxField
                                {...field}
                                key={option}
                                id={`${kebabName}-${option}`}
                                testid={`${kebabName}-${option}`}
                                label={
                                  currentConfig.options[
                                    option as keyof typeof currentConfig.options
                                  ]
                                }
                                checked={fieldValueArray.includes(option)}
                                value={option}
                                onBlur={field.onBlur}
                                onChange={e => {
                                  const newValue = e.target.checked
                                    ? [...fieldValueArray, option]
                                    : fieldValueArray.filter(v => v !== option);

                                  field.onChange(newValue);
                                }}
                                icon={
                                  currentConfig.tooltips?.[option] ? (
                                    <Tooltip
                                      label={currentConfig.tooltips[option]}
                                      position="right"
                                      className="margin-left-05"
                                    >
                                      <Icon.Info
                                        className="text-base-light"
                                        aria-label="info"
                                      />
                                    </Tooltip>
                                  ) : undefined
                                }
                                disabled={isOptionDisabled}
                              />
                            </div>

                            {(childFields.length > 0 || relatedField) && (
                              <div className="margin-left-4 margin-top-neg-4">
                                {childFields.length > 0 &&
                                  childFields.map(subField => (
                                    <ModelPlanQuestionItem
                                      key={subField}
                                      question={subField}
                                      config={config}
                                      control={control}
                                      setValue={setValue}
                                    />
                                  ))}

                                {relatedField && (
                                  <ModelPlanQuestionItem
                                    question={relatedField}
                                    config={config}
                                    control={control}
                                    setValue={setValue}
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}

                    {formType === TranslationFormType.MULTISELECT && (
                      <MultiSelect
                        {...field}
                        key={`${kebabName}-${Array.isArray(field.value) ? field.value.length : 0}`}
                        id={kebabName}
                        inputId={kebabName}
                        ariaLabel={currentConfig.label}
                        options={
                          shouldUseComboOptions
                            ? [
                                ...comboOptions,
                                ...composeMultiSelectOptions(
                                  currentConfig.options
                                )
                              ]
                            : composeMultiSelectOptions(currentConfig.options)
                        }
                        selectedLabel={currentConfig.multiSelectLabel || ''}
                        initialValues={
                          (Array.isArray(field.value)
                            ? field.value
                            : []) as string[]
                        }
                        onChange={values => {
                          const hasSelectedOther = values.includes('Other');

                          const otherField =
                            MULTI_SELECT_WITH_OTHER[field.name];

                          if (otherField) {
                            setValue(otherField, hasSelectedOther);
                          }

                          field.onChange(values);
                        }}
                      />
                    )}
                  </Fieldset>
                </>
              )}

              {formType === TranslationFormType.SELECT && (
                <ComboBox
                  {...field}
                  id={kebabName}
                  data-testid={kebabName}
                  options={
                    hasOptions && !shouldUseComboOptions
                      ? filteredOptions.map(option => ({
                          value: option,
                          label:
                            currentConfig.options[
                              option as keyof typeof currentConfig.options
                            ]
                        }))
                      : comboOptions
                  }
                  defaultValue={field.value ? String(field.value) : ''}
                  onChange={selectedValue => {
                    field.onChange(selectedValue ?? null);
                  }}
                />
              )}

              {formType === TranslationFormType.TEXT && (
                <TextInput
                  {...field}
                  id={kebabName}
                  data-testid={kebabName}
                  type="text"
                  value={(field.value as string) || ''}
                />
              )}

              {formType === TranslationFormType.TEXTAREA && (
                <TextAreaField
                  {...field}
                  id={kebabName}
                  data-testid={kebabName}
                  value={fieldValueString}
                />
              )}
            </>
          );
        }}
      />

      {question === 'cmsCenters' &&
        fieldValueArray.includes(CmsCenter.CMMI) && (
          <ModelPlanQuestionItem
            question="cmmiGroups"
            config={config}
            control={control}
            setValue={setValue}
          />
        )}

      {childQuestionFields.length > 0 &&
        currentConfig.formType !== TranslationFormType.CHECKBOX &&
        childQuestionFields.map(subField => (
          <ModelPlanQuestionItem
            key={subField}
            question={subField}
            config={config}
            control={control}
            setValue={setValue}
            comboOptions={comboOptions}
          />
        ))}

      {optionsRelatedQuestionFields.length > 0 &&
        currentConfig.formType !== TranslationFormType.CHECKBOX &&
        !(
          currentConfig.formType === TranslationFormType.RADIO &&
          currentConfig.dataType !== TranslationDataType.BOOLEAN
        ) &&
        optionsRelatedQuestionFields.map(otherQuestion => (
          <ModelPlanQuestionItem
            key={otherQuestion}
            question={otherQuestion}
            config={config}
            control={control}
            setValue={setValue}
            comboOptions={comboOptions}
          />
        ))}
    </FormGroup>
  );
};

export default ExpandableSection;
