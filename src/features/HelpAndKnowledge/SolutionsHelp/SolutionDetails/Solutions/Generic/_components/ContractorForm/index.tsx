import React, { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import {
  Button,
  Fieldset,
  Form,
  FormGroup,
  Label,
  TextInput
} from '@trussworks/react-uswds';
import { SolutionContractorType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import {
  useCreateMtoCommonSolutionContractorMutation,
  useUpdateMtoCommonSolutionContractorMutation
} from 'gql/generated/graphql';
import GetMTOSolutionContacts from 'gql/operations/ModelToOperations/GetMTOSolutionContacts';

import Alert from 'components/Alert';
import useMessage from 'hooks/useMessage';
import useModalSolutionState from 'hooks/useModalSolutionState';
import dirtyInput from 'utils/formUtil';

import { ModeType } from '../ContractorModal';

type FormValues = {
  contractorTitle: string;
  contractorName: string;
};

const ContractorForm = ({
  mode,
  closeModal,
  contractor = {
    __typename: 'MTOCommonSolutionContractor',
    id: 'not a real id',
    contractorTitle: '',
    contractorName: ''
  }
}: {
  mode: ModeType;
  closeModal: () => void;
  contractor?: SolutionContractorType;
}) => {
  const { t: contractorT } = useTranslation('mtoCommonSolutionContractor');
  const { t: miscT } = useTranslation('mtoCommonSolutionContractorMisc');

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
    formState: { isSubmitting, isDirty, isValid }
  } = methods;

  const { selectedSolution } = useModalSolutionState();
  const { showMessage } = useMessage();
  const [create] = useCreateMtoCommonSolutionContractorMutation();
  const [update] = useUpdateMtoCommonSolutionContractorMutation();
  const [mutationError, setMutationError] = useState<
    'duplicate' | 'generic' | null
  >(null);
  const disabledSubmitBtn = isSubmitting || !isDirty || !isValid;

  if (!selectedSolution) {
    return null;
  }

  const onSubmit = (formData: FormValues) => {
    const { contractorTitle, contractorName } = dirtyInput(
      contractor,
      formData
    );

    const promise =
      mode === 'addContractor'
        ? create({
            variables: {
              key: selectedSolution.enum,
              contractorTitle,
              contractorName
            },
            refetchQueries: [
              {
                query: GetMTOSolutionContacts
              }
            ]
          })
        : update({
            variables: {
              id: contractor.id,
              changes: {
                contractorTitle,
                contractorName
              }
            },
            refetchQueries: [
              {
                query: GetMTOSolutionContacts
              }
            ]
          });
    promise
      .then(response => {
        if (!response?.errors) {
          showMessage(
            <Trans
              i18nKey={`mtoCommonSolutionContractorMisc:${mode}.success`}
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
      .catch(error => {
        const duplicateError = error.message.includes(
          'uniq_user_id_per_solution_key'
        );
        setMutationError(duplicateError ? 'duplicate' : 'generic');
      });
  };

  return (
    <FormProvider {...methods}>
      <Form
        className="maxw-none"
        data-testid="contractor-form"
        id="contractor-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        {mutationError !== null && (
          <Alert
            type="error"
            slim
            headingLevel="h1"
            className="margin-bottom-2"
          >
            {mutationError === 'generic' ? (
              miscT(`${mode}.error`)
            ) : (
              <Trans
                i18nKey="mtoCommonSolutionContractorMisc:duplicateError"
                values={{
                  contractor: methods.getValues('contractorName')
                }}
                components={{
                  bold: <span className="text-bold" />
                }}
              />
            )}
          </Alert>
        )}
        <Fieldset disabled={!selectedSolution}>
          <Controller
            name="contractorTitle"
            control={control}
            rules={{
              required: false
            }}
            render={({ field: { ref, ...field } }) => (
              <FormGroup className="margin-top-0 margin-bottom-2">
                <Label
                  htmlFor="contractor-title"
                  className="mint-body-normal maxw-none margin-bottom-1"
                >
                  {contractorT('contractorTitle.label')}
                </Label>

                <TextInput
                  type="text"
                  {...field}
                  id="contractor-title"
                  data-testid="contractor-title"
                  value={field.value}
                />
              </FormGroup>
            )}
          />

          <Controller
            name="contractorName"
            control={control}
            rules={{
              required: true,
              validate: value => value !== ''
            }}
            render={({ field: { ref, ...field } }) => (
              <FormGroup className="margin-top-0 margin-bottom-2">
                <Label
                  htmlFor="contractor-name"
                  className="mint-body-normal maxw-none margin-bottom-1"
                  requiredMarker
                >
                  {contractorT('contractorName.label')}
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
            disabled={disabledSubmitBtn}
            className="margin-right-3 margin-top-0"
          >
            {miscT(`${mode}.cta`)}
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
            {miscT('cancel')}
          </Button>
        </div>
      </Form>
    </FormProvider>
  );
};

export default ContractorForm;
