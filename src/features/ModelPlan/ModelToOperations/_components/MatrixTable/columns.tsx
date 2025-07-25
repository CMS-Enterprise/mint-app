import React, { useContext } from 'react';
import { Button, Icon } from '@trussworks/react-uswds';
import { helpSolutionsArray } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import {
  MtoCommonMilestoneKey,
  MtoCommonSolutionKey,
  MtoFacilitator,
  MtoMilestoneStatus,
  MtoRiskIndicator
} from 'gql/generated/graphql';
import i18next from 'i18next';

import UswdsReactLink from 'components/LinkWrapper';
import { MTOMilestonePanelContext } from 'contexts/MTOMilestonePanelContext';
import { MTOModalState } from 'contexts/MTOModalContext';
import { MTOSolutionPanelContext } from 'contexts/MTOSolutionPanelContext';
import { findSolutionByKey } from 'hooks/useModalSolutionState';
import { formatDateUtc } from 'utils/date';

import MTORiskIndicatorTag from '../MTORiskIndicatorIcon';
import MilestoneStatusTag from '../MTOStatusTag';

import './index.scss';

export type ColumnSortType = {
  isSorted: boolean;
  isSortedDesc: boolean;
  sortColumn: string;
};

export type MTORowType = 'category' | 'subcategory' | 'milestone';

type MtoSolutionType = {
  id: string;
  key?: MtoCommonSolutionKey | null;
  name?: string | null;
};

export type MilestoneType = {
  __typename: 'MTOMilestone';
  id: string;
  riskIndicator: MtoRiskIndicator;
  name: string;
  facilitatedBy: MtoFacilitator[] | null;
  facilitatedByOther?: string | null;
  solutions: MtoSolutionType[];
  needBy: string | null;
  status: MtoMilestoneStatus;
  actions: any;
  addedFromMilestoneLibrary?: boolean;
  isDraft?: boolean;
  isUncategorized?: boolean;
  key?: MtoCommonMilestoneKey | null;
};

export function isMilestoneType(data: RowType): data is MilestoneType {
  return data.__typename === 'MTOMilestone'; // eslint-disable-line no-underscore-dangle
}

export type SubCategoryType = {
  __typename: 'MTOSubcategory';
  id: string;
  riskIndicator: undefined;
  name: string;
  facilitatedBy: undefined;
  facilitatedByOther?: undefined;
  solutions: string[];
  needBy: undefined;
  status: undefined;
  actions: any;
  milestones: MilestoneType[];
  addedFromMilestoneLibrary?: undefined;
  isDraft?: undefined;
  isUncategorized?: boolean;
  key?: undefined;
};

export type CategoryType = {
  __typename: 'MTOCategory';
  id: string;
  riskIndicator: undefined;
  name: string;
  facilitatedBy: undefined;
  facilitatedByOther?: undefined;
  solutions: string[];
  needBy: undefined;
  status: undefined;
  actions: any;
  subCategories: SubCategoryType[];
  addedFromMilestoneLibrary?: undefined;
  isDraft?: undefined;
  isUncategorized?: boolean;
  key?: undefined;
};

export type RowType = CategoryType | SubCategoryType | MilestoneType;

const riskMap: Record<MtoRiskIndicator, number> = {
  [MtoRiskIndicator.ON_TRACK]: 1,
  [MtoRiskIndicator.OFF_TRACK]: 2,
  [MtoRiskIndicator.AT_RISK]: 3
};

type RowProps = {
  row: RowType;
  rowType: MTORowType;
  expanded?: boolean;
};

type ExtendedRowProps = RowProps & {
  clearMessage?: () => void;
  setMTOModalOpen?: (open: boolean) => void;
  setMTOModalState?: (state: Partial<MTOModalState>) => void;
  initLocation?: string;
  search?: string;
  readView?: boolean;
  numberOfMilestones?: number;
};

export type ColumnType = {
  Header: string | React.ReactNode;
  accessor: string;
  width: string;
  canSort?: boolean;
  sort?: (
    data: CategoryType[],
    direction: 'ASC' | 'DESC',
    accessor: keyof MilestoneType
  ) => CategoryType[];
  Cell?: (cellRow: RowProps | ExtendedRowProps) => JSX.Element;
};

