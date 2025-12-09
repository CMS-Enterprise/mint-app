import React, { ChangeEvent, useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Fieldset,
  Form,
  FormGroup,
  Header,
  Label,
  PrimaryNav,
  Select
  // TextInput
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import {
  useCreateKeyContactMailboxMutation,
  useCreateKeyContactUserMutation,
  useUpdateKeyContactMutation
} from 'gql/generated/graphql';
import GetAllKeyContacts from 'gql/operations/KeyContactDirectory/GetAllKeyContacts';

import { useErrorMessage } from 'contexts/ErrorContext';
import dirtyInput from 'utils/formUtil';
import { convertCamelCaseToKebabCase } from 'utils/modelPlan';
import { tArray } from 'utils/translation';

import IndivitualSmeFieldset from '../IndivitualSmeFieldset';
import { KeyContactType, smeModeType } from '../SmeModal';
import TeamMailboxSmeFieldset from '../TeamMailboxSmeFieldset';

const Categories = [
  {
    __typename: 'KeyContactCategory',
    id: 'a95a1f98-fb7a-43f9-9e3c-abc52238e350',
    category: 'Healthcare'
  },
  {
    __typename: 'KeyContactCategory',
    id: 'a95a1f98-fb7a-43f9-9e3c-abc52238e351',
    category: 'CMS Programs'
  }
];

type UnwrapNullable<
  T extends Record<P, unknown> | null | undefined,
  P extends PropertyKey
> = T extends Record<P, unknown> ? T[P] : '';

export type SmeFormValues = Pick<
  KeyContactType,
  | 'name'
  | 'mailboxTitle'
  | 'mailboxAddress'
  | 'subjectArea'
  | 'subjectCategoryID'
> & {
  userName: UnwrapNullable<KeyContactType['userAccount'], 'username'>;
};

const SmeForm = ({
  mode,
  closeModal,
  setDisableButton,
  categoryId,
  sme = {
    __typename: 'KeyContact',
    id: 'not a real id',
    name: '',
    email: '',
    mailboxAddress: '',
    mailboxTitle: '',
    subjectArea: '',
    subjectCategoryID: '',
    userAccount: {
      __typename: 'UserAccount',
      id: 'not a real userAccount id',
      commonName: 'User Doe',
      email: 'userdoe@test.com',
      username: 'user'
    }
  }
}: {
  mode: smeModeType;
  closeModal: () => void;
  setDisableButton: React.Dispatch<React.SetStateAction<boolean>>;
  categoryId?: string;
  sme?: KeyContactType;
}) => {
  const { t: keyContactT } = useTranslation('keyContact');
  const { t: keyContactMiscT } = useTranslation('keyContactMisc');

  const navs = tArray<string>('keyContactMisc:navs');

  const isEditMode = mode === 'edit';

  const [currentNavKey, setCurrentNavKey] = useState(navs[0]);

  const [isIndivitualMode, setIsIndivitualMode] = useState(
    isEditMode ? !!sme.userAccount : true
  );

  const [disabledNavKey, setIsDisabledNavKey] = useState('');

  const { setErrorMeta } = useErrorMessage();

  const methods = useForm<SmeFormValues>({
    defaultValues: {
      userName: sme.userAccount?.username || '',
      name: sme.name || '',
      mailboxAddress: sme.mailboxAddress || '',
      mailboxTitle: sme.mailboxTitle || '',
      subjectArea: sme.subjectArea || '',
      subjectCategoryID: sme.subjectCategoryID || ''
    },
    mode: 'onChange'
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isDirty },
    watch,
    setValue,
    reset
  } = methods;

  const [createKeyContactUser] = useCreateKeyContactUserMutation({
    refetchQueries: [
      {
        query: GetAllKeyContacts
      }
    ]
  });

  const [createKeyContactMailbox] = useCreateKeyContactMailboxMutation({
    refetchQueries: [
      {
        query: GetAllKeyContacts
      }
    ]
  });

  const [update] = useUpdateKeyContactMutation({
    refetchQueries: [
      {
        query: GetAllKeyContacts
      }
    ]
  });

  useEffect(() => {
    if (isEditMode) {
      setIsDisabledNavKey(sme.mailboxAddress ? 'Indivitual' : 'Team mailbox');
      setCurrentNavKey(sme.mailboxAddress ? 'Team mailbox' : 'Indivitual');
    } else {
      setIsIndivitualMode(currentNavKey === 'Indivitual');
    }
  }, [sme.mailboxAddress, currentNavKey, isEditMode]);

  const disabledIndivitual = isIndivitualMode ? !watch('userName') : false;
  const disabledTeamMailbox = !isIndivitualMode
    ? !watch('mailboxAddress') || !watch('mailboxTitle')
    : false;

  const disabledSubmitBtn =
    (isIndivitualMode && disabledIndivitual) ||
    (!isIndivitualMode && disabledTeamMailbox) ||
    watch('subjectCategoryID') === 'default' ||
    !watch('subjectArea') ||
    isSubmitting ||
    !isDirty;

  useEffect(() => {
    setDisableButton(disabledSubmitBtn);
  }, [setDisableButton, disabledSubmitBtn]);

  const formNavKeys = navs.map(navKey => (
    <button
      type="button"
      key={navKey}
      disabled={disabledNavKey === navKey}
      onClick={() => {
        reset();
        setCurrentNavKey(navKey);
      }}
      className={classNames('usa-nav__link margin-left-neg-2 margin-right-2', {
        'usa-current': currentNavKey === navKey
      })}
    >
      <span
        className={classNames({
          'text-primary': currentNavKey === navKey
        })}
      >
        {navKey}
      </span>
    </button>
  ));

  const onSubmit = (formData: SmeFormValues) => {
    const { subjectArea, subjectCategoryID, mailboxTitle } = dirtyInput(
      sme,
      formData
    );
    setErrorMeta({
      overrideMessage: keyContactMiscT(`${mode}.error`)
    });

    let promise;

    if (isEditMode) {
      promise = update({
        variables: {
          id: sme.id,
          changes: {
            subjectArea,
            subjectCategoryID,
            mailboxTitle
          }
        }
      });
    } else {
      promise = isIndivitualMode
        ? createKeyContactUser({
            variables: {
              subjectCategoryID: categoryId || formData.subjectCategoryID,
              userName: formData.userName,
              subjectArea: formData.subjectArea
            }
          })
        : createKeyContactMailbox({
            variables: {
              subjectCategoryID: categoryId || formData.subjectCategoryID,
              mailboxAddress: formData.mailboxAddress || '',
              mailboxTitle: formData.mailboxTitle || '',
              subjectArea: formData.subjectArea
            }
          });
    }

    promise.then(response => {
      if (!response?.errors) {
        closeModal();
      }
    });
  };

  return (
    <FormProvider {...methods}>
      <Form
        className="maxw-none padding-bottom-10"
        data-testid="sme-form"
        id="sme-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Fieldset style={{ minWidth: '100%' }}>
          {categoryId ? (
            <p>
              <span className="text-bold">
                {keyContactT('subjectCategory.label')}:
              </span>{' '}
              {categoryId}
            </p>
          ) : (
            <Controller
              name="subjectCategoryID"
              control={control}
              rules={{
                required: true,
                validate: value => value !== 'default'
              }}
              render={({ field: { ref, ...field } }) => (
                <FormGroup className="margin-top-0 margin-bottom-2">
                  <Label
                    htmlFor="sme-subject-category-select"
                    className="mint-body-normal maxw-none"
                    requiredMarker
                  >
                    {keyContactT('subjectCategory.label')}
                  </Label>
                  {mode === 'addWithoutCategory' && (
                    <span className="text-base-dark">
                      {keyContactT('subjectCategory.sublabel')}
                    </span>
                  )}

                  <Select
                    {...field}
                    id="sme-subject-category-select"
                    value={field.value || ''}
                    defaultValue="default"
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      setValue('subjectCategoryID', e.target.value, {
                        shouldDirty: true
                      });
                    }}
                  >
                    <option value="default">
                      - {keyContactMiscT('selectDefault')} -
                    </option>
                    {Categories.map(option => {
                      return (
                        <option
                          key={`select-${convertCamelCaseToKebabCase(option.category)}`}
                          value={option.id}
                        >
                          {option.category}
                        </option>
                      );
                    })}
                  </Select>
                </FormGroup>
              )}
            />
          )}
        </Fieldset>

        <Header
          basic
          extended={false}
          className="model-to-operations__nav-container border-bottom border-base-lighter"
        >
          <div className="usa-nav-container padding-0">
            <PrimaryNav
              items={formNavKeys}
              mobileExpanded={false}
              className="flex-justify-start margin-0 padding-0"
            />
          </div>
        </Header>

        {isIndivitualMode ? (
          <IndivitualSmeFieldset
            control={control}
            setValue={setValue}
            sme={sme}
            isEditMode={isEditMode}
          />
        ) : (
          <TeamMailboxSmeFieldset control={control} isEditMode={isEditMode} />
        )}

        {mode !== 'edit' && (
          <Button
            type="submit"
            disabled={disabledSubmitBtn}
            className="margin-right-3 margin-top-0"
          >
            {keyContactMiscT('add.cta')}
          </Button>
        )}
      </Form>
    </FormProvider>
  );
};

export default SmeForm;
