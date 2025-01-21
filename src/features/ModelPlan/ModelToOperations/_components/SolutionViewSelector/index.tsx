import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button, ButtonGroup, Label, Select } from '@trussworks/react-uswds';

import useCheckResponsiveScreen from 'hooks/useCheckMobile';

import { SolutionCardType, SolutionViewType } from '../../SolutionLibrary';
import { SolutionType } from '../ITSystemsTable';

const SolutionViewSelector = ({
  viewParam,
  viewParamName = 'view',
  usePages = true,
  allSolutions,
  itSystemsSolutions,
  contractsSolutions,
  crossCutSolutions
}: {
  viewParam: SolutionViewType;
  viewParamName?: string;
  usePages?: boolean;
  allSolutions: SolutionCardType[] | SolutionType[];
  itSystemsSolutions: SolutionCardType[] | SolutionType[];
  contractsSolutions: SolutionCardType[] | SolutionType[];
  crossCutSolutions: SolutionCardType[] | SolutionType[];
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
              params.set(viewParamName, e.target.value);
              if (usePages) params.set('page', '1');
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
              params.set(viewParamName, 'all');
              if (usePages) params.set('page', '1');
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
              params.set(viewParamName, 'it-systems');
              if (usePages) params.set('page', '1');
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
              params.set(viewParamName, 'contracts');
              if (usePages) params.set('page', '1');
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
              params.set(viewParamName, 'cross-cut');
              if (usePages) params.set('page', '1');
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

export default SolutionViewSelector;
