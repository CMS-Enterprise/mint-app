import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { NotFoundPartial } from 'features/NotFound';
import {
  GetModelToOperationsMatrixDocument,
  GetModelToOperationsMatrixQuery,
  ReorderMtoCategoryMutationVariables,
  useGetModelToOperationsMatrixQuery,
  useReorderMtoCategoryMutation
} from 'gql/generated/graphql';
import i18next from 'i18next';

import Alert from 'components/Alert';
import DraggableRow from 'components/DraggableRow';
import PageLoading from 'components/PageLoading';
import TablePageSize from 'components/TablePageSize';
import useMessage from 'hooks/useMessage';
import usePagination from 'hooks/usePagination';
import { getHeaderSortIcon } from 'utils/tableSort';

import MTOOptionsPanel from '../OptionPanel';

import MTOTableActions from './Actions';
import {
  ActionMenu,
  CategoryType,
  columns,
  ColumnSortType,
  MilestoneType,
  MTORowType,
  RowType,
  SubCategoryType
} from './columns';

export type GetModelToOperationsMatrixQueryType =
  GetModelToOperationsMatrixQuery['modelPlan']['mtoMatrix'];

type GetModelToOperationsMatrixCategoryType =
  GetModelToOperationsMatrixQueryType['categories'];

const MTOTable = () => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { modelID } = useParams<{ modelID: string }>();

  const { showMessage: setError } = useMessage();

  const [updateOrder] = useReorderMtoCategoryMutation({
    refetchQueries: [
      {
        query: GetModelToOperationsMatrixDocument,
        variables: { id: modelID }
      }
    ]
  });

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
          []) as unknown as GetModelToOperationsMatrixCategoryType
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

  // Load expanded rows from local storage
  let defaultExpandedRows: string[] = [];
  try {
    if (window.localStorage[`mto-matrix-expanded-rows-${modelID}`]) {
      defaultExpandedRows = JSON.parse(
        window.localStorage[`mto-matrix-expanded-rows-${modelID}`]
      );
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error parsing local storage');
  }

  // Toggle row expansion states
  const [expandedRows, setExpandedRows] =
    useState<string[]>(defaultExpandedRows);

  // Function to toggle row expansion
  const toggleRow = (index: string) => {
    setExpandedRows(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  useEffect(() => {
    localStorage.setItem(
      `mto-matrix-expanded-rows-${modelID}`,
      JSON.stringify(expandedRows)
    );
  }, [expandedRows, modelID]);

  // Load row length from local storage
  let defaultRowLength: number = 10;
  try {
    if (window.localStorage[`mto-matrix-row-length-${modelID}`]) {
      defaultRowLength = JSON.parse(
        window.localStorage[`mto-matrix-row-length-${modelID}`]
      );
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error parsing local storage');
  }

  // Sets items per page
  const [itemsPerPage, setItemsPerPage] = useState<number>(defaultRowLength);

  // Update local storage when row length changes
  useEffect(() => {
    localStorage.setItem(
      `mto-matrix-row-length-${modelID}`,
      JSON.stringify(itemsPerPage)
    );
  }, [itemsPerPage, modelID]);

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
  const getVisibleIndexes = useMemo(() => {
    return (sliceItems: CategoryType[], pageNum: number, itemsPerP: number) => {
      renderedRowIndexes.current = getRenderedRowIndexes(
        sliceItems,
        pageNum,
        itemsPerP
      );

      return sliceItems;
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
    sliceFn: getVisibleIndexes,
    itemLength
  });

  const renderCells = (
    row: RowType,
    rowType: MTORowType,
    expanded: boolean,
    currentIndex: number,
    rowLength: number,
    categoryIndex?: number
  ) => (
    <>
      {columns.map((column, index) => {
        const RenderCell = column?.Cell ?? '';

        const setIndexes =
          rowType === 'subcategory' && categoryIndex !== undefined
            ? [categoryIndex, currentIndex]
            : [currentIndex];

        const moveRowDirection = (num: number) => {
          if (rowType === 'category') {
            return [setIndexes[0] + num];
          }
          return [setIndexes[0], setIndexes[1] + num];
        };

        return (
          <td
            className={classNames('padding-1 line-height-normal', {
              'padding-left-05': index === 0,
              'padding-left-0': index !== 0
            })}
            key={column.accessor}
          >
            {/* If column is the Actions column, render <ActionMenu /> with custom buttons that updates data state for reordering */}
            {column.accessor === 'actions' ? (
              <ActionMenu
                rowType={rowType}
                MoveUp={
                  <Button
                    type="button"
                    disabled={
                      currentIndex === 0 ||
                      currentIndex === (rowLength || 0) - 1
                    }
                    onClick={e => {
                      e.stopPropagation();
                      setRearrangedData(
                        moveRow(
                          setIndexes,
                          moveRowDirection(-1),
                          rowType,
                          sortedData,
                          updateOrder,
                          setError
                        )
                      );
                    }}
                    onKeyPress={e => {
                      e.stopPropagation();
                    }}
                    className="share-export-modal__menu-item padding-y-1 padding-x-2 action-menu-item"
                    unstyled
                  >
                    {t(
                      `modelToOperationsMisc:table.menu.${rowType === 'category' ? 'moveCategoryUp' : 'moveSubCategoryUp'}`
                    )}
                  </Button>
                }
                MoveDown={
                  <Button
                    type="button"
                    disabled={
                      currentIndex === (rowLength || 0) - 1 ||
                      currentIndex === (rowLength || 0) - 2
                    }
                    onClick={e => {
                      e.stopPropagation();
                      setRearrangedData(
                        moveRow(
                          setIndexes,
                          moveRowDirection(1),
                          rowType,
                          sortedData,
                          updateOrder,
                          setError
                        )
                      );
                    }}
                    onKeyPress={e => {
                      e.stopPropagation();
                    }}
                    className="share-export-modal__menu-item padding-y-1 padding-x-2 action-menu-item"
                    unstyled
                  >
                    {t(
                      `modelToOperationsMisc:table.menu.${rowType === 'category' ? 'moveCategoryDown' : 'moveSubCategoryDown'}`
                    )}
                  </Button>
                }
              />
            ) : (
              <>
                {RenderCell ? (
                  <RenderCell row={row} rowType={rowType} expanded={expanded} />
                ) : (
                  row[column.accessor as keyof MilestoneType]
                )}
              </>
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
      // Don't render if the milestone is not in the rendered indexes
      if (
        !renderedRowIndexes.current.milestone[categoryIndex][
          subcategoryIndex
        ].includes(index)
      ) {
        return null;
      }

      return (
        <tr id={milestone.id} key={milestone.id}>
          {renderCells(milestone, 'milestone', false, 0, 0)}
        </tr>
      );
    });

  const renderSubCategories = (
    subCategories: SubCategoryType[],
    categoryID: string,
    categoryIndex: number
  ) =>
    subCategories.map((subCategory, index) => {
      const isExpanded = expandedRows.includes(
        `${categoryID}-${subCategory.id}`
      );

      // Don't render if the subcategory is not in the rendered indexes
      if (
        !renderedRowIndexes.current.subCategory[categoryIndex].includes(index)
      ) {
        return null;
      }

      return (
        <div style={{ display: 'contents' }} key={subCategory.id}>
          <DraggableRow
            index={[categoryIndex, index]}
            type="subcategory"
            moveRow={(dragIndex: number[], hoverIndex: number[]) =>
              setRearrangedData(
                moveRow(
                  dragIndex,
                  hoverIndex,
                  'subcategory',
                  sortedData,
                  updateOrder,
                  setError
                )
              )
            }
            id={`${categoryID}-${subCategory.id}`}
            toggleRow={toggleRow}
            style={{
              backgroundColor: '#F0F0F0',
              fontWeight: 'bold',
              borderBottom: '1px solid black',
              cursor: 'pointer'
            }}
            isDraggable={!subCategory.isUncategorized}
          >
            {renderCells(
              subCategory,
              'subcategory',
              isExpanded,
              index,
              subCategories.length,
              categoryIndex
            )}
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
            index={[index]}
            type="category"
            moveRow={(dragIndex: number[], hoverIndex: number[]) =>
              setRearrangedData(
                moveRow(
                  dragIndex,
                  hoverIndex,
                  'category',
                  sortedData,
                  updateOrder,
                  setError
                )
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
            {renderCells(
              category,
              'category',
              isExpanded,
              index,
              sortedData.length,
              index
            )}
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

  const isMatrixStarted: boolean = useMemo(() => {
    return isMatrixStartedFc(queryData?.modelPlan.mtoMatrix);
  }, [queryData?.modelPlan.mtoMatrix]);

  if (loading) {
    return <PageLoading />;
  }

  if (error) {
    return <NotFoundPartial />;
  }

  if (!isMatrixStarted) {
    return <MTOOptionsPanel />;
  }

  return (
    <>
      <MTOTableActions />
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
            suffix={t('modelToOperationsMisc:table.milestones')}
          />
        </div>
      </DndProvider>
    </>
  );
};

export default MTOTable;

export const isMatrixStartedFc = (
  data: GetModelToOperationsMatrixQueryType | undefined
): boolean => {
  if (!data) {
    return false;
  }

  const hasCategories = (data.categories || []).filter(
    category => !category.isUncategorized
  );

  const hasSubcategories = hasCategories.filter(
    subcategory => !subcategory.isUncategorized
  );

  if (
    hasCategories.length ||
    hasSubcategories.length ||
    data.milestones.length
  ) {
    return true;
  }
  return false;
};

/**
 * Function to format Category and SubCategory data to mirror the structure of Milstone data
 * This is done to make the data homogenized and easier to work with in the table for drag, drop, sort and pagination
 * Each row can now be superficially treated as a Milestone row
 */
export const formatAndHomogenizeMilestoneData = (
  data: GetModelToOperationsMatrixCategoryType
) => {
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

/**
 * moveRow function
 * This function handles the reordering of categories, subcategories, and milestones within the sorted data.
 * It updates the data structure based on the drag-and-drop/menu moveup/down interactions.
 */
export const moveRow = (
  dragIndex: number[],
  hoverIndex: number[],
  type: MTORowType,
  sortedData: CategoryType[],
  updateOrder: ({
    variables
  }: {
    variables: ReorderMtoCategoryMutationVariables;
  }) => Promise<any>,
  setError?: (element: JSX.Element) => void
) => {
  // Clone the existing data
  const updatedData = [...sortedData];

  if (type === 'category') {
    // Handle Category reordering
    const [draggedCategory] = updatedData.splice(dragIndex[0], 1);
    updatedData.splice(hoverIndex[0], 0, draggedCategory);

    updateOrder({
      variables: {
        id: draggedCategory.id,
        newOrder: hoverIndex[0]
      }
    });
  } else if (type.includes('subcategory')) {
    const parentIndex = dragIndex[0];
    const hoverParentIndex = hoverIndex[0];

    // Find the category that contains the dragged subcategory
    const parentCategory = updatedData[parentIndex];
    const hoverParentCategory = updatedData[hoverParentIndex];
    const hoverParentCategoryID = hoverParentCategory.id;

    const subIndex = dragIndex[1];
    const subCategoryId = parentCategory.subCategories[subIndex].id;
    let hoverSubIndex = hoverIndex[1];

    hoverSubIndex =
      hoverSubIndex === hoverParentCategory.subCategories.length - 1
        ? hoverSubIndex - 1
        : hoverSubIndex;

    // Find the subcategories array and reorder within it
    const subCategories = [...parentCategory.subCategories];
    const draggedSub = subCategories.splice(subIndex, 1)[0];

    // Replace the modified subcategories array back to the parent category
    parentCategory.subCategories = subCategories;

    const hoverSubCategories = [...hoverParentCategory.subCategories];
    hoverSubCategories.splice(hoverSubIndex, 0, draggedSub);

    hoverParentCategory.subCategories = hoverSubCategories;

    updateOrder({
      variables: {
        id: subCategoryId,
        newOrder: hoverSubIndex,
        parentID: hoverParentCategoryID
      }
    })?.catch(() => {
      if (setError) {
        setError(
          <Alert
            type="error"
            slim
            data-testid="error-alert"
            className="margin-y-4"
          >
            {i18next.t('modelToOperationsMisc:errorReorder')}
          </Alert>
        );
      }
    });
  } else if (type.includes('milestone')) {
    // TODO: if needed, implement milestone reordering
    // // Find the parent category
    // const parentCategory = updatedData.find(cat =>
    //   cat.subCategories.some(sub =>
    //     sub.milestones.some(milestone => milestone.id === milestoneID)
    //   )
    // );
    // // Find the parent sub-category
    // const parentSubCategory = parentCategory?.subCategories.find(sub =>
    //   sub.milestones.some(milestone => milestone.id === milestoneID)
    // );
    // if (parentCategory && parentSubCategory) {
    //   // Reorder milestones within the found sub-category
    //   const milestones = [...parentSubCategory.milestones];
    //   const draggedMilestone = milestones.splice(dragIndex, 1)[0];
    //   milestones.splice(hoverIndex, 0, draggedMilestone);
    //   // Update the sub-category with reordered milestones
    //   parentSubCategory.milestones = milestones;
    // }
  }

  return updatedData;
};

export const getRenderedRowIndexes = (
  sliceItems: CategoryType[],
  pageNum: number,
  itemsPerP: number
) => {
  const startingIndex = pageNum * itemsPerP;
  const endingIndex = startingIndex + itemsPerP;

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
      if (subCategory.milestones.length === 0) {
        shownIndexes.category.push(catIndex);
        shownIndexes.subCategory[catIndex].push(subIndex);
      }
      subCategory.milestones.forEach((milestone, milIndex) => {
        if (milestoneIndex >= startingIndex && milestoneIndex < endingIndex) {
          shownIndexes.category.push(catIndex);
          shownIndexes.subCategory[catIndex].push(subIndex);
          shownIndexes.milestone[catIndex][subIndex].push(milIndex);
        }
        milestoneIndex += 1;
      });
    });
  });

  return shownIndexes;
};
