import React, { useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Fieldset,
  Grid,
  GridContainer,
  IconArrowBack,
  Label,
  Radio
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import MultiSelect from 'components/shared/MultiSelect';
import TextAreaField from 'components/shared/TextAreaField';
import TextField from 'components/shared/TextField';
import { UpdatePaymentsVariables } from 'queries/Payments/types/UpdatePayments';
import UpdatePayments from 'queries/Payments/UpdatePayments';
import { ClaimsBasedPayType, PayType } from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import { sortOtherEnum, translateClaimsBasedPayType } from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

import { renderCurrentPage, renderTotalPages } from '..';

const AnticipateDependencies = () => {
  const { t } = useTranslation('payments');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<ClaimsBasedPaymentFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useQuery<
    GetClaimsBasedPaymentType,
    GetClaimsBasedPaymentVariables
  >(GetClaimsBasedPayment, {
    variables: {
      id: modelID
    }
  });

  const modelName = data?.modelPlan?.modelName || '';

  const [update] = useMutation<UpdatePaymentsVariables>(UpdatePayments);

  return <div>AnticipateDependencies</div>;
};

export default AnticipateDependencies;
