import React from 'react';
import { Field, Form, Formik, FormikProps } from 'formik';

import FieldGroup from 'components/FieldGroup';
import HelpText from 'components/HelpText';
import Label from 'components/Label';

import FileUpload from './index';

export default {
  title: 'File Upload',
  component: FileUpload
};

export const Default = () => {
  return (
    <FileUpload
      id="file-upload"
      name="file-upload"
      accept=".pdf,.txt"
      onChange={() => {}}
      onBlur={() => {}}
      ariaDescribedBy=""
      inputProps={<input />}
    />
  );
};

export const Disabled = () => {
  return (
    <FileUpload
      id="file-upload-disabled"
      name="file-upload-disabled"
      accept=".pdf,.txt"
      onChange={() => {}}
      onBlur={() => {}}
      ariaDescribedBy=""
      disabled
      inputProps={<input />}
    />
  );
};

export const Error = () => {
  return (
    <FieldGroup error>
      <FileUpload
        id="file-upload-disabled"
        name="file-upload-disabled"
        accept=".pdf,.txt"
        onChange={() => {}}
        onBlur={() => {}}
        ariaDescribedBy=""
        inputProps={<input />}
      />
    </FieldGroup>
  );
};

type FileInputForm = {
  document: File | null;
};

export const WithFormik = () => {
  return (
    <Formik onSubmit={() => {}} initialValues={{ document: null }}>
      {(formikProps: FormikProps<FileInputForm>) => {
        const { setFieldValue } = formikProps;

        // Cast to any to avoid type errors. This is a common pattern for resolving React 19 compatibility issues with third-party libraries that haven't been updated yet.
        const FormComponent = Form as any;
        return (
          <FormComponent>
            <Label htmlFor="Storybook-FileInput">Document</Label>
            <HelpText id="Storybook-FileInputHelp">
              This document can be a PDF or DOC and can be no larger than 5 MB.
              Limit 1 file
            </HelpText>
            <Field
              as={FileUpload}
              id="Storybook-FileInput"
              name="document"
              ariaDescribedBy="Storybook-FileInputHelp"
              accept=".pdf,.doc"
              onChange={(event: React.FormEvent<HTMLFormElement>) => {
                setFieldValue('document', event.currentTarget.files[0]);
              }}
            />
          </FormComponent>
        );
      }}
    </Formik>
  );
};
