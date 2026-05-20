import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useBlocker, useNavigate, useParams } from 'react-router-dom';
import { Form } from '@trussworks/react-uswds';
import { isEmpty } from 'features/ModelPlan/ReadOnly/_components/ReadOnlySection/util';
import {
  CmsCenter,
  ExistingModelLinks,
  GetModelPlanQuestionsQuery,
  useUpdateModelPlanQuestionsMutation
} from 'gql/generated/graphql';

import ConfirmLeaveRHF from 'components/ConfirmLeave/ConfirmLeaveRHF';
import FormFooter from 'components/FormFooter';
import MutationErrorModal from 'components/MutationErrorModal';
import { useErrorMessage } from 'contexts/ErrorContext';
import usePlanTranslation from 'hooks/usePlanTranslation';
import {
  TranslationBasics,
  TranslationGeneralCharacteristics
} from 'types/translation';
import mapDefaultFormValues from 'utils/mapDefaultFormValues';

import {
  formattedLabel,
  formattedValue,
  getFormDiffs,
  getMapChildrenQuestions,
  separateLinksByType
} from '../../util';
import ExpandableSection from '../ExpandableSection';

import MODEL_PLAN_QUESTIONS from './questionMap';

import '../../ModelPlanQuestions/index.scss';

type BasicsType = GetModelPlanQuestionsQuery['modelPlan']['basics'];

type GeneralCharacteristicsType =
  GetModelPlanQuestionsQuery['modelPlan']['generalCharacteristics'];

export type ModelPlanQuestionsDataType = Omit<BasicsType, 'id' | '__typename'> &
  Omit<GeneralCharacteristicsType, 'id' | '__typename'> & {
    basicsId: string;
    generalCharacteristicsId: string;
  };

export type ModelPlanQuestionsFormTypeWithLinks = Omit<
  ModelPlanQuestionsDataType,
  | 'currentModelPlanID'
  | 'existingModelID'
  | 'existingModel'
  | 'resemblesExistingModelWhich'
  | 'participationInModelPreconditionWhich'
> & {
  resemblesExistingModelLinks: string[];
  participationInModelPreconditionLinks: string[];
  existingModel: string | number | null;
};

export type CombinedConfigType = TranslationBasics &
  TranslationGeneralCharacteristics;

export const defaultFormValues: ModelPlanQuestionsFormTypeWithLinks = {
  // --- Plan Basics ---
  basicsId: '',
  modelCategory: null,
  additionalModelCategories: [],
  cmsCenters: [],
  cmmiGroups: [],

  // --- General Characteristics ---
  generalCharacteristicsId: '',
  isNewModel: null,
  existingModel: null,
  resemblesExistingModel: null,
  resemblesExistingModelWhyHow: '',
  resemblesExistingModelHow: '',
  resemblesExistingModelLinks: [],
  resemblesExistingModelOtherSpecify: '',
  resemblesExistingModelOtherSelected: false,
  resemblesExistingModelOtherOption: '',
  participationInModelPrecondition: null,
  participationInModelPreconditionLinks: [],
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
  waiversRequiredTypes: []
};

