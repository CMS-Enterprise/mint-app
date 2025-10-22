import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonGroup, Grid } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { helpSolutions } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import { ModelsType } from 'features/Home/components/ModelCardTable';
import {
  ComponentGroup,
  GeneralStatus,
  MtoCommonSolutionKey
} from 'gql/generated/graphql';

import useCheckResponsiveScreen from 'hooks/useCheckMobile';

import '../ModelsBySolution/index.scss';

export type StatusCategories =
  | 'total'
  | GeneralStatus.PLANNED
  | GeneralStatus.ACTIVE
  | GeneralStatus.ENDED;

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
  const { t: homepageSettingsT } = useTranslation('homepageSettings');

  const isMobile = useCheckResponsiveScreen('tablet', 'smaller');

  const headerText = () => {
    if (type === 'solution') {
      const selectedSolution = helpSolutions[filterKey as MtoCommonSolutionKey];

      return (
        <>
          {' '}
          {selectedSolution?.name}{' '}
          {selectedSolution?.acronym ? `(${selectedSolution?.acronym})` : ''}
        </>
      );
    }
    return homepageSettingsT(`componentGroupAcronyms.${filterKey}`);
  };

  return (
    <div className="models-by-solutions">
      <div className="bg-primary-lighter radius-md padding-2">
        <Grid row className="flex-align-center">
          <Grid desktop={{ col: 7 }} tablet={{ col: 6 }}>
            <h3 className="margin-y-1">{headerText()}</h3>
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
                <div>{customHomeT(`generalStatus.${GeneralStatus.OTHER}`)}</div>
                <div data-testid="total-count">{models.length}</div>
              </Button>
              <Button
                type="button"
                onClick={() => setSelectedStatus(GeneralStatus.PLANNED)}
                className={classNames('padding-y-2', {
                  'bg-primary-darker': selectedStatus === GeneralStatus.PLANNED
                })}
              >
                <div>
                  {customHomeT(`generalStatus.${GeneralStatus.PLANNED}`)}
                </div>
                <div data-testid="planned-count">
                  {
                    models.filter(
                      model => model.generalStatus === GeneralStatus.PLANNED
                    ).length
                  }
                </div>
              </Button>
              <Button
                type="button"
                onClick={() => setSelectedStatus(GeneralStatus.ACTIVE)}
                className={classNames('padding-y-2', {
                  'bg-primary-darker': selectedStatus === GeneralStatus.ACTIVE
                })}
              >
                <div>
                  {customHomeT(`generalStatus.${GeneralStatus.ACTIVE}`)}
                </div>
                <div data-testid="active-count">
                  {
                    models.filter(
                      model => model.generalStatus === GeneralStatus.ACTIVE
                    ).length
                  }
                </div>
              </Button>
              <Button
                type="button"
                onClick={() => setSelectedStatus(GeneralStatus.ENDED)}
                className={classNames('padding-y-2', {
                  'bg-primary-darker': selectedStatus === GeneralStatus.ENDED
                })}
              >
                <div>{customHomeT(`generalStatus.${GeneralStatus.ENDED}`)}</div>
                <div data-testid="ended-count">
                  {
                    models.filter(
                      model => model.generalStatus === GeneralStatus.ENDED
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
