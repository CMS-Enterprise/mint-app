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
import { useCreateMtoCommonSolutionUserContactMutation } from 'gql/generated/graphql';
import GetMTOSolutionContacts from 'gql/operations/ModelToOperations/GetMTOSolutionContacts';

import Alert from 'components/Alert';
import CheckboxField from 'components/CheckboxField';
import OktaUserSelect from 'components/OktaUserSelect';
import useMessage from 'hooks/useMessage';
import useModalSolutionState from 'hooks/useModalSolutionState';

type FormValues = {
  userName: string;
  role: string;
  isPrimary: boolean;
  receiveEmails: boolean;
};

const AddTeamMemberForm = ({ closeModal }: { closeModal: () => void }) => {
  const { t: contactT } = useTranslation('mtoCommonSolutionContact');
  const { t: miscT } = useTranslation('mtoCommonSolutionContactMisc');
  const methods = useForm<FormValues>({
    defaultValues: {
      userName: '',
      role: '',
      isPrimary: false,
      receiveEmails: false
    },
    mode: 'onChange'
  });

  const { control, handleSubmit, reset, watch, setValue } = methods;

  const { selectedSolution } = useModalSolutionState();
  const { showMessage } = useMessage();
  const [create] = useCreateMtoCommonSolutionUserContactMutation({
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
        key: selectedSolution.enum,
        userName: formData.userName,
        role: formData.role,
        isPrimary: formData.isPrimary,
        receiveEmails: formData.receiveEmails
      }
    })
      .then(response => {
        if (!response?.errors) {
          showMessage(
            <Trans
              i18nKey="mtoCommonSolutionContactMisc:addTeamMember.success"
              values={{
                contact: formData.userName
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
            {miscT('addTeamMember.error')}
          </Alert>
        )}
        <Fieldset disabled={!selectedSolution}>
          <Controller
            name="userName"
            control={control}
            rules={{
              required: true,
              validate: value => value !== ''
            }}
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
                  onChange={oktaUser =>
                    setValue('userName', oktaUser ? oktaUser.username : '')
                  }
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
                  label={contactT('isPrimary.label')}
                  subLabel={contactT('isPrimary.sublabel')}
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
          {miscT('alert')}
        </Alert>
        <div className="margin-top-3 display-flex">
          <Button
            type="submit"
            disabled={!watch('userName') || !watch('role')}
            className="margin-right-3 margin-top-0"
          >
            {miscT('addTeamMember.cta')}
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

export default AddTeamMemberForm;
