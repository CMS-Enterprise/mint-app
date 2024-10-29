import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
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
  MTORowType,
  RowType,
  SubCategoryType
} from '..';

import DraggableRow from './DraggableRow';

const NestedTable = ({ rawData }: { rawData: CategoryType[] }) => {
  const [data, setData] = useState(structuredClone(rawData));

  const [sortedData, setSortedData] = useState<CategoryType[]>([...data]);
  const [rearrangedData, setRearrangedData] = useState<CategoryType[]>([
    ...data
  ]);

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

      // console.log('sliceItems', sliceItems);

      const sliceData: CategoryType[] = [];

      let milestoneIndex = 0;
      const sliceItemsCopy = [...sliceItems];

      sliceItemsCopy.forEach(category => {
        category.subCategories.forEach(subCategory => {
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
    return structuredClone(rawData).reduce(
      (acc, category) =>
        acc +
        category.subCategories.reduce(
          (subAcc, subCategory) => subAcc + subCategory.milestones.length,
          0
        ),
      0
    );
  }, [rawData]);

  const { currentItems, startIndex, endIndex, Pagination } = usePagination<
    CategoryType[]
  >({
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
    type: MTORowType,
    categoryID?: string,
    subcategoryID?: string,
    milestoneID?: string
  ) => {
    // Clone the existing data
    const updatedData = [...sortedData];

    if (type === 'category') {
      // Handle Category reordering
      const [draggedCategory] = sortedData.splice(dragIndex, 1);
      sortedData.splice(hoverIndex, 0, draggedCategory);
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
        const milestones = [...parentSubCategory.milestones];
        const draggedMilestone = milestones.splice(dragIndex, 1)[0];
        milestones.splice(hoverIndex, 0, draggedMilestone);

        // Update the sub-category with reordered milestones
        parentSubCategory.milestones = milestones;
      }
    }

    // Set the new data state
    setRearrangedData([...updatedData]);
    setData(updatedData);
  };

  const renderCells = (row: RowType, rowType: MTORowType) => (
    <>
      {getKeys(row)
        .filter(key => columns.find(column => column.accessor === key))
        .map((key, index) => {
          const columnCell = columns.find(column => column.accessor === key);

          const RenderCell = columnCell?.Cell ? columnCell.Cell : '';

          return (
            <td
              className={classNames('padding-1 line-height-normal', {
                'padding-left-05': index === 0,
                'padding-left-0': index !== 0
              })}
              key={key}
            >
              {RenderCell ? (
                <RenderCell row={row} rowType={rowType} />
              ) : (
                row[key]
              )}
            </td>
          );
        })}
    </>
  );

  const milestoneCount = useRef<number>(0);

  useEffect(() => {
    milestoneCount.current = startIndex;
  }, [startIndex]);

  const renderMilestones = (
    milestones: MilestoneType[],
    categoryID: string,
    subcategoryID: string
  ) =>
    milestones.map((milestone, index) => {
      // if (
      //   milestoneCount.current < startIndex ||
      //   milestoneCount.current >= endIndex
      // ) {
      //   return null;
      // }

      return (
        <DraggableRow
          key={milestone.id}
          index={index}
          type={`${categoryID}-${subcategoryID}-milestone`}
          moveRow={(dragIndex: number, hoverIndex: number) =>
            moveRow(
              dragIndex,
              hoverIndex,
              'milestone',
              categoryID,
              subcategoryID,
              milestone.id
            )
          }
          id={milestone.id}
        >
          {renderCells(milestone, 'milestone')}
        </DraggableRow>
      );
    });

  const renderSubCategories = (
    subCategories: SubCategoryType[],
    categoryID: string
  ) =>
    subCategories.map((subCategory, index) => {
      const isExpanded = subExpandedRows.includes(subCategory.id);

      const subCategoryMilestoneCount = subCategory.milestones.length;

      if (
        milestoneCount.current + subCategoryMilestoneCount < startIndex ||
        milestoneCount.current > endIndex
      ) {
        return null;
      }

      const remainder =
        milestoneCount.current + subCategoryMilestoneCount - endIndex;

      console.log(remainder);

      let slicedSubCategoryMilestones = [...subCategory.milestones];

      if (remainder > 0) {
        slicedSubCategoryMilestones = slicedSubCategoryMilestones.slice(
          0,
          subCategoryMilestoneCount - remainder
        );
      }

      return (
        <div style={{ display: 'contents' }} key={subCategory.id}>
          <DraggableRow
            index={index}
            type={`${categoryID}-subcategory`}
            moveRow={(dragIndex: number, hoverIndex: number) =>
              moveRow(
                dragIndex,
                hoverIndex,
                'subcategory',
                categoryID,
                subCategory.id
              )
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
            {renderCells(subCategory, 'subcategory')}
          </DraggableRow>
          {isExpanded &&
            renderMilestones(
              slicedSubCategoryMilestones,
              categoryID,
              subCategory.id
            )}
        </div>
      );
    });

  const renderCategories = () =>
    sortedData.map((category, index) => {
      if (index === 0) {
        milestoneCount.current = startIndex;
      }

      const categoryMilestoneCount = category.subCategories.reduce(
        (acc, subCategory) =>
          acc + (subCategory.milestones ? subCategory.milestones.length : 0),
        0
      );

      // if (categoryMilestoneCount + milestoneCount.current <= endIndex) {
      //   milestoneCount.current += categoryMilestoneCount;
      // } else {
      //   milestoneCount.current = endIndex;
      // }

      if (
        milestoneCount.current + categoryMilestoneCount < startIndex ||
        milestoneCount.current > endIndex
      ) {
        return null;
      }

      const isExpanded = expandedRows.includes(category.id);

      return (
        <div style={{ display: 'contents' }} key={category.id}>
          <DraggableRow
            index={index}
            type="category"
            moveRow={(dragIndex: number, hoverIndex: number) =>
              moveRow(dragIndex, hoverIndex, 'category', category.id)
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
            {renderCells(category, 'category')}
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
      setSortedData(structuredClone(rearrangedData));
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
          overflow: 'auto',
          borderBottom: '1px solid black',
          marginBottom: '.75rem'
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
                        const isSortedDesc = sortCount % 3 === 1;

                        setCurrentColumn(index);
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
      </div>

      <div className="display-flex">
        {Pagination}

        <TablePageSize
          className="margin-left-auto desktop:grid-col-auto"
          pageSize={itemsPerPage}
          setPageSize={setItemsPerPage}
          valueArray={[5, 10, 15, 20]}
        />
      </div>
    </DndProvider>
  );
};

export default NestedTable;
