import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSortBy, useTable } from 'react-table';

import { ExistingProviderSupplierTypes } from 'i18n/en-US/modelPlan/participantsAndProviders';

import data from './data';

const ProviderAndSupplierTable = ({
  type
}: {
  type: ExistingProviderSupplierTypes;
}) => {
  const { t: modalT } = useTranslation('participantsAndProvidersMisc');

  const columns = useMemo(() => {
    return [
      {
        Header: modalT('modal.table.headers.providerType'),
        accessor: 'providerType',
        Cell: ({ value }: any) => {
          return { value };
        }
      },
      {
        Header: modalT('modal.table.headers.description'),
        accessor: 'description',
        Cell: ({ value }: any) => {
          return { value };
        }
      }
    ];
  }, [modalT]);

  const {
    // getTableProps,
    // getTableBodyProps,
    // headerGroups,
    // rows,
    // prepareRow
  } = useTable(
    {
      autoResetSortBy: false,
      autoResetPage: false,
      columns,
      data: data[type],
      // sortTypes:
      initialState: {
        pageIndex: 0
      }
    },
    useSortBy
  );

  return <div>ProviderAndSupplierTable</div>;
};

export default ProviderAndSupplierTable;
