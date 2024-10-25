import React, { useEffect, useMemo, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { raw } from '@storybook/react';
import classNames from 'classnames';

import TablePageSize from 'components/TablePageSize';
import usePagination from 'hooks/usePagination';
import { getKeys } from 'types/translation';
import { getHeaderSortIcon } from 'utils/tableSort';

import {
  CategoryType,
  columns,
  ColumnSortType,
  MilestoneType,
  SubCategoryType
} from '..';

import DraggableRow from './DraggableRow';

const NestedTable = ({ rawData }: { rawData: CategoryType[] }) => {
  const [data, setData] = useState(structuredClone(rawData));

  const [sortedData, setSortedData] = useState<CategoryType[]>([...data]);

  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [subExpandedRows, setSubExpandedRows] = useState<string[]>([]);

  const [sortCount, setSortCount] = useState<number>(3);
  const [columnSort, setColumnSort] = useState<ColumnSortType[]>(
    Array.from(columns, () => ({
      isSorted: false,
      isSortedDesc: false,
      sortColumn: ''
    }))
  );
  const [currentColumn, setCurrentColumn] = useState<number>(0);

  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const sliceFn = useMemo(() => {
    return (sliceItems: CategoryType[], pageNum: number, itemsPerP: number) => {
      const startingIndex = pageNum * itemsPerP;
      const endingIndex = startingIndex + itemsPerP;

      const sliceData: CategoryType[] = [];

      let milestoneIndex = 0;
      const sliceItemsCopy = [...sliceItems];

      sliceItemsCopy.forEach((category, categoryIndex) => {
        category.subCategories.forEach((subCategory, subCategoryIndex) => {
          subCategory.milestones.forEach(milestone => {
            if (
              milestoneIndex >= startingIndex &&
              milestoneIndex < endingIndex
            ) {
              const foundCategory = sliceData.find(
                sliceCategory => sliceCategory.id === category.id
              );
              if (foundCategory) {
                const foundSubCategory = foundCategory.subCategories.find(
                  sliceSubCategory => sliceSubCategory.id === subCategory.id
                );
                if (foundSubCategory) {
                  foundSubCategory.milestones.push(milestone);
                } else {
                  foundCategory.subCategories.push({
                    ...subCategory,
                    milestones: [milestone]
                  });
                }
              } else {
                sliceData.push({
                  ...category,
                  subCategories: [
                    {
                      ...subCategory,
                      milestones: [milestone]
                    }
                  ]
                });
              }
            }
            milestoneIndex += 1;
          });
        });
      });

      return sliceData;
    };
  }, []);

  const itemLength = useMemo(() => {
    return data.reduce(
      (acc, category) =>
        acc +
        category.subCategories.reduce(
          (subAcc, subCategory) => subAcc + subCategory.milestones.length,
          0
        ),
      0
    );
  }, [data]);

  const { currentItems, Pagination } = usePagination<CategoryType[]>({
    items: sortedData,
    itemsPerPage,
    loading: false,
    sliceFn,
    itemLength
  });

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

  const moveRow = (
    dragIndex: number,
    hoverIndex: number,
    type: string,
    subcategoryID?: string,
    milestoneID?: string
  ) => {
    // Clone the existing data
    const updatedData = [...data];

    if (type === 'category') {
      // Handle Category reordering
      const [draggedCategory] = updatedData.splice(dragIndex, 1);
      updatedData.splice(hoverIndex, 0, draggedCategory);
    } else if (type.includes('subcategory')) {
      // Find the category that contains the dragged subcategory
      const parentCategory = updatedData.find(cat =>
        cat.subCategories.some(
          (sub: SubCategoryType) => sub.id === subcategoryID
        )
      );

      if (parentCategory?.subCategories) {
        // Find the subcategories array and reorder within it
        const subCategories = [...parentCategory.subCategories];
        const draggedSub = subCategories.splice(dragIndex, 1)[0];
        subCategories.splice(hoverIndex, 0, draggedSub);

        // Replace the modified subcategories array back to the parent category
        parentCategory.subCategories = subCategories;
      }
    } else if (type.includes('milestone')) {
      // Find the parent sub-category
      const parentCategory = updatedData.find(cat =>
        cat.subCategories.some(sub =>
          sub.milestones.some(milestone => milestone.id === milestoneID)
        )
      );

      const parentSubCategory = parentCategory?.subCategories.find(sub =>
        sub.milestones.some(milestone => milestone.id === milestoneID)
      );

      if (parentCategory && parentSubCategory) {
        // Reorder milestones within the found sub-category
        const milestones = [...parentSubCategory.milestones!];
        const draggedMilestone = milestones.splice(dragIndex, 1)[0];
        milestones.splice(hoverIndex, 0, draggedMilestone);

        // Update the sub-category with reordered milestones
        parentSubCategory.milestones = milestones;
      }
    }

    // Set the new data state
    setData(updatedData);
  };

  const renderCells = (row: CategoryType | SubCategoryType | MilestoneType) => (
    <>
      {getKeys(row)
        .filter(key => columns.find(column => column.accessor === key))
        .map((key, index) => {
          return (
            <td
              className={classNames('padding-2', {
                'padding-left-05': index === 0,
                'padding-left-0': index !== 0
              })}
              key={key}
            >
              {Array.isArray(row[key]) ? row[key].join(', ') : row[key]}
            </td>
          );
        })}
    </>
  );

  const renderMilestones = (
    milestones: MilestoneType[],
    categoryID: string,
    subcategoryID: string
  ) =>
    milestones.map((milestone, index) => (
      <DraggableRow
        key={milestone.id}
        index={index}
        type={`${categoryID}-${subcategoryID}-milestone`}
        moveRow={(dragIndex: number, hoverIndex: number) =>
          moveRow(
            dragIndex,
            hoverIndex,
            'milestone',
            subcategoryID,
            milestone.id
          )
        }
        id={milestone.id}
      >
        {renderCells(milestone)}
      </DraggableRow>
    ));

  const renderSubCategories = (
    subCategories: SubCategoryType[],
    categoryID: string
  ) =>
    subCategories.map((subCategory, index) => {
      const isExpanded = subExpandedRows.includes(subCategory.id);

      return (
        <div style={{ display: 'contents' }} key={subCategory.id}>
          <DraggableRow
            index={index}
            type={`${categoryID}-subcategory`}
            moveRow={(dragIndex: number, hoverIndex: number) =>
              moveRow(dragIndex, hoverIndex, 'subcategory', subCategory.id)
            }
            id={subCategory.id}
            toggleRow={toggleSubRow}
            style={{
              backgroundColor: '#F0F0F0',
              fontWeight: 'bold',
              borderBottom: '1px solid black',
              cursor: 'pointer'
            }}
          >
            {renderCells(subCategory)}
          </DraggableRow>
          {isExpanded &&
            renderMilestones(
              subCategory.milestones,
              categoryID,
              subCategory.id
            )}
        </div>
      );
    });

  const renderCategories = () =>
    currentItems.map((category, index) => {
      const isExpanded = expandedRows.includes(category.id);

      return (
        <div style={{ display: 'contents' }} key={category.id}>
          <DraggableRow
            index={index}
            type="category"
            moveRow={(dragIndex: number, hoverIndex: number) =>
              moveRow(dragIndex, hoverIndex, 'category')
            }
            id={category.id}
            toggleRow={toggleRow}
            style={{
              cursor: 'pointer',
              backgroundColor: '#E1F3F8',
              borderBottom: '1px solid black',
              fontWeight: 'bold',
              fontSize: '1.25em'
            }}
          >
            {renderCells(category)}
          </DraggableRow>

          {isExpanded &&
            category.subCategories &&
            category.id &&
            renderSubCategories(category.subCategories, category.id)}
        </div>
      );
    });

  useEffect(() => {
    if (columns[currentColumn].sort && columnSort[currentColumn].isSorted) {
      setSortedData(
        columns[currentColumn].sort(
          sortedData,
          columnSort[currentColumn].isSortedDesc ? 'DESC' : 'ASC',
          columnSort[currentColumn].sortColumn as keyof MilestoneType
        )
      );
    } else {
      setSortedData(structuredClone(rawData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentColumn, columnSort, rawData]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className="display-block"
        style={{
          width: '100%',
          minWidth: '100%',
          overflow: 'auto'
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}
        >
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={column.accessor}
                  style={{
                    borderBottom: '1px solid black',
                    padding: '1rem',
                    paddingLeft: index === 0 ? '.5rem' : '0px',
                    paddingBottom: '.75rem',
                    textAlign: 'left',
                    width: column.width,
                    minWidth: column.width,
                    maxWidth: column.width
                  }}
                >
                  {column.canSort !== false ? (
                    <button
                      className={classNames(
                        'usa-button usa-button--unstyled position-relative',
                        {
                          'text-no-underline text-bold text-black':
                            column.Header === 'Actions'
                        }
                      )}
                      onClick={() => {
                        const isSorted =
                          sortCount % 3 === 1 || sortCount % 3 === 0;

                        // console.log(isSorted);

                        const isSortedDesc = sortCount % 3 === 1;

                        // console.log(isSortedDesc);

                        setSortCount(sortCount + 1);
                        setColumnSort(prev => {
                          const newColumnSort = [...prev];
                          newColumnSort[index] = {
                            isSorted,
                            isSortedDesc,
                            sortColumn: column.accessor
                          };
                          return newColumnSort;
                        });

                        setCurrentColumn(index);

                        // if (column.sort && isSorted) {
                        //   setSortedData(
                        //     column.sort(
                        //       sortedData,
                        //       isSortedDesc ? 'DESC' : 'ASC',
                        //       column.accessor as keyof MilestoneType
                        //     )
                        //   );
                        // } else {
                        //   setSortedData([...rawData]);
                        // }
                      }}
                      type="button"
                    >
                      {column.Header}
                      {getHeaderSortIcon(columnSort[index], false)}
                    </button>
                  ) : (
                    column.Header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{renderCategories()}</tbody>
        </table>

        <div className="display-flex">
          {Pagination}

          <TablePageSize
            className="margin-left-auto desktop:grid-col-auto"
            pageSize={itemsPerPage}
            setPageSize={setItemsPerPage}
            valueArray={[5, 10, 15, 20]}
          />
        </div>
      </div>
    </DndProvider>
  );
};

export default NestedTable;
