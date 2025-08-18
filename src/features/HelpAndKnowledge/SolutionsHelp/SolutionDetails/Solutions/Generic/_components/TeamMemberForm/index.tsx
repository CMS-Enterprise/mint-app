import React, { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
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
import { useErrorMessage } from 'contexts/ErrorContext';
import useModalSolutionState from 'hooks/useModalSolutionState';
import dirtyInput from 'utils/formUtil';

import { TeamMemberModeType } from '../MailboxAndTeamMemberModal';

type UnwrapNullable<
  T extends Record<P, unknown> | null | undefined,
  P extends PropertyKey
> = T extends Record<P, unknown> ? T[P] : '';

export type TeamMemberFormValues = Pick<
  SolutionContactType,
  'name' | 'role' | 'isPrimary' | 'receiveEmails'
> & {
  userName: UnwrapNullable<SolutionContactType['userAccount'], 'username'>;
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
    receiveEmails: false,
    userAccount: {
      __typename: 'UserAccount',
      id: 'not a real userAccount id',
      username: ''
    }
  },
  setDisableButton
}: {
  mode: TeamMemberModeType;
  closeModal: () => void;
  teamMember?: SolutionContactType;
  setDisableButton: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { t: contactT } = useTranslation('mtoCommonSolutionContact');
  const { t: miscT } = useTranslation('mtoCommonSolutionContactMisc');

  const { selectedSolution } = useModalSolutionState();

  const methods = useForm<TeamMemberFormValues>({
    defaultValues: {
      userName: teamMember.userAccount?.username || '',
      name: teamMember.name,
      role: teamMember.role || '',
      isPrimary: teamMember.isPrimary,
      receiveEmails: teamMember.receiveEmails
    },
    mode: 'onChange'
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isDirty },
    watch,
    setValue
  } = methods;

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
    !watch('userName') || !watch('role') || isSubmitting || !isDirty;

  const { setErrorMeta } = useErrorMessage();

  useEffect(() => {
    setDisableButton(disabledSubmitBtn);
  }, [setDisableButton, disabledSubmitBtn]);

  const onSubmit = (formData: TeamMemberFormValues) => {
    if (!selectedSolution) {
      setMutationError('generic');
      return;
    }

    const { role, isPrimary, receiveEmails } = dirtyInput(teamMember, formData);

    setErrorMeta({
      overrideMessage: `${formData.userName} is already added to this solution and cannot be added again. Please edit the existing entry.`
    });

    const promise = isAddMode
      ? create({
          variables: {
            key: selectedSolution.key,
            userName: formData.userName,
            role: formData.role || '',
            isPrimary: formData.isPrimary,
            receiveEmails: formData.isPrimary ? true : formData.receiveEmails
          }
        })
      : update({
          variables: {
            id: teamMember.id,
            input: {
              role,
              isPrimary,
              receiveEmails: isPrimary ? true : receiveEmails
            }
          }
        });
    promise.then(response => {
      if (!response?.errors) {
        toast.success(
          <Alert type="success" isClosable={false}>
            <Trans
              i18nKey={`mtoCommonSolutionContactMisc:${mode}.success`}
              values={{
                contact: formData.name || teamMember.name
              }}
              components={{
                bold: <span className="text-bold" />
              }}
            />
          </Alert>,
          {
            autoClose: 3000,
            hideProgressBar: false
          }
        );
        closeModal();
      }
    });
  };

  return (
    <FormProvider {...methods}>
      <Form
        className="maxw-none padding-bottom-10"
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
                  contact: methods.getValues('name')
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
                    username: teamMember.userAccount?.username || '',
                    displayName: teamMember.name,
                    email: teamMember.email
                  }}
                  onChange={oktaUser => {
                    setValue('name', oktaUser ? oktaUser.displayName : '');
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
          headingLevel="h1"
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
      </Form>
    </FormProvider>
  );
};

export default TeamMemberForm;
