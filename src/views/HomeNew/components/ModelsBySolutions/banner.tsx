import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonGroup, Grid } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { ModelStatus, OperationalSolutionKey } from 'gql/gen/graphql';

import { ModelsBySolutionType } from 'components/ModelsBySolution/table';
import { helpSolutions } from 'views/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import './index.scss';

export type StatusCategories =
  | 'total'
  | 'planned'
  | ModelStatus.ACTIVE
  | ModelStatus.ENDED;

const ModelsBySolutionsBanner = ({
  solutionKey,
  solutionModels,
  selectedStatus,
  setSelectedStatus
}: {
  solutionKey: OperationalSolutionKey;
  solutionModels: ModelsBySolutionType;
  selectedStatus: StatusCategories;
  setSelectedStatus: (status: StatusCategories) => void;
}) => {
  const { t: customHomeT } = useTranslation('customHome');

  const selectedSolution = helpSolutions.find(
    solution => solution.enum === solutionKey
  );

  return (
    <div className="models-by-solutions">
      <div className="bg-primary-lighter radius-md padding-2">
        <Grid row className="flex-align-center">
          <Grid desktop={{ col: 7 }}>
            <h3 className="margin-0">
              {selectedSolution?.name}{' '}
              {selectedSolution?.acronym
                ? `(${selectedSolution?.acronym})`
                : ''}
            </h3>
          </Grid>

          <Grid
            desktop={{ col: 5 }}
            className="models-by-solutions__banner-buttons"
          >
            <ButtonGroup type="segmented">
              <Button
                type="button"
                onClick={() => setSelectedStatus('total')}
                className={classNames({
                  'bg-primary-darker': selectedStatus === 'total'
                })}
              >
                <div className="margin-bottom-1">
                  {customHomeT(`solutionStatus.total`)}
                </div>
                <div>{solutionModels.length}</div>
              </Button>
              <Button
                type="button"
                onClick={() => setSelectedStatus('planned')}
                className={classNames({
                  'bg-primary-darker': selectedStatus === 'planned'
                })}
              >
                <div className="margin-bottom-1">
                  {customHomeT(`solutionStatus.planned`)}
                </div>
                <div>
                  {
                    solutionModels.filter(
                      solution =>
                        solution.modelPlan.status !== ModelStatus.ACTIVE &&
                        solution.modelPlan.status !== ModelStatus.ENDED
                    ).length
                  }
                </div>
              </Button>
              <Button
                type="button"
                onClick={() => setSelectedStatus(ModelStatus.ACTIVE)}
                className={classNames({
                  'bg-primary-darker': selectedStatus === ModelStatus.ACTIVE
                })}
              >
                <div className="margin-bottom-1">
                  {customHomeT(`solutionStatus.active`)}
                </div>
                <div>
                  {
                    solutionModels.filter(
                      solution =>
                        solution.modelPlan.status === ModelStatus.ACTIVE
                    ).length
                  }
                </div>
              </Button>
              <Button
                type="button"
                onClick={() => setSelectedStatus(ModelStatus.ENDED)}
                className={classNames({
                  'bg-primary-darker': selectedStatus === ModelStatus.ENDED
                })}
              >
                <div className="margin-bottom-1">
                  {customHomeT(`solutionStatus.ended`)}
                </div>
                <div>
                  {
                    solutionModels.filter(
                      solution =>
                        solution.modelPlan.status === ModelStatus.ENDED
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

export default ModelsBySolutionsBanner;
