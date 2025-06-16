import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Trans } from 'react-i18next';
import {
  Button,
  Fieldset,
  Form,
  FormGroup,
  //   Icon,
  Label,
  Select,
  TextInput
} from '@trussworks/react-uswds';

import Alert from 'components/Alert';
import CheckboxField from 'components/CheckboxField';
import mtoCommonSolutionContact, {
  mtoCommonSolutionContactMisc
} from 'i18n/en-US/modelPlan/mtoCommonSolutionContact';

import { ModeType } from '../MailboxAndTeamMemberModal';

type MemberValues = { name: string; role: string };
type TeamValues = { mailboxAddress: string; mailboxTitle: string };
type FormValues =
  | MemberValues
  | TeamValues
  | { isPrimary: boolean; receiveEmails: boolean };

const AddMailboxAndTeamMemberForm = ({
  mode,
  closeModal
}: {
  mode: ModeType;
  closeModal: () => void;
}) => {
  const methods = useForm<FormValues>({
    defaultValues: {
      name: '',
      role: '',
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
    formState: { isValid }
  } = methods;

  const onSubmit = () => {
    console.log('hello world');
  };

  return (
    <FormProvider {...methods}>
      <Form
        className="maxw-none"
        data-testid="mailbox-and-team-member-form"
        id="mailbox-and-team-member-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Fieldset
        //   disabled={loading}
        >
          {mode === 'addTeamMember' && (
            <>
              <Controller
                name="name"
                control={control}
                rules={{
                  required: true,
                  validate: value => value !== 'default'
                }}
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

                    <Select
                      {...field}
                      id="team-member-name"
                      value={field.value || 'default'}
                    >
                      <option> </option>
                      <option>ABCD</option>
                      <option>EFGH</option>
                      <option>IJKL</option>
                    </Select>
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
            </>
          )}

          {mode === 'addTeamMailbox' && (
            <>
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
            </>
          )}

          <Controller
            name="isPrimary"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <FormGroup className="margin-top-0 margin-bottom-2">
                {/* <Label htmlFor="isPrimary" className="maxw-none text-normal">
                    {mtoCommonSolutionContact.isPrimary.label}
                  </Label> */}

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
                />
                {/* <Icon.Info className="minw-4" /> */}
              </FormGroup>
            )}
          />

          <Controller
            name="receiveEmails"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <FormGroup className="margin-top-0 margin-bottom-2">
                {/* <Label htmlFor="receiveEmails" className="maxw-none text-normal">
                    {mtoCommonSolutionContact.receiveEmails.label}
                  </Label> */}

                <CheckboxField
                  {...field}
                  id="receiveEmails"
                  checked={Boolean(field.value)}
                  value="true"
                  onBlur={field.onBlur}
                  onChange={e => {
                    field.onChange(e.target.checked);
                  }}
                  label={mtoCommonSolutionContact.receiveEmails.label}
                  subLabel={
                    mtoCommonSolutionContact.receiveEmails.sublabel || ''
                  }
                />
                {/* <Icon.Info className="minw-4" /> */}
              </FormGroup>
            )}
          />
        </Fieldset>
        <Alert type="info" slim className="margin-top-0 margin-bottom-2" hidden>
          <Trans
            i18nKey={mtoCommonSolutionContactMisc.alert}
            components={{
              milestoneLibrary: (
                <Button
                  type="button"
                  className="usa-button usa-button--unstyled margin-top-0"
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
            {mtoCommonSolutionContactMisc[mode].cta}
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

export default AddMailboxAndTeamMemberForm;
