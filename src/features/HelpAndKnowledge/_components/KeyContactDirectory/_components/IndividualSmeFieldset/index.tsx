import React from 'react';
import { Control, Controller, UseFormSetValue } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Fieldset, FormGroup, Label, TextInput } from '@trussworks/react-uswds';
import classNames from 'classnames';

import OktaUserSelect from 'components/OktaUserSelect';

import { SmeFormValues } from '../SmeForm';
import { KeyContactType } from '../SmeModal';

const IndividualSmeFieldset = ({
  control,
  setValue,
  sme,
  isEditMode
}: {
  control: Control<SmeFormValues, any, SmeFormValues>;
  setValue: UseFormSetValue<SmeFormValues>;
  sme: KeyContactType;
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
        name="userName"
        control={control}
        render={({ field: { ref, ...field } }) => (
          <FormGroup className="margin-top-0 margin-bottom-2">
            <Label
              htmlFor="sme-name"
              className="mint-body-normal maxw-none"
              requiredMarker
            >
              {keyContactT('name.label')}
            </Label>
            <span className="text-base-dark">
              {keyContactT('name.sublabel')}
            </span>

            <OktaUserSelect
              id="sme-name"
              name="sme-name"
              ariaLabelledBy="label-sme-name"
              ariaDescribedBy="hint-sme-name"
              value={{
                username: sme.userAccount?.username || '',
                displayName: sme.name,
                email: sme.email
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
    </Fieldset>
  );
};
export default IndividualSmeFieldset;
