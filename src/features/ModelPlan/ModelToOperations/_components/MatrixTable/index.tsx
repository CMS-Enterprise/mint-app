import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import { Button } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { findSolutionByRouteParam } from 'features/HelpAndKnowledge/SolutionsHelp';
import SolutionDetailsModal from 'features/HelpAndKnowledge/SolutionsHelp/SolutionDetails/Modal';
import {
  GetModelToOperationsMatrixDocument,
  GetModelToOperationsMatrixQuery,
  MtoCommonSolutionKey,
  ReorderMtoCategoryMutationVariables,
  useReorderMtoCategoryMutation
} from 'gql/generated/graphql';
import i18next from 'i18next';

import Alert from 'components/Alert';
import DraggableRow from 'components/DraggableRow';
import PageLoading from 'components/PageLoading';
import TablePageSize from 'components/TablePageSize';
import toastSuccess from 'components/ToastSuccess';
import { MTOMilestonePanelProvider } from 'contexts/MTOMilestonePanelContext';
import { MTOModalContext } from 'contexts/MTOModalContext';
import { MTOSolutionPanelProvider } from 'contexts/MTOSolutionPanelContext';
import { PrintPDFContext } from 'contexts/PrintPDFContext';
import useHelpSolution from 'hooks/useHelpSolutions';
import useMessage from 'hooks/useMessage';
import useModalSolutionState from 'hooks/useModalSolutionState';
import usePagination from 'hooks/usePagination';
import { getHeaderSortIcon } from 'utils/tableSort';

import ActionMenu from '../ActionsMenu';

