import React, { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Trans } from 'react-i18next';
import {
  Button,
  Fieldset,
  Form,
  FormGroup,
  Icon,
  Label,
  TextInput,
  Tooltip
} from '@trussworks/react-uswds';
import {
  MtoCommonSolutionKey,
  useCreateMtoCommonSolutionMailboxContactMutation
} from 'gql/generated/graphql';
import GetMTOSolutionContacts from 'gql/operations/ModelToOperations/GetMTOSolutionContacts';

import Alert from 'components/Alert';
import CheckboxField from 'components/CheckboxField';
import useMessage from 'hooks/useMessage';
import useModalSolutionState from 'hooks/useModalSolutionState';
import mtoCommonSolutionContact, {
  mtoCommonSolutionContactMisc
} from 'i18n/en-US/modelPlan/mtoCommonSolutionContact';

type FormValues = {
  mailboxAddress: string;
  mailboxTitle: string;
  isPrimary: boolean;
  receiveEmails: boolean;
};

const AddTeamMailboxForm = ({ closeModal }: { closeModal: () => void }) => {
  const methods = useForm<FormValues>({
    defaultValues: {
      mailboxAddress: '',
      mailboxTitle: '',
      isPrimary: false,
      receiveEmails: false
    },
    mode: 'onChange'
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
    watch
  } = methods;

  const { selectedSolution } = useModalSolutionState();
  const { showMessage } = useMessage();
  const [create] = useCreateMtoCommonSolutionMailboxContactMutation({
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
        mailboxTitle: formData.mailboxTitle,
        mailboxAddress: formData.mailboxAddress,
        isPrimary: formData.isPrimary,
        receiveEmails: formData.receiveEmails
      }
    })
      .then(response => {
        if (!response?.errors) {
          showMessage(
            <Trans
              i18nKey={mtoCommonSolutionContactMisc.addTeamMailbox.success}
              values={{
                contact: formData.mailboxTitle
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
            {mtoCommonSolutionContactMisc.addTeamMailbox.error}
          </Alert>
        )}
        <Fieldset disabled={!selectedSolution}>
          <Controller
            name="mailboxAddress"
            control={control}
            rules={{
              required: true,
              validate: value => value !== 'default'
            }}
            render={({ field: { ref, ...field } }) => (
              <FormGroup className="margin-top-0 margin-bottom-2">
                <Label
                  htmlFor="team-mailbox-address"
                  className="mint-body-normal maxw-none margin-bottom-1"
                  requiredMarker
                >
                  {mtoCommonSolutionContact.mailboxAddress.label}
                </Label>
                <span className="text-base-dark">
                  {mtoCommonSolutionContact.mailboxAddress.sublabel}
                </span>

                <TextInput
                  type="text"
                  {...field}
                  id="team-mailbox-address"
                  value={field.value || ''}
                />
              </FormGroup>
            )}
          />

          <Controller
            name="mailboxTitle"
            control={control}
            rules={{
              required: true,
              validate: value => value !== 'default'
            }}
            render={({ field: { ref, ...field } }) => (
              <FormGroup className="margin-top-0 margin-bottom-2">
                <Label
                  htmlFor="team-mailbox-title"
                  className="mint-body-normal maxw-none margin-bottom-1"
                  requiredMarker
                >
                  {mtoCommonSolutionContact.mailboxTitle.label}
                </Label>

                <TextInput
                  type="text"
                  {...field}
                  id="team-mailbox-title"
                  value={field.value || ''}
                />
              </FormGroup>
            )}
          />

          <Controller
            name="isPrimary"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <FormGroup className="margin-top-0 margin-bottom-2">
                <CheckboxField
                  {...field}
                  id="isPrimary"
                  checked={Boolean(field.value)}
                  value="true"
                  onBlur={field.onBlur}
                  onChange={e => {
                    field.onChange(e.target.checked);
                  }}
                  label={mtoCommonSolutionContact.isPrimary.label}
                  subLabel={mtoCommonSolutionContact.isPrimary.sublabel || ''}
                  icon={
                    <Tooltip
                      label={mtoCommonSolutionContact.isPrimary.tooltips?.true}
                      position="top"
                      className="bg-white padding-0 text-base-dark"
                      style={{ gap: '0.25rem' }}
                    >
                      <Icon.Info className="minw-4 text-base-light margin-left-neg-05 margin-bottom-neg-2px" />
                    </Tooltip>
                  }
                />
              </FormGroup>
            )}
          />

          <Controller
            name="receiveEmails"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <FormGroup className="margin-top-0 margin-bottom-2">
                <CheckboxField
                  {...field}
                  id="receiveEmails"
                  label={mtoCommonSolutionContact.receiveEmails.label}
                  subLabel={
                    mtoCommonSolutionContact.receiveEmails.sublabel || ''
                  }
                  checked={Boolean(field.value) || watch('isPrimary')}
                  value="true"
                  onBlur={field.onBlur}
                  onChange={e => {
                    field.onChange(e.target.checked);
                  }}
                  disabled={watch('isPrimary')}
                />
              </FormGroup>
            )}
          />
        </Fieldset>
        <Alert
          type="info"
          slim
          className="margin-top-0 margin-bottom-2"
          hidden={!watch('isPrimary') && !watch('receiveEmails')}
        >
          <Trans
            i18nKey={mtoCommonSolutionContactMisc.alert}
            components={{
              milestoneLibrary: (
                <Button
                  type="button"
                  className="margin-top-0"
                  unstyled
                  onClick={() => {
                    reset();
                  }}
                >
                  {' '}
                </Button>
              )
            }}
          />
        </Alert>
        <div className="margin-top-3 display-flex">
          <Button
            type="submit"
            disabled={!isValid}
            className="margin-right-3 margin-top-0"
          >
            {mtoCommonSolutionContactMisc.addTeamMailbox.cta}
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
            {mtoCommonSolutionContactMisc.cancel}
          </Button>
        </div>
      </Form>
    </FormProvider>
  );
};

export default AddTeamMailboxForm;
