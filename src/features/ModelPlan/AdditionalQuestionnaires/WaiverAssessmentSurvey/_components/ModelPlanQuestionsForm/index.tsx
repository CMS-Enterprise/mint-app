import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useBlocker, useNavigate, useParams } from 'react-router-dom';
import { Form } from '@trussworks/react-uswds';
import { isEmpty } from 'features/ModelPlan/ReadOnly/_components/ReadOnlySection/util';
import {
  ExistingModelLink,
  GetModelPlanQuestionsQuery,
  useUpdateModelPlanQuestionsMutation
} from 'gql/generated/graphql';

import FormFooter from 'components/FormFooter';
import MutationErrorModal from 'components/MutationErrorModal';
import { useErrorMessage } from 'contexts/ErrorContext';
import usePlanTranslation from 'hooks/usePlanTranslation';
import {
  TranslationBasics,
  TranslationGeneralCharacteristics
} from 'types/translation';
import mapDefaultFormValues from 'utils/mapDefaultFormValues';

import { formattedValue, getChildrenQuestions, getFormDiffs } from '../../util';
import ExpandableSection from '../ExpandableSection';

import '../../ModelPlanQuestions/index.scss';

type BasicsType = GetModelPlanQuestionsQuery['modelPlan']['basics'];

type GeneralCharacteristicsType =
  GetModelPlanQuestionsQuery['modelPlan']['generalCharacteristics'];

export type ModelPlanQuestionsDataType = Omit<BasicsType, 'id' | '__typename'> &
  Omit<GeneralCharacteristicsType, 'id' | '__typename'> & {
    basicsId: string;
    generalCharacteristicsId: string;
  };

export type CombinedConfigType = TranslationBasics &
  TranslationGeneralCharacteristics;

type BasicQuestionKey = Extract<
  keyof TranslationBasics,
  keyof ModelPlanQuestionsDataType
>;

type GeneralQuestionKey = Extract<
  keyof TranslationGeneralCharacteristics,
  keyof ModelPlanQuestionsDataType
>;

export type QuestionFieldType = BasicQuestionKey | GeneralQuestionKey;

export type QuestionType = {
  field: QuestionFieldType;
  childRelation?: QuestionType[];
};

const MODEL_PLAN_QUESTIONS: QuestionType[][] = [
  [
    { field: 'modelCategory' },
    {
      field: 'additionalModelCategories'
    }
  ],
  [
    {
      field: 'cmsCenters',
      childRelation: [{ field: 'cmmiGroups' }]
    }
  ],
  [
    {
      field: 'isNewModel',
      childRelation: [
        {
          field: 'existingModel'
        }
      ]
    }
  ],
  [
    {
      field: 'resemblesExistingModel',
      childRelation: [
        {
          field: 'resemblesExistingModelWhyHow'
        },
        {
          field: 'resemblesExistingModelWhich'
        },
        {
          field: 'resemblesExistingModelHow'
        },
        {
          field: 'resemblesExistingModelOtherSpecify'
        }
      ]
    }
  ],
  [
    {
      field: 'participationInModelPrecondition',
      childRelation: [
        { field: 'participationInModelPreconditionWhich' },
        { field: 'participationInModelPreconditionWhyHow' },
        { field: 'participationInModelPreconditionOtherSpecify' }
      ]
    }
  ],
  [
    {
      field: 'keyCharacteristics',
      childRelation: [
        { field: 'collectPlanBids' },
        { field: 'managePartCDEnrollment' },
        { field: 'planContractUpdated' },
        { field: 'keyCharacteristicsOther' }
      ]
    }
  ],
  [
    {
      field: 'geographiesTargeted',
      childRelation: [
        { field: 'geographiesTargetedTypes' },
        { field: 'geographiesTargetedAppliedTo' }
      ]
    }
  ],
  [
    {
      field: 'waiversRequired',
      childRelation: [{ field: 'waiversRequiredTypes' }]
    }
  ]
];