const ModelPlanQuestionsForm = ({
  modelPlanQuestionsData,
  modelPlanOptions,
  mintModelPlanCollection,
  existingModelCollection
}: {
  modelPlanQuestionsData: ModelPlanQuestionsDataType;
  modelPlanOptions: { label: string; value: string }[];
  mintModelPlanCollection: GetModelPlanQuestionsQuery['modelPlanCollection'];
  existingModelCollection: GetModelPlanQuestionsQuery['existingModelCollection'];
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

  const existingModel =
    modelPlanQuestionsData.currentModelPlanID ||
    modelPlanQuestionsData.existingModelID ||
    null;

  // Formats query data of existing links to feed into multiselect
  // Checks if Other field is selected, if so append Other to the list of existing models
  const formatExistingLinkData = useCallback(
    (
      existingLinks: ExistingModelLinks | undefined | null,
      isOtherSelected: boolean | undefined | null
    ): string[] => {
      if (!existingLinks) return [];

      const formattedLinks =
        existingLinks.links?.map(
          link => String(link.existingModelID || link.currentModelPlanID)!
        ) || [];

      // Checking if Other was persisted to db, if so add it as an resemblesExistingModelLinks value
      if (isOtherSelected) {
        formattedLinks.push('Other');
      }

      return formattedLinks;
    },
    []
  );

  const resemblesExistingModelLinks: string[] = useMemo(() => {
    return formatExistingLinkData(
      modelPlanQuestionsData.resemblesExistingModelWhich as ExistingModelLinks,
      modelPlanQuestionsData.resemblesExistingModelOtherSelected
    );
  }, [
    modelPlanQuestionsData.resemblesExistingModelWhich,
    modelPlanQuestionsData.resemblesExistingModelOtherSelected,
    formatExistingLinkData
  ]);

  const participationInModelPreconditionLinks: string[] = useMemo(() => {
    return formatExistingLinkData(
      modelPlanQuestionsData.participationInModelPreconditionWhich as ExistingModelLinks,
      modelPlanQuestionsData.participationInModelPreconditionOtherSelected
    );
  }, [
    modelPlanQuestionsData.participationInModelPreconditionWhich,
    modelPlanQuestionsData.participationInModelPreconditionOtherSelected,
    formatExistingLinkData
  ]);

  const {
    currentModelPlanID,
    existingModelID,
    resemblesExistingModelWhich,
    participationInModelPreconditionWhich,
    ...remainingQuestionsData
  } = modelPlanQuestionsData;

  const modelQuestionsDataWithLinks: ModelPlanQuestionsFormTypeWithLinks = {
    ...remainingQuestionsData,
    resemblesExistingModelLinks,
    participationInModelPreconditionLinks,
    existingModel
  };

  const formData = mapDefaultFormValues<ModelPlanQuestionsFormTypeWithLinks>(
    modelQuestionsDataWithLinks,
    defaultFormValues
  );

  const methods = useForm<ModelPlanQuestionsFormTypeWithLinks>({
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
      defaultValues as ModelPlanQuestionsFormTypeWithLinks;

    const {
      basicsChanges,
      withBasics,
      generalCharacteristicsChanges,
      withGeneralCharacteristics,
      withResemblesLinks,
      withParticipationLinks
    } = getFormDiffs(
      defaultValues as ModelPlanQuestionsFormTypeWithLinks,
      currentValues
    );

    let resemblesExistingModelIDs: number[] = [];
    let resemblesCurrentModelPlanIDs: string[] = [];

    let participationExistingModelIDs: number[] = [];
    let participationCurrentModelPlanIDs: string[] = [];

    if (withResemblesLinks) {
      const resemblesSplit = separateLinksByType(
        currentValues.resemblesExistingModelLinks,
        existingModelCollection,
        mintModelPlanCollection
      );
      resemblesExistingModelIDs = resemblesSplit.existingModelIDs;
      resemblesCurrentModelPlanIDs = resemblesSplit.currentModelPlanIDs;
    }

    if (withParticipationLinks) {
      const participationSplit = separateLinksByType(
        currentValues.participationInModelPreconditionLinks,
        existingModelCollection,
        mintModelPlanCollection
      );
      participationExistingModelIDs = participationSplit.existingModelIDs;
      participationCurrentModelPlanIDs = participationSplit.currentModelPlanIDs;
    }

    // ONLY block and save if there is an actual diff to send
    if (
      withBasics ||
      withGeneralCharacteristics ||
      withResemblesLinks ||
      withParticipationLinks
    ) {
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

          withResemblesLinks,
          resemblesExistingModelIDs: withResemblesLinks
            ? resemblesExistingModelIDs
            : [],
          resemblesCurrentModelPlanIDs: withResemblesLinks
            ? resemblesCurrentModelPlanIDs
            : [],

          withParticipationLinks,
          participationExistingModelIDs: withParticipationLinks
            ? participationExistingModelIDs
            : [],
          participationCurrentModelPlanIDs: withParticipationLinks
            ? participationCurrentModelPlanIDs
            : []
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

  /** Below useEffect handles manually sub field value clean up upon parent field change */
  useEffect(() => {
    const primaryCategory = liveFormData?.modelCategory;
    const additionalCategories = liveFormData?.additionalModelCategories || [];

    if (primaryCategory && additionalCategories.includes(primaryCategory)) {
      const sanitizedCategories = additionalCategories.filter(
        category => category !== primaryCategory
      );

      setValue('additionalModelCategories', sanitizedCategories, {
        shouldDirty: true,
        shouldValidate: true
      });
    }
  }, [
    liveFormData?.modelCategory,
    liveFormData?.additionalModelCategories,
    setValue
  ]);

  useEffect(() => {
    const cmsCenters = liveFormData?.cmsCenters || [];
    const cmmiGroups = liveFormData?.cmmiGroups || [];

    if (!cmsCenters.includes(CmsCenter.CMMI) && cmmiGroups.length > 0) {
      setValue('cmmiGroups', [], { shouldDirty: true });
    }
  }, [liveFormData?.cmsCenters, liveFormData?.cmmiGroups, setValue]);

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
        <ConfirmLeaveRHF />

        <div className="display-flex bg-base-lightest padding-3 flex-column">
          {MODEL_PLAN_QUESTIONS.map((questionGroup, index) => (
            <div
              key={questionGroup.map(q => q.field).join(',')}
              className={`${index === MODEL_PLAN_QUESTIONS.length - 1 ? 'margin-bottom-0' : 'margin-bottom-4'}`}
            >
              {questionGroup.map(questionConfig => {
                const question = questionConfig.field;

                const childrenQuestions = getMapChildrenQuestions(
                  questionConfig,
                  liveFormData
                );

                return (
                  <div key={question}>
                    <QuestionBody
                      label={formattedLabel({ combinedConfig, key: question })}
                      answer={formattedValue({
                        combinedConfig,
                        key: question,
                        rawValue:
                          liveFormData[
                            question as keyof ModelPlanQuestionsFormTypeWithLinks
                          ],
                        comboOptions: modelPlanOptions
                      })}
                    />

                    {childrenQuestions.length > 0 && (
                      <>
                        {childrenQuestions.map(childQuestion => (
                          <QuestionBody
                            key={childQuestion}
                            label={formattedLabel({
                              combinedConfig,
                              key: childQuestion
                            })}
                            answer={formattedValue({
                              combinedConfig,
                              key: childQuestion,
                              rawValue:
                                liveFormData[
                                  childQuestion as keyof ModelPlanQuestionsFormTypeWithLinks
                                ],
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
