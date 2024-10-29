import React, { useEffect } from 'react';
import { GridContainer, Icon } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';

import NestedTable from './DnD/NestedTable';

export type ColumnSortType = {
  isSorted: boolean;
  isSortedDesc: boolean;
  sortColumn: string;
};

export type MTORowType = 'category' | 'subcategory' | 'milestone';

export type MilestoneType = {
  id: string;
  risk: string;
  name: string;
  facilitatedBy: string;
  solutions: string[];
  needBy: string;
  status: string;
  actions: any;
};

export type SubCategoryType = {
  id: string;
  risk: string;
  name: string;
  facilitatedBy: string;
  solutions: string[];
  needBy: string;
  status: string;
  actions: any;
  milestones: MilestoneType[];
};

export type CategoryType = {
  id: string;
  risk: string;
  name: string;
  facilitatedBy: string;
  solutions: string[];
  needBy: string;
  status: string;
  actions: any;
  subCategories: SubCategoryType[];
};

export type RowType = CategoryType | SubCategoryType | MilestoneType;

const rawData: CategoryType[] = [
  {
    id: '1',
    risk: '',
    name: 'Category 1',
    facilitatedBy: '',
    solutions: [],
    needBy: '',
    status: '',
    actions: '',
    subCategories: [
      {
        id: '1-1',
        risk: '',
        name: 'Sub-Category 1',
        facilitatedBy: '',
        solutions: [],
        needBy: '',
        status: '',
        actions: '',
        milestones: [
          {
            id: '1-1-1',
            risk: 'H',
            name: 'Milestone 1',
            facilitatedBy: 'Facilitator 1',
            solutions: ['Solution 1', 'Solution 2'],
            needBy: '2025-01-01',
            status: 'In Progress',
            actions: 'Actions 1'
          },
          {
            id: '1-1-2',
            risk: 'L',
            name: 'Second milestone',
            facilitatedBy: 'Rupert Harrison',
            solutions: [],
            needBy: '2025-06-07',
            status: 'In Progress',
            actions: 'Actions 2'
          },
          {
            id: '1-1-3',
            risk: 'M',
            name: 'Just another milestone',
            facilitatedBy: 'John Doe',
            solutions: ['IPC', '4i'],
            needBy: '2023-01-02',
            status: 'In Progress',
            actions: 'Actions 2'
          }
        ]
      },
      {
        id: '1-2',
        risk: '',
        name: 'Sub-Category 2',
        facilitatedBy: '',
        solutions: [],
        needBy: '',
        status: '',
        actions: '',
        milestones: [
          {
            id: '1-2-1',
            risk: 'M',
            name: 'Milestone 3',
            facilitatedBy: 'Facilitator 3',
            solutions: ['Solution 5', 'Solution 6'],
            needBy: '2022-01-03',
            status: 'In Progress',
            actions: 'Actions 3'
          },
          {
            id: '1-2-2',
            risk: 'H',
            name: 'Milestone 4',
            facilitatedBy: 'Facilitator 4',
            solutions: [],
            needBy: '2022-01-04',
            status: 'In Progress',
            actions: 'Actions 4'
          }
        ]
      }
    ]
  },
  {
    id: '2',
    risk: '',
    name: 'Category 2',
    facilitatedBy: '',
    solutions: [],
    needBy: '',
    status: '',
    actions: '',
    subCategories: [
      {
        id: '2-1',
        risk: '',
        name: 'Sub-Category 3',
        facilitatedBy: '',
        solutions: [],
        needBy: '',
        status: '',
        actions: '',
        milestones: [
          {
            id: '2-1-1',
            risk: 'L',
            name: 'Milestone 5',
            facilitatedBy: 'Facilitator 1',
            solutions: ['Solution 1', 'Solution 2'],
            needBy: '2022-01-01',
            status: 'In Progress',
            actions: 'Actions 1'
          },
          {
            id: '2-1-2',
            risk: 'H',
            name: 'Milestone 6',
            facilitatedBy: 'Facilitator 2',
            solutions: [],
            needBy: '2022-01-02',
            status: 'In Progress',
            actions: 'Actions 2'
          }
        ]
      },
      {
        id: '2-2',
        risk: '',
        name: 'Sub-Category 4',
        facilitatedBy: '',
        solutions: [],
        needBy: '',
        status: '',
        actions: '',
        milestones: [
          {
            id: '2-2-1',
            risk: 'M',
            name: 'Milestone 7',
            facilitatedBy: 'Facilitator 3',
            solutions: ['Solution 5', 'Solution 6'],
            needBy: '2022-01-03',
            status: 'In Progress',
            actions: 'Actions 3'
          },
          {
            id: '2-2-2',
            risk: 'H',
            name: 'Milestone 8',
            facilitatedBy: 'Facilitator 4',
            solutions: ['Solution 7', 'Solution 8'],
            needBy: '2022-01-04',
            status: 'In Progress',
            actions: 'Actions 4'
          }
        ]
      }
    ]
  }
];

const riskMap: { [key: string]: number } = {
  Low: 1,
  Medium: 2,
  High: 3
};

type ColumnType = {
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

type RowProps = { row: RowType; rowType: MTORowType };

export const columns: ColumnType[] = [
  {
    Header: <Icon.Warning size={3} className="left-05 text-base-lighter" />,
    accessor: 'risk',
    width: '60px',
    canSort: false,
    sort: (data: CategoryType[], direction: 'ASC' | 'DESC') => {
      const copyData = [...data];
      copyData.forEach(category => {
        category.subCategories.forEach(subCategory => {
          subCategory.milestones.sort(
            (a, b) => (riskMap[a.risk] || 0) - (riskMap[b.risk] || 0)
          );
          if (direction === 'DESC') {
            subCategory.milestones.reverse();
          }
        });
      });
      return copyData;
    },
    Cell: ({ row, rowType }: RowProps) => {
      const { risk } = row;
      if (rowType !== 'milestone')
        return <span className="margin-left-05">&#x2015;</span>;
      return (
        <span className="text-bold text-base-lighter">
          {(() => {
            if (risk === 'H')
              return <Icon.Error className="text-error-dark top-05" size={3} />;
            if (risk === 'M')
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
    Header: 'Model milestone',
    accessor: 'name',
    width: '200px',
    sort: sortNested,
    Cell: ({ row }: RowProps) => {
      return <>{row.name}</>;
    }
  },
  {
    Header: 'Facilitated By',
    accessor: 'facilitatedBy',
    width: '200px',
    sort: sortNested,
    Cell: ({ row }: RowProps) => {
      return <>{row.facilitatedBy}</>;
    }
  },
  {
    Header: 'Solutions',
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
    Header: 'Need By',
    accessor: 'needBy',
    width: '130px',
    sort: sortNested,
    Cell: ({ row }: RowProps) => {
      return <>{row.needBy}</>;
    }
  },
  {
    Header: 'Status',
    accessor: 'status',
    width: '130px',
    sort: sortNested,
    Cell: ({ row }: RowProps) => {
      return <>{row.status}</>;
    }
  },
  {
    Header: 'Actions',
    accessor: 'actions',
    width: '130px',
    canSort: false,
    Cell: ({ row }: RowProps) => {
      return <>{row.actions}</>;
    }
  }
];

const Sandbox = () => {
  useEffect(() => {
    document.title = 'Sandbox';
  }, []);

  return (
    <MainContent>
      <GridContainer className="margin-y-6">
        <NestedTable rawData={rawData} />
      </GridContainer>
    </MainContent>
  );
};

export default Sandbox;
