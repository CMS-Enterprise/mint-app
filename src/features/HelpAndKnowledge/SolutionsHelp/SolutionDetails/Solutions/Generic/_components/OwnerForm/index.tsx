import React, { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import {
  Alert,
  ComboBox,
  Fieldset,
  Form,
  FormGroup,
  Label,
  Radio
} from '@trussworks/react-uswds';
import { SolutionSystemOwnerType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import {
  MtoCommonSolutionCmsComponent,
  useCreateMtoCommonSolutionSystemOwnerMutation,
  useUpdateMtoCommonSolutionSystemOwnerMutation
} from 'gql/generated/graphql';
import GetMTOSolutionContacts from 'gql/operations/ModelToOperations/GetMTOSolutionContacts';

import useMessage from 'hooks/useMessage';
import useModalSolutionState from 'hooks/useModalSolutionState';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { getKeys } from 'types/translation';
import isEnumValue from 'utils/enum';
import dirtyInput from 'utils/formUtil';

import { ModeType } from '../OwnerModal';

export type OwnerFormValues = Partial<
  Pick<SolutionSystemOwnerType, 'cmsComponent' | 'ownerType'>
>;

const OwnerForm = ({
  mode,
  closeModal,
  owner,
  setSubmitForm,
  setDisableButton
}: {
  mode: ModeType;
  closeModal: () => void;
  owner?: SolutionSystemOwnerType;
  setSubmitForm: React.Dispatch<
    React.SetStateAction<(formData: OwnerFormValues) => void>
  >;
  setDisableButton: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { t: ownerT } = useTranslation('mtoCommonSolutionSystemOwner');
  const { t: miscT } = useTranslation('mtoCommonSolutionSystemOwnerMisc');
  const { cmsComponent: cmsComponentConfig, ownerType: ownerTypeConfig } =
    usePlanTranslation('mtoCommonSolutionSystemOwner');

  const { selectedSolution } = useModalSolutionState();

  const { showMessage } = useMessage();

  const methods = useForm<OwnerFormValues>({
    defaultValues: {
      cmsComponent: owner?.cmsComponent,
      ownerType: owner?.ownerType
    },
    mode: 'onChange'
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isDirty },
    setValue,
    watch
  } = methods;

  const [create] = useCreateMtoCommonSolutionSystemOwnerMutation({
    refetchQueries: [
      {
        query: GetMTOSolutionContacts
      }
    ]
  });

  const [update] = useUpdateMtoCommonSolutionSystemOwnerMutation({
    refetchQueries: [
      {
        query: GetMTOSolutionContacts
      }
    ]
  });

  const [mutationError, setMutationError] = useState<
    'duplicate' | 'generic' | null
  >(null);

  const sortedCmsComponentConfig = [
    ...getKeys(cmsComponentConfig.options)
  ].sort();

  const cmsComponentOptions = sortedCmsComponentConfig.map(option => ({
    value: option,
    label: cmsComponentConfig.options[option]
  }));

  const cmsComponentInput = methods.getValues('cmsComponent');

  const disabledSubmitBtn =
    !watch('cmsComponent') || !watch('ownerType') || isSubmitting || !isDirty;

  useEffect(() => {
    setDisableButton(disabledSubmitBtn);
  }, [setDisableButton, disabledSubmitBtn]);

  useEffect(() => {
    setSubmitForm(() => onSubmit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!selectedSolution) {
    return null;
  }

  const onSubmit = (formData: OwnerFormValues) => {
    const { cmsComponent, ownerType } = dirtyInput(owner, formData);

    const promise = owner
      ? update({
          variables: {
            id: owner.id,
            changes: { cmsComponent, ownerType }
          }
        })
      : create({
          variables: {
            key: selectedSolution.key,
            changes: {
              cmsComponent: formData.cmsComponent,
              ownerType: formData.ownerType
            }
          }
        });

    promise
      .then(response => {
        if (!response?.errors) {
          showMessage(
            <Trans
              i18nKey={`mtoCommonSolutionSystemOwnerMisc:${mode}.success`}
              values={{
                owner: cmsComponentInput
                  ? cmsComponentConfig.options[cmsComponentInput]
                  : ''
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
          'uniq_system_owner_key_type_component'
        );
        setMutationError(duplicateError ? 'duplicate' : 'generic');
      });
  };

  return (
    <FormProvider {...methods}>
      <Form
        className="maxw-none padding-bottom-6"
        data-testid="owner-form"
        id="owner-form"
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
                i18nKey="mtoCommonSolutionSystemOwnerMisc:duplicateError"
                values={{
                  owner: cmsComponentInput
                    ? cmsComponentConfig.options[cmsComponentInput]
                    : ''
                }}
                components={{
                  bold: <span className="text-bold" />
                }}
              />
            )}
          </Alert>
        )}

        {mode === 'addSystemOwner' && <p> {miscT(`${mode}.description`)}</p>}

        <Fieldset disabled={!selectedSolution}>
          <Controller
            name="cmsComponent"
            control={control}
            rules={{
              required: true,
              validate: value => value !== undefined
            }}
            render={({ field: { ref, ...field } }) => (
              <FormGroup className="margin-top-0 margin-bottom-2">
                <Label
                  htmlFor="cms-component"
                  className="mint-body-normal maxw-none margin-bottom-0"
                  requiredMarker
                >
                  {ownerT('cmsComponent.label')}
                </Label>

                <span className="text-base-dark">
                  {ownerT('cmsComponent.sublabel')}
                </span>

                <ComboBox
                  {...field}
                  id="cms-component"
                  name="cms-component"
                  onChange={value => {
                    const verifiedValue = isEnumValue(
                      MtoCommonSolutionCmsComponent,
                      value
                    )
                      ? value
                      : undefined;
                    setValue('cmsComponent', verifiedValue, {
                      shouldDirty: true
                    });
                  }}
                  defaultValue={owner?.cmsComponent}
                  options={cmsComponentOptions}
                />
              </FormGroup>
            )}
          />

          <Controller
            name="ownerType"
            control={control}
            rules={{
              required: true,
              validate: value => value !== undefined
            }}
            render={({ field: { ref, ...field } }) => (
              <FormGroup className="margin-top-0 margin-bottom-2">
                <Label
                  htmlFor="owner-type"
                  className="mint-body-normal maxw-none margin-bottom-0"
                  requiredMarker
                >
                  {ownerT('ownerType.label')}
                </Label>

                {getKeys(ownerTypeConfig.options).map(option => (
                  <div className="display-flex" key={option}>
                    <Radio
                      {...field}
                      id={option}
                      data-testid={option}
                      value={option}
                      label={ownerTypeConfig.options[option]}
                      checked={field.value === option}
                      className="margin-right-1"
                    />
                  </div>
                ))}
              </FormGroup>
            )}
          />
        </Fieldset>
      </Form>
    </FormProvider>
  );
};

export default OwnerForm;
