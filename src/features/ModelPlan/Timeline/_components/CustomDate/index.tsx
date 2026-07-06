import React from 'react';
import { Controller, Form, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import {
  Fieldset,
  FormGroup,
  Grid,
  GridContainer,
  Label
} from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';

const CustomDate = () => {
  const { t: timelineMiscT } = useTranslation('timelineMisc');

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
                      {timelineMiscT('dateTitle.label')}
                    </Label>

                    <span className="text-base-dark">
                      {timelineMiscT('dateTitle.sublabel')}
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
                      {timelineMiscT('ownerType.label')}
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
