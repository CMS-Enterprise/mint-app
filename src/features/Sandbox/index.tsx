import React, { useEffect, useState } from 'react';
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable
} from 'react-beautiful-dnd';
import { Column, useTable } from 'react-table';
import { GridContainer } from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';

import DndWrapper from './DnD/DnDWrapper';
import NestedTable from './DnD/NestedTable';

type Milestone = {
  id: string;
  name: string;
  facilitatedBy: string;
  solutions: string[];
  needBy: string;
  status: string;
  actions: any;
};

type SubCategoryType = {
  id: string;
  name: string;
  milestones: Milestone[];
};

type Category = {
  id: string;
  name: string;
  facilitatedBy: null;
  solutions: null;
  needBy: null;
  status: null;
  actions: null;
  subCategories: SubCategoryType[];
};

// Sample Usage
const columns: Column<Partial<Category>>[] = [
  {
    Header: 'Model milestone',
    accessor: 'name'
  },
  {
    Header: 'Facilitated by',
    accessor: 'facilitatedBy'
  },
  {
    Header: 'Solution',
    accessor: 'solutions'
  },
  {
    Header: 'Need by',
    accessor: 'needBy'
  },
  {
    Header: 'Status',
    accessor: 'status'
  },
  {
    Header: 'Actions',
    accessor: 'actions'
  }
];

const rawData: Partial<Category>[] = [
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
    <DndWrapper>
      <NestedTable rawData={rawData} />
    </DndWrapper>
  );
};

export default Sandbox;
