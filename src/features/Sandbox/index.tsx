import React, { useEffect } from 'react';
import { GridContainer, Icon } from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';

import NestedTable from './DnD/NestedTable';

export type ColumnSortType = {
  isSorted: boolean;
  isSortedDesc: boolean;
};

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
            needBy: '2022-01-01',
            status: 'In Progress',
            actions: 'Actions 1'
          },
          {
            id: '1-1-2',
            risk: 'L',
            name: 'Milestone 2',
            facilitatedBy: 'Facilitator 2',
            solutions: ['Solution 3', 'Solution 4'],
            needBy: '2022-01-02',
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
            solutions: ['Solution 7', 'Solution 8'],
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
            solutions: ['Solution 3', 'Solution 4'],
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
};

const sortNested = (
  data: CategoryType[],
  direction: 'ASC' | 'DESC',
  accessor: keyof MilestoneType
) => {
  data.forEach(category => {
    category.subCategories.forEach(subCategory => {
      subCategory.milestones.sort((a, b) =>
        a[accessor].localeCompare(b[accessor])
      );
      if (direction === 'ASC') {
        subCategory.milestones.reverse();
      }
    });
  });
  return data;
};

export const columns: ColumnType[] = [
  {
    Header: <Icon.Warning size={3} className="left-05 text-base-lighter" />,
    accessor: 'risk',
    width: '60px',
    sort: (
      data: CategoryType[],
      direction: 'ASC' | 'DESC',
      accessor: keyof MilestoneType
    ) => {
      data.forEach(category => {
        category.subCategories.forEach(subCategory => {
          subCategory.milestones.sort(
            (a, b) => (riskMap[a.risk] || 0) - (riskMap[b.risk] || 0)
          );
          if (direction === 'ASC') {
            subCategory.milestones.reverse();
          }
        });
      });
      return data;
    }
  },
  {
    Header: 'Model milestone',
    accessor: 'name',
    width: '200px',
    sort: sortNested
  },
  {
    Header: 'Facilitated By',
    accessor: 'facilitatedBy',
    width: '200px',
    sort: sortNested
  },
  {
    Header: 'Solutions',
    accessor: 'solutions',
    width: '200px',
    sort: (
      data: CategoryType[],
      direction: 'ASC' | 'DESC',
      accessor: keyof MilestoneType
    ) => {
      data.forEach(category => {
        category.subCategories.forEach(subCategory => {
          subCategory.milestones.sort((a, b) =>
            a.solutions.join().localeCompare(b.solutions.join())
          );
          if (direction === 'ASC') {
            subCategory.milestones.reverse();
          }
        });
      });
      return data;
    }
  },
  {
    Header: 'Need By',
    accessor: 'needBy',
    width: '130px',
    sort: sortNested
  },
  {
    Header: 'Status',
    accessor: 'status',
    width: '130px',
    sort: sortNested
  },
  {
    Header: 'Actions',
    accessor: 'actions',
    width: '130px',
    canSort: false
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
