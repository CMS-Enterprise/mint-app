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
import { useUpdateMtoCommonSolutionContactMutation } from 'gql/generated/graphql';
import GetMTOSolutionContacts from 'gql/operations/ModelToOperations/GetMTOSolutionContacts';

import Alert from 'components/Alert';
import CheckboxField from 'components/CheckboxField';
import useMessage from 'hooks/useMessage';
import useModalSolutionState from 'hooks/useModalSolutionState';
import dirtyInput from 'utils/formUtil';

type FormValues = {
  mailboxAddress: string;
  mailboxTitle: string;
  isPrimary: boolean;
  receiveEmails: boolean;
};

const EditTeamMailboxForm = ({
  closeModal,
  teamMailbox
}: {
  closeModal: () => void;
  teamMailbox: SolutionContactType;
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
    formState: { isSubmitting, isDirty, dirtyFields, isValid },
    watch
  } = methods;

  const { selectedSolution } = useModalSolutionState();
  const { showMessage } = useMessage();
  const [update] = useUpdateMtoCommonSolutionContactMutation({
    refetchQueries: [
      {
        query: GetMTOSolutionContacts
      }
    ]
  });
  const [hasMutationError, setHasMutationError] = useState(false);
  const disabledSubmitBtn =
    isSubmitting ||
    !isDirty ||
    Object.keys(dirtyFields).length === 0 ||
    !isValid;

  if (!selectedSolution) {
    return null;
  }

  const onSubmit = (formData: FormValues) => {
    const { mailboxTitle, isPrimary, receiveEmails } = dirtyInput(
      teamMailbox,
      formData
    );
    update({
      variables: {
        id: teamMailbox.id,
        input: {
          mailboxTitle,
          isPrimary,
          receiveEmails
        }
      }
    })
      .then(response => {
        if (!response?.errors) {
          showMessage(
            <Trans
              i18nKey="mtoCommonSolutionContactMisc:editTeamMailbox.success"
              values={{
                contact: teamMailbox.name
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
        data-testid="team-member-form"
        id="team-member-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        {hasMutationError && (
          <Alert
            type="error"
            slim
            headingLevel="h1"
            className="margin-bottom-2"
          >
            {miscT('editTeamMailbox.error')}
          </Alert>
        )}
        <Fieldset disabled={!selectedSolution} style={{ minWidth: '100%' }}>
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
                  disabled
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
                  subLabel={miscT('editTeamMailbox.primaryPocSubLabel')}
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
            {miscT('saveChanges')}
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

export default EditTeamMailboxForm;
