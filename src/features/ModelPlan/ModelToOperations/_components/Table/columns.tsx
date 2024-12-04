import React, { useEffect, useRef, useState } from 'react';
import { Button, Icon, Menu } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { TaskListStatusTag } from 'features/ModelPlan/TaskList/_components/TaskListItem';
import {
  MtoFacilitator,
  MtoMilestoneStatus,
  MtoRiskIndicator
} from 'gql/generated/graphql';
import i18next from 'i18next';

import UswdsReactLink from 'components/LinkWrapper';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';

import './index.scss';

export type ColumnSortType = {
  isSorted: boolean;
  isSortedDesc: boolean;
  sortColumn: string;
};

export type MTORowType = 'category' | 'subcategory' | 'milestone';

export type MilestoneType = {
  __typename: 'MTOMilestone';
  id: string;
  riskIndicator: MtoRiskIndicator;
  name: string;
  facilitatedBy: MtoFacilitator[] | null;
  solutions: string[];
  needBy: string | null;
  status: MtoMilestoneStatus;
  actions: any;
  isUncategorized?: boolean;
};

export type SubCategoryType = {
  __typename: 'MTOSubcategory';
  id: string;
  riskIndicator: undefined;
  name: string;
  facilitatedBy: undefined;
  solutions: string[];
  needBy: undefined;
  status: undefined;
  actions: any;
  milestones: MilestoneType[];
  isUncategorized?: boolean;
};

