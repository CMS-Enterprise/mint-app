import React, { useEffect } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import {
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

import toastSuccess from 'components/ToastSuccess';
import { useErrorMessage } from 'contexts/ErrorContext';
import useModalSolutionState from 'hooks/useModalSolutionState';
import dirtyInput from 'utils/formUtil';

import { ModeType } from '../ContractorModal';

export type ContractorFormValues = Pick<
  SolutionContractorType,
  'contractTitle' | 'contractorName'
>;

const ContractorForm = ({
  mode,
  closeModal,
  contractor = {
    __typename: 'MTOCommonSolutionContractor',
    id: 'not a real id',
    contractTitle: '',
    contractorName: ''
  },
  setDisableButton
}: {
  mode: ModeType;
  closeModal: () => void;
  contractor?: SolutionContractorType;
  setDisableButton: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { t: contractorT } = useTranslation('mtoCommonSolutionContractor');
  const { t: miscT } = useTranslation('mtoCommonSolutionContractorMisc');
  const { selectedSolution } = useModalSolutionState();

  const { setErrorMeta } = useErrorMessage();

  const methods = useForm<ContractorFormValues>({
    defaultValues: {
      contractTitle: contractor.contractTitle || '',
      contractorName: contractor.contractorName
    },
    mode: 'onChange'
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isDirty, isValid }
  } = methods;

  const [create] = useCreateMtoCommonSolutionContractorMutation({
    refetchQueries: [
      {
        query: GetMTOSolutionContacts
      }
    ]
  });

  const [update] = useUpdateMtoCommonSolutionContractorMutation({
    refetchQueries: [
      {
        query: GetMTOSolutionContacts
      }
    ]
  });

  const disabledSubmitBtn = isSubmitting || !isDirty || !isValid;

  useEffect(() => {
    setDisableButton(disabledSubmitBtn);
  }, [setDisableButton, disabledSubmitBtn]);

  const onSubmit = (formData: ContractorFormValues) => {
    if (!selectedSolution) {
      return;
    }

    setErrorMeta({
      overrideMessage: miscT(`${mode}.error`)
    });

    const { contractTitle, contractorName } = dirtyInput(contractor, formData);

    const promise =
      mode === 'addContractor'
        ? create({
            variables: {
              key: selectedSolution.key,
              contractTitle,
              contractorName
            }
          })
        : update({
            variables: {
              id: contractor.id,
              changes: {
                contractTitle,
                contractorName
              }
            }
          });

    promise.then(response => {
      if (!response?.errors) {
        toastSuccess(
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
    });
  };

  return (
    <FormProvider {...methods}>
      <Form
        className="maxw-none padding-bottom-6"
        data-testid="contractor-form"
        id="contractor-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Fieldset disabled={!selectedSolution}>
          <Controller
            name="contractTitle"
            control={control}
            rules={{
              required: false
            }}
            render={({ field: { ref, ...field } }) => (
              <FormGroup className="margin-top-0 margin-bottom-2">
                <Label
                  htmlFor="contract-title"
                  className="mint-body-normal maxw-none margin-bottom-1"
                >
                  {contractorT('contractTitle.label')}
                </Label>

                <TextInput
                  type="text"
                  {...field}
                  id="contract-title"
                  data-testid="contract-title"
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
      </Form>
    </FormProvider>
  );
};

export default ContractorForm;
