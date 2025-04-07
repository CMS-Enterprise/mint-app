import React, { useMemo } from 'react';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm
} from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button,
  Fieldset,
  Form,
  FormGroup,
  Label
} from '@trussworks/react-uswds';
import {
  GetMtoCommonSolutionsDocument,
  MtoCommonSolutionKey,
  useCreateMtoSolutionCommonMutation,
  useGetMtoAllMilestonesQuery
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import HelpText from 'components/HelpText';
import MultiSelect from 'components/MultiSelect';
import useMessage from 'hooks/useMessage';
import {
  composeMultiSelectOptions,
  convertCamelCaseToKebabCase
} from 'utils/modelPlan';

type FormValues = {
  linkedMilestones: MtoCommonSolutionKey[] | string[] | undefined;
};

const AddToExistingMilestoneForm = ({
  closeModal,
  solutionName,
  solutionKey
}: {
  closeModal: () => void;
  solutionName?: string;
  solutionKey: MtoCommonSolutionKey;
}) => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { modelID } = useParams<{ modelID: string }>();

  const { message, showMessage, clearMessage, showErrorMessageInModal } =
    useMessage();

  const history = useHistory();

  const params = useMemo(() => {
    return new URLSearchParams(history.location.search);
  }, [history.location.search]);

  const { data, loading } = useGetMtoAllMilestonesQuery({
    variables: {
      id: modelID
    }
  });

  const milestones = useMemo(() => {
    return (
      data?.modelPlan?.mtoMatrix?.milestones.map(milestone => ({
        value: milestone.id,
        label: milestone.name
      })) || []
    );
  }, [data]);

  const multiSelectOptions = useMemo(() => {
    return composeMultiSelectOptions(
      milestones.reduce(
        (acc, milestone) => {
          acc[milestone.value] = milestone.label;
          return acc;
        },
        {} as Record<string, string>
      )
    );
  }, [milestones]);

  const methods = useForm<FormValues>({
    defaultValues: {
      linkedMilestones: []
    },
    mode: 'onBlur'
  });
  const { control, handleSubmit, reset, watch } = methods;

  const [create] = useCreateMtoSolutionCommonMutation({
    refetchQueries: [
      {
        query: GetMtoCommonSolutionsDocument,
        variables: { id: modelID }
      }
    ]
  });

  const onSubmit: SubmitHandler<FormValues> = ({ linkedMilestones }) => {
    create({
      variables: {
        modelPlanID: modelID,
        milestonesToLink: linkedMilestones || [],
        key: solutionKey
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
                  <Trans
                    i18nKey={t('modal.addToExistingMilestone.alert.success')}
                    components={{
                      b: <span className="text-bold" />
                    }}
                    values={{ title: solutionName }}
                  />
                </span>
              </Alert>
            </>
          );
          params.delete('add-solution', solutionKey);
          history.replace({ search: params.toString() });
          closeModal();
        }
      })
      .catch(() => {
        showErrorMessageInModal(
          <Alert
            type="error"
            slim
            data-testid="error-alert"
            className="margin-y-4"
          >
            {t('modal.addToExistingMilestone.alert.error')}
          </Alert>
        );
      });
  };

  return (
    <>
      <p className="mint-body-normal">
        {t('modal.addToExistingMilestone.description')}
      </p>

      {!loading && milestones.length === 0 && (
        <Alert type="info" className="margin-bottom-2">
          {t('modal.addToExistingMilestone.noMilestone')}
        </Alert>
      )}

      <FormProvider {...methods}>
        {message}
        <Form
          className="maxw-none"
          id="add-to-existing-milestone-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Fieldset disabled={loading || milestones?.length === 0}>
            <Controller
              name="linkedMilestones"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <FormGroup className="margin-0">
                  <Label
                    htmlFor={convertCamelCaseToKebabCase('linkedMilestones')}
                  >
                    {t('modal.addToExistingMilestone.label')}
                  </Label>

                  <HelpText className="margin-top-1">
                    {t('modal.addToExistingMilestone.helpText')}
                  </HelpText>

                  <MultiSelect
                    {...field}
                    disabled={milestones.length === 0}
                    id={convertCamelCaseToKebabCase('linkedMilestones')}
                    ariaLabel={convertCamelCaseToKebabCase('linkedMilestones')}
                    ariaLabelText={t('modal.addToExistingMilestone.label')}
                    options={multiSelectOptions}
                    selectedLabel={t(
                      'modal.addToExistingMilestone.selectedLabel'
                    )}
                    onChange={() => field.onChange(watch('linkedMilestones'))}
                    initialValues={watch('linkedMilestones')}
                  />
                </FormGroup>
              )}
            />
          </Fieldset>

          <div className="margin-top-0">
            <Button type="submit" className="margin-right-3">
              {watch('linkedMilestones')?.length === 0
                ? t('modal.addToExistingMilestone.cta.empty')
                : t('modal.addToExistingMilestone.cta.add', {
                    count: watch('linkedMilestones')?.length
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
          </div>
        </Form>
      </FormProvider>
    </>
  );
};

export default AddToExistingMilestoneForm;
