import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';
import { NotFoundPartial } from 'features/NotFound';
import { useGetModelToOperationsMatrixQuery } from 'gql/generated/graphql';

import DraggableRow from 'components/DraggableRow';
import PageLoading from 'components/PageLoading';
import TablePageSize from 'components/TablePageSize';
import usePagination from 'hooks/usePagination';
import { getHeaderSortIcon } from 'utils/tableSort';

import MTOOptionsPanel from '../OptionPanel';

import {
  CategoryType,
  columns,
  ColumnSortType,
  MilestoneType,
  MTORowType,
  RowType,
  SubCategoryType
} from './columns';

/**
 * Function to format Category and SubCategory data to mirror the structure of Milstone data
 * This is done to make the data homogenized and easier to work with in the table for drag, drop, sort and pagination
 * Each row can now be superficially treated as a Milestone row
 */
const formatAndHomogenizeMilestoneData = (data: CategoryType[]) => {
  const formatData: CategoryType[] = [];
  data.forEach(category => {
    const formattedCategory = {} as CategoryType;
    formattedCategory.actions = undefined;
    formattedCategory.riskIndicator = undefined;
    formattedCategory.facilitatedBy = undefined;
    formattedCategory.needBy = undefined;
    formattedCategory.status = undefined;
    formattedCategory.solutions = [];
    formattedCategory.subCategories = [];

    category.subCategories.forEach(subCategory => {
      const formattedSubCategory = {} as SubCategoryType;
      formattedSubCategory.actions = undefined;
      formattedSubCategory.riskIndicator = undefined;
      formattedSubCategory.facilitatedBy = undefined;
      formattedSubCategory.needBy = undefined;
      formattedSubCategory.status = undefined;
      formattedSubCategory.solutions = [];
      formattedSubCategory.milestones = [];

      subCategory.milestones.forEach(milestone => {
        const formattedMilestone = {} as MilestoneType;
        formattedMilestone.actions = undefined;
        formattedMilestone.solutions = [];
        formattedSubCategory.milestones.push({
          ...formattedMilestone,
          ...milestone
        });
      });

      const { milestones, ...subCategoryData } = subCategory;
      formattedCategory.subCategories.push({
        ...formattedSubCategory,
        ...subCategoryData
      });
    });

    const { subCategories, ...categoryData } = category;
    formatData.push({ ...formattedCategory, ...categoryData });
  });
  return formatData;
};

