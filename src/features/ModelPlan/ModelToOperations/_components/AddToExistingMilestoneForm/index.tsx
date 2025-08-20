import React, { useMemo } from 'react';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm
} from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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
import { useErrorMessage } from 'contexts/ErrorContext';
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

  const { modelID = '' } = useParams<{ modelID: string }>();

  const { message, showMessage, clearMessage } = useMessage();
  const { setErrorMeta } = useErrorMessage();

  const navigate = useNavigate();

  const location = useLocation();

  const params = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location.search]);

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
    mode: 'onChange'
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
    setErrorMeta({
      overrideMessage: t('modal.addToExistingMilestone.alert.error')
    });

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
                clearMessage={clearMessage}
              >
                <span className="mandatory-fields-alert__text">
                  <Trans
                    i18nKey={t('modal.addToExistingMilestone.alert.success')}
                    components={{
                      bold: <span className="text-bold" />
                    }}
                    values={{ title: solutionName }}
                  />
                </span>
              </Alert>
            </>
          );
          params.delete('add-solution', solutionKey);
          navigate({ search: params.toString() }, { replace: true });
          closeModal();
        }
      })
      .catch(() => {
        params.delete('add-solution', solutionKey);
        navigate({ search: params.toString() }, { replace: true });
        closeModal();
      });
  };

  return (
    <>
      <p className="mint-body-normal">
        <span className="text-bold">
          {t('modal.addToExistingMilestone.selectedSolution')}
        </span>
        {solutionName}
      </p>
      <p className="mint-body-normal border-bottom border-base-lighter padding-bottom-2">
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
          <Fieldset
            disabled={loading || milestones?.length === 0}
            className="padding-bottom-8"
          >
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
                  />
                </FormGroup>
              )}
            />
          </Fieldset>

          <div className="margin-top-0 mint-modal__footer">
            <Button type="submit" className="margin-right-3 margin-top-0">
              {watch('linkedMilestones')?.length === 0
                ? t('modal.addToExistingMilestone.cta.empty')
                : t('modal.addToExistingMilestone.cta.add', {
                    count: watch('linkedMilestones')?.length
                  })}
            </Button>

            <Button
              type="button"
              className="usa-button usa-button--unstyled margin-top-0"
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
