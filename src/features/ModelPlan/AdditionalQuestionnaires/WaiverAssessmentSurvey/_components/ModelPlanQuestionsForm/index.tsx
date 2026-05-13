import React, { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
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
import { isEmpty } from 'features/ModelPlan/ReadOnly/_components/ReadOnlySection/util';
import {
  CmsCenter,
  ExistingModelLink,
  GetModelPlanQuestionsQuery,
  TranslationFormType
} from 'gql/generated/graphql';

import CheckboxField from 'components/CheckboxField';
import FormFooter from 'components/FormFooter';
import MultiSelect from 'components/MultiSelect';
import TextAreaField from 'components/TextAreaField';
import Tooltip from 'components/Tooltip';
import usePlanTranslation from 'hooks/usePlanTranslation';
import {
  getKeys,
  isTranslationFieldPropertiesWithOptions,
  isTranslationFieldPropertiesWithOptionsAndChildren,
  TranslationBasics,
  TranslationGeneralCharacteristics
} from 'types/translation';
import mapDefaultFormValues from 'utils/mapDefaultFormValues';
import {
  composeMultiSelectOptions,
  convertCamelCaseToKebabCase
} from 'utils/modelPlan';

import '../../ModelPlanQuestions/index.scss';

type BasicsType = GetModelPlanQuestionsQuery['modelPlan']['basics'];

type GeneralCharacteristicsType =
  GetModelPlanQuestionsQuery['modelPlan']['generalCharacteristics'];

export type ModelPlanQuestionsDataType = { id: string } & Omit<
  BasicsType,
  'id' | '__typename'
> &
  Omit<GeneralCharacteristicsType, 'id' | '__typename'>;

type CombinedConfigType = TranslationBasics & TranslationGeneralCharacteristics;

type BasicQuestionKey = Extract<
  keyof TranslationBasics,
  keyof ModelPlanQuestionsDataType
>;

type GeneralQuestionKey = Extract<
  keyof TranslationGeneralCharacteristics,
  keyof ModelPlanQuestionsDataType
>;

const MODEL_PLAN_QUESTIONS: (BasicQuestionKey | GeneralQuestionKey)[][] = [
  ['modelCategory', 'additionalModelCategories'],
  ['cmsCenters'],
  ['isNewModel'],
  ['resemblesExistingModel'],
  ['participationInModelPrecondition'],
  ['keyCharacteristics'],
  ['geographiesTargeted'],
  ['waiversRequired']
];

const defaulFormValues: ModelPlanQuestionsDataType = {
  id: '',

  // --- Plan Basics ---
  modelCategory: null,
  additionalModelCategories: [],
  cmsCenters: [],
  cmmiGroups: [],

  // --- General Characteristics ---
  isNewModel: null,
  currentModelPlanID: null,
  existingModelID: null,
  resemblesExistingModel: null,
  resemblesExistingModelWhyHow: '',
  resemblesExistingModelHow: '',
  resemblesExistingModelNote: '',
  resemblesExistingModelOtherSpecify: '',
  resemblesExistingModelOtherSelected: false,
  resemblesExistingModelOtherOption: '',
  participationInModelPrecondition: null,
  participationInModelPreconditionOtherSpecify: '',
  participationInModelPreconditionOtherSelected: false,
  participationInModelPreconditionOtherOption: '',
  participationInModelPreconditionWhyHow: '',
  participationInModelPreconditionNote: '',
  keyCharacteristics: [],
  keyCharacteristicsOther: '',
  keyCharacteristicsNote: '',
  geographiesTargeted: null,
  geographiesTargetedTypes: [],
  geographiesStatesAndTerritories: [],
  geographiesRegionTypes: [],
  geographiesTargetedTypesOther: '',
  geographiesTargetedAppliedTo: [],
  geographiesTargetedAppliedToOther: '',
  geographiesTargetedNote: '',
  waiversRequired: null,
  waiversRequiredTypes: [],
  waiversRequiredNote: '',
  resemblesExistingModelWhich: {
    __typename: 'ExistingModelLinks',
    links: [] as ExistingModelLink[]
  },
  participationInModelPreconditionWhich: {
    __typename: 'ExistingModelLinks',
    links: [] as ExistingModelLink[]
  }
};

const ModelPlanQuestionsForm = ({
  modelPlanQuestionsData
}: {
  modelPlanQuestionsData: ModelPlanQuestionsDataType;
}) => {
  const { t: additionalQuestionnairesT } = useTranslation(
    'additionalQuestionnaires'
  );

  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const combinedConfig: CombinedConfigType = {
    ...usePlanTranslation('basics'),
    ...usePlanTranslation('generalCharacteristics')
  };

  const formData = mapDefaultFormValues<ModelPlanQuestionsDataType>(
    modelPlanQuestionsData,
    defaulFormValues
  );

  const { id, ...defaultValues } = formData;

  const methods = useForm<ModelPlanQuestionsDataType>({
    defaultValues,
    mode: 'onChange'
  });

  const {
    control,
    // handleSubmit,
    // formState: { touchedFields },
    watch
    // setValue,
    // reset
  } = methods;

  const liveFormData = watch();

  const formattedValue = (
    key: keyof typeof combinedConfig,
    rawValue: unknown
  ) => {
    const config = combinedConfig[key];

    if (isTranslationFieldPropertiesWithOptions(config)) {
      if (Array.isArray(rawValue)) {
        return rawValue
          .map(value => config.options[value as keyof typeof config.options])
          .join(', ');
      }
      return config.options[rawValue as keyof typeof config.options];
    }
    return String(rawValue);
  };

  return (
    <FormProvider {...methods}>
      <div className="display-flex bg-base-lightest padding-3 flex-column">
        {MODEL_PLAN_QUESTIONS.map((questionGroup, index) => (
          <div
            key={questionGroup.join(',')}
            className={`${index === MODEL_PLAN_QUESTIONS.length - 1 ? 'margin-bottom-0' : 'margin-bottom-4'}`}
          >
            {questionGroup.map(question => (
              <div key={question} className="margin-bottom-2">
                <span className="text-bold margin-y-0 mint-text-normal">
                  {combinedConfig[question].label}
                </span>

                <div className="margin-y-0 mint-text-medium text-light text-pre-line text-overflow-wrap-break-word">
                  {isEmpty(liveFormData[question]) ? (
                    <em>{miscellaneousT('na')}</em>
                  ) : (
                    formattedValue(question, liveFormData[question])
                  )}
                </div>
              </div>
            ))}

            <ExpandableSection
              questionGroup={questionGroup}
              config={combinedConfig}
              control={control}
            />
          </div>
        ))}
      </div>

      <FormFooter
        id="waiver-assessment-survey-model-plan-questions-form"
        homeArea={additionalQuestionnairesT('saveAndReturnToQuestionnaires')}
        homeRoute={`/models/${modelPlanQuestionsData.id}/collaboration-area/additional-questionnaires`}
        backPage={`/models/${modelPlanQuestionsData.id}/collaboration-area/additional-questionnaires/waiver-assessment-survey/about`}
        nextPage
        disabled={false}
      />
    </FormProvider>
  );
};

const ExpandableSection = ({
  questionGroup,
  config,
  control
}: {
  questionGroup: (BasicQuestionKey | GeneralQuestionKey)[];
  config: CombinedConfigType;
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
        className="display-flex flex-align-center deep_underline margin-bottom-2"
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
            key={question}
            question={question}
            config={config}
            control={control}
          />
        ))}
    </div>
  );
};

const ModelPlanQuestionItem = ({
  question,
  control,
  config
}: {
  question: BasicQuestionKey | GeneralQuestionKey;
  config: CombinedConfigType;
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
                  control={control}
                  config={config}
                />
              )}

            {/* Beginning of children questions */}
            {childrenRelation &&
              childrenRelation.map(childQuestion => {
                const childConfig = childQuestion();
                const childKey = childConfig.gqlField as
                  | BasicQuestionKey
                  | GeneralQuestionKey;

                return (
                  <ModelPlanQuestionItem
                    key={childKey}
                    question={childKey}
                    control={control}
                    config={config}
                  />
                );
              })}

            {/* handle Other option */}
            {optionsRelatedInfo && (
              <ModelPlanQuestionItem
                key={optionsRelatedInfo}
                question={
                  optionsRelatedInfo as BasicQuestionKey | GeneralQuestionKey
                }
                control={control}
                config={config}
              />
            )}
          </FormGroup>
        );
      }}
    />
  );
};

export default ModelPlanQuestionsForm;
