import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { Alert, IconFileDownload } from '@trussworks/react-uswds';
import axios from 'axios';

import AccessibilityRequestsTable from 'components/AccessibilityRequestsTable';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import { NavLink, SecondaryNav } from 'components/shared/SecondaryNav';
import useMessage from 'hooks/useMessage';
import GetAccessibilityRequestsQuery from 'queries/GetAccessibilityRequestsQuery';
import { GetAccessibilityRequests } from 'queries/types/GetAccessibilityRequests';
import { downloadBlob } from 'utils/downloadFile';

const List = () => {
  const { t } = useTranslation('home');
  const { message } = useMessage();

  const { loading, error, data } = useQuery<GetAccessibilityRequests>(
    GetAccessibilityRequestsQuery,
    {
      variables: {
        first: 20
      },
      fetchPolicy: 'cache-and-network'
    }
  );

  if (loading) {
    return <PageLoading />;
  }

  if (error) {
    return <div>{JSON.stringify(error)}</div>;
  }

  const requests =
    data &&
    data.accessibilityRequests &&
    data.accessibilityRequests.edges.map(edge => {
      return edge.node;
    });

  function fetchCSV() {
    axios
      .request({
        url: `${process.env.REACT_APP_API_ADDRESS}/metrics/508`,
        responseType: 'blob',
        method: 'GET'
      })
      .then(response => {
        const blob = new Blob([response.data], { type: 'application/csv' });
        downloadBlob('EASiAccessibilityMetrics.csv', blob);
      })
      .catch(e => {
        // TODO add error handling: display a modal if things fail?
        console.error(e); // eslint-disable-line
      });
  }

  return (
    <>
      <SecondaryNav>
        <NavLink to="/">
          {t('accessibility:tabs.accessibilityRequests')}
        </NavLink>
      </SecondaryNav>
      <div
        className="grid-container"
        data-testid="accessibility-request-list-page"
      >
        {message && (
          <Alert className="margin-top-4" type="success" role="alert">
            {message}
          </Alert>
        )}
        <div className="display-flex flex-justify flex-wrap">
          <PageHeading>{t('accessibility.heading')}</PageHeading>
          <div className="flex-align-self-center">
            <button
              className="usa-button usa-button--unstyled easi-no-print display-flex margin-bottom-4 text-no-underline"
              type="button"
              onClick={fetchCSV}
            >
              <IconFileDownload />
              &nbsp;
              <span className="text-underline">
                Download all requests as excel file
              </span>
            </button>
          </div>
        </div>
        <AccessibilityRequestsTable requests={requests || []} />
      </div>
    </>
  );
};

export default List;
