import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button, ButtonGroup, Label, Select } from '@trussworks/react-uswds';

import useCheckResponsiveScreen from 'hooks/useCheckMobile';

import { SolutionCardType, SolutionViewType } from '..';

const ViewSelector = ({
  viewParam,
  allSolutions,
  itSystemsSolutions,
  contractsSolutions,
  crossCutSolutions
}: {
  viewParam: SolutionViewType;
  allSolutions: SolutionCardType[];
  itSystemsSolutions: SolutionCardType[];
  contractsSolutions: SolutionCardType[];
  crossCutSolutions: SolutionCardType[];
}) => {
  const { t } = useTranslation('modelToOperationsMisc');
  const isTablet = useCheckResponsiveScreen('tablet', 'smaller');
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);

  return (
    <>
      {isTablet ? (
        <div>
          <Label htmlFor="select-view" className="text-normal maxw-none">
            {t('documentsMisc:documentTable.view')}
          </Label>
          <Select
            id="select-view"
            name="select-view"
            className="maxw-none"
            onChange={e => {
              params.set('view', e.target.value);
              params.set('page', '1');
              history.replace({ search: params.toString() });
            }}
          >
            <option value="all">
              {t('solutionLibrary.tabs.allSolutions', {
                count: allSolutions.length
              })}
            </option>
            <option value="it-systems">
              {t('solutionLibrary.tabs.itSystems', {
                count: itSystemsSolutions.length
              })}
            </option>
            <option value="contracts">
              {t('solutionLibrary.tabs.contracts', {
                count: contractsSolutions.length
              })}
            </option>
            <option value="cross-cut">
              {t('solutionLibrary.tabs.crossCutting', {
                count: crossCutSolutions.length
              })}
            </option>
          </Select>
        </div>
      ) : (
        <ButtonGroup type="segmented" className="margin-right-3">
          <Button
            type="button"
            outline={viewParam !== 'all'}
            onClick={() => {
              params.set('view', 'all');
              params.set('page', '1');
              history.replace({ search: params.toString() });
            }}
          >
            {t('solutionLibrary.tabs.allSolutions', {
              count: allSolutions.length
            })}
          </Button>
          <Button
            type="button"
            outline={viewParam !== 'it-systems'}
            onClick={() => {
              params.set('view', 'it-systems');
              params.set('page', '1');
              history.replace({ search: params.toString() });
            }}
          >
            {t('solutionLibrary.tabs.itSystems', {
              count: itSystemsSolutions.length
            })}
          </Button>
          <Button
            type="button"
            outline={viewParam !== 'contracts'}
            onClick={() => {
              params.set('view', 'contracts');
              params.set('page', '1');
              history.replace({ search: params.toString() });
            }}
          >
            {t('solutionLibrary.tabs.contracts', {
              count: contractsSolutions.length
            })}
          </Button>
          <Button
            type="button"
            outline={viewParam !== 'cross-cut'}
            onClick={() => {
              params.set('view', 'cross-cut');
              params.set('page', '1');
              history.replace({ search: params.toString() });
            }}
          >
            {t('solutionLibrary.tabs.crossCutting', {
              count: crossCutSolutions.length
            })}
          </Button>
        </ButtonGroup>
      )}
    </>
  );
};

export default ViewSelector;
