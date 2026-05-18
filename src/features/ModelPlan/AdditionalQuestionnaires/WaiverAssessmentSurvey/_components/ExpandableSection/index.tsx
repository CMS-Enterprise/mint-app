import React, { useState } from 'react';
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

import { getSubQuestionFields, getTranslationKey } from '../../util';
import {
  CombinedConfigType,
  ModelPlanQuestionsFormTypeWithLinks
} from '../ModelPlanQuestionsForm';
import {
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
  const { t: waiverAssessmentSurveyT } = useTranslation(
    'waiverAssessmentSurvey'
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
          {waiverAssessmentSurveyT(
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

  if (!currentConfig) return null;

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

  const { childQuestionFields, optionsRelatedQuestionFields } =
    getSubQuestionFields(question, fieldValue, config);

  const shouldUseComboOptions =
    question === 'existingModel' ||
    question === 'resemblesExistingModelLinks' ||
    question === 'participationInModelPreconditionLinks';

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
                      getKeys(currentConfig.options).map(option => {
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
                      getKeys(currentConfig.options).map(option => {
                        const relatedField = optionsRelatedQuestionFields.find(
                          otherQuestion =>
                            otherQuestion ===
                            currentConfig.optionsRelatedInfo?.[
                              option as keyof typeof currentConfig.optionsRelatedInfo
                            ]
                        );

                        const childFields = childQuestionFields.filter(cq => {
                          if (
                            isTranslationFieldPropertiesWithOptionsAndChildren(
                              currentConfig
                            )
                          ) {
                            const relations =
                              currentConfig.childRelation?.[option];
                            return relations?.some(
                              (fn: any) => fn().gqlField === cq
                            );
                          }
                          return false;
                        });

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
                        onChange={field.onChange}
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
                      ? getKeys(currentConfig.options).map(option => ({
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
                    field.onChange(selectedValue);
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
