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
import { SolutionContactType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import { useUpdateMtoCommonSolutionContactMutation } from 'gql/generated/graphql';
import GetMTOSolutionContacts from 'gql/operations/ModelToOperations/GetMTOSolutionContacts';

import Alert from 'components/Alert';
import CheckboxField from 'components/CheckboxField';
import OktaUserSelect from 'components/OktaUserSelect';
import useMessage from 'hooks/useMessage';
import useModalSolutionState from 'hooks/useModalSolutionState';
import mtoCommonSolutionContact, {
  mtoCommonSolutionContactMisc
} from 'i18n/en-US/modelPlan/mtoCommonSolutionContact';
import dirtyInput from 'utils/formUtil';

type FormValues = {
  userName: string;
  role: string;
  isPrimary: boolean;
  receiveEmails: boolean;
};

const EditTeamMemberForm = ({
  closeModal,
  teamMember
}: {
  closeModal: () => void;
  teamMember: SolutionContactType;
}) => {
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
    const { role, isPrimary, receiveEmails } = dirtyInput(teamMember, formData);
    update({
      variables: {
        id: teamMember.id,
        input: {
          role,
          isPrimary,
          receiveEmails
        }
      }
    })
      .then(response => {
        if (!response?.errors) {
          showMessage(
            <Trans
              i18nKey={mtoCommonSolutionContactMisc.editTeamMember.success}
              values={{
                contact: teamMember.name
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
            {mtoCommonSolutionContactMisc.editTeamMember.error}
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
                  {mtoCommonSolutionContact.name.label}
                </Label>
                <span className="text-base-dark">
                  {mtoCommonSolutionContact.name.sublabel}
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
                  onChange={() => {}}
                  className="disabled-input"
                  disabled
                />
              </FormGroup>
            )}
          />

          <Controller
            name="role"
            control={control}
            rules={{
              required: true,
              validate: value => value !== 'default'
            }}
            render={({ field: { ref, ...field } }) => (
              <FormGroup className="margin-top-0 margin-bottom-2">
                <Label
                  htmlFor="team-member-role"
                  className="mint-body-normal maxw-none margin-bottom-1"
                  requiredMarker
                >
                  {mtoCommonSolutionContact.role.label}
                </Label>

                <TextInput
                  type="text"
                  {...field}
                  id="team-member-role"
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
                  label={mtoCommonSolutionContact.isPrimary.label}
                  subLabel={mtoCommonSolutionContact.isPrimary.sublabel || ''}
                  checked={Boolean(field.value)}
                  value="true"
                  onBlur={field.onBlur}
                  onChange={e => {
                    field.onChange(e.target.checked);
                  }}
                  disabled={teamMember.isPrimary}
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
            {mtoCommonSolutionContactMisc.saveChanges}
          </Button>
          <Button
            type="button"
            className="margin-top-0"
            unstyled
            onClick={closeModal}
          >
            {mtoCommonSolutionContactMisc.cancel}
          </Button>
        </div>
      </Form>
    </FormProvider>
  );
};

export default EditTeamMemberForm;
