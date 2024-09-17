import React, { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import {
  Button,
  CharacterCount,
  Fieldset,
  Grid,
  GridContainer,
  Label,
  Radio,
  TextInput
} from '@trussworks/react-uswds';
import HelpBreadcrumb from 'features/HelpAndKnowledge/Articles/_components/HelpBreadcrumb';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  EaseOfUse,
  MintUses,
  SatisfactionLevel,
  SendFeedbackEmailInput
} from 'gql/generated/graphql';
import CreateSendFeedback from 'gql/operations/Feedback/CreateSendFeedback';

import Alert from 'components/Alert';
import BooleanRadio from 'components/BooleanRadioForm';
import CheckboxField from 'components/CheckboxField';
import FieldGroup from 'components/FieldGroup';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import { getKeys } from 'types/translation';

const SendFeedback = () => {
  const { t } = useTranslation(['feedback', 'miscellaneous']);

  const history = useHistory();

  const [mutationError, setMutationError] = useState<boolean>(false);

  const [update, { loading }] = useMutation(CreateSendFeedback);

  const mintUsedForOptions: Record<MintUses, string> = t(
    'mintUsedFor.options',
    {
      returnObjects: true
    }
  );

  const systemEasyToUseOptions: Record<EaseOfUse, string> = t(
    'systemEasyToUse.options',
    {
      returnObjects: true
    }
  );

  const howSatisfiedOptions: Record<SatisfactionLevel, string> = t(
    'howSatisfied.options',
    {
      returnObjects: true
    }
  );

  const handleFormSubmit = (formikValues: SendFeedbackEmailInput) => {
    update({
      variables: {
        input: formikValues
      }
    })
      .then(response => {
        if (!response?.errors) {
          history.push('/feedback-received');
        }
      })
      .catch(errors => {
        setMutationError(true);
        window.scrollTo(0, 0);
      });
  };

  const initialValues: SendFeedbackEmailInput = {
    isAnonymousSubmission: false,
    allowContact: null,
    cmsRole: '',
    mintUsedFor: [],
    mintUsedForOther: '',
    systemEasyToUse: null,
    systemEasyToUseOther: '',
    howSatisfied: null
  };

  return (
    <MainContent>
      <GridContainer>
        <HelpBreadcrumb newTabOnly />

        {mutationError && (
          <Alert type="error" slim className="margin-top-4">
            {t('errorFeedback')}
          </Alert>
        )}

        <PageHeading className="margin-bottom-2">
          {t('feedbackHeading')}
        </PageHeading>

        <p className="margin-bottom-2 font-body-lg  line-height-sans-lg">
          {t('feedbackSubheading')}
        </p>

        <Formik
          initialValues={initialValues}
          onSubmit={values => {
            handleFormSubmit(values);
          }}
          enableReinitialize
        >
          {(formikProps: FormikProps<SendFeedbackEmailInput>) => {
            const { handleSubmit, setFieldValue, values } = formikProps;

            return (
              <Grid desktop={{ col: 6 }}>
                <Form
                  className="margin-top-3"
                  onSubmit={e => {
                    handleSubmit(e);
                  }}
                >
                  <Fieldset disabled={loading}>
                    <FieldGroup>
                      <Label htmlFor="send-feedback-allow-anon-submission">
                        {t('isAnonymousSubmission.label')}
                      </Label>

                      <p className="text-base margin-y-1">
                        {t('isAnonymousSubmission.sublabel')}
                      </p>

                      <BooleanRadio
                        field="isAnonymousSubmission"
                        id="send-feedback-allow-anon-submission"
                        value={values.isAnonymousSubmission}
                        setFieldValue={setFieldValue}
                        options={{
                          true: t('isAnonymousSubmission.options.true'),
                          false: t('isAnonymousSubmission.options.false')
                        }}
                      />
                    </FieldGroup>

                    <FieldGroup>
                      <Label
                        htmlFor="send-feedback-allow-contact"
                        className="margin-top-5"
                      >
                        {t('allowContact.label')}
                      </Label>

                      <p className="text-base margin-y-1">
                        {t('allowContact.sublabel')}
                      </p>

                      <BooleanRadio
                        field="allowContact"
                        id="send-feedback-allow-contact"
                        value={
                          values.allowContact === undefined
                            ? null
                            : values.allowContact
                        }
                        setFieldValue={setFieldValue}
                        disabled={values.isAnonymousSubmission === true}
                        options={{
                          true: t('allowContact.options.true'),
                          false: t('allowContact.options.false')
                        }}
                      />
                    </FieldGroup>

                    <FieldGroup>
                      <Label
                        htmlFor="send-feedback-cms-role"
                        className="margin-top-5"
                      >
                        {t('cmsRole.label')}
                      </Label>

                      <Field
                        as={TextInput}
                        id="send-feedback-cmsRole"
                        data-testid="send-feedback-cms-role"
                        name="cmsRole"
                      />
                    </FieldGroup>

                    <FieldGroup>
                      <Label
                        htmlFor="send-feedback-mint-used-for"
                        className="margin-top-5"
                      >
                        {t('mintUsedFor.label')}
                      </Label>

                      <Fieldset>
                        {getKeys(mintUsedForOptions).map(key => (
                          <Fragment key={key}>
                            <Field
                              as={CheckboxField}
                              id={`send-feedback-mint-used-for-${key}`}
                              data-testid={`send-feedback-mint-used-for-${key}`}
                              name="mintUsedFor"
                              label={t(`mintUsedFor.options.${key}`)}
                              value={key}
                              checked={values.mintUsedFor?.includes(
                                key as MintUses
                              )}
                            />

                            {key === MintUses.OTHER && (
                              <div className="margin-left-4 margin-top-1">
                                <Field
                                  as={TextInput}
                                  id="send-feedback-mint-used-for-other"
                                  data-testid="send-feedback-mint-used-for-other"
                                  disabled={
                                    !values.mintUsedFor?.includes(
                                      MintUses.OTHER
                                    )
                                  }
                                  name="mintUsedForOther"
                                />
                              </div>
                            )}
                          </Fragment>
                        ))}
                      </Fieldset>
                    </FieldGroup>

                    <FieldGroup>
                      <Label
                        htmlFor="send-feedback-ease-of-use"
                        className="margin-top-5"
                      >
                        {t('systemEasyToUse.label')}
                      </Label>

                      <Fieldset>
                        {getKeys(systemEasyToUseOptions).map(key => (
                          <Fragment key={key}>
                            <Field
                              as={Radio}
                              id={`send-feedback-ease-of-use-${key}`}
                              data-testid={`send-feedback-ease-of-use-${key}`}
                              name="systemEasyToUse"
                              label={t(`systemEasyToUse.options.${key}`)}
                              value={key}
                              checked={values.systemEasyToUse === key}
                              onChange={() => {
                                setFieldValue('systemEasyToUse', key);
                              }}
                            />
                            {key === EaseOfUse.UNSURE && (
                              <div className="margin-left-4 margin-top-1">
                                <Field
                                  as={TextInput}
                                  id="send-feedback-ease-of-use-other"
                                  data-testid="send-feedback-ease-of-use-other"
                                  disabled={
                                    values.systemEasyToUse !== EaseOfUse.UNSURE
                                  }
                                  name="systemEasyToUseOther"
                                />
                              </div>
                            )}
                          </Fragment>
                        ))}
                      </Fieldset>
                    </FieldGroup>

                    <FieldGroup>
                      <Label
                        htmlFor="send-feedback-how-satisfied"
                        className="margin-top-5"
                      >
                        {t('howSatisfied.label')}
                      </Label>

                      <Fieldset>
                        {getKeys(howSatisfiedOptions).map(key => (
                          <Fragment key={key}>
                            <Field
                              as={Radio}
                              id={`send-feedback-how-satisfied-${key}`}
                              data-testid={`send-feedback-how-satisfied-${key}`}
                              name="howSatisfied"
                              label={t(`howSatisfied.options.${key}`)}
                              value={key}
                              checked={values.howSatisfied === key}
                              onChange={() => {
                                setFieldValue('howSatisfied', key);
                              }}
                            />
                          </Fragment>
                        ))}
                      </Fieldset>
                    </FieldGroup>

                    <FieldGroup>
                      <Label
                        htmlFor="send-feedback-how-can-we-improve"
                        className="margin-top-5"
                      >
                        {t('howCanWeImprove.label')}
                      </Label>

                      <Field
                        as={CharacterCount}
                        id="send-feedback-how-can-we-improve"
                        data-testid="send-feedback-how-can-we-improve"
                        className="height-card margin-bottom-1"
                        isTextArea
                        name="howCanWeImprove"
                        maxLength={2000}
                        getCharacterCount={(text: string): number =>
                          Array.from(text).length
                        }
                      />
                    </FieldGroup>

                    <div className="margin-top-6 margin-bottom-3">
                      <Button
                        type="button"
                        className="usa-button margin-bottom-1"
                        onClick={() => {
                          handleFormSubmit(values);
                        }}
                      >
                        {t('sendFeedback')}
                      </Button>
                    </div>
                  </Fieldset>
                </Form>
              </Grid>
            );
          }}
        </Formik>
      </GridContainer>
    </MainContent>
  );
};

export default SendFeedback;
