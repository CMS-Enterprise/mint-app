import React, { useEffect } from 'react';
import { GridContainer } from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';

import NestedTable from './DnD/NestedTable';

export type MilestoneType = {
  id: string;
  name: string;
  facilitatedBy: string;
  solutions: string[];
  needBy: string;
  status: string;
  actions: any;
};

export type SubCategoryType = {
  id: string;
  name: string;
  milestones: MilestoneType[];
};

export type CategoryType = {
  id: string;
  name: string;
  facilitatedBy: null;
  solutions: null;
  needBy: null;
  status: null;
  actions: null;
  subCategories: SubCategoryType[];
};

const rawData: Partial<CategoryType>[] = [
  {
    id: '1',
    name: 'Category 1',
    subCategories: [
      {
        id: '1-1',
        name: 'Sub-Category 1',
        milestones: [
          {
            id: '1-1-1',
            name: 'Milestone 1',
            facilitatedBy: 'Facilitator 1',
            solutions: ['Solution 1', 'Solution 2'],
            needBy: '2022-01-01',
            status: 'In Progress',
            actions: 'Actions 1'
          },
          {
            id: '1-1-2',
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
        name: 'Sub-Category 2',
        milestones: [
          {
            id: '1-2-1',
            name: 'Milestone 3',
            facilitatedBy: 'Facilitator 3',
            solutions: ['Solution 5', 'Solution 6'],
            needBy: '2022-01-03',
            status: 'In Progress',
            actions: 'Actions 3'
          },
          {
            id: '1-2-2',
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
    name: 'Category 2',
    subCategories: [
      {
        id: '2-1',
        name: 'Sub-Category 1',
        milestones: [
          {
            id: '2-1-1',
            name: 'Milestone 1',
            facilitatedBy: 'Facilitator 1',
            solutions: ['Solution 1', 'Solution 2'],
            needBy: '2022-01-01',
            status: 'In Progress',
            actions: 'Actions 1'
          },
          {
            id: '2-1-2',
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
        id: '2-2',
        name: 'Sub-Category 2',
        milestones: [
          {
            id: '2-2-1',
            name: 'Milestone 3',
            facilitatedBy: 'Facilitator 3',
            solutions: ['Solution 5', 'Solution 6'],
            needBy: '2022-01-03',
            status: 'In Progress',
            actions: 'Actions 3'
          },
          {
            id: '2-2-2',
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