import {
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

const MTOTable = ({
  queryData,
  loading,
  error,
  readView = false
}: {
  queryData?: GetModelToOperationsMatrixQuery;
  loading: boolean;
  error?: ApolloError;
  readView?: boolean;
}) => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { modelID = '' } = useParams<{ modelID: string }>();

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const { clearMessage } = useMessage();

  const [updateOrder] = useReorderMtoCategoryMutation({
    refetchQueries: [
      {
        query: GetModelToOperationsMatrixDocument,
        variables: { id: modelID }
      }
    ]
  });

  const formattedData = useMemo(
    () =>
      formatAndHomogenizeMilestoneData(
        (queryData?.modelPlan.mtoMatrix?.categories ||
          []) as unknown as GetModelToOperationsMatrixCategoryType
      ),
    [queryData?.modelPlan.mtoMatrix]
  );

  const [initLocation] = useState<string>(location.pathname);

  const { helpSolutions } = useHelpSolution();
  const { prevPathname, selectedSolution: solution } = useModalSolutionState();

  const filteredColumns = useMemo(() => {
    if (readView) {
      // Remove the Actions from the columns array if in readview
      return columns.slice(0, -1);
    }
    return columns;
  }, [readView]);

  // Solution to render in modal
  const selectedSolution = findSolutionByRouteParam(
    solution?.key || null,
    helpSolutions,
    true
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

  // Toggle inital row expansion states for pdf export. Need to expand all on export and return to previous state once finished exports
  const [expandedInitRows, setExpandedInitRows] =
    useState<string[]>(defaultExpandedRows);

  // Function to toggle row expansion
  const toggleRow = (index: string, forceOpen?: boolean) => {
    setExpandedRows(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      }
      if (forceOpen) {
        return [...prev];
      }
      return [...prev, index];
    });

    setExpandedInitRows(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      }
      if (forceOpen) {
        return [...prev];
      }
      return [...prev, index];
    });
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

  // isPrintPDF is a boolean that is set to true when the user is printing the PDF
  const { isPrintPDF } = useContext(PrintPDFContext);

  const [itemsPerPageInit, setItemsPerPageInit] = useState(itemsPerPage);

  // Sets and resets the expanded rows and items per page when the user is printing the PDF
  // This is done to ensure that all rows are expanded and all items are shown in the PDF
  useEffect(() => {
    if (isPrintPDF) {
      setExpandedRows([]);
      setItemsPerPage(1000);
    } else {
      setExpandedRows(expandedInitRows);
      setItemsPerPage(itemsPerPageInit);
    }
  }, [isPrintPDF, setItemsPerPage, itemsPerPageInit, expandedInitRows]);

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

  const totalPages = useMemo(() => {
    return Math.ceil(itemLength / itemsPerPage);
  }, [itemLength, itemsPerPage]);

  // Function to map data indexes to be conditionally rendered based on the current page and items per page
  const getVisibleIndexes = useMemo(() => {
    return (sliceItems: CategoryType[], pageNum: number, itemsPerP: number) => {
      renderedRowIndexes.current = getRenderedRowIndexes(
        sliceItems,
        pageNum,
        itemsPerP,
        totalPages
      );

      return sliceItems;
    };
  }, [totalPages]);

  const { Pagination } = usePagination<CategoryType[]>({
    items: sortedData,
    itemsPerPage,
    loading: false,
    sliceFn: getVisibleIndexes,
    itemLength,
    withQueryParams: 'page'
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

  const RenderCells = ({
    row,
    rowType,
    expanded,
    currentIndex,
    rowLength,
    categoryID,
    subCategoryID,
    categoryIndex,
    numberOfMilestones
  }: {
    row: RowType;
    rowType: MTORowType;
    expanded: boolean;
    currentIndex: number;
    rowLength: number;
    categoryID?: string;
    subCategoryID?: string;
    categoryIndex?: number;
    numberOfMilestones?: number;
  }) => {
    const { setMTOModalOpen, setMTOModalState } = useContext(MTOModalContext);

    const renderActionMenu = () => {
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
        <ActionMenu
          name={row.name}
          primaryCategoryID={categoryID ?? ''}
          subCategoryID={subCategoryID ?? ''}
          milestoneID={row.id}
          rowType={rowType}
          toggleRow={toggleRow}
          MoveUp={
            <Button
              type="button"
              disabled={
                currentIndex === 0 || currentIndex === (rowLength || 0) - 1
              }
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                setRearrangedData(
                  moveRow(
                    setIndexes,
                    moveRowDirection(-1),
                    rowType,
                    sortedData,
                    updateOrder
                  )
                );
              }}
              onKeyPress={(e: React.KeyboardEvent<HTMLButtonElement>) => {
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
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                setRearrangedData(
                  moveRow(
                    setIndexes,
                    moveRowDirection(1),
                    rowType,
                    sortedData,
                    updateOrder
                  )
                );
              }}
              onKeyPress={(e: React.KeyboardEvent<HTMLButtonElement>) => {
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
      );
    };

    // Category: standard row rendering
    return (
      <>
        {filteredColumns.map((column, index) => {
          const RenderCell = column?.Cell ?? '';

          return (
            <td
              className={classNames('padding-1 line-height-normal', {
                'padding-left-05': index === 0,
                'padding-left-0': index !== 0
              })}
              key={column.accessor}
            >
              {(() => {
                if (column.accessor === 'actions') {
                  return renderActionMenu();
                }
                if (RenderCell) {
                  return (
                    <RenderCell
                      row={row}
                      rowType={rowType}
                      expanded={expanded}
                      clearMessage={clearMessage}
                      setMTOModalOpen={setMTOModalOpen}
                      setMTOModalState={setMTOModalState}
                      initLocation={initLocation}
                      search={location.search}
                      readView={readView}
                      numberOfMilestones={numberOfMilestones}
                    />
                  );
                }
                return row[column.accessor as keyof MilestoneType];
              })()}
            </td>
          );
        })}
      </>
    );
  };

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
        <tr id={milestone.id} key={milestone.id} className="border-top-1px">
          <RenderCells
            row={milestone}
            rowType="milestone"
            expanded={false}
            currentIndex={0}
            rowLength={0}
          />
        </tr>
      );
    });

  const renderSubCategories = (
    subCategories: SubCategoryType[],
    categoryID: string,
    categoryIndex: number
  ) =>
    subCategories.map((subCategory, index) => {
      const isExpanded = !expandedRows.includes(
        `${categoryID}-${subCategory.id}`
      );

      // Don't render if the subcategory is not in the rendered indexes
      if (
        !renderedRowIndexes.current.subCategory[categoryIndex].includes(index)
      ) {
        return null;
      }

      const rawSubCategory = formattedData
        .find(category => category.id === categoryID)
        ?.subCategories.find(sub => sub.id === subCategory.id);

      const numberOfMilestones = rawSubCategory
        ? rawSubCategory.milestones.length
        : 0;

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
                  updateOrder
                )
              )
            }
            id={`${categoryID}-${subCategory.id}`}
            toggleRow={toggleRow}
            style={{
              backgroundColor: '#F0F0F0',
              fontWeight: 'bold',
              borderTop: '1px solid black',
              cursor: 'pointer'
            }}
            isDraggable={!subCategory.isUncategorized && !readView}
          >
            <RenderCells
              row={subCategory}
              rowType="subcategory"
              expanded={isExpanded}
              currentIndex={index}
              rowLength={subCategories.length}
              categoryID={categoryID}
              subCategoryID={subCategory.id}
              categoryIndex={categoryIndex}
              numberOfMilestones={numberOfMilestones}
            />
          </DraggableRow>
          {isExpanded &&
            renderMilestones(subCategory.milestones, categoryIndex, index)}
        </div>
      );
    });

  const renderCategories = () => {
    return sortedData.map((category, index) => {
      // Don't render if the category is not in the rendered indexes
      if (!renderedRowIndexes.current.category.includes(index)) {
        return null;
      }

      const isExpanded = !expandedRows.includes(category.id);

      const rawCategory = formattedData.find(cat => cat.id === category.id);

      const numberOfMilestones = rawCategory
        ? rawCategory.subCategories.reduce(
            (acc, subCategory) => acc + subCategory.milestones.length,
            0
          )
        : 0;

      return (
        <div style={{ display: 'contents' }} key={category.id}>
          <DraggableRow
            index={[index]}
            type={category.isUncategorized ? 'uncategorized' : 'category'}
            moveRow={(dragIndex: number[], hoverIndex: number[]) =>
              setRearrangedData(
                moveRow(
                  dragIndex,
                  hoverIndex,
                  'category',
                  sortedData,
                  updateOrder
                )
              )
            }
            id={category.id}
            toggleRow={toggleRow}
            style={{
              cursor: 'pointer',
              backgroundColor: '#E1F3F8',
              borderBottom: '1px solid black',
              borderTop: '1px solid black',
              fontWeight: 'bold',
              fontSize: '1.25em'
            }}
            isDraggable={!category.isUncategorized && !readView}
          >
            <RenderCells
              row={category}
              rowType="category"
              expanded={isExpanded}
              currentIndex={index}
              rowLength={sortedData.length}
              categoryID={category.id}
              categoryIndex={index}
              numberOfMilestones={numberOfMilestones}
            />
          </DraggableRow>

          {isExpanded &&
            category.subCategories &&
            category.id &&
            renderSubCategories(category.subCategories, category.id, index)}
        </div>
      );
    });
  };

  if (loading && !queryData) {
    return <PageLoading />;
  }

  if (error) {
    return (
      <Alert type="error" isClosable={false}>
        {t('error:notFound.fetchError')}
      </Alert>
    );
  }

  return (
    <>
      <MTOMilestonePanelProvider>
        <MTOSolutionPanelProvider>
          {selectedSolution && (
            <SolutionDetailsModal
              solution={selectedSolution}
              openedFrom={prevPathname}
              closeRoute={initLocation}
            />
          )}
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
                    {filteredColumns.map((column, index) => (
                      <th
                        key={column.accessor}
                        style={{
                          borderBottom: '1px solid black',
                          padding: '1rem',
                          paddingLeft: index === 0 ? '.5rem' : '0px',
                          paddingBottom: '.25rem',
                          width: column.width,
                          minWidth: column.width,
                          maxWidth: column.width
                        }}
                      >
                        {column.canSort !== false ? (
                          <button
                            className={classNames(
                              'usa-button usa-button--unstyled position-relative display-block'
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
                            {getHeaderSortIcon(columnSort[index], true)}
                          </button>
                        ) : (
                          <span
                            className={classNames(
                              'usa-button usa-button--unstyled position-relative display-block',
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
            <div className="mint-no-print">
              <div className="display-flex">
                {totalPages > 0 && Pagination}

                <TablePageSize
                  className="margin-left-auto desktop:grid-col-auto"
                  pageSize={itemsPerPage}
                  setPageSize={setItemsPerPage}
                  setInitPageSize={setItemsPerPageInit}
                  valueArray={[5, 10, 15, 20, 'all']}
                  suffix={t('modelToOperationsMisc:table.milestones')}
                  onChange={() => {
                    // Reset pagination to the first page when the page size changes
                    params.set('page', '1');
                    navigate({ search: params.toString() }, { replace: true });
                  }}
                />
              </div>
            </div>
          </DndProvider>{' '}
        </MTOSolutionPanelProvider>
      </MTOMilestonePanelProvider>
    </>
  );
};

export default MTOTable;

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
    formattedCategory.addedFromMilestoneLibrary = undefined;
    formattedCategory.isDraft = undefined;
    formattedCategory.isUncategorized = category.isUncategorized;
    formattedCategory.key = undefined;
    formattedCategory.solutions = [];
    formattedCategory.subCategories = [];

    category.subCategories.forEach(subCategory => {
      const formattedSubCategory = {} as SubCategoryType;
      formattedSubCategory.actions = undefined;
      formattedSubCategory.riskIndicator = undefined;
      formattedSubCategory.facilitatedBy = undefined;
      formattedSubCategory.needBy = undefined;
      formattedSubCategory.status = undefined;
      formattedSubCategory.addedFromMilestoneLibrary = undefined;
      formattedSubCategory.isDraft = undefined;
      formattedSubCategory.isUncategorized = subCategory.isUncategorized;
      formattedSubCategory.key = undefined;
      formattedSubCategory.solutions = [];
      formattedSubCategory.milestones = [];

      subCategory.milestones.forEach(milestone => {
        const formattedMilestone = {} as MilestoneType;
        formattedMilestone.actions = undefined;
        formattedMilestone.solutions = [];
        formattedSubCategory.milestones.push({
          ...formattedMilestone,
          ...milestone,
          solutions: milestone.solutions.map(solution => ({
            ...solution,
            key: solution.key as MtoCommonSolutionKey | null | undefined
          }))
        });
      });

      formattedSubCategory.milestones.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      const { milestones, ...subCategoryData } = subCategory;
      const { isUncategorized, ...restSubCategoryData } = subCategoryData;
      formattedCategory.subCategories.push({
        ...formattedSubCategory,
        ...restSubCategoryData
      });
    });

    const { subCategories, ...categoryData } = category;
    const { isUncategorized, ...restCategoryData } = categoryData;
    formatData.push({ ...formattedCategory, ...restCategoryData });
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
  }) => Promise<any>
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
    })?.then(() => {
      toastSuccess(i18next.t('modelToOperationsMisc:successReorder'));
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
    })?.then(() => {
      toastSuccess(i18next.t('modelToOperationsMisc:successReorder'));
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
  itemsPerP: number,
  totalPages: number
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

  let milestoneCount = 0;

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
        milestoneCount += 1;
        if (milestoneIndex >= startingIndex && milestoneIndex < endingIndex) {
          shownIndexes.category.push(catIndex);
          shownIndexes.subCategory[catIndex].push(subIndex);
          shownIndexes.milestone[catIndex][subIndex].push(milIndex);
        }
        milestoneIndex += 1;
      });
    });
  });

  // If there are no milestones, we still want to show the category and subcategory on their respective pages
  sliceItemsCopy.forEach((category, catIndex) => {
    // If the category is Uncategorized and has no milestones, don't render it
    const categoryMilestones = category.subCategories.reduce(
      (acc, subCategory) => acc + subCategory.milestones.length,
      0
    );

    // If the category is Uncategorized and has no milestones, don't render it
    if (category.name === 'Uncategorized' && categoryMilestones === 0) {
      return;
    }

    // If the category has no milestones, render it, but don't return/render the subcategory yet
    if (categoryMilestones === 0) {
      shownIndexes.category.push(catIndex);
    }

    category.subCategories.forEach((subCategory, subIndex) => {
      if (subCategory.milestones.length === 0) {
        // If the subcategory is Uncategorized and has no milestones, don't render it
        if (subCategory.name === 'Uncategorized') {
          return;
        }

        // Only want to hit this conditional if the template is empty only one page
        if (totalPages === 1 && milestoneCount > 0) {
          shownIndexes.category.push(catIndex);
          shownIndexes.subCategory[catIndex].push(subIndex);
          return;
        }

        // If no milestones exist, set default index of 0 to the shownIndexes
        const categoryIndexes = shownIndexes.category.length
          ? shownIndexes.category
          : [0];

        const minShownCategoryIndex = Math.min(...categoryIndexes);
        const maxShownCategoryIndex = Math.max(...categoryIndexes);

        // Used to render out empty categories on the first page that fall as the first shown index
        const initPageIndex = pageNum === 1 ? 0 : 1;

        // -1 here to still render out any empty categories that are on the first page and are ordered first/fall before the first shown index
        // +2 here to still render out any empty categories that ordered last/fall after the last shown index
        const isInRange =
          catIndex > minShownCategoryIndex - initPageIndex &&
          catIndex < maxShownCategoryIndex + 2;

        // If the category has no milesteones, check the existing shownIndexes to see if it falls between the current page and the last page, then render it
        if (isInRange) {
          shownIndexes.category.push(catIndex);
          shownIndexes.subCategory[catIndex].push(subIndex);
        }
      }
    });
  });

  return shownIndexes;
};