export type CategoryType = {
  __typename: 'MTOCategory';
  id: string;
  riskIndicator: undefined;
  name: string;
  facilitatedBy: undefined;
  solutions: string[];
  needBy: undefined;
  status: undefined;
  actions: any;
  subCategories: SubCategoryType[];
  isUncategorized?: boolean;
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
  Cell?: (cellRow: RowProps) => JSX.Element;
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
    Header: <Icon.Warning size={3} className="left-05 text-base-lighter" />,
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
      return (
        <span className="text-bold text-base-lighter">
          {(() => {
            if (riskIndicator === MtoRiskIndicator.AT_RISK)
              return <Icon.Error className="text-error-dark top-05" size={3} />;
            if (riskIndicator === MtoRiskIndicator.OFF_TRACK)
              return (
                <Icon.Warning className="text-warning-dark top-05" size={3} />
              );
            return '';
          })()}
        </span>
      );
    }
  },
  {
    Header: i18next.t('modelToOperationsMisc:table.modelMilestone'),
    accessor: 'name',
    width: '200px',
    sort: sortNested,
    Cell: ({ row, rowType, expanded }: RowProps) => {
      return <>{row.name}</>;
    }
  },
  {
    Header: i18next.t('modelToOperationsMisc:table.facilitatedBy'),
    accessor: 'facilitatedBy',
    width: '200px',
    sort: sortNested,
    Cell: ({ row, rowType, expanded }: RowProps) => {
      if (!row.facilitatedBy) return <></>;
      return (
        <>
          {row.facilitatedBy
            .map(facilitator =>
              i18next.t(
                `modelToOperationsMisc:milestoneLibrary.facilitatedBy.${facilitator}`
              )
            )
            .join(', ')}
        </>
      );
    }
  },
  {
    Header: i18next.t('modelToOperationsMisc:table.solutions'),
    accessor: 'solutions',
    width: '200px',
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
    Cell: ({ row, rowType, expanded }: RowProps) => {
      if (rowType !== 'milestone') return <></>;
      if (row.solutions.length === 0)
        return (
          <UswdsReactLink to="#">
            Select a solution{' '}
            <Icon.ArrowForward className="top-05 margin-left-05" />
          </UswdsReactLink>
        );

      return <>{row.solutions.join(', ')}</>;
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
      return <>{row.needBy}</>;
    }
  },
  {
    Header: i18next.t('modelToOperationsMisc:table.status'),
    accessor: 'status',
    width: '130px',
    sort: sortNested,
    Cell: ({ row, rowType, expanded }: RowProps) => {
      const { status } = row;
      if (rowType !== 'milestone') return <></>;
      return (
        <TaskListStatusTag status={status} classname="width-fit-content" />
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

export const ActionMenu = ({
  rowType,
  MoveUp,
  MoveDown
}: {
  rowType: MTORowType;
  MoveUp: React.ReactChild;
  MoveDown: React.ReactChild;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const isTablet = useCheckResponsiveScreen('tablet', 'smaller');

  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (rowType !== 'milestone')
    return (
      <div ref={menuRef}>
        <Button
          type="button"
          style={{ fontSize: '1.25rem' }}
          className="width-auto padding-right-1 text-primary text-decoration-none text-bold float-right"
          aria-label={i18next.t('modelToOperationsMisc:table.openActionMenu')}
          unstyled
          onClick={e => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
          onKeyPress={e => {
            e.stopPropagation();
          }}
        >
          &#8230;
        </Button>
        <Menu
          className={classNames(
            'share-export-modal__menu padding-top-05 padding-bottom-0 bg-white text-primary width-card-lg action-menu',
            {
              'position-absolute': !isTablet
            }
          )}
          items={[
            <Button
              type="button"
              onClick={e => {
                e.stopPropagation();
                setIsMenuOpen(false);
              }}
              onKeyPress={e => {
                e.stopPropagation();
              }}
              className="share-export-modal__menu-item padding-y-1 padding-x-2 action-menu-item"
              unstyled
            >
              {i18next.t('modelToOperationsMisc:table.menu.close')}
            </Button>,
            MoveUp,
            MoveDown,
            <Button
              type="button"
              onClick={e => {
                e.stopPropagation();
                setIsMenuOpen(false);
              }}
              onKeyPress={e => {
                e.stopPropagation();
              }}
              className="share-export-modal__menu-item padding-y-1 padding-x-2 action-menu-item"
              unstyled
            >
              {i18next.t('modelToOperationsMisc:table.menu.addMilestone')}
            </Button>,
            <Button
              type="button"
              onClick={e => {
                setIsMenuOpen(false);
              }}
              onKeyPress={e => {
                e.stopPropagation();
              }}
              className="share-export-modal__menu-item padding-y-1 padding-x-2 action-menu-item"
              unstyled
            >
              {i18next.t(
                `modelToOperationsMisc:table.menu.${rowType === 'category' ? 'addSubCategory' : 'moveToAnotherCategory'}`
              )}
            </Button>,
            <Button
              type="button"
              onClick={e => {
                e.stopPropagation();
                setIsMenuOpen(false);
              }}
              onKeyPress={e => {
                e.stopPropagation();
              }}
              className="share-export-modal__menu-item padding-y-1 padding-x-2 action-menu-item"
              unstyled
            >
              {i18next.t(
                `modelToOperationsMisc:table.menu.${rowType === 'category' ? 'editCategoryTitle' : 'editSubCategoryTitle'}`
              )}
            </Button>,
            <Button
              type="button"
              onClick={e => {
                e.stopPropagation();
                setIsMenuOpen(false);
              }}
              onKeyPress={e => {
                e.stopPropagation();
              }}
              className="share-export-modal__menu-item padding-y-1 padding-x-2 action-menu-item text-red"
              unstyled
            >
              {i18next.t(
                `modelToOperationsMisc:table.menu.${rowType === 'category' ? 'removeCategory' : 'removeSubCategory'}`
              )}
            </Button>
          ]}
          isOpen={isMenuOpen}
        />
      </div>
    );
  return (
    <div style={{ textAlign: 'right' }}>
      {/* TODO: add link to edit milestone */}
      <UswdsReactLink to="#">
        {i18next.t('modelToOperationsMisc:table.editDetails')}
      </UswdsReactLink>
    </div>
  );
};
