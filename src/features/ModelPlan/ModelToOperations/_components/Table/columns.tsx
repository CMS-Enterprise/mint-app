import React from 'react';
import { Icon } from '@trussworks/react-uswds';
import { TaskListStatusTag } from 'features/ModelPlan/TaskList/_components/TaskListItem';
import { MtoRiskIndicator, MtoStatus } from 'gql/generated/graphql';
import i18next from 'i18next';

import UswdsReactLink from 'components/LinkWrapper';

export type ColumnSortType = {
  isSorted: boolean;
  isSortedDesc: boolean;
  sortColumn: string;
};

export type MTORowType = 'category' | 'subcategory' | 'milestone';

export type MilestoneType = {
  id: string;
  riskIndicator: MtoRiskIndicator;
  name: string;
  facilitatedBy: string;
  solutions: string[];
  needBy: string;
  status: MtoStatus;
  actions: any;
  isUncategorized?: boolean;
};

export type SubCategoryType = {
  id: string;
  riskIndicator: undefined;
  name: string;
  facilitatedBy: undefined;
  solutions: string[];
  needBy: undefined;
  status: undefined;
  actions: any;
  milestones: MilestoneType[];
  isUncategorized?: boolean;
};

export type CategoryType = {
  id: string;
  riskIndicator: undefined;
  name: string;
  facilitatedBy: undefined;
  solutions: string[];
  needBy: undefined;
  status: undefined;
  actions: any;
  subCategories: SubCategoryType[];
  isUncategorized?: boolean;
};

export type RowType = CategoryType | SubCategoryType | MilestoneType;

// eslint-disable-next-line react/no-unused-prop-types
type RowProps = { row: RowType; rowType: MTORowType; expanded?: boolean };

const riskMap: Record<MtoRiskIndicator, number> = {
  [MtoRiskIndicator.ON_TRACK]: 1,
  [MtoRiskIndicator.OFF_TRACK]: 2,
  [MtoRiskIndicator.AT_RISK]: 3
};

export type ColumnType = {
  Header: string | React.ReactNode;
  accessor: string;
  width: string;
  canSort?: boolean;
  sort?: (
    data: CategoryType[],
    direction: 'ASC' | 'DESC',
    accessor: keyof MilestoneType
  ) => CategoryType[];
  Cell?: ({
    row,
    rowType
  }: {
    row: CategoryType | SubCategoryType | MilestoneType;
    rowType: MTORowType;
    expanded?: boolean;
  }) => JSX.Element;
};

const sortNested = (
  data: CategoryType[],
  direction: 'ASC' | 'DESC',
  accessor: keyof MilestoneType
) => {
  const copyData = [...data];
  copyData.forEach(category => {
    category.subCategories.forEach(subCategory => {
      subCategory.milestones.sort((a, b) =>
        a[accessor].localeCompare(b[accessor])
      );
      if (direction === 'DESC') {
        subCategory.milestones.reverse();
      }
    });
  });
  return copyData;
};

export const columns: ColumnType[] = [
  {
    Header: <Icon.Warning size={3} className="left-05 text-base-lighter" />,
    accessor: 'riskIndicator',
    width: '60px',
    canSort: false,
    sort: (data: CategoryType[], direction: 'ASC' | 'DESC') => {
      const copyData = [...data];
      copyData.forEach(category => {
        category.subCategories.forEach(subCategory => {
          subCategory.milestones.sort(
            (a, b) =>
              (riskMap[a.riskIndicator] || 0) - (riskMap[b.riskIndicator] || 0)
          );
          if (direction === 'DESC') {
            subCategory.milestones.reverse();
          }
        });
      });
      return copyData;
    },
    Cell: ({ row, rowType, expanded }: RowProps) => {
      const { riskIndicator } = row;

      if (rowType !== 'milestone')
        return (
          <span style={{ fontSize: '1.25rem' }} className="margin-left-05">
            {!expanded ? (
              <span
                style={{
                  fontSize: '1.5rem',
                  padding: '.25rem'
                }}
                className="text-primary"
              >
                &#x2b;
              </span>
            ) : (
              <span className="text-primary">&#x2015;</span>
            )}
          </span>
        );
      return (
        <span className="text-bold text-base-lighter">
          {(() => {
            if (riskIndicator === MtoRiskIndicator.AT_RISK)
              return <Icon.Error className="text-error-dark top-05" size={3} />;
            if (riskIndicator === MtoRiskIndicator.OFF_TRACK)
              return (
                <Icon.Warning className="text-warning-dark top-05" size={3} />
              );
            return '';
          })()}
        </span>
      );
    }
  },
  {
    Header: i18next.t('modelToOperationsMisc:table.modelMilestone'),
    accessor: 'name',
    width: '200px',
    sort: sortNested,
    Cell: ({ row }: RowProps) => {
      return <>{row.name}</>;
    }
  },
  {
    Header: i18next.t('modelToOperationsMisc:table.facilitatedBy'),
    accessor: 'facilitatedBy',
    width: '200px',
    sort: sortNested,
    Cell: ({ row }: RowProps) => {
      return <>{row.facilitatedBy}</>;
    }
  },
  {
    Header: i18next.t('modelToOperationsMisc:table.solutions'),
    accessor: 'solutions',
    width: '200px',
    sort: (data: CategoryType[], direction: 'ASC' | 'DESC') => {
      const copyData = [...data];
      copyData.forEach(category => {
        category.subCategories.forEach(subCategory => {
          subCategory.milestones.sort((a, b) =>
            a.solutions.join().localeCompare(b.solutions.join())
          );
          if (direction === 'DESC') {
            subCategory.milestones.reverse();
          }
        });
      });
      return copyData;
    },
    Cell: ({ row, rowType }: RowProps) => {
      if (rowType !== 'milestone') return <></>;
      if (row.solutions.length === 0)
        return (
          <UswdsReactLink to="#">
            Select a solution{' '}
            <Icon.ArrowForward className="top-05 margin-left-05" />
          </UswdsReactLink>
        );

      return <>{row.solutions.join(', ')}</>;
    }
  },
  {
    Header: i18next.t('modelToOperationsMisc:table.needBy'),
    accessor: 'needBy',
    width: '130px',
    sort: sortNested,
    Cell: ({ row, rowType }: RowProps) => {
      if (!row.needBy && rowType === 'milestone')
        return (
          <span className="text-italic">
            {i18next.t('modelToOperationsMisc:table.noneAdded')}
          </span>
        );
      return <>{row.needBy}</>;
    }
  },
  {
    Header: i18next.t('modelToOperationsMisc:table.status'),
    accessor: 'status',
    width: '130px',
    sort: sortNested,
    Cell: ({ row, rowType }: RowProps) => {
      const { status } = row;
      if (rowType !== 'milestone') return <></>;
      return (
        <TaskListStatusTag status={status} classname="width-fit-content" />
      );
    }
  },
  {
    Header: i18next.t('modelToOperationsMisc:table.actions'),
    accessor: 'actions',
    width: '130px',
    canSort: false,
    Cell: ({ row, rowType }: RowProps) => {
      if (rowType !== 'milestone')
        return (
          <div
            style={{ textAlign: 'right', fontSize: '1.25rem' }}
            className="width-full padding-right-1 text-primary"
          >
            &#8230;
          </div>
        );
      return (
        <UswdsReactLink to="#">
          {i18next.t('modelToOperationsMisc:table.editDetails')}
        </UswdsReactLink>
      );
    }
  }
];
