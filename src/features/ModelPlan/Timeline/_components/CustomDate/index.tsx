import React, { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Fieldset,
  Form,
  FormGroup,
  Grid,
  GridContainer,
  Icon,
  Label,
  Radio,
  TextInput
} from '@trussworks/react-uswds';
import {
  CustomTimelineDateType,
  GetCustomDateQuery,
  useCreateCustomDateMutation
} from 'gql/generated/graphql';

import DateTimePicker from 'components/DateTimePicker';
import HelpText from 'components/HelpText';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import TextAreaField from 'components/TextAreaField';
import toastSuccess from 'components/ToastSuccess';
import { getStatusAlertBody } from 'contexts/ErrorContext';
import { setCurrentErrorMeta } from 'contexts/ErrorContext/errorMetaStore';
import usePlanTranslation from 'hooks/usePlanTranslation';

type CustomDateFormValues = GetCustomDateQuery['customTimelineDate'];

const CustomDate = () => {
  const { t: generalT } = useTranslation('general');
  const { t: customDateT } = useTranslation('customDate');
  const { t: customDateMiscT } = useTranslation('customDateMisc');
  const { dateType: dateTypeConfig } = usePlanTranslation('customDate');

  const { modelID = '' } = useParams<{ modelID: string }>();

  const navigate = useNavigate();

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const dateParam = params.get('customDateID');

  const mode = dateParam ? 'edit' : 'add';

  const [disableButton, setDisableButton] = useState(true);

  const [create] = useCreateCustomDateMutation();

  const methods = useForm<CustomDateFormValues>({
    defaultValues: {
      title: '',
      description: '',
      dateType: undefined,
      startDate: '',
      endDate: ''
    },
    mode: 'onChange'
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting, isDirty, isValid },
    watch
  } = methods;

  const disabledSubmitBtn = isSubmitting || !isDirty || !isValid;

  useEffect(() => {
    setDisableButton(disabledSubmitBtn);
  }, [setDisableButton, disabledSubmitBtn]);

  const onSubmit = (formData: CustomDateFormValues) => {
    setCurrentErrorMeta({
      overrideMessage: getStatusAlertBody({
        type: 'error',
        message: customDateMiscT(`${mode}.error`)
      })
    });

    create({
      variables: {
        input: {
          modelPlanID: modelID,
          title: formData.title || '',
          description: formData.description || undefined,
          dateType: formData.dateType,
          startDate: formData.startDate || '',
          endDate: formData.endDate || undefined
        }
      }
    }).then(response => {
      if (!response?.errors) {
        toastSuccess(
          <Trans
            i18nKey={`customDateMisc:${mode}.success`}
            values={{
              name: formData.title
            }}
            components={{
              bold: <span className="text-bold" />
            }}
          />
        );

        navigate(`/models/${modelID}/collaboration-area/model-timeline`);
      }
    });
  };

  return (
    <MainContent
      data-testid="model-plan-timeline-custom-date"
      className="padding-top-2"
    >
      <GridContainer>
        <div className="margin-bottom-5">
          <PageHeading headingLevel="h2" className="margin-bottom-0">
            {customDateMiscT(`${mode}.heading`)}
          </PageHeading>

          <p className="mint-body-large text-base-dark margin-top-0 margin-bottom-2">
            {customDateMiscT(`${mode}.description`)}
          </p>

          <div>
            <Button
              type="button"
              className="usa-button usa-button--unstyled"
              onClick={() =>
                navigate(`/models/${modelID}/collaboration-area/model-timeline`)
              }
            >
              <Icon.ArrowBack
                className="deep-underline"
                aria-hidden
                aria-label="back"
              />

              {customDateMiscT(`${mode}.returnCta`)}
            </Button>
          </div>
        </div>

        <p className="text-base margin-top-0 margin-bottom-3">
          <Trans
            i18nKey={customDateMiscT('requiredField')}
            components={{
              s: <span className="text-error" />
            }}
          />
        </p>
        <Grid desktop={{ col: 9 }} tablet={{ col: 9 }}>
          <FormProvider {...methods}>
            <Form
              className="maxw-none padding-bottom-6"
              data-testid="custom-date-form"
              id="custom-date-form"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Fieldset disabled={false}>
                <Controller
                  name="title"
                  control={control}
                  rules={{
                    required: true,
                    validate: value => value !== undefined
                  }}
                  render={({ field: { ref, ...field } }) => (
                    <FormGroup className="margin-top-0 margin-bottom-3">
                      <Label
                        htmlFor="date-title"
                        className="maxw-none margin-bottom-0 text-bold"
                        requiredMarker
                      >
                        {customDateT('title.label')}
                      </Label>

                      <TextInput
                        type="text"
                        {...field}
                        id="date-title"
                        data-testid="date-title"
                        value={field.value || ''}
                      />
                    </FormGroup>
                  )}
                />

                <Controller
                  name="description"
                  control={control}
                  render={({ field: { ref, ...field } }) => (
                    <FormGroup className="margin-top-0 margin-bottom-3">
                      <Label
                        htmlFor="date-description"
                        className="maxw-none margin-bottom-0 text-bold"
                      >
                        {customDateT('description.label')}
                      </Label>

                      <TextAreaField
                        {...field}
                        id="date-description"
                        data-testid="date-description"
                        value={field.value || ''}
                      />
                    </FormGroup>
                  )}
                />

                <Controller
                  name="dateType"
                  control={control}
                  rules={{
                    required: true,
                    validate: value => value !== undefined
                  }}
                  render={({ field: { ref, ...field } }) => (
                    <FormGroup className="margin-top-0 margin-bottom-2">
                      <Label
                        htmlFor="SINGLE"
                        className="text-bold maxw-none margin-bottom-0"
                        requiredMarker
                      >
                        {customDateT('dateType.label')}
                      </Label>

                      <Radio
                        {...field}
                        className="margin-right-1"
                        id={CustomTimelineDateType.SINGLE}
                        data-testid={CustomTimelineDateType.SINGLE}
                        value={CustomTimelineDateType.SINGLE}
                        label={dateTypeConfig.options.SINGLE}
                        checked={field.value === CustomTimelineDateType.SINGLE}
                        onChange={e => {
                          field.onChange(e);
                          setValue('startDate', '', {
                            shouldDirty: true,
                            shouldValidate: true
                          });
                          setValue('endDate', '', {
                            shouldDirty: true,
                            shouldValidate: true
                          });
                        }}
                      />

                      {watch('dateType') === CustomTimelineDateType.SINGLE && (
                        <Controller
                          name="startDate"
                          control={control}
                          rules={{
                            required: true,
                            validate: value => value !== undefined
                          }}
                          render={({
                            field: { ref: childRef, ...childField }
                          }) => (
                            <FormGroup className="margin-top-05 margin-left-4 margin-bottom-2">
                              <Label
                                htmlFor="startDate"
                                className="text-bold maxw-none margin-bottom-1"
                                requiredMarker
                              >
                                {customDateMiscT('date')}
                              </Label>

                              <HelpText className="usa-hint margin-bottom-1">
                                {generalT('datePlaceholder')}
                              </HelpText>

                              <DateTimePicker
                                id="startDate"
                                name="startDate"
                                className="desktop:grid-col-6 padding-right-4"
                                value={childField.value}
                                onChange={date => {
                                  setValue('startDate', date || '', {
                                    shouldDirty: true,
                                    shouldValidate: true
                                  });
                                }}
                                alertText
                                alertIcon={false}
                                isClearable
                              />
                            </FormGroup>
                          )}
                        />
                      )}

                      <Radio
                        {...field}
                        className="margin-right-1"
                        id={CustomTimelineDateType.RANGE}
                        data-testid={CustomTimelineDateType.RANGE}
                        value={CustomTimelineDateType.RANGE}
                        label={dateTypeConfig.options.RANGE}
                        checked={field.value === CustomTimelineDateType.RANGE}
                        onChange={e => {
                          field.onChange(e);
                          setValue('startDate', '', {
                            shouldDirty: true,
                            shouldValidate: true
                          });
                          setValue('endDate', '', {
                            shouldDirty: true,
                            shouldValidate: true
                          });
                        }}
                      />

                      {watch('dateType') === CustomTimelineDateType.RANGE && (
                        <div className="display-flex">
                          <Controller
                            name="startDate"
                            control={control}
                            rules={{
                              required: true,
                              validate: value => value !== undefined
                            }}
                            render={({
                              field: { ref: childRef, ...childField }
                            }) => (
                              <FormGroup className="margin-top-05 margin-left-4 margin-bottom-2">
                                <Label
                                  htmlFor="startDate"
                                  className="text-bold maxw-none margin-bottom-1"
                                  requiredMarker
                                >
                                  {customDateT('startDate.label')}
                                </Label>

                                <HelpText className="usa-hint margin-bottom-1">
                                  {generalT('datePlaceholder')}
                                </HelpText>

                                <DateTimePicker
                                  id="startDate"
                                  name="startDate"
                                  className="padding-right-4"
                                  value={childField.value}
                                  onChange={date => {
                                    setValue('startDate', date || '', {
                                      shouldDirty: true,
                                      shouldValidate: true
                                    });
                                  }}
                                  alertText
                                  alertIcon={false}
                                  isClearable
                                />
                              </FormGroup>
                            )}
                          />

                          <Controller
                            name="endDate"
                            control={control}
                            rules={{
                              required: true,
                              validate: value => value !== undefined
                            }}
                            render={({
                              field: { ref: childRef2, ...childField2 }
                            }) => (
                              <FormGroup className="margin-top-05 margin-left-4 margin-bottom-2">
                                <Label
                                  htmlFor="endDate"
                                  className="text-bold maxw-none margin-bottom-1"
                                  requiredMarker
                                >
                                  {customDateT('endDate.label')}
                                </Label>

                                <HelpText className="usa-hint margin-bottom-1">
                                  {generalT('datePlaceholder')}
                                </HelpText>

                                <DateTimePicker
                                  id="endDate"
                                  name="endDate"
                                  className="padding-right-4"
                                  value={childField2.value || ''}
                                  onChange={date => {
                                    setValue('endDate', date || '', {
                                      shouldDirty: true,
                                      shouldValidate: true
                                    });
                                  }}
                                  alertText
                                  alertIcon={false}
                                  isClearable
                                />
                              </FormGroup>
                            )}
                          />
                        </div>
                      )}
                    </FormGroup>
                  )}
                />
              </Fieldset>

              <Button
                type="submit"
                className="usa-button margin-top-4 margin-bottom-2"
                disabled={disableButton}
              >
                {customDateMiscT(`${mode}.saveCta`)}
              </Button>

              <div>
                <Button
                  type="button"
                  className="usa-button usa-button--unstyled"
                  onClick={() =>
                    navigate(
                      `/models/${modelID}/collaboration-area/model-timeline`
                    )
                  }
                >
                  <Icon.ArrowBack
                    className="deep-underline"
                    aria-hidden
                    aria-label="back"
                  />

                  {customDateMiscT(`${mode}.returnCta`)}
                </Button>
              </div>
            </Form>
          </FormProvider>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default CustomDate;
