import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Grid, GridContainer, Label, Link } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { helpSolutions } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import {
  GetMtoAllSolutionsQuery,
  GetMtoMilestoneQuery,
  MtoCommonSolutionKey
} from 'gql/generated/graphql';

import HelpText from 'components/HelpText';
import UswdsReactLink from 'components/LinkWrapper';
import MultiSelect from 'components/MultiSelect';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';

import { SolutionCard } from '../SolutionCard';

import '../../index.scss';

type LinkSolutionFormProps = {
  milestone: GetMtoMilestoneQuery['mtoMilestone'];
  commonSolutionKeys: MtoCommonSolutionKey[];
  setCommonSolutionKeys: Dispatch<SetStateAction<MtoCommonSolutionKey[]>>;
  solutionIDs: string[];
  setSolutionIDs: Dispatch<SetStateAction<string[]>>;
  allSolutions: GetMtoAllSolutionsQuery['modelPlan']['mtoMatrix'];
};

const LinkSolutionForm = ({
  milestone,
  commonSolutionKeys,
  setCommonSolutionKeys,
  solutionIDs,
  setSolutionIDs,
  allSolutions
}: LinkSolutionFormProps) => {
  const { t: modelToOperationsMiscT } = useTranslation('modelToOperationsMisc');
  const { t: milestoneT } = useTranslation('mtoMilestone');

  const { modelID } = useParams<{ modelID: string }>();

  const isTablet = useCheckResponsiveScreen('tablet', 'smaller');

  // Map the common solutions to the FE help solutions
  const mappedSolutions = useMemo(
    () =>
      milestone.commonMilestone?.commonSolutions.map(solution => {
        return helpSolutions.find(s => s.enum === solution.key);
      }) || [],
    [milestone.commonMilestone]
  );

  const mappedSolutionKeys = mappedSolutions.map(solution => solution?.enum);

  const commonSolutions =
    allSolutions?.commonSolutions.filter(
      solution => !mappedSolutionKeys.includes(solution.key)
    ) || [];

  const createdSolutions = useMemo(
    () => allSolutions?.solutions?.filter(solution => !solution.key) || [],
    [allSolutions?.solutions]
  );

  const groupedOptions = [
    {
      label: modelToOperationsMiscT('modal.editMilestone.customSolution'),
      options: createdSolutions.map(solution => {
        return {
          label: solution.name || '',
          value: solution.id
        };
      })
    },
    {
      label: modelToOperationsMiscT('modal.editMilestone.otherSolutions'),
      options: commonSolutions.map(solution => {
        return {
          label: solution.name || '',
          value: solution.key
        };
      })
    }
  ];

  // Initial values for multiselect form component
  const initialValues = [...commonSolutionKeys, ...solutionIDs];

  // Checks to see if a solution is a custom solution by its ID
  const isCustomSolution = useCallback(
    (id: string) => {
      return createdSolutions.find(solution => solution.id === id);
    },
    [createdSolutions]
  );

  // Checks if the solution should be rendered in the SolutionCard component
  const isSuggestedSolution = useCallback(
    (key: string) => {
      return mappedSolutionKeys.find(k => k === key);
    },
    [mappedSolutionKeys]
  );

  const [selectedSolutions, setSelectedSolutions] =
    useState<string[]>(initialValues);

  // onChange handler for the SolutionCard component
  const setChecked = (key: MtoCommonSolutionKey) => {
    if (commonSolutionKeys.includes(key)) {
      setCommonSolutionKeys(commonSolutionKeys.filter(k => k !== key));
    } else {
      setCommonSolutionKeys([...commonSolutionKeys, key]);
    }
  };

  // Sets the solution IDs and common solution keys when the selectedSolutions state changes
  useEffect(() => {
    const custom: string[] = [];
    const common: MtoCommonSolutionKey[] = [];

    selectedSolutions.forEach(solution => {
      if (isCustomSolution(solution)) {
        custom.push(solution);
      } else if (!isSuggestedSolution(solution)) {
        common.push(solution as MtoCommonSolutionKey);
      }
    });

    const suggestedSolutions = mappedSolutions
      .filter(s => commonSolutionKeys.includes(s?.enum as MtoCommonSolutionKey))
      .map(s => s?.enum) as MtoCommonSolutionKey[];

    setSolutionIDs(custom);
    setCommonSolutionKeys([
      ...(common as unknown as MtoCommonSolutionKey[]),
      ...suggestedSolutions
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedSolutions,
    isCustomSolution,
    setCommonSolutionKeys,
    setSolutionIDs,
    mappedSolutions
  ]);

  const selectedSolutionCount: number =
    commonSolutionKeys.length + solutionIDs.length;

  return (
    <GridContainer
      className={classNames({
        'padding-8': !isTablet,
        'padding-4': isTablet
      })}
    >
      <Grid row>
        <Grid col={10}>
          <h3 className="margin-bottom-2">
            {modelToOperationsMiscT(
              'modal.editMilestone.selectedSolutionCount',
              {
                count: selectedSolutionCount
              }
            )}
          </h3>

          <div className="text-base-dark mint-body-normal margin-bottom-4">
            <Trans
              i18nKey="modelToOperationsMisc:modal.editMilestone.visitSolutionLibrary"
              components={{
                solution: (
                  <UswdsReactLink
                    to={`/models/${modelID}/collaboration-area/model-to-operations/solution-library`}
                  >
                    {' '}
                  </UswdsReactLink>
                ),
                help: (
                  <Link
                    href="/help-and-knowledge/operational-solutions"
                    target="_blank"
                    variant="external"
                  >
                    {' '}
                  </Link>
                )
              }}
            />
          </div>

          <div className="border-bottom-1px border-base-lighter border-top-1px padding-top-4 padding-bottom-2 margin-bottom-4">
            <h4 className="margin-0">
              {modelToOperationsMiscT('modal.editMilestone.suggestedSolutions')}
            </h4>

            <p className="margin-top-0 margin-bottom-3 mint-body-normal text-base">
              {modelToOperationsMiscT(
                'modal.editMilestone.selectedSolutionsDescription'
              )}
            </p>

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
          </div>

          <Label htmlFor="available-solutions">
            {milestoneT('solutions.label')}
          </Label>

          <HelpText className="margin-top-1 text-base-dark mint-body-normal">
            {modelToOperationsMiscT(
              'modal.editMilestone.availableSolutionsDescription'
            )}
          </HelpText>

          <MultiSelect
            id="available-solutions"
            inputId="available-solutions"
            ariaLabel={milestoneT('solutions.label')}
            options={[]}
            groupedOptions={groupedOptions}
            selectedLabel="Selected solutions"
            initialValues={selectedSolutions}
            name="availableSolutions"
            onChange={values => {
              setSelectedSolutions(values);
            }}
          />
        </Grid>
      </Grid>
    </GridContainer>
  );
};

export default LinkSolutionForm;
