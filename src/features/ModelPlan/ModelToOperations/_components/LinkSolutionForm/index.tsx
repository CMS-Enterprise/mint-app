import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button,
  Card,
  Grid,
  GridContainer,
  Label
} from '@trussworks/react-uswds';
import {
  HelpSolutionBaseType,
  helpSolutions
} from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import {
  GetMtoAllSolutionsQuery,
  GetMtoMilestoneQuery,
  MtoCommonSolutionKey
} from 'gql/generated/graphql';

import HelpText from 'components/HelpText';
import MultiSelect from 'components/MultiSelect';
import useMessage from 'hooks/useMessage';
import useModalSolutionState from 'hooks/useModalSolutionState';
import { convertCamelCaseToKebabCase } from 'utils/modelPlan';

import { SolutionCard } from '../SolutionCard';

import '../../index.scss';

type LinkSolutionFormProps = {
  milestone: GetMtoMilestoneQuery['mtoMilestone'];
  closeModal: Dispatch<SetStateAction<boolean>>;
  commonSolutionKeys: MtoCommonSolutionKey[];
  setCommonSolutionKeys: Dispatch<SetStateAction<MtoCommonSolutionKey[]>>;
  solutionIDs: string[];
  setSolutionIDs: Dispatch<SetStateAction<string[]>>;
  allSolutions: GetMtoAllSolutionsQuery['modelPlan']['mtoMatrix'];
};

const LinkSolutionForm = ({
  milestone,
  closeModal,
  commonSolutionKeys,
  setCommonSolutionKeys,
  solutionIDs,
  setSolutionIDs,
  allSolutions
}: LinkSolutionFormProps) => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { errorMessageInModal, clearMessage } = useMessage();

  const history = useHistory();

  //   console.log('data', allSolutions);

  const setChecked = (key: MtoCommonSolutionKey) => {
    if (commonSolutionKeys.includes(key)) {
      setCommonSolutionKeys(commonSolutionKeys.filter(k => k !== key));
    } else {
      setCommonSolutionKeys([...commonSolutionKeys, key]);
    }
  };

  // Map the common solutions to the FE help solutions
  const mappedSolutions = milestone.solutions
    .filter(solution => !!solution.commonSolution)
    .map(solution => {
      return helpSolutions.find(s => s.enum === solution.commonSolution?.key);
    });

  const mappedSolutionKeys = mappedSolutions.map(solution => solution?.enum);

  const commonSolutions =
    allSolutions?.commonSolutions.filter(
      solution => !mappedSolutionKeys.includes(solution.key)
    ) || [];

  const createdSolutions =
    allSolutions?.solutions?.filter(solution => !solution.key) || [];

  const groupedOptions = [
    {
      label: 'Custom solutions added to this MTO',
      options: createdSolutions.map(solution => {
        return {
          label: solution.name || '',
          value: solution.id
        };
      })
    },
    {
      label: 'Other available solutions',
      options: commonSolutions.map(solution => {
        return {
          label: solution.name || '',
          value: solution.key
        };
      })
    }
  ];

  const initialValues = [...commonSolutionKeys, ...solutionIDs];

  const isCustomSolution = (id: string) => {
    return createdSolutions.find(solution => solution.id === id);
  };

  return (
    <GridContainer className="padding-8">
      <Grid row>
        <Grid col={12}>
          {mappedSolutions.map(solution =>
            solution ? (
              <SolutionCard
                key={solution.key}
                solution={solution}
                setChecked={setChecked}
                checked={commonSolutionKeys.includes(
                  solution.enum as MtoCommonSolutionKey
                )}
              />
            ) : null
          )}

          {/* <Label htmlFor="available-solutions">
            {commonSolutionsConfig.label}
          </Label>

          <HelpText className="margin-top-1">
            {commonSolutionsConfig.sublabel}
          </HelpText> */}

          <MultiSelect
            id="available-solutions"
            inputId="available-solutions"
            ariaLabel="Available solutions"
            options={[]}
            groupedOptions={groupedOptions}
            selectedLabel="Selected solutions"
            initialValues={initialValues}
            name="availableSolutions"
            onChange={values => {
              values.forEach(value => {
                if (isCustomSolution(value)) {
                  setSolutionIDs([...solutionIDs, value]);
                } else {
                  setCommonSolutionKeys([
                    ...commonSolutionKeys,
                    value as MtoCommonSolutionKey
                  ]);
                }
              });
            }}
          />
        </Grid>
      </Grid>
    </GridContainer>
  );
};

export default LinkSolutionForm;
