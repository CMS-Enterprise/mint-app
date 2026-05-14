import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Button,
  ComboBox,
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

import {
  CombinedConfigType,
  ModelPlanQuestionsDataType,
  QuestionFieldType,
  QuestionType
} from '../ModelPlanQuestionsForm';

const ExpandableSection = ({
  questionGroup,
  config,
  setValue,
  control
}: {
  questionGroup: QuestionType[];
  config: CombinedConfigType;
  setValue: ReturnType<typeof useForm<ModelPlanQuestionsDataType>>['setValue'];
  control: ReturnType<typeof useForm<ModelPlanQuestionsDataType>>['control'];
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
          />
        ))}
    </div>
  );
};

const ModelPlanQuestionItem = ({
  question,
  config,
  setValue,
  control
}: {
  question: QuestionFieldType;
  config: CombinedConfigType;
  setValue: ReturnType<typeof useForm<ModelPlanQuestionsDataType>>['setValue'];
  control: ReturnType<typeof useForm<ModelPlanQuestionsDataType>>['control'];
}) => {
  const currentConfig = config[question];
  const hasOptions = isTranslationFieldPropertiesWithOptions(currentConfig);
  const hasOptionsAndChildren =
    isTranslationFieldPropertiesWithOptionsAndChildren(currentConfig);

  if (!currentConfig) return null;

  return (
    <Controller
      name={question}
      key={question}
      control={control}
      render={({ field: { ref, ...field } }) => {
        const fieldValueArray = (
          Array.isArray(field.value) ? field.value : []
        ) as unknown[];

        const fieldValueString =
          field.value !== null &&
          field.value !== undefined &&
          !Array.isArray(field.value)
            ? String(field.value)
            : '';

        const childrenRelation =
          hasOptionsAndChildren &&
          fieldValueString &&
          currentConfig.childRelation
            ? currentConfig.childRelation[
                field.value as keyof typeof currentConfig.childRelation
              ]
            : null;

        const optionsRelatedInfo =
          hasOptions && fieldValueString && currentConfig.optionsRelatedInfo
            ? currentConfig.optionsRelatedInfo[
                fieldValueString as keyof typeof currentConfig.optionsRelatedInfo
              ]
            : null;

        const kebabName = convertCamelCaseToKebabCase(field.name);

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

            {/* Beginning of original question */}
            {hasOptions && (
              <>
                {currentConfig.formType === TranslationFormType.RADIO &&
                  currentConfig.dataType !== TranslationDataType.BOOLEAN &&
                  getKeys(currentConfig.options).map(option => (
                    <div className="display-flex" key={option}>
                      <Radio
                        {...field}
                        id={`${kebabName}-${option}`}
                        data-testid={`${kebabName}-${option}`}
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
                        className="margin-right-1"
                      />
                    </div>
                  ))}

                {currentConfig.formType === TranslationFormType.RADIO &&
                  currentConfig.dataType === TranslationDataType.BOOLEAN && (
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

                {currentConfig.formType === TranslationFormType.CHECKBOX &&
                  getKeys(currentConfig.options).map(option => (
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
                  ))}

                {currentConfig.formType === TranslationFormType.SELECT && (
                  <ComboBox
                    {...field}
                    id={kebabName}
                    data-testid={kebabName}
                    options={getKeys(currentConfig.options).map(option => ({
                      value: option,
                      label:
                        currentConfig.options[
                          option as keyof typeof currentConfig.options
                        ]
                    }))}
                    onChange={val => field.onChange(val || null)}
                    defaultValue={fieldValueString}
                  />
                )}

                {currentConfig.formType === TranslationFormType.MULTISELECT && (
                  <MultiSelect
                    {...field}
                    id={kebabName}
                    inputId={kebabName}
                    ariaLabel={currentConfig.label}
                    options={composeMultiSelectOptions(currentConfig.options)}
                    selectedLabel={currentConfig.multiSelectLabel || ''}
                    initialValues={fieldValueArray as string[]}
                    onChange={field.onChange}
                  />
                )}
              </>
            )}

            {currentConfig.formType === TranslationFormType.TEXT && (
              <TextInput
                {...field}
                id={kebabName}
                data-testid={kebabName}
                type="text"
                value={fieldValueString}
              />
            )}

            {currentConfig.formType === TranslationFormType.TEXTAREA && (
              <TextAreaField
                {...field}
                id={kebabName}
                data-testid={kebabName}
                value={fieldValueString}
              />
            )}
            {/* End of original question */}

            {/* CMS question */}
            {question === 'cmsCenters' &&
              fieldValueArray.includes(CmsCenter.CMMI) && (
                <ModelPlanQuestionItem
                  question="cmmiGroups"
                  config={config}
                  control={control}
                  setValue={setValue}
                />
              )}

            {/* Beginning of children questions */}
            {childrenRelation &&
              childrenRelation.map(childQuestion => {
                const childConfig = childQuestion();
                const childKey = childConfig.gqlField as QuestionFieldType;

                return (
                  <ModelPlanQuestionItem
                    key={childKey}
                    question={childKey}
                    config={config}
                    setValue={setValue}
                    control={control}
                  />
                );
              })}

            {/* handle Other option */}
            {optionsRelatedInfo && (
              <ModelPlanQuestionItem
                key={optionsRelatedInfo}
                question={optionsRelatedInfo as QuestionFieldType}
                config={config}
                setValue={setValue}
                control={control}
              />
            )}
          </FormGroup>
        );
      }}
    />
  );
};

export default ExpandableSection;
