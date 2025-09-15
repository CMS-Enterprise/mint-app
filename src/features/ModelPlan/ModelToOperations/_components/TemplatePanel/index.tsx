import React, { useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Grid,
  GridContainer,
  Header,
  PrimaryNav
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { mtoTemplateMock } from 'tests/mock/mto';

import { MTOModalContext, MtoTemplateType } from 'contexts/MTOModalContext';
import usePagination from 'hooks/usePagination';

import '../../index.scss';

type TableType = 'milestones' | 'solutions';

// Flatten the nested array structure based on tableType
const flattenTemplateData = (template: MtoTemplateType, type: TableType) => {
  const flattenedItems: any[] = [];

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
      });
    });
  });

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

  const mockItems = mtoTemplateMock?.[0]?.result?.data?.mtoTemplates?.[0];

  const formattedMilestones = useMemo(
    () => flattenTemplateData(mockItems, tableType),
    [mockItems, tableType]
  );

  const formattedSolutions = useMemo(
    () => flattenTemplateData(mockItems, tableType),
    [mockItems, tableType]
  );

  const { currentItems, Pagination: PaginationComponent } = usePagination<
    any[]
  >({
    items:
      tableType === 'milestones' ? formattedMilestones : formattedSolutions,
    itemsPerPage: 5,
    showPageIfOne: true
  });

  console.log('currentItems', currentItems);

  return (
    <GridContainer className="padding-4 padding-x-8 mint-body-normal">
      <Grid row>
        <Grid col={12}>
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

          <h3 className="margin-y-2">{t('templateLibrary.templateContent')}</h3>

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
                items={(['milestones', 'solutions'] as TableType[]).map(
                  item => (
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
                  )
                )}
                mobileExpanded={false}
                className="flex-justify-start margin-0 padding-0"
              />
            </div>
          </Header>

          {/* Milestone Table */}
          <div className="margin-y-4">
            <div className="border-top border-bottom">
              {currentItems.map((item, index) => (
                <div
                  key={item.id}
                  className={classNames(`padding-2`, {
                    'border-bottom': index < currentItems.length - 1,
                    'bg-accent-cool-lighter': item.type === 'category',
                    'bg-base-lightest': item.type === 'subCategory'
                  })}
                >
                  <div
                    className={classNames({
                      'text-normal': item.type === 'milestone',
                      'text-bold':
                        item.type === 'category' || item.type === 'subCategory'
                    })}
                  >
                    {t(`templateLibrary.${item.type}`)}: {item.name}
                    {item.type === 'milestone' && (
                      <div className="text-normal">
                        {t('templateLibrary.solution')}: {item.solutions}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {PaginationComponent}
          </div>
        </Grid>
      </Grid>
    </GridContainer>
  );
};

export default TemplatePanel;