const sortNested = (
  data: CategoryType[],
  direction: 'ASC' | 'DESC',
  accessor: keyof MilestoneType
) => {
  const copyData = [...data];
  copyData.forEach(category => {
    category.subCategories.forEach(subCategory => {
      subCategory.milestones.sort((a, b) =>
        a[accessor]?.localeCompare(b[accessor])
      );
      if (direction === 'DESC') {
        subCategory.milestones.reverse();
      }
    });
  });
  return copyData;
};

export const columns: ColumnType[] = [
  {
    Header: (
      <Icon.Warning
        size={3}
        className="left-05 text-base-lighter"
        aria-label="warning"
      />
    ),
    accessor: 'riskIndicator',
    width: '60px',
    canSort: false,
    sort: (data: CategoryType[], direction: 'ASC' | 'DESC') => {
      const copyData = [...data];
      copyData.forEach(category => {
        category.subCategories.forEach(subCategory => {
          subCategory.milestones.sort(
            (a, b) =>
              (riskMap[a.riskIndicator] || 0) - (riskMap[b.riskIndicator] || 0)
          );
          if (direction === 'DESC') {
            subCategory.milestones.reverse();
          }
        });
      });
      return copyData;
    },
    Cell: ({ row, rowType, expanded }: RowProps) => {
      const { riskIndicator } = row;

      if ('subCategories' in row) {
        if (row.subCategories.length === 0) return <></>;
      }

      if ('milestones' in row) {
        if (row.milestones.length === 0) return <></>;
      }

      if (rowType !== 'milestone')
        return (
          <span style={{ fontSize: '1.25rem' }} className="margin-left-05">
            {!expanded ? (
              <span
                aria-label={i18next.t('modelToOperationsMisc:table.expandRow')}
                style={{
                  fontSize: '1.5rem',
                  padding: '.25rem'
                }}
                className="text-primary"
              >
                &#x2b;
              </span>
            ) : (
              <span
                aria-label={i18next.t(
                  'modelToOperationsMisc:table.collapseRow'
                )}
                className="text-primary"
              >
                &#x2015;
              </span>
            )}
          </span>
        );

      if (!riskIndicator) return <></>;

      return <MTORiskIndicatorTag riskIndicator={riskIndicator} />;
    }
  },
  {
    Header: i18next.t('modelToOperationsMisc:table.modelMilestone'),
    accessor: 'name',
    width: '200px',
    sort: sortNested,
    Cell: ({
      row,
      rowType,
      expanded,
      clearMessage,
      setMTOModalOpen,
      setMTOModalState,
      initLocation,
      search,
      readView,
      numberOfMilestones
    }: ExtendedRowProps) => {
      const { openEditMilestoneModal, setMilestoneID } = useContext(
        MTOMilestonePanelContext
      );

      if (readView && rowType === 'milestone') {
        return (
          <Button
            type="button"
            unstyled
            className="mint-print-link line-height-normal"
            onClick={() => {
              openEditMilestoneModal(row.id);
              setMilestoneID(row.id);
            }}
          >
            {row.name}{' '}
            {rowType !== 'milestone' && (
              <span className="text-base-dark margin-left-2 mint-body-normal position-absolute">
                {i18next.t('modelToOperationsMisc:table.milestonesCount', {
                  count: numberOfMilestones
                })}
              </span>
            )}
          </Button>
        );
      }
      return (
        <>
          {row.name}{' '}
          {rowType !== 'milestone' && (
            <span className="text-base-dark margin-left-2 mint-body-normal position-absolute">
              {i18next.t('modelToOperationsMisc:table.milestonesCount', {
                count: numberOfMilestones
              })}
            </span>
          )}
        </>
      );
    }
  },
  {
    Header: i18next.t('modelToOperationsMisc:table.facilitatedBy'),
    accessor: 'facilitatedBy',
    width: '175px',
    sort: sortNested,
    Cell: ({ row, rowType, expanded }: RowProps) => {
      if (rowType !== 'milestone') return <></>;

      if (!row.facilitatedBy || row.facilitatedBy.length === 0)
        return <em>{i18next.t('modelToOperationsMisc:table.noneAdded')}</em>;
      return (
        <>
          {row.facilitatedBy
            .map(
              facilitator =>
                `${i18next.t(`mtoMilestone:facilitatedBy.options.${facilitator}`)}${facilitator === 'OTHER' ? ` (${row.facilitatedByOther})` : ''}`
            )
            .join(', ')}
        </>
      );
    }
  },
  {
    Header: i18next.t('modelToOperationsMisc:table.solutions'),
    accessor: 'solutions',
    width: '150px',
    sort: (data: CategoryType[], direction: 'ASC' | 'DESC') => {
      const copyData = [...data];
      copyData.forEach(category => {
        category.subCategories.forEach(subCategory => {
          subCategory.milestones.sort((a, b) =>
            a.solutions.join().localeCompare(b.solutions.join())
          );
          if (direction === 'DESC') {
            subCategory.milestones.reverse();
          }
        });
      });
      return copyData;
    },
    Cell: ({
      row,
      rowType,
      expanded,
      clearMessage,
      setMTOModalOpen,
      setMTOModalState,
      initLocation,
      search,
      readView,
      numberOfMilestones
    }: ExtendedRowProps) => {
      const { openViewSolutionModal, setViewSolutionID } = useContext(
        MTOSolutionPanelContext
      );

      if (rowType !== 'milestone') return <></>;
      if (isMilestoneType(row)) {
        if (row.solutions.length === 0)
          return (
            <>
              {readView ? (
                <div className="text-italic">
                  {i18next.t('modelToOperationsMisc:table.noneAdded')}
                </div>
              ) : (
                <Button
                  type="button"
                  className="display-block mint-print-link text-bold"
                  unstyled
                  onClick={() => {
                    if (clearMessage) clearMessage();
                    if (setMTOModalState)
                      setMTOModalState({
                        modalType: 'selectSolution',
                        milestoneID: row.id
                      });
                    if (setMTOModalOpen) setMTOModalOpen(true);
                  }}
                >
                  {i18next.t('modelToOperationsMisc:table.selectASolution')}
                  <Icon.ArrowForward
                    className="top-05 margin-left-05"
                    aria-label="forward"
                  />
                </Button>
              )}
            </>
          );

        if (readView) {
          return (
            <>
              {row.solutions.map((solution, index) => {
                const solutionAcornym = findSolutionByKey(
                  solution.key!,
                  helpSolutionsArray
                )?.acronym;

                return (
                  <Button
                    type="button"
                    unstyled
                    className="mint-print-link"
                    onClick={() => {
                      openViewSolutionModal(solution.id);
                      setViewSolutionID(solution.id);
                    }}
                  >
                    <span className="margin-right-05">
                      {solutionAcornym || solution.name}
                      {index < row.solutions.length - 1 && ', '}
                    </span>
                  </Button>
                );
              })}
            </>
          );
        }

        return (
          <>
            {row.solutions.map((solution, index) => {
              const solutionMap = findSolutionByKey(
                solution.key!,
                helpSolutionsArray
              );

              const detailRoute = solutionMap?.key
                ? `${initLocation}${search}${
                    search ? '&' : '?'
                  }solution-key=${solutionMap?.key || ''}&section=about`
                : `${initLocation}${search}`;
              return (
                <React.Fragment key={solution.id}>
                  {solution.key !== null ? (
                    <UswdsReactLink
                      to={detailRoute}
                      className="mint-print-link"
                    >
                      {solutionMap?.acronym ?? solutionMap?.name}
                    </UswdsReactLink>
                  ) : (
                    solution.name
                  )}
                  {index < row.solutions.length - 1 && ', '}
                </React.Fragment>
              );
            })}
          </>
        );
      }
      return <></>;
    }
  },
  {
    Header: i18next.t('modelToOperationsMisc:table.needBy'),
    accessor: 'needBy',
    width: '130px',
    sort: sortNested,
    Cell: ({ row, rowType, expanded }: RowProps) => {
      if (!row.needBy && rowType === 'milestone')
        return (
          <span className="text-italic">
            {i18next.t('modelToOperationsMisc:table.noneAdded')}
          </span>
        );
      return <>{formatDateUtc(row.needBy, 'MM/dd/yyyy')}</>;
    }
  },
  {
    Header: i18next.t('modelToOperationsMisc:table.status'),
    accessor: 'status',
    width: '130px',
    sort: sortNested,
    Cell: ({ row, rowType, expanded }: RowProps) => {
      const { status } = row;
      if (rowType !== 'milestone' || !status) return <></>;
      return (
        <MilestoneStatusTag status={status} classname="width-fit-content" />
      );
    }
  },
  {
    Header: i18next.t('modelToOperationsMisc:table.actions'),
    accessor: 'actions',
    width: '130px',
    canSort: false
  }
];
