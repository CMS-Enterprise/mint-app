import React from 'react';
import { useTranslation } from 'react-i18next';
import { DatePicker, Fieldset, Label, Radio } from '@trussworks/react-uswds';
import { Field, FormikProps } from 'formik';
import {
  GetOperationalNeedQuery,
  GetOperationalSolutionQuery
} from 'gql/gen/graphql';

import Divider from 'components/Divider';
import FieldErrorMsg from 'components/FieldErrorMsg';
import FieldGroup from 'components/FieldGroup';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { getKeys } from 'types/translation';

import ImplementationStatuses from '../../_components/ImplementationStatus';
import SolutionCard from '../../_components/SolutionCard';
import SolutionDetailCard from '../../_components/SolutionDetailCard';

type OpertionalNeedSolutionTypes =
  GetOperationalNeedQuery['operationalNeed']['solutions'][0];

type flatErrorsType = {
  [key: string]: string;
};

type OperationNeedType = GetOperationalNeedQuery['operationalNeed'];
type GetOperationalSolutionType =
  GetOperationalSolutionQuery['operationalSolution'];

type SolutionTypes = {
  solution: OpertionalNeedSolutionTypes;
  identifier: string;
  index: number;
  length: number;
  flatErrors: flatErrorsType;
  loading: boolean;
  operationalNeedID: string;
  operationalSolutionID: string | undefined;
  modelID: string;
  formikProps: FormikProps<OperationNeedType>;
};

const Solution = ({
  solution,
  identifier,
  index,
  flatErrors,
  length,
  loading,
  operationalNeedID,
  operationalSolutionID,
  modelID,
  formikProps
}: SolutionTypes) => {
  const { t } = useTranslation('opSolutionsMisc');
  const { t: h } = useTranslation('draftModelPlan');

  const { status: statusConfig } = usePlanTranslation('solutions');

  const { errors, setFieldError, setFieldValue, values } = formikProps;

  const handleOnBlur = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    if (e.target.value === '') {
      setFieldValue(field, null);
      return;
    }
    try {
      setFieldValue(field, new Date(e.target.value).toISOString());
      delete errors[field as keyof OperationNeedType];
    } catch (err) {
      setFieldError(field, h('validDate'));
    }
  };

  return (
    <div key={solution.id}>
      {/*
        Operational Solution ID is UNDEFINED if user is displaying ALL solutions to an Operational Need.
        Operational Solution ID is DEFINED if user is displaying an INDIVIDUAL solution to an Operational Need.
      */}
      {operationalSolutionID === undefined ? (
        <>
          <p className="text-bold">{t('solution')}</p>
          <SolutionCard solution={solution} shadow />
        </>
      ) : (
        <SolutionDetailCard
          className="margin-bottom-3"
          solution={solution as GetOperationalSolutionType}
          operationalNeedID={operationalNeedID}
          operationalSolutionID={operationalSolutionID}
          modelID={modelID}
          isUpdatingStatus
        />
      )}

      {!loading && (
        <>
          <FieldGroup
            scrollElement="mustStartDts"
            error={!!flatErrors.mustStartDts}
            className="margin-top-1"
          >
            <Label
              htmlFor={`solution-must-start-${identifier}`}
              className="text-bold"
            >
              {t('mustStartBy')}
            </Label>

            <div className="usa-hint margin-top-1">{h('datePlaceholder')}</div>

            <FieldErrorMsg>{flatErrors.mustStartDts}</FieldErrorMsg>

            <div className="width-card-lg position-relative">
              <Field
                as={DatePicker}
                error={+!!flatErrors.mustStartDts}
                id={`solution-must-start-${identifier}`}
                data-testid={`solution-must-start-${identifier}`}
                maxLength={50}
                name={`solutions[${index}].mustStartDts`}
                defaultValue={solution.mustStartDts}
                onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleOnBlur(e, `solutions[${index}].mustStartDts`);
                }}
              />
            </div>
          </FieldGroup>

          <FieldGroup
            scrollElement="mustFinishDts"
            error={!!flatErrors.mustFinishDts}
          >
            <Label
              htmlFor={`solution-must-finish-${identifier}`}
              className="text-bold"
            >
              {t('mustFinishBy')}
            </Label>

            <div className="usa-hint margin-top-1">{h('datePlaceholder')}</div>

            <FieldErrorMsg>{flatErrors.mustFinishDts}</FieldErrorMsg>

            <div className="width-card-lg position-relative">
              <Field
                as={DatePicker}
                error={+!!flatErrors.mustFinishDts}
                id={`solution-must-finish-${identifier}`}
                data-testid={`solution-must-finish-${identifier}`}
                maxLength={50}
                name={`solutions[${index}].mustFinishDts`}
                defaultValue={solution.mustFinishDts}
                onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleOnBlur(e, `solutions[${index}].mustFinishDts`);
                }}
              />
            </div>
          </FieldGroup>

          <FieldGroup>
            <Label
              htmlFor={`solution-status-${identifier}`}
              className="text-bold"
            >
              {t('whatIsStatus')}
            </Label>

            <FieldErrorMsg>{flatErrors.status}</FieldErrorMsg>

            <Fieldset>
              {getKeys(statusConfig.options).map(key => (
                <Field
                  as={Radio}
                  key={key}
                  id={`solution-status-${identifier}-${key}`}
                  name={`solutions[${index}].status`}
                  label={statusConfig.options[key]}
                  value={key}
                  checked={values.solutions[index]?.status === key}
                  onChange={() => {
                    setFieldValue(`solutions[${index}].status`, key);
                  }}
                />
              ))}
            </Fieldset>
          </FieldGroup>

          <ImplementationStatuses />
        </>
      )}
      {index !== length - 1 && length > 1 && (
        <Divider className="margin-bottom-6 margin-top-6" />
      )}
    </div>
  );
};

export default Solution;
