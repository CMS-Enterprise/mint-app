import React, { useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Header, PrimaryNav } from '@trussworks/react-uswds';
import classNames from 'classnames';

import Alert from 'components/Alert';
import { MTOModalContext, MtoTemplateType } from 'contexts/MTOModalContext';
import usePagination from 'hooks/usePagination';

import '../../index.scss';

type TableType = 'milestones' | 'solutions';

// Flatten the nested array structure based on tableType
export const flattenTemplateData = (
  template: MtoTemplateType,
  type: TableType
) => {
  const flattenedItems: any[] = [];

  const flattenedSolutions: any[] = [];

  const solutionMap: any = {};

  template.categories?.forEach(category => {
    flattenedItems.push({
      ...category,
      type: 'category',
      name: category.name
    });
    category.subCategories?.forEach(subCategory => {
      flattenedItems.push({
        ...subCategory,
        type: 'subCategory',
        name: subCategory.name
      });
      subCategory.milestones?.forEach(milestone => {
        flattenedItems.push({
          ...milestone,
          type: 'milestone',
          name: milestone.name,
          solutions: milestone.solutions
            .map(solution => solution.name)
            .join(', ')
        });

        if (type === 'solutions') {
          milestone.solutions.forEach(solution => {
            if (!solutionMap[solution.name]) {
              solutionMap[solution.name] = [];
            }
            solutionMap[solution.name].push(milestone.name);
            flattenedSolutions.push({
              ...solution,
              type: 'solution',
              name: solution.name
            });
          });
        }
      });
    });
  });

  if (type === 'solutions') {
    // Assign related milestones to the flattenedSolutions array
    return flattenedSolutions.map(solution => ({
      ...solution,
      relatedMilestones: solutionMap[solution.name].join(', ')
    }));
  }

  return flattenedItems;
};

const TemplatePanel = ({
  template,
  closeModal
}: {
  template: MtoTemplateType;
  closeModal: () => void;
}) => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { setMTOModalState, setMTOModalOpen } = useContext(MTOModalContext);

  const [tableType, setTableType] = useState<TableType>('milestones');

  const formattedItems = useMemo(
    () => flattenTemplateData(template, tableType),
    [template, tableType]
  );

  const { currentItems, Pagination: PaginationComponent } = usePagination<
    any[]
  >({
    items: formattedItems,
    itemsPerPage: 5,
    showPageIfOne: true
  });

  return (
    <div className="padding-4 padding-x-8 mint-body-normal">
      <h2 className="margin-y-2 line-height-large">{template.name}</h2>

      <div className="text-base-dark">
        {t('templateLibrary.templateCount', {
          categoryCount: template.categoryCount,
          milestoneCount: template.milestoneCount,
          solutionCount: template.solutionCount
        })}
      </div>

      <p className="margin-y-4" style={{ whiteSpace: 'pre-line' }}>
        {template.description}
      </p>

      <div className="padding-bottom-6 margin-bottom-4 border-bottom border-base-light">
        <Button
          type="button"
          outline
          className="margin-right-2"
          onClick={() => {
            setMTOModalState({
              modalType: 'addTemplate',
              mtoTemplate: template
            });
            setMTOModalOpen(true);
          }}
        >
          {t('templateLibrary.addToMatrix')}
        </Button>
      </div>

      <h3 className="margin-y-2">{t('templateLibrary.templateContents')}</h3>

      <p className="margin-y-2" style={{ whiteSpace: 'pre-line' }}>
        {t('templateLibrary.contentDetails')}
      </p>

      <Header
        basic
        extended={false}
        className="model-to-operations__nav-container border-bottom border-base-lighter"
      >
        <div className="usa-nav-container padding-0">
          <PrimaryNav
            items={(['milestones', 'solutions'] as TableType[]).map(item => (
              <button
                type="button"
                onClick={() => {
                  setTableType(item);
                }}
                className={classNames(
                  'usa-nav__link margin-left-neg-2 margin-right-2',
                  {
                    'usa-current': tableType === item
                  }
                )}
              >
                <span
                  className={classNames({
                    'text-primary': tableType === item
                  })}
                >
                  {t(item)}
                </span>
              </button>
            ))}
            mobileExpanded={false}
            className="flex-justify-start margin-0 padding-0"
          />
        </div>
      </Header>

      {/* Milestone Table */}
      <div className="margin-y-4">
        {currentItems.length > 0 ? (
          <div className="border-top border-bottom">
            {currentItems.map((item, index) => (
              <div
                key={item.id}
                className={classNames(`padding-105`, {
                  'border-bottom': index < currentItems.length - 1,
                  'bg-accent-cool-lighter': item.type === 'category',
                  'bg-base-lightest': item.type === 'subCategory'
                })}
              >
                {tableType === 'milestones' && (
                  <div
                    className={classNames({
                      'text-normal': item.type === 'milestone',
                      'text-bold':
                        item.type === 'category' || item.type === 'subCategory'
                    })}
                  >
                    <p className="margin-0">
                      {t(`templateLibrary.${item.type}`)}: {item.name}
                    </p>
                    {item.type === 'milestone' && (
                      <p className="margin-0 text-base">
                        {t('templateLibrary.selectedSolutions')}:{' '}
                        {item.solutions}
                      </p>
                    )}
                  </div>
                )}
                {tableType === 'solutions' && (
                  <>
                    <p className="margin-0">
                      {t('templateLibrary.solution')}: {item.name}
                    </p>
                    <p className="margin-0 text-base">
                      {t('templateLibrary.relatedMilestones')}:{' '}
                      {item.relatedMilestones}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <Alert type="info" slim>
            {tableType === 'milestones'
              ? t('templateLibrary.noMilestones')
              : t('templateLibrary.noSolutions')}
          </Alert>
        )}
        {PaginationComponent}
      </div>
    </div>
  );
};

export default TemplatePanel;
