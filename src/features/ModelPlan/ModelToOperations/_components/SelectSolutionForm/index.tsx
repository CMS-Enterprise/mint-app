import React, { useContext, useMemo } from 'react';
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
  MtoCommonSolutionKey,
  useGetMtoAllSolutionsQuery,
  useGetMtoMilestoneQuery,
  useUpdateMtoMilestoneLinkedSolutionsMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import HelpText from 'components/HelpText';
import UswdsReactLink from 'components/LinkWrapper';
import MultiSelect from 'components/MultiSelect';
import { MTOModalContext } from 'contexts/MTOModalContext';
import useMessage from 'hooks/useMessage';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { convertCamelCaseToKebabCase } from 'utils/modelPlan';

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

  const { data: milestoneData } = useGetMtoMilestoneQuery({
    variables: {
      id: milestoneID || ''
    }
  });

  const milestone = milestoneData?.mtoMilestone;

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

  const mappedSolutions = useMemo(
    () =>
      milestone?.commonMilestone?.commonSolutions.map(solution => {
        return helpSolutions.find(s => s.enum === solution.key);
      }) || [],
    [milestone?.commonMilestone]
  );
  console.log(mappedSolutions);

  const mappedSolutionKeys = mappedSolutions.map(solution => solution?.enum);

  // All the common solutions but filter out the suggested solution
  const commonSolutions =
    allSolutions?.commonSolutions.filter(
      solution => !mappedSolutionKeys.includes(solution.key)
    ) || [];

  const createdSolutions =
    allSolutions?.solutions?.filter(solution => !solution.key) || [];

  const groupedOptions = [
    {
      label: t('modal.editMilestone.suggestedSolution'),
      options: mappedSolutions.map(solution => {
        return {
          label: solution?.name || '',
          value: solution?.enum || ''
        };
      })
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

    update({
      variables: {
        id: milestoneID,
        solutionLinks: {
          // TODO: Add the correct values here
          // commonSolutionKeys,
          // solutionIDs
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
                    onChange={values => console.log(values)}
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
