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
import { helpSolutions } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import {
  GetMtoAllSolutionsQuery,
  GetMtoMilestoneQuery,
  MtoCommonSolutionKey
} from 'gql/generated/graphql';

import HelpText from 'components/HelpText';
import UswdsReactLink from 'components/LinkWrapper';
import MultiSelect from 'components/MultiSelect';

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
  const { t } = useTranslation('modelToOperationsMisc');
  const { t: milestoneT } = useTranslation('mtoMilestone');

  // console.log('commonSolutionKeys', commonSolutionKeys);
  // console.log('solutionIDs', solutionIDs);

  const { modelID } = useParams<{ modelID: string }>();

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

  const isCustomSolution = useCallback(
    (id: string) => {
      return createdSolutions.find(solution => solution.id === id);
    },
    [createdSolutions]
  );

  const isSuggestedSolution = useCallback(
    (key: string) => {
      return mappedSolutionKeys.find(k => k === key);
    },
    [mappedSolutionKeys]
  );

  const [selectedSolutions, setSelectedSolutions] =
    useState<string[]>(initialValues);

  const setChecked = (key: MtoCommonSolutionKey) => {
    if (commonSolutionKeys.includes(key)) {
      setCommonSolutionKeys(commonSolutionKeys.filter(k => k !== key));
    } else {
      setCommonSolutionKeys([...commonSolutionKeys, key]);
    }
  };

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
    <GridContainer className="padding-8">
      <Grid row>
        <Grid col={12}>
          <h3 className="margin-bottom-4">
            {t('modal.editMilestone.selectedSolutionCount', {
              count: selectedSolutionCount
            })}
          </h3>

          <div className="border-bottom-1px border-base-lighter border-top-1px padding-top-4 padding-bottom-2 margin-bottom-4">
            <h4 className="margin-0">
              {t('modal.editMilestone.suggestedSolutions')}
            </h4>

            <p className="margin-top-0 margin-bottom-3 mint-body-normal text-base">
              {t('modal.editMilestone.selectedSolutionsDescription')}
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

          <HelpText className="margin-top-1">
            <Trans
              i18nKey="modelToOperationsMisc:modal.editMilestone.availableSolutionsDescription"
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
          </HelpText>

          <MultiSelect
            id="available-solutions"
            inputId="available-solutions"
            ariaLabel="Available solutions"
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
