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
import {
  MtoCommonSolutionKey,
  useCreateMtoCommonSolutionContractorMutation
} from 'gql/generated/graphql';
import GetMTOSolutionContacts from 'gql/operations/ModelToOperations/GetMTOSolutionContacts';

import Alert from 'components/Alert';
import useMessage from 'hooks/useMessage';
import useModalSolutionState from 'hooks/useModalSolutionState';
import mtoCommonSolutionContractor, {
  mtoCommonSolutionContractorMisc
} from 'i18n/en-US/modelPlan/mtoCommonSolutionContractor';

type FormValues = {
  contractorTitle: string;
  contractorName: string;
};

const AddContractorForm = ({ closeModal }: { closeModal: () => void }) => {
  const methods = useForm<FormValues>({
    defaultValues: {
      contractorTitle: '',
      contractorName: ''
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
  const [create] = useCreateMtoCommonSolutionContractorMutation({
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
    create({
      variables: {
        key: selectedSolution.key.toUpperCase() as MtoCommonSolutionKey,
        contractorTitle: formData.contractorTitle,
        contractorName: formData.contractorName
      }
    })
      .then(response => {
        if (!response?.errors) {
          showMessage(
            <Trans
              i18nKey={mtoCommonSolutionContractorMisc.addContractor.success}
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
        data-testid="mailbox-form"
        id="mailbox-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        {hasMutationError && (
          <Alert
            type="error"
            slim
            headingLevel="h1"
            className="margin-bottom-2"
          >
            {mtoCommonSolutionContractorMisc.addContractor.error}
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
            {mtoCommonSolutionContractorMisc.addContractor.cta}
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

export default AddContractorForm;
