import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Fieldset, FormGroup, Label, TextInput } from '@trussworks/react-uswds';

import { SmeFormValues } from '../SmeForm';

const TeamMailboxSmeFieldset = ({
  control,
  isEditMode
}: {
  control: Control<SmeFormValues, any, SmeFormValues>;
  isEditMode: boolean;
}) => {
  const { t: keyContactT } = useTranslation('keyContact');

  return (
    <Fieldset style={{ minWidth: '100%' }}>
      <Controller
        name="subjectArea"
        control={control}
        rules={{
          required: true,
          validate: value => value !== ''
        }}
        render={({ field: { ref, ...field } }) => (
          <FormGroup className="margin-bottom-2">
            <Label
              htmlFor="sme-subject-area"
              className="mint-body-normal maxw-none"
              requiredMarker
            >
              {keyContactT('subjectArea.label')}
            </Label>
            <span className="text-base-dark">
              {keyContactT('subjectArea.sublabel')}
            </span>

            <TextInput
              type="text"
              {...field}
              id="sme-subject-area"
              data-testid="sme-subject-area"
              value={field.value || ''}
            />
          </FormGroup>
        )}
      />

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
              {keyContactT('mailboxAddress.label')}
            </Label>
            <span className="text-base-dark">
              {keyContactT('mailboxAddress.sublabel')}
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
              {keyContactT('mailboxTitle.label')}
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
    </Fieldset>
  );
};
export default TeamMailboxSmeFieldset;
