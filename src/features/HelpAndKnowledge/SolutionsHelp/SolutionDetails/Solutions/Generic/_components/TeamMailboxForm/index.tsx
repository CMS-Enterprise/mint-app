import React, { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
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
import { SolutionContactType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import {
  useCreateMtoCommonSolutionMailboxContactMutation,
  useUpdateMtoCommonSolutionContactMutation
} from 'gql/generated/graphql';
import GetMTOSolutionContacts from 'gql/operations/ModelToOperations/GetMTOSolutionContacts';

import Alert from 'components/Alert';
import CheckboxField from 'components/CheckboxField';
import useMessage from 'hooks/useMessage';
import useModalSolutionState from 'hooks/useModalSolutionState';
import dirtyInput from 'utils/formUtil';

import { TeamMailboxModeType } from '../MailboxAndTeamMemberModal';

type FormValues = {
  mailboxAddress: string;
  mailboxTitle: string;
  isPrimary: boolean;
  receiveEmails: boolean;
};

const TeamMailboxForm = ({
  mode,
  closeModal,
  teamMailbox = {
    __typename: 'MTOCommonSolutionContact',
    id: 'not a real id',
    name: '',
    email: '',
    mailboxTitle: '',
    mailboxAddress: '',
    isTeam: true,
    isPrimary: false,
    receiveEmails: false
  }
}: {
  mode: TeamMailboxModeType;
  closeModal: () => void;
  teamMailbox?: SolutionContactType;
}) => {
  const { t: contactT } = useTranslation('mtoCommonSolutionContact');
  const { t: miscT } = useTranslation('mtoCommonSolutionContactMisc');
  const methods = useForm<FormValues>({
    defaultValues: {
      mailboxAddress: teamMailbox.mailboxAddress || '',
      mailboxTitle: teamMailbox.mailboxTitle || '',
      isPrimary: teamMailbox.isPrimary,
      receiveEmails: teamMailbox.receiveEmails
    },
    mode: 'onChange'
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isDirty, isValid },
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
  const [update] = useUpdateMtoCommonSolutionContactMutation({
    refetchQueries: [
      {
        query: GetMTOSolutionContacts
      }
    ]
  });
  const [mutationError, setMutationError] = useState<
    'duplicate' | 'generic' | null
  >(null);
  const isAddMode = mode === 'addTeamMailbox';
  const isEditMode = mode === 'editTeamMailbox';
  const disabledSubmitBtn = isSubmitting || !isDirty || !isValid;

  if (!selectedSolution) {
    return null;
  }

  const onSubmit = (formData: FormValues) => {
    const { mailboxTitle, isPrimary, receiveEmails } = dirtyInput(
      teamMailbox,
      formData
    );
    const promise = isAddMode
      ? create({
          variables: {
            key: selectedSolution.enum,
            mailboxTitle: formData.mailboxTitle,
            mailboxAddress: formData.mailboxAddress,
            isPrimary: formData.isPrimary,
            receiveEmails: formData.receiveEmails
          }
        })
      : update({
          variables: {
            id: teamMailbox.id,
            input: {
              mailboxTitle,
              isPrimary,
              receiveEmails
            }
          }
        });
    promise
      .then(response => {
        if (!response?.errors) {
          showMessage(
            <Trans
              i18nKey={`mtoCommonSolutionContactMisc:${mode}.success`}
              values={{
                contact: formData.mailboxAddress || teamMailbox.name
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
        const duplicateError = error.message.includes('duplicate');
        setMutationError(duplicateError ? 'duplicate' : 'generic');
      });
  };

  return (
    <FormProvider {...methods}>
      <Form
        className="maxw-none"
        data-testid="team-mailbox-form"
        id="team-mailbox-form"
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
                i18nKey="mtoCommonSolutionContactMisc:duplicateError"
                values={{
                  contact: methods.getValues('mailboxAddress')
                }}
                components={{
                  bold: <span className="text-bold" />
                }}
              />
            )}
          </Alert>
        )}
        <Fieldset disabled={!selectedSolution} style={{ minWidth: '100%' }}>
          <Controller
            name="mailboxAddress"
            control={control}
            rules={{
              required: true,
              validate: value => value !== ''
            }}
            render={({ field: { ref, ...field } }) => (
              <FormGroup className="margin-top-0 margin-bottom-2">
                <Label
                  htmlFor="team-mailbox-address"
                  className="mint-body-normal maxw-none margin-bottom-1"
                  requiredMarker
                >
                  {contactT('mailboxAddress.label')}
                </Label>
                <span className="text-base-dark">
                  {contactT('mailboxAddress.sublabel')}
                </span>

                <TextInput
                  type="text"
                  {...field}
                  id="team-mailbox-address"
                  data-testid="team-mailbox-address"
                  value={field.value || ''}
                  disabled={isEditMode}
                />
              </FormGroup>
            )}
          />

          <Controller
            name="mailboxTitle"
            control={control}
            rules={{
              required: true,
              validate: value => value !== ''
            }}
            render={({ field: { ref, ...field } }) => (
              <FormGroup className="margin-top-0">
                <Label
                  htmlFor="team-mailbox-title"
                  className="mint-body-normal maxw-none margin-bottom-1"
                  requiredMarker
                >
                  {contactT('mailboxTitle.label')}
                </Label>

                <TextInput
                  type="text"
                  {...field}
                  id="team-mailbox-title"
                  data-testid="team-mailbox-title"
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
                  testid="isPrimary"
                  label={contactT('isPrimary.label')}
                  subLabel={
                    isAddMode
                      ? contactT('isPrimary.sublabel')
                      : miscT('editTeamMailbox.primaryPocSubLabel')
                  }
                  checked={Boolean(field.value)}
                  value="true"
                  onBlur={field.onBlur}
                  onChange={e => {
                    field.onChange(e.target.checked);
                  }}
                  disabled={teamMailbox.isPrimary}
                  icon={
                    <Tooltip
                      label={contactT('isPrimary.questionTooltip')}
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
                  testid="receiveEmails"
                  label={contactT('receiveEmails.label')}
                  subLabel={contactT('receiveEmails.sublabel')}
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
            i18nKey={miscT('alert')}
            components={{
              milestoneLibrary: (
                <Button
                  type="button"
                  className="margin-top-0"
                  unstyled
                  onClick={() => {}}
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
            disabled={disabledSubmitBtn}
            className="margin-right-3 margin-top-0"
          >
            {miscT(`${mode}.cta`)}
          </Button>
          <Button
            type="button"
            className="margin-top-0"
            unstyled
            onClick={closeModal}
          >
            {miscT('cancel')}
          </Button>
        </div>
      </Form>
    </FormProvider>
  );
};

export default TeamMailboxForm;
