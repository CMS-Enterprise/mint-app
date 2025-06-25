import React, { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Trans } from 'react-i18next';
import {
  Button,
  Fieldset,
  Form,
  FormGroup,
  Label,
  TextInput
} from '@trussworks/react-uswds';
import { SolutionContractorType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import { useUpdateMtoCommonSolutionContractorMutation } from 'gql/generated/graphql';
import GetMTOSolutionContacts from 'gql/operations/ModelToOperations/GetMTOSolutionContacts';

import Alert from 'components/Alert';
import useMessage from 'hooks/useMessage';
import useModalSolutionState from 'hooks/useModalSolutionState';
import mtoCommonSolutionContractor, {
  mtoCommonSolutionContractorMisc
} from 'i18n/en-US/modelPlan/mtoCommonSolutionContractor';
import dirtyInput from 'utils/formUtil';

type FormValues = {
  contractorTitle: string;
  contractorName: string;
};

const EditContractorForm = ({
  closeModal,
  contractor
}: {
  closeModal: () => void;
  contractor: SolutionContractorType;
}) => {
  const methods = useForm<FormValues>({
    defaultValues: {
      contractorTitle: contractor.contractorTitle || '',
      contractorName: contractor.contractorName
    },
    mode: 'onChange'
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid }
  } = methods;

  const { selectedSolution } = useModalSolutionState();
  const { showMessage } = useMessage();
  const [update] = useUpdateMtoCommonSolutionContractorMutation({
    refetchQueries: [
      {
        query: GetMTOSolutionContacts
      }
    ]
  });
  const [hasMutationError, setHasMutationError] = useState(false);

  if (!selectedSolution) {
    return null;
  }

  const onSubmit = (formData: FormValues) => {
    const { contractorTitle, contractorName } = dirtyInput(
      contractor,
      formData
    );
    update({
      variables: {
        id: contractor.id,
        changes: {
          contractorTitle,
          contractorName
        }
      }
    })
      .then(response => {
        if (!response?.errors) {
          showMessage(
            <Trans
              i18nKey={mtoCommonSolutionContractorMisc.editContractor.success}
              values={{
                contractor: formData.contractorName
              }}
              components={{
                bold: <span className="text-bold" />
              }}
            />
          );
          closeModal();
        }
      })
      .catch(() => {
        setHasMutationError(true);
      });
  };

  return (
    <FormProvider {...methods}>
      <Form
        className="maxw-none"
        data-testid="edit-contractor-form"
        id="edit-contractor-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        {hasMutationError && (
          <Alert
            type="error"
            slim
            headingLevel="h1"
            className="margin-bottom-2"
          >
            {mtoCommonSolutionContractorMisc.editContractor.error}
          </Alert>
        )}
        <Fieldset disabled={!selectedSolution}>
          <Controller
            name="contractorTitle"
            control={control}
            rules={{
              required: false,
              validate: value => value !== 'default'
            }}
            render={({ field: { ref, ...field } }) => (
              <FormGroup className="margin-top-0 margin-bottom-2">
                <Label
                  htmlFor="contractor-title"
                  className="mint-body-normal maxw-none margin-bottom-1"
                >
                  {mtoCommonSolutionContractor.contractorTitle.label}
                </Label>

                <TextInput
                  type="text"
                  {...field}
                  id="contractor-title"
                  data-testid="contractor-title"
                  value={field.value || ''}
                />
              </FormGroup>
            )}
          />

          <Controller
            name="contractorName"
            control={control}
            rules={{
              required: true,
              validate: value => value !== 'default'
            }}
            render={({ field: { ref, ...field } }) => (
              <FormGroup className="margin-top-0 margin-bottom-2">
                <Label
                  htmlFor="contractor-name"
                  className="mint-body-normal maxw-none margin-bottom-1"
                  requiredMarker
                >
                  {mtoCommonSolutionContractor.contractorName.label}
                </Label>

                <TextInput
                  type="text"
                  {...field}
                  id="contractor-name"
                  data-testid="contractor-name"
                  value={field.value || ''}
                />
              </FormGroup>
            )}
          />
        </Fieldset>

        <div className="margin-top-3 display-flex">
          <Button
            type="submit"
            disabled={!isValid}
            className="margin-right-3 margin-top-0"
          >
            {mtoCommonSolutionContractorMisc.saveChanges}
          </Button>
          <Button
            type="button"
            className="margin-top-0"
            unstyled
            onClick={() => {
              reset();
              closeModal();
            }}
          >
            {mtoCommonSolutionContractorMisc.cancel}
          </Button>
        </div>
      </Form>
    </FormProvider>
  );
};

export default EditContractorForm;
