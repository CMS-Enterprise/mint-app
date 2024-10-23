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

// Define the data type
interface Data {
  name: string;
  age: number;
  country: string;
}

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
  subCategories: Category[];
};

// Sample Usage
const columns: Column<Data>[] = [
  {
    Header: 'Name',
    accessor: 'name'
  },
  {
    Header: 'Age',
    accessor: 'age'
  },
  {
    Header: 'Country',
    accessor: 'country'
  }
];

const rawData: Data[] = [
  { name: 'John Doe', age: 28, country: 'USA' },
  { name: 'Jane Smith', age: 34, country: 'Canada' },
  { name: 'Kevin Brown', age: 23, country: 'UK' }
];

const Sandbox = () => {
  useEffect(() => {
    document.title = 'Sandbox';
  }, []);

  const [data, setData] = useState(rawData);

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
      <GridContainer>
        <DragDropContext onDragEnd={onDragEnd}>
          <table
            {...getTableProps()}
            style={{ width: '100%', borderCollapse: 'collapse' }}
          >
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th
                      {...column.getHeaderProps()}
                      style={{
                        borderBottom: '1px solid black',
                        padding: '10px'
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
                    const isExpanded = expandedRows.includes(row.id);
                    const isSubExpanded = subExpandedRows.includes(
                      `${row.id}-sub`
                    );

                    return (
                      <Draggable
                        key={row.id}
                        draggableId={row.id}
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
                                backgroundColor: isExpanded
                                  ? '#f0f0f0'
                                  : 'white'
                              }}
                              onClick={() => toggleRow(row.id)}
                            >
                              {row.cells.map(cell => (
                                <td
                                  {...cell.getCellProps()}
                                  style={{
                                    padding: '10px',
                                    borderBottom: '1px solid black'
                                  }}
                                >
                                  {cell.render('Cell')}
                                </td>
                              ))}
                            </tr>

                            {/* First Level Expandable Row Content */}
                            {isExpanded && (
                              <tr>
                                <td
                                  colSpan={columns.length}
                                  style={{
                                    padding: '10px',
                                    backgroundColor: '#f9f9f9'
                                  }}
                                >
                                  <div style={{ paddingBottom: '10px' }}>
                                    Expanded content for row {row.id} goes here!
                                  </div>

                                  {/* Second Level Expand Button */}
                                  <button
                                    type="button"
                                    onClick={e => {
                                      e.stopPropagation();
                                      toggleSubRow(`${row.id}-sub`);
                                    }}
                                  >
                                    {isSubExpanded
                                      ? 'Hide Sub-Details'
                                      : 'Show Sub-Details'}
                                  </button>

                                  {/* Second Level Expanded Content */}
                                  {isSubExpanded && (
                                    <div
                                      style={{
                                        padding: '10px',
                                        marginTop: '10px',
                                        backgroundColor: '#e0e0e0'
                                      }}
                                    >
                                      Nested expanded content for row {row.id}.
                                    </div>
                                  )}
                                </td>
                              </tr>
                            )}
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
      </GridContainer>
    </MainContent>
  );
};

export default Sandbox;