const moveRow = (
  dragIndex: number,
  hoverIndex: number,
  type: MTORowType,
  sortedData: CategoryType[],
  setRearrangedData: React.Dispatch<React.SetStateAction<CategoryType[]>>,
  subcategoryID?: string,
  milestoneID?: string
) => {
  // Clone the existing data
  const updatedData = [...sortedData];

  if (type === 'category') {
    // Handle Category reordering
    const [draggedCategory] = updatedData.splice(dragIndex, 1);
    updatedData.splice(hoverIndex, 0, draggedCategory);
  } else if (type.includes('subcategory')) {
    // Find the category that contains the dragged subcategory
    const parentCategory = updatedData.find(cat =>
      cat.subCategories.some((sub: SubCategoryType) => sub.id === subcategoryID)
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
    // Find the parent category
    const parentCategory = updatedData.find(cat =>
      cat.subCategories.some(sub =>
        sub.milestones.some(milestone => milestone.id === milestoneID)
      )
    );

    // Find the parent sub-category
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
  setRearrangedData(updatedData);
};

const MTOTable = () => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { modelID } = useParams<{ modelID: string }>();

  const {
    data: queryData,
    loading,
    error
  } = useGetModelToOperationsMatrixQuery({
    variables: {
      id: modelID
    }
  });

  const formattedData = useMemo(
    () =>
      formatAndHomogenizeMilestoneData(
        (queryData?.modelPlan.mtoMatrix?.categories ||
          []) as unknown as CategoryType[]
      ),
    [queryData?.modelPlan.mtoMatrix]
  );

  // Holds the rearranged/dragged state of data pre-sorted
  const [rearrangedData, setRearrangedData] = useState(
    structuredClone(formattedData || [])
  );

  // Update the rearrangedData state when the formattedData changes
  useEffect(() => {
    setRearrangedData(structuredClone(formattedData));
  }, [formattedData]);

  // Holds the sorted data state
  const [sortedData, setSortedData] = useState<CategoryType[]>([
    ...rearrangedData
  ]);

  // Update the sorted data state when the rearrangedData changes
  useEffect(() => {
    setSortedData([...rearrangedData]);
  }, [rearrangedData]);

  // Toggle row expansion states
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [subExpandedRows, setSubExpandedRows] = useState<string[]>([]);

  // Sort states
  const [sortCount, setSortCount] = useState<number>(3);
  const [columnSort, setColumnSort] = useState<ColumnSortType[]>(
    Array.from(columns, () => ({
      isSorted: false,
      isSortedDesc: false,
      sortColumn: ''
    }))
  );
  // Holds the current column that should be sorted
  const [currentColumn, setCurrentColumn] = useState<number>(0);

  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // State to hold the index of rows that should be rendered in conjunction with pagination
  const renderedRowIndexes = useRef<{
    category: number[];
    subCategory: number[][];
    milestone: number[][][];
  }>({
    category: [],
    subCategory: [],
    milestone: []
  });

  // Function to map data indexes to be conditionally rendered based on the current page and items per page
  const sliceFn = useMemo(() => {
    return (sliceItems: CategoryType[], pageNum: number, itemsPerP: number) => {
      const startingIndex = pageNum * itemsPerP;
      const endingIndex = startingIndex + itemsPerP;

      const sliceData: CategoryType[] = [];

      let milestoneIndex = 0;
      const sliceItemsCopy = [...sliceItems];

      // Initialize the shownIndexes object to later be set to the renderedRowIndexes ref
      const shownIndexes: {
        category: number[];
        subCategory: number[][];
        milestone: number[][][];
      } = {
        category: [],
        subCategory: [],
        milestone: []
      };

      // Initialize the shownIndexes object with structure of fetched data
      sliceItemsCopy.forEach((category, catIndex) => {
        shownIndexes.subCategory[catIndex] = [];
        shownIndexes.milestone[catIndex] = [];
        category.subCategories.forEach((subCategory, subIndex) => {
          shownIndexes.milestone[catIndex][subIndex] = [];
        });
      });

      sliceItemsCopy.forEach((category, catIndex) => {
        category.subCategories.forEach((subCategory, subIndex) => {
          subCategory.milestones.forEach((milestone, milIndex) => {
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
                  shownIndexes.milestone[catIndex][subIndex].push(milIndex);
                } else {
                  shownIndexes.subCategory[catIndex].push(subIndex);
                  shownIndexes.milestone[catIndex][subIndex].push(milIndex);
                }
              } else {
                shownIndexes.category.push(catIndex);
                shownIndexes.subCategory[catIndex].push(subIndex);
                shownIndexes.milestone[catIndex][subIndex].push(milIndex);
              }
            }
            milestoneIndex += 1;
          });
        });
      });

      renderedRowIndexes.current = shownIndexes;

      return sliceData;
    };
  }, []);

  // Calculate the total number of milestones in the data
  const itemLength = useMemo(() => {
    return structuredClone(formattedData).reduce(
      (acc, category) =>
        acc +
        category.subCategories.reduce(
          (subAcc, subCategory) => subAcc + subCategory.milestones.length,
          0
        ),
      0
    );
  }, [formattedData]);

  const { Pagination } = usePagination<CategoryType[]>({
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

  const renderCells = (
    row: RowType,
    rowType: MTORowType,
    expanded: boolean
  ) => (
    <>
      {columns.map((column, index) => {
        const RenderCell = column?.Cell ?? '';

        return (
          <td
            className={classNames('padding-1 line-height-normal', {
              'padding-left-05': index === 0,
              'padding-left-0': index !== 0
            })}
            key={column.accessor}
          >
            {RenderCell ? (
              <RenderCell row={row} rowType={rowType} expanded={expanded} />
            ) : (
              row[column.accessor as keyof MilestoneType]
            )}
          </td>
        );
      })}
    </>
  );

  const renderMilestones = (
    milestones: MilestoneType[],
    categoryIndex: number,
    subcategoryIndex: number
  ) =>
    milestones.map((milestone, index) => {
      if (
        !renderedRowIndexes.current.milestone[categoryIndex][
          subcategoryIndex
        ].includes(index)
      ) {
        return null;
      }

      return (
        <tr id={milestone.id} key={milestone.id}>
          {renderCells(milestone, 'milestone', false)}
        </tr>
      );
    });

  const renderSubCategories = (
    subCategories: SubCategoryType[],
    categoryID: string,
    categoryIndex: number
  ) =>
    subCategories.map((subCategory, index) => {
      const isExpanded = subExpandedRows.includes(subCategory.id);

      // Don't render if the subcategory is not in the rendered indexes
      if (
        !renderedRowIndexes.current.subCategory[categoryIndex].includes(index)
      ) {
        return null;
      }

      return (
        <div style={{ display: 'contents' }} key={subCategory.id}>
          <DraggableRow
            index={index}
            type={`${categoryID}-subcategory-${subCategory.isUncategorized}`}
            moveRow={(dragIndex: number, hoverIndex: number) =>
              moveRow(
                dragIndex,
                hoverIndex,
                'subcategory',
                sortedData,
                setRearrangedData,
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
            isDraggable={!subCategory.isUncategorized}
          >
            {renderCells(subCategory, 'subcategory', isExpanded)}
          </DraggableRow>
          {isExpanded &&
            renderMilestones(subCategory.milestones, categoryIndex, index)}
        </div>
      );
    });

  const renderCategories = () =>
    sortedData.map((category, index) => {
      // Don't render if the category is not in the rendered indexes
      if (!renderedRowIndexes.current.category.includes(index)) {
        return null;
      }

      const isExpanded = expandedRows.includes(category.id);

      return (
        <div style={{ display: 'contents' }} key={category.id}>
          <DraggableRow
            index={index}
            type="category"
            moveRow={(dragIndex: number, hoverIndex: number) =>
              moveRow(
                dragIndex,
                hoverIndex,
                'category',
                sortedData,
                setRearrangedData
              )
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
            isDraggable={!category.isUncategorized}
          >
            {renderCells(category, 'category', isExpanded)}
          </DraggableRow>

          {isExpanded &&
            category.subCategories &&
            category.id &&
            renderSubCategories(category.subCategories, category.id, index)}
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
      setSortedData(structuredClone(formattedData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentColumn, columnSort, formattedData]);

  if (loading) {
    return <PageLoading />;
  }

  if (error) {
    return <NotFoundPartial />;
  }

  if (queryData?.modelPlan.mtoMatrix.categories.length === 0) {
    return <MTOOptionsPanel />;
  }

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
                    paddingBottom: '.25rem',
                    textAlign: 'left',
                    width: column.width,
                    minWidth: column.width,
                    maxWidth: column.width
                  }}
                >
                  {column.canSort !== false ? (
                    <button
                      className={classNames(
                        'usa-button usa-button--unstyled position-relative'
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
                    <span
                      className={classNames(
                        'usa-button usa-button--unstyled position-relative',
                        {
                          'text-no-underline text-black':
                            column.Header ===
                            t('modelToOperationsMisc:table.actions')
                        }
                      )}
                    >
                      {column.Header}
                    </span>
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

export default MTOTable;
