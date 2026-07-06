import React from 'react';
import { Controller, Form, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Fieldset,
  FormGroup,
  Grid,
  GridContainer,
  Icon,
  Label
} from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';

const CustomDate = () => {
  const { t: customDateMiscT } = useTranslation('customDateMisc');

  const { modelID = '' } = useParams<{ modelID: string }>();

  const navigate = useNavigate();

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const dateParam = params.get('customDateID');

  const methods = useForm<any>({
    defaultValues: {},
    mode: 'onChange'
  });

  const { control, handleSubmit, setValue } = methods;

  const onSubmit = (formData: any) => {};

  return (
    <MainContent
      data-testid="model-plan-timeline-custom-date"
      className="padding-top-2"
    >
      <GridContainer>
        <div className="margin-bottom-3">
          <PageHeading headingLevel="h2" className="margin-y-0">
            {customDateMiscT('add.heading')}
          </PageHeading>

          <p className="mint-body-large text-base-dark margin-top-0 margin-bottom-2">
            {customDateMiscT('add.description')}
          </p>

          <div>
            <Button
              type="submit"
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

              {customDateMiscT('dontSaveAndReturn')}
            </Button>
          </div>
        </div>

        <FormProvider {...methods}>
          <Form
            className="maxw-none padding-bottom-6"
            data-testid="custom-date-form"
            id="custom-date-form"
            //   onSubmit={handleSubmit(onSubmit)}
          >
            {/* {mode === 'addSystemOwner' && (
              <p> {miscT(`${mode}.description`)}</p>
            )} */}

            <Fieldset disabled={false}>
              <Controller
                name="dateTitle"
                control={control}
                rules={{
                  required: true,
                  validate: value => value !== undefined
                }}
                render={({ field: { ref, ...field } }) => (
                  <FormGroup className="margin-top-0 margin-bottom-2">
                    <Label
                      htmlFor="dateTitle"
                      className="mint-body-normal maxw-none margin-bottom-0"
                      requiredMarker
                    >
                      {customDateMiscT('add.heading')}
                    </Label>

                    <span className="text-base-dark">
                      {customDateMiscT('add.description')}
                    </span>
                  </FormGroup>
                )}
              />

              <Controller
                name="ownerType"
                control={control}
                rules={{
                  required: true,
                  validate: value => value !== undefined
                }}
                render={({ field: { ref, ...field } }) => (
                  <FormGroup className="margin-top-0 margin-bottom-2">
                    <Label
                      htmlFor="owner-type"
                      className="mint-body-normal maxw-none margin-bottom-0"
                      requiredMarker
                    >
                      {customDateMiscT('ownerType.label')}
                    </Label>

                    {/* {getKeys(ownerTypeConfig.options).map(option => (
                      <div className="display-flex" key={option}>
                        <Radio
                          {...field}
                          id={option}
                          data-testid={option}
                          value={option}
                          label={ownerTypeConfig.options[option]}
                          checked={field.value === option}
                          className="margin-right-1"
                        />
                      </div>
                    ))} */}
                  </FormGroup>
                )}
              />
            </Fieldset>
          </Form>
        </FormProvider>
        <Grid className="border">
          <div className="padding-top-6 padding-bottom-5">hello</div>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default CustomDate;
