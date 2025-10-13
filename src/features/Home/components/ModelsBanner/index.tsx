import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonGroup, Grid } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { helpSolutions } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import { ModelsType } from 'features/Home/components/ModelCardTable';
import {
  ComponentGroup,
  ModelBySolutionStatus,
  MtoCommonSolutionKey
} from 'gql/generated/graphql';

import useCheckResponsiveScreen from 'hooks/useCheckMobile';

import '../ModelsBySolution/index.scss';

export type StatusCategories =
  | 'total'
  | ModelBySolutionStatus.PLANNED
  | ModelBySolutionStatus.ACTIVE
  | ModelBySolutionStatus.ENDED;

const ModelsBanner = ({
  type,
  filterKey,
  models,
  selectedStatus,
  setSelectedStatus
}: {
  type: 'solution' | 'group';
  filterKey: MtoCommonSolutionKey | ComponentGroup;
  models: ModelsType;
  selectedStatus: StatusCategories;
  setSelectedStatus: (status: StatusCategories) => void;
}) => {
  const { t: customHomeT } = useTranslation('customHome');

  const isMobile = useCheckResponsiveScreen('tablet', 'smaller');

  const selectedSolution = helpSolutions[filterKey as MtoCommonSolutionKey];

  return (
    <div className="models-by-solutions">
      <div className="bg-primary-lighter radius-md padding-2">
        <Grid row className="flex-align-center">
          <Grid desktop={{ col: 7 }} tablet={{ col: 6 }}>
            <h3 className="margin-y-1">
              {selectedSolution?.name}{' '}
              {selectedSolution?.acronym
                ? `(${selectedSolution?.acronym})`
                : ''}
            </h3>
          </Grid>

          <Grid
            desktop={{ col: 5 }}
            tablet={{ col: 6 }}
            className={classNames('models-by-solutions__banner-buttons', {
              'row-reverse': !isMobile
            })}
          >
            <ButtonGroup type="segmented">
              <Button
                type="button"
                onClick={() => setSelectedStatus('total')}
                className={classNames('padding-y-2', {
                  'bg-primary-darker': selectedStatus === 'total'
                })}
              >
                <div>{customHomeT(`solutionStatus.total`)}</div>
                <div data-testid="total-count">{models.length}</div>
              </Button>
              <Button
                type="button"
                onClick={() => setSelectedStatus(ModelBySolutionStatus.PLANNED)}
                className={classNames('padding-y-2', {
                  'bg-primary-darker':
                    selectedStatus === ModelBySolutionStatus.PLANNED
                })}
              >
                <div>{customHomeT(`solutionStatus.planned`)}</div>
                <div data-testid="planned-count">
                  {
                    models.filter(
                      model =>
                        model.modelBySolutionStatus ===
                        ModelBySolutionStatus.PLANNED
                    ).length
                  }
                </div>
              </Button>
              <Button
                type="button"
                onClick={() => setSelectedStatus(ModelBySolutionStatus.ACTIVE)}
                className={classNames('padding-y-2', {
                  'bg-primary-darker':
                    selectedStatus === ModelBySolutionStatus.ACTIVE
                })}
              >
                <div>{customHomeT(`solutionStatus.active`)}</div>
                <div data-testid="active-count">
                  {
                    models.filter(
                      model =>
                        model.modelBySolutionStatus ===
                        ModelBySolutionStatus.ACTIVE
                    ).length
                  }
                </div>
              </Button>
              <Button
                type="button"
                onClick={() => setSelectedStatus(ModelBySolutionStatus.ENDED)}
                className={classNames('padding-y-2', {
                  'bg-primary-darker':
                    selectedStatus === ModelBySolutionStatus.ENDED
                })}
              >
                <div>{customHomeT(`solutionStatus.ended`)}</div>
                <div data-testid="ended-count">
                  {
                    models.filter(
                      model =>
                        model.modelBySolutionStatus ===
                        ModelBySolutionStatus.ENDED
                    ).length
                  }
                </div>
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default ModelsBanner;
