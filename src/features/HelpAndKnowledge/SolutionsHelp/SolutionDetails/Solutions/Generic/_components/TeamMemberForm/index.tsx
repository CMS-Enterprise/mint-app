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
import classNames from 'classnames';
import { SolutionContactType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import {
  useCreateMtoCommonSolutionUserContactMutation,
  useUpdateMtoCommonSolutionContactMutation
} from 'gql/generated/graphql';
import GetMTOSolutionContacts from 'gql/operations/ModelToOperations/GetMTOSolutionContacts';

import Alert from 'components/Alert';
import CheckboxField from 'components/CheckboxField';
import OktaUserSelect from 'components/OktaUserSelect';
import useMessage from 'hooks/useMessage';
import useModalSolutionState from 'hooks/useModalSolutionState';
import dirtyInput from 'utils/formUtil';

import { TeamMemberModeType } from '../MailboxAndTeamMemberModal';

type FormValues = {
  userName: string;
  displayName: string;
  role: string;
  isPrimary: boolean;
  receiveEmails: boolean;
};

const TeamMemberForm = ({
  mode,
  closeModal,
  teamMember = {
    __typename: 'MTOCommonSolutionContact',
    id: 'not a real id',
    name: '',
    email: '',
    isTeam: false,
    isPrimary: false,
    role: '',
    receiveEmails: false
  }
}: {
  mode: TeamMemberModeType;
  closeModal: () => void;
  teamMember?: SolutionContactType;
}) => {
  const { t: contactT } = useTranslation('mtoCommonSolutionContact');
  const { t: miscT } = useTranslation('mtoCommonSolutionContactMisc');
  const methods = useForm<FormValues>({
    defaultValues: {
      role: teamMember.role || '',
      isPrimary: teamMember.isPrimary,
      receiveEmails: teamMember.receiveEmails
    },
    mode: 'onChange'
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isDirty, dirtyFields },
    watch,
    setValue
  } = methods;

  const { selectedSolution } = useModalSolutionState();
  const { showMessage } = useMessage();
  const [create] = useCreateMtoCommonSolutionUserContactMutation({
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
  const isAddMode = mode === 'addTeamMember';
  const isEditMode = mode === 'editTeamMember';
  const disabledSubmitBtn =
    isSubmitting || !isDirty || Object.keys(dirtyFields).length === 0;

  if (!selectedSolution) {
    return null;
  }

  const onSubmit = (formData: FormValues) => {
    const { role, isPrimary, receiveEmails } = dirtyInput(teamMember, formData);

    const promise = isAddMode
      ? create({
          variables: {
            key: selectedSolution.enum,
            userName: formData.userName,
            role: formData.role,
            isPrimary: formData.isPrimary,
            receiveEmails: formData.receiveEmails
          }
        })
      : update({
          variables: {
            id: teamMember.id,
            input: {
              role,
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
                contact: formData.userName || teamMember.name
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
        data-testid="team-member-form"
        id="team-member-form"
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
                  contact: methods.getValues('displayName')
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
            name="userName"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <FormGroup className="margin-top-0 margin-bottom-2">
                <Label
                  htmlFor="team-member-name"
                  className="mint-body-normal maxw-none margin-bottom-1"
                  requiredMarker
                >
                  {contactT('name.label')}
                </Label>
                <span className="text-base-dark">
                  {contactT('name.sublabel')}
                </span>

                <OktaUserSelect
                  id="team-member-name"
                  name="team-member-name"
                  ariaLabelledBy="label-team-member-name"
                  ariaDescribedBy="hint-team-member-name"
                  value={{
                    username: teamMember.name,
                    displayName: teamMember.name,
                    email: teamMember.email
                  }}
                  onChange={oktaUser => {
                    setValue(
                      'displayName',
                      oktaUser ? oktaUser.displayName : ''
                    );
                    setValue('userName', oktaUser ? oktaUser.username : '');
                  }}
                  className={classNames({
                    'disabled-input': isEditMode
                  })}
                  disabled={isEditMode}
                />
              </FormGroup>
            )}
          />

          <Controller
            name="role"
            control={control}
            rules={{
              required: true,
              validate: value => value !== ''
            }}
            render={({ field: { ref, ...field } }) => (
              <FormGroup className="margin-top-0">
                <Label
                  htmlFor="team-member-role"
                  className="mint-body-normal maxw-none margin-bottom-1"
                  requiredMarker
                >
                  {contactT('role.label')}
                </Label>

                <TextInput
                  type="text"
                  {...field}
                  id="team-member-role"
                  data-testid="team-member-role"
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
                      : miscT('editTeamMember.primaryPocSubLabel')
                  }
                  checked={Boolean(field.value)}
                  value="true"
                  onBlur={field.onBlur}
                  onChange={e => {
                    field.onChange(e.target.checked);
                  }}
                  disabled={teamMember.isPrimary}
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
            i18nKey="mtoCommonSolutionContactMisc:alert"
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
            disabled={!watch('userName') || !watch('role') || disabledSubmitBtn}
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

export default TeamMemberForm;
