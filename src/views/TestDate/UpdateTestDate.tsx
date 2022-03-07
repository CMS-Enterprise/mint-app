import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { DateTime } from 'luxon';

import PageLoading from 'components/PageLoading';
import { NavLink, SecondaryNav } from 'components/shared/SecondaryNav';
import { useMessage } from 'hooks/useMessage';
import GetAccessibilityRequestQuery from 'queries/GetAccessibilityRequestQuery';
import {
  GetAccessibilityRequest,
  GetAccessibilityRequest_accessibilityRequest_testDates as TestDateType
} from 'queries/types/GetAccessibilityRequest';
import { UpdateTestDate } from 'queries/types/UpdateTestDate';
import UpdateTestDateQuery from 'queries/UpdateTestDateQuery';
import { TestDateFormType } from 'types/accessibility';
import { formatDate } from 'utils/date';

import RequestDeleted from '../Accessibility/RequestDeleted';
import { NotFoundPartial } from '../NotFound';

import TestDateForm from './Form';

import './styles.scss';

const TestDate = () => {
  const { t } = useTranslation('accessibility');
  const { showMessageOnNextPage } = useMessage();

  const { accessibilityRequestId, testDateId } = useParams<{
    accessibilityRequestId: string;
    testDateId: string;
  }>();
  const [mutate, mutateResult] = useMutation<UpdateTestDate>(
    UpdateTestDateQuery,
    {
      errorPolicy: 'all'
    }
  );
  const { data, loading } = useQuery<GetAccessibilityRequest>(
    GetAccessibilityRequestQuery,
    {
      variables: {
        id: accessibilityRequestId
      }
    }
  );
  const history = useHistory();

  const test:
    | TestDateType
    | undefined = data?.accessibilityRequest?.testDates.find(
    date => date.id === testDateId
  );

  const testDate = test?.date
    ? DateTime.fromISO(test.date)
    : {
        month: '',
        day: '',
        year: ''
      };
  const initialValues: TestDateFormType = {
    dateMonth: String(testDate.month),
    dateDay: String(testDate.day),
    dateYear: String(testDate.year),
    testType: test?.testType || null,
    score: {
      isPresent: Boolean(test?.score),
      value: test?.score ? `${test?.score && test?.score / 10}` : ''
    }
  };

  const onSubmit = (values: TestDateFormType) => {
    const date = DateTime.fromObject({
      day: Number(values.dateDay),
      month: Number(values.dateMonth),
      year: Number(values.dateYear)
    });
    const hasScore = values.score.isPresent;
    const score = values.score.value;

    const confirmationText = `
      ${t('testDateForm.confirmation.date', { date: formatDate(date) })}
      ${hasScore ? t('testDateForm.confirmation.score', { score }) : ''}
      ${t('testDateForm.confirmation.update')}
    `;

    mutate({
      variables: {
        input: {
          date,
          score: hasScore ? Math.round(parseFloat(score) * 10) : null,
          testType: values.testType,
          id: testDateId
        }
      }
    }).then(() => {
      showMessageOnNextPage(confirmationText);
      history.push(`/508/requests/${accessibilityRequestId}/documents`);
    });
  };

  if (loading) {
    return <PageLoading />;
  }

  if (!data || !test) {
    return (
      <div className="grid-container">
        <NotFoundPartial />
      </div>
    );
  }

  if (data?.accessibilityRequest?.statusRecord.status === 'DELETED') {
    return <RequestDeleted />;
  }

  return (
    <>
      <SecondaryNav>
        <NavLink to="/">{t('tabs.accessibilityRequests')}</NavLink>
      </SecondaryNav>
      <div className="grid-container">
        <TestDateForm
          initialValues={initialValues}
          onSubmit={onSubmit}
          error={mutateResult.error}
          requestName={data?.accessibilityRequest?.name || ''}
          requestId={accessibilityRequestId}
          formType="update"
        />
      </div>
    </>
  );
};

export default TestDate;
