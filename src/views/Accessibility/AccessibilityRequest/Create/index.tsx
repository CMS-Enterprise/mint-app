/* eslint-disable react/prop-types */
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';

import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import GetSystemsQuery from 'queries/GetSystems';
import { GetSystems } from 'queries/types/GetSystems';

const Create = () => {
  const { t } = useTranslation('accessibility');
  const { data, loading } = useQuery<GetSystems>(GetSystemsQuery, {
    variables: {
      // TODO: Is there a way to make this all? or change the query?
      first: 20
    }
  });

  useMemo(() => {
    const queriedSystems = data?.systems?.edges || [];
    return queriedSystems.map(system => {
      const {
        node: { id, lcid, name }
      } = system;
      return {
        label: `${name} - ${lcid}`,
        value: id
      };
    });
  }, [data]);
  if (loading) {
    return <PageLoading />;
  }

  return (
    <>
      <div className="grid-container" data-testid="create-508-request">
        <PageHeading>{t('newRequestForm.heading')}</PageHeading>
      </div>
    </>
  );
};

export default Create;
