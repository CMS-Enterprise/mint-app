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

type Milestone = {
  id: string;
  name: string;
  facilitatedBy: string;
  solutions: string[];
  needBy: string;
  status: string;
  actions: any;
};

type SubCategory = {
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
  subCategories: SubCategory[];
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
  }
];

const Sandbox = () => {
  useEffect(() => {
    document.title = 'Sandbox';
  }, []);

  const [data, setData] = useState<Partial<Category>[]>(rawData);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [subExpandedRows, setSubExpandedRows] = useState<string[]>([]);

  // Function to toggle row expansion
  const toggleRow = (index: string) => {
    setExpandedRows(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  // Function to toggle sub-row expansion
  const toggleSubRow = (index: string) => {
    setSubExpandedRows(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  // Drag-and-Drop functions
  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedData = Array.from(data);
    const [removed] = reorderedData.splice(result.source.index, 1);
    reorderedData.splice(result.destination.index, 0, removed);

    setData(reorderedData);
  };

  return (
    <MainContent>
      <GridContainer className="margin-y-6">
        <div style={{ width: '101%', overflow: 'auto' }}>
          <DragDropContext onDragEnd={onDragEnd}>
            <table {...getTableProps()} style={{ borderCollapse: 'collapse' }}>
              <thead>
                {headerGroups.map(headerGroup => (
                  <tr
                    {...headerGroup.getHeaderGroupProps()}
                    key={{ ...headerGroup.getHeaderGroupProps() }.key}
                  >
                    {headerGroup.headers.map(column => (
                      <th
                        {...column.getHeaderProps()}
                        key={{ ...column.getHeaderProps() }.key}
                        style={{
                          borderBottom: '1px solid black',
                          padding: '1rem',
                          textAlign: 'left',
                          width: '190px',
                          minWidth: '190px',
                          maxWidth: '190px'
                        }}
                      >
                        {column.render('Header')}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <Droppable droppableId="table">
                {provided => (
                  <tbody
                    {...getTableBodyProps()}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {rows.map((row, index) => {
                      prepareRow(row);
                      const isExpanded = expandedRows.includes(
                        row.original.id!
                      );

                      const { subCategories } = row.original;

                      return (
                        <Draggable
                          key={row.original.id}
                          draggableId={row.original.id!}
                          index={index}
                        >
                          {(provided2: DraggableProvided) => (
                            <>
                              <tr
                                {...row.getRowProps()}
                                ref={provided2.innerRef}
                                {...provided2.draggableProps}
                                {...provided2.dragHandleProps}
                                style={{
                                  ...provided2.draggableProps.style,
                                  cursor: 'pointer',
                                  backgroundColor: '#E1F3F8',
                                  borderBottom: '1px solid black'
                                }}
                                onClick={() => toggleRow(row.original.id!)}
                              >
                                {row.cells.map(cell => (
                                  <td
                                    {...cell.getCellProps()}
                                    key={{ ...cell.getCellProps() }.key}
                                    style={{
                                      padding: '1rem',
                                      borderBottom: '1px solid black',
                                      fontWeight: 'bold',
                                      fontSize: '1.2em'
                                    }}
                                  >
                                    {cell.render('Cell')}
                                  </td>
                                ))}
                              </tr>

                              {/* First Level Expandable Row Content */}
                              {isExpanded &&
                                subCategories?.map((subCategory, subIndex) => {
                                  const { milestones } = subCategory;

                                  const isSubExpanded =
                                    subExpandedRows.includes(
                                      `${row.original.id!}-${subCategory.id}`
                                    );

                                  return (
                                    <tr
                                      key={subCategory.id}
                                      style={{
                                        ...provided2.draggableProps.style,
                                        cursor: 'pointer',
                                        backgroundColor: '#F0F0F0'
                                      }}
                                      onClick={() =>
                                        toggleSubRow(
                                          `${row.original.id!}-${subCategory.id}`
                                        )
                                      }
                                    >
                                      <td
                                        colSpan={columns.length}
                                        style={{
                                          backgroundColor: '#f9f9f9'
                                        }}
                                      >
                                        <div
                                          style={{
                                            padding: '1rem',
                                            fontWeight: 'bold',
                                            borderBottom: '1px solid black'
                                          }}
                                        >
                                          {subCategory.name}
                                        </div>

                                        {/* Second Level Expanded Content */}
                                        {isSubExpanded &&
                                          milestones?.map(
                                            (milestone, milestoneIndex) => {
                                              return (
                                                <tr
                                                  key={milestone.id}
                                                  style={{
                                                    backgroundColor: 'white',
                                                    borderBottom:
                                                      '1px solid black'
                                                  }}
                                                >
                                                  <td
                                                    role="cell"
                                                    style={{
                                                      width: '190px',
                                                      padding: '1rem'
                                                    }}
                                                  >
                                                    {milestone.name}
                                                  </td>
                                                  <td
                                                    role="cell"
                                                    style={{
                                                      width: '190px',
                                                      padding: '1rem'
                                                    }}
                                                  >
                                                    {milestone.facilitatedBy}
                                                  </td>
                                                  <td
                                                    role="cell"
                                                    style={{
                                                      width: '190px',
                                                      padding: '1rem'
                                                    }}
                                                  >
                                                    {milestone.solutions.join(
                                                      ', '
                                                    )}
                                                  </td>
                                                  <td
                                                    role="cell"
                                                    style={{
                                                      width: '190px',
                                                      padding: '1rem'
                                                    }}
                                                  >
                                                    {milestone.needBy}
                                                  </td>
                                                  <td
                                                    role="cell"
                                                    style={{
                                                      width: '190px',
                                                      padding: '1rem'
                                                    }}
                                                  >
                                                    {milestone.status}
                                                  </td>
                                                  <td
                                                    role="cell"
                                                    style={{
                                                      width: '190px',
                                                      padding: '1rem'
                                                    }}
                                                  >
                                                    {milestone.actions}
                                                  </td>
                                                </tr>
                                              );
                                            }
                                          )}
                                      </td>
                                    </tr>
                                  );
                                })}
                            </>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </tbody>
                )}
              </Droppable>
            </table>
          </DragDropContext>
        </div>
      </GridContainer>
    </MainContent>
  );
};

export default Sandbox;