const defaultFormValues: ModelPlanQuestionsDataType = {
  // --- Plan Basics ---
  basicsId: '',
  modelCategory: null,
  additionalModelCategories: [],
  cmsCenters: [],
  cmmiGroups: [],

  // --- General Characteristics ---
  generalCharacteristicsId: '',
  isNewModel: null,
  currentModelPlanID: null,
  existingModelID: null,
  existingModel: null,
  resemblesExistingModel: null,
  resemblesExistingModelWhyHow: '',
  resemblesExistingModelHow: '',
  resemblesExistingModelOtherSpecify: '',
  resemblesExistingModelOtherSelected: false,
  resemblesExistingModelOtherOption: '',
  participationInModelPrecondition: null,
  participationInModelPreconditionOtherSpecify: '',
  participationInModelPreconditionOtherSelected: false,
  participationInModelPreconditionOtherOption: '',
  participationInModelPreconditionWhyHow: '',
  keyCharacteristics: [],
  keyCharacteristicsOther: '',
  collectPlanBids: null,
  managePartCDEnrollment: null,
  planContractUpdated: null,
  geographiesTargeted: null,
  geographiesTargetedTypes: [],
  geographiesStatesAndTerritories: [],
  geographiesRegionTypes: [],
  geographiesTargetedTypesOther: '',
  geographiesTargetedAppliedTo: [],
  geographiesTargetedAppliedToOther: '',
  waiversRequired: null,
  waiversRequiredTypes: [],
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
  modelPlanQuestionsData,
  modelPlanOptions
}: {
  modelPlanQuestionsData: ModelPlanQuestionsDataType;
  modelPlanOptions: { label: string; value: string }[];
}) => {
  const { t: additionalQuestionnairesT } = useTranslation(
    'additionalQuestionnaires'
  );

  const combinedConfig: CombinedConfigType = {
    ...usePlanTranslation('basics'),
    ...usePlanTranslation('generalCharacteristics')
  };

  const { modelID = '' } = useParams<{ modelID: string }>();

  const navigate = useNavigate();

  const [destinationURL, setDestinationURL] = useState<string>('');
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);

  const [updateModelPlanQuestions, { loading: submitting }] =
    useUpdateModelPlanQuestionsMutation();

  const formData = mapDefaultFormValues<ModelPlanQuestionsDataType>(
    modelPlanQuestionsData,
    defaultFormValues
  );

  const methods = useForm<ModelPlanQuestionsDataType>({
    defaultValues: formData,
    mode: 'onChange'
  });

  const {
    control,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { defaultValues, isDirty }
  } = methods;

  const liveFormData = watch();

  useErrorMessage('skip', true);

  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    if (
      isErrorModalOpen ||
      nextLocation.pathname === currentLocation.pathname
    ) {
      return false;
    }

    if (!isDirty) {
      return false;
    }

    const currentValues = getValues();

    const { basicsId, generalCharacteristicsId } =
      defaultValues as ModelPlanQuestionsDataType;

    const {
      basicsChanges,
      withBasics,
      generalCharacteristicsChanges,
      withGeneralCharacteristics
    } = getFormDiffs(
      defaultValues as ModelPlanQuestionsDataType,
      currentValues
    );

    // ONLY block and save if there is an actual diff to send
    if (withBasics || withGeneralCharacteristics) {
      updateModelPlanQuestions({
        variables: {
          modelPlanID: modelID,
          basicsId,
          basicsChanges: withBasics ? basicsChanges : {},
          withBasics,
          generalCharacteristicsId,
          generalCharacteristicsChanges: withGeneralCharacteristics
            ? generalCharacteristicsChanges
            : {},
          withGeneralCharacteristics,
          withParticipationLinks: false,
          withResemblesLinks: false
        }
      })
        .then(response => {
          if (!response?.errors) {
            setDestinationURL(nextLocation.pathname);
            blocker?.proceed?.();
          } else {
            setDestinationURL(nextLocation.pathname);
            setIsErrorModalOpen(true);
          }
        })
        .catch(() => {
          setDestinationURL(nextLocation.pathname);
          setIsErrorModalOpen(true);
        });
    }

    return false;
  });

  return (
    <FormProvider {...methods}>
      {isErrorModalOpen && (
        <MutationErrorModal
          isOpen={isErrorModalOpen}
          closeModal={() => setIsErrorModalOpen(false)}
          url={destinationURL}
        />
      )}

      <Form
        id="waiver-assessment-survey-model-plan-questions-form"
        data-testid="waiver-assessment-survey-model-plan-questions-form"
        className="maxw-none"
        onSubmit={handleSubmit(() =>
          navigate(
            `/models/${modelID}/collaboration-area/additional-questionnaires/waiver-assessment-survey/about`
          )
        )}
      >
        <div className="display-flex bg-base-lightest padding-3 flex-column">
          {MODEL_PLAN_QUESTIONS.map((questionGroup, index) => (
            <div
              key={questionGroup.map(q => q.field).join(',')}
              className={`${index === MODEL_PLAN_QUESTIONS.length - 1 ? 'margin-bottom-0' : 'margin-bottom-4'}`}
            >
              {questionGroup.map(questionConfig => {
                const question = questionConfig.field;

                const childrenQuestions = getChildrenQuestions(
                  questionConfig,
                  liveFormData
                );

                return (
                  <div key={question}>
                    <QuestionBody
                      label={combinedConfig[question].label}
                      answer={formattedValue({
                        combinedConfig,
                        key: question,
                        rawValue: liveFormData[question],
                        comboOptions: modelPlanOptions
                      })}
                    />

                    {childrenQuestions.length > 0 && (
                      <>
                        {childrenQuestions.map(childQuestion => (
                          <QuestionBody
                            key={childQuestion}
                            label={combinedConfig[childQuestion].label}
                            answer={formattedValue({
                              combinedConfig,
                              key: childQuestion,
                              rawValue: liveFormData[childQuestion],
                              comboOptions: modelPlanOptions
                            })}
                          />
                        ))}
                      </>
                    )}
                  </div>
                );
              })}

              <ExpandableSection
                questionGroup={questionGroup}
                config={combinedConfig}
                setValue={setValue}
                control={control}
                comboOptions={modelPlanOptions}
              />
            </div>
          ))}
        </div>

        <FormFooter
          id="waiver-assessment-survey-model-plan-questions-form"
          homeArea={additionalQuestionnairesT('saveAndReturnToQuestionnaires')}
          homeRoute={`/models/${modelID}/collaboration-area/additional-questionnaires`}
          backPage={`/models/${modelID}/collaboration-area/additional-questionnaires/waiver-assessment-survey/about`}
          nextPage
          disabled={submitting}
        />
      </Form>
    </FormProvider>
  );
};

const QuestionBody = ({ label, answer }: { label: string; answer: string }) => {
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  return (
    <div className="margin-bottom-2">
      <span className="text-bold margin-y-0 mint-text-normal">{label}</span>

      <div className="margin-y-0 mint-text-medium text-light text-pre-line text-overflow-wrap-break-word">
        {isEmpty(answer) ? <em>{miscellaneousT('na')}</em> : answer}
      </div>
    </div>
  );
};

export default ModelPlanQuestionsForm;
