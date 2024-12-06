import React, { useCallback, useEffect, useState } from 'react';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button,
  Fieldset,
  Form,
  FormGroup,
  Label
} from '@trussworks/react-uswds';
import { MilestoneCardType } from 'features/ModelPlan/ModelToOperations/MilestoneLibrary';
import {
  // GetCustomMtoSolutionsQuery,
  GetModelToOperationsMatrixDocument,
  MtoCommonMilestoneKey,
  MtoCommonSolutionKey,
  useCreateMtoMilestoneMutation
  // useGetCustomMtoSolutionsQuery
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import HelpText from 'components/HelpText';
import MultiSelect from 'components/MultiSelect';
import useMessage from 'hooks/useMessage';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { getKeys } from 'types/translation';
import {
  composeMultiSelectOptions,
  convertCamelCaseToKebabCase
} from 'utils/modelPlan';

type FormValues = {
  commonSolutions: MtoCommonSolutionKey[] | undefined;
};

// TODO: Uncomment all instances once the custom solutions are available as mutation input

// type CustomMTOSolutionType =
//   GetCustomMtoSolutionsQuery['modelPlan']['mtoMatrix']['solutions'][0];

const AddCommonMilestoneForm = ({
  closeModal,
  milestone
}: {
  closeModal: () => void;
  milestone: MilestoneCardType;
}) => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { commonSolutions: commonSolutionsConfig } =
    usePlanTranslation('mtoMilestone');

  const history = useHistory();

  const params = new URLSearchParams(history.location.search);
  const milestoneKey = params.get('milestone') as MtoCommonMilestoneKey;

  const { modelID } = useParams<{ modelID: string }>();

  const { message, showMessage, clearMessage } = useMessage();

  // Variables for the form
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

  // const { data, loading } = useGetCustomMtoSolutionsQuery({
  //   variables: {
  //     id: modelID
  //   }
  // });

  // const customSolutions = useMemo(
  //   () => data?.modelPlan?.mtoMatrix?.solutions || [],
  //   [data?.modelPlan?.mtoMatrix?.solutions]
  // );

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

  // const formatCustomSolutions = useCallback(
  //   (solutions: CustomMTOSolutionType[]) => {
  //     return solutions
  //       .filter(solution => !solution.addedFromSolutionLibrary)
  //       .map(solution => {
  //         return {
  //           label: solution.name || '',
  //           value: solution.id
  //         };
  //       });
  //   },
  //   []
  // );

  const removeCommonSolutionsFromList = useCallback(
    (options: Record<MtoCommonSolutionKey, string>) => {
      const filteredSolutionOptions: Partial<
        Record<MtoCommonSolutionKey, string>
      > = {};
      getKeys(options).forEach(key => {
        if (!milestone.commonSolutions.find(s => s.key === key)) {
          filteredSolutionOptions[key] = commonSolutionsConfig.options[key];
        }
      });
      return filteredSolutionOptions;
    },
    [commonSolutionsConfig.options, milestone.commonSolutions]
  );

  const [groupedOptions, setGroupedOptions] = useState([
    {
      label: 'Suggested solutions for this milestone',
      options: formatSolutions(milestone.commonSolutions)
    },
    // {
    //   label: 'Custom solutions added to this MTO',
    //   options: formatCustomSolutions(customSolutions)
    // },
    {
      label: 'Other available solutions',
      options: composeMultiSelectOptions(
        removeCommonSolutionsFromList(commonSolutionsConfig.options),
        commonSolutionsConfig.readonlyOptions
      )
    }
  ]);

  useEffect(() => {
    setGroupedOptions([
      {
        label: 'Suggested solutions for this milestone',
        options: formatSolutions(milestone.commonSolutions)
      },
      // {
      //   label: 'Custom solutions added to this MTO',
      //   options: formatCustomSolutions(customSolutions)
      // },
      {
        label: 'Other available solutions',
        options: composeMultiSelectOptions(
          removeCommonSolutionsFromList(commonSolutionsConfig.options),
          commonSolutionsConfig.readonlyOptions
        )
      }
    ]);
  }, [
    milestone.commonSolutions,
    // customSolutions,
    commonSolutionsConfig.options,
    commonSolutionsConfig.readonlyOptions,
    formatSolutions,
    // formatCustomSolutions,
    removeCommonSolutionsFromList
  ]);

  const [create] = useCreateMtoMilestoneMutation({
    refetchQueries: [
      {
        query: GetModelToOperationsMatrixDocument,
        variables: { id: modelID }
      }
    ]
  });

  const onSubmit: SubmitHandler<FormValues> = formData => {
    if (!milestoneKey) return;

    create({
      variables: {
        modelPlanID: modelID,
        commonMilestoneKey: milestoneKey,
        commonSolutions: formData.commonSolutions
      }
    })
      .then(response => {
        if (!response?.errors) {
          closeModal();
        }
      })
      .catch(() => {
        showMessage(
          <Alert
            type="error"
            slim
            data-testid="error-alert"
            className="margin-y-4"
          >
            {t('modal.solution.alert.error')}
          </Alert>
        );
      });
  };

  return (
    <>
      <p className="mint-body-normal">
        {t('modal.solutionToMilestone.description')}
      </p>

      <FormProvider {...methods}>
        {message}
        <Form
          className="maxw-none"
          id="milestone-form"
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
                  >
                    {commonSolutionsConfig.label}
                  </Label>

                  <HelpText className="margin-top-1">
                    {commonSolutionsConfig.sublabel}
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
            {t('modal.solutionToMilestone.add', {
              count: watch('commonSolutions')?.length || 0
            })}
          </Button>

          <Button
            type="button"
            className="usa-button usa-button--unstyled"
            onClick={() => {
              reset();
              clearMessage();
              closeModal();
            }}
          >
            {t('modal.cancel')}
          </Button>
        </Form>
      </FormProvider>
    </>
  );
};

export default AddCommonMilestoneForm;
