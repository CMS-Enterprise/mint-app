import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm
} from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  Button,
  Fieldset,
  Form,
  FormGroup,
  Label
} from '@trussworks/react-uswds';
import { helpSolutions } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import {
  GetModelToOperationsMatrixDocument,
  GetMtoMilestonesDocument,
  MtoCommonSolutionKey,
  useCreateMtoMilestoneMutation,
  useGetMtoAllSolutionsQuery,
  useGetMtoMilestoneQuery,
  useUpdateMtoMilestoneLinkedSolutionsMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import ExternalLink from 'components/ExternalLink';
import HelpText from 'components/HelpText';
import UswdsReactLink from 'components/LinkWrapper';
import MultiSelect from 'components/MultiSelect';
import { MTOModalContext } from 'contexts/MTOModalContext';
import useMessage from 'hooks/useMessage';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { convertCamelCaseToKebabCase } from 'utils/modelPlan';

import { MilestoneCardType } from '../../MilestoneLibrary';

type FormValues = {
  commonSolutions: MtoCommonSolutionKey[] | undefined;
};

const SelectSolutionForm = () => {
  const { modelID } = useParams<{ modelID: string }>();
  const { t } = useTranslation('modelToOperationsMisc');
  const { commonSolutions: commonSolutionsConfig } =
    usePlanTranslation('mtoMilestone');

  const {
    mtoModalState: { milestoneID },
    setMTOModalOpen
  } = useContext(MTOModalContext);

  const { message, showMessage, showErrorMessageInModal } = useMessage();

  const { data: milestoneData, error } = useGetMtoMilestoneQuery({
    variables: {
      id: milestoneID || ''
    }
  });

  const milestone = milestoneData?.mtoMilestone;

  // Custom solution state
  const [solutionIDs, setSolutionIDs] = useState<string[]>(
    milestone?.solutions
      .filter(solution => !solution.key)
      .map(solution => solution.id) || []
  );

  const { data: allSolutionData } = useGetMtoAllSolutionsQuery({
    variables: {
      id: modelID
    }
  });

  // Extracts all solutions from the query
  const allSolutions = useMemo(() => {
    return (
      allSolutionData?.modelPlan.mtoMatrix || {
        __typename: 'ModelsToOperationMatrix',
        commonSolutions: [],
        solutions: []
      }
    );
  }, [allSolutionData]);

  // Map the common solutions to the FE help solutions
  const mappedSolutions = useMemo(
    () =>
      milestone?.commonMilestone?.commonSolutions.map(solution => {
        return helpSolutions.find(s => s.enum === solution.key);
      }) || [],
    [milestone?.commonMilestone]
  );

  const mappedSolutionKeys = mappedSolutions.map(solution => solution?.enum);

  const commonSolutions =
    allSolutions?.commonSolutions.filter(
      solution => !mappedSolutionKeys.includes(solution.key)
    ) || [];

  const createdSolutions = useMemo(
    () => allSolutions?.solutions?.filter(solution => !solution.key) || [],
    [allSolutions?.solutions]
  );

  // Common solution state
  const [commonSolutionKeys, setCommonSolutionKeys] = useState<
    MtoCommonSolutionKey[]
  >(
    milestone?.solutions
      .filter(solution => !!solution.key)
      .map(solution => solution.key!) || []
  );

  const formatSolutions = useCallback(
    (solutions: MilestoneCardType['commonSolutions']) => {
      return solutions.map(solution => {
        return {
          label: commonSolutionsConfig.options[solution.key] || '',
          value: solution.key
        };
      });
    },
    [commonSolutionsConfig.options]
  );

  const groupedOptions = [
    {
      label: t('modal.editMilestone.suggestedSolution'),
      options: formatSolutions(
        milestone?.commonMilestone?.commonSolutions || []
      )
    },
    {
      label: t('modal.editMilestone.customSolution'),
      options: createdSolutions.map(solution => {
        return {
          label: solution.name || '',
          value: solution.id
        };
      })
    },
    {
      label: t('modal.editMilestone.otherSolutions'),
      options: commonSolutions.map(solution => {
        return {
          label: solution.name || '',
          value: solution.key
        };
      })
    }
  ];

  // Initial values for multiselect form component
  const initialValues = [...commonSolutionKeys, ...solutionIDs];

  // Checks to see if a solution is a custom solution by its ID
  const isCustomSolution = useCallback(
    (id: string) => {
      return createdSolutions.find(solution => solution.id === id);
    },
    [createdSolutions]
  );

  // Checks if the solution should be rendered in the SolutionCard component
  const isSuggestedSolution = useCallback(
    (key: string) => {
      return mappedSolutionKeys.find(k => k === key);
    },
    [mappedSolutionKeys]
  );

  const [selectedSolutions, setSelectedSolutions] =
    useState<string[]>(initialValues);

  const methods = useForm<FormValues>({
    defaultValues: {
      commonSolutions: []
    },
    mode: 'onBlur'
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isValid }
  } = methods;

  const [update] = useUpdateMtoMilestoneLinkedSolutionsMutation({
    refetchQueries: [
      {
        query: GetModelToOperationsMatrixDocument,
        variables: {
          id: modelID
        }
      }
    ]
  });

  const onSubmit: SubmitHandler<FormValues> = formData => {
    if (!milestoneID) return;

    showMessage('submitted');

    update({
      variables: {
        id: milestoneID,
        solutionLinks: {
          commonSolutionKeys,
          solutionIDs
        }
      }
    })
      .then(response => {
        if (!response?.errors) {
          showMessage(
            <>
              <Alert
                type="success"
                slim
                data-testid="mandatory-fields-alert"
                className="margin-y-4"
              >
                <span className="mandatory-fields-alert__text">
                  {t('modal.selectSolution.alert.success')}
                </span>
              </Alert>
            </>
          );
          setMTOModalOpen(false);
        }
      })
      .catch(() => {
        showErrorMessageInModal(
          <Alert
            type="error"
            slim
            data-testid="error-alert"
            className="margin-bottom-2"
          >
            {t('modal.selectSolution.alert.error')}
          </Alert>
        );
      });
  };

  return (
    <>
      <p className="mint-body-normal">
        {t('modal.selectSolution.description')}
      </p>

      <FormProvider {...methods}>
        {message}
        <Form
          className="maxw-none"
          id="select-solution-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Fieldset>
            <Controller
              name="commonSolutions"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <FormGroup className="margin-0">
                  <Label
                    htmlFor={convertCamelCaseToKebabCase('commonSolutions')}
                    requiredMarker
                  >
                    {commonSolutionsConfig.label}
                  </Label>

                  <HelpText>
                    <Trans
                      i18nKey="modelToOperationsMisc:modal.selectSolution.helperText"
                      components={{
                        solution: (
                          <UswdsReactLink
                            to={`/models/${modelID}/collaboration-area/model-to-operations/solution-library`}
                          >
                            {' '}
                          </UswdsReactLink>
                        ),
                        help: (
                          <UswdsReactLink
                            to="/help-and-knowledge/operational-solutions"
                            variant="external"
                            target="_blank"
                            className="margin-top-0"
                          >
                            {' '}
                          </UswdsReactLink>
                        )
                      }}
                    />
                  </HelpText>

                  <MultiSelect
                    {...field}
                    id={convertCamelCaseToKebabCase('multiSourceDataToCollect')}
                    inputId={convertCamelCaseToKebabCase('commonSolutions')}
                    ariaLabel={convertCamelCaseToKebabCase('commonSolutions')}
                    ariaLabelText={commonSolutionsConfig.label}
                    options={[]}
                    groupedOptions={groupedOptions}
                    selectedLabel={commonSolutionsConfig.multiSelectLabel || ''}
                    initialValues={watch('commonSolutions')}
                  />
                </FormGroup>
              )}
            />
          </Fieldset>

          <Button type="submit" disabled={!isValid} className="margin-right-3">
            {t('modal.selectSolution.cta.add', {
              count: watch('commonSolutions')?.length || 0
            })}
          </Button>

          <Button
            type="button"
            className="usa-button usa-button--unstyled"
            onClick={() => {
              reset();
              setMTOModalOpen(false);
            }}
          >
            {t('modal.cancel')}
          </Button>
        </Form>
      </FormProvider>
    </>
  );
};

export default SelectSolutionForm;
