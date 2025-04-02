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
import {
  GetMtoAllMilestonesQuery,
  GetMtoSolutionQuery,
  MtoCommonMilestoneKey,
  MtoMilestoneStatus,
  MtoRiskIndicator,
  useGetMtoAllMilestonesQuery
} from 'gql/generated/graphql';

import HelpText from 'components/HelpText';
import UswdsReactLink from 'components/LinkWrapper';
import MultiSelect from 'components/MultiSelect';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';

// import '../../index.scss';

type MTOCommonMilestone =
  GetMtoAllMilestonesQuery['modelPlan']['mtoMatrix']['commonMilestones'][0];

type LinkSolutionFormProps = {
  solution: GetMtoSolutionQuery['mtoSolution'];
  commonMilestoneKeys: MtoCommonMilestoneKey[];
  setCommonMilestoneKeys: Dispatch<SetStateAction<MtoCommonMilestoneKey[]>>;
  milestoneIDs: string[];
  setMilestoneIDs: Dispatch<SetStateAction<string[]>>;
  allMilestones: GetMtoAllMilestonesQuery['modelPlan']['mtoMatrix'];
};

const LinkMilestoneForm = ({
  solution,
  commonMilestoneKeys,
  setCommonMilestoneKeys,
  milestoneIDs,
  setMilestoneIDs,
  allMilestones
}: LinkSolutionFormProps) => {
  const { t: modelToOperationsMiscT } = useTranslation('modelToOperationsMisc');
  const { t: milestoneT } = useTranslation('mtoMilestone');

  const { modelID } = useParams<{ modelID: string }>();

  const isTablet = useCheckResponsiveScreen('tablet', 'smaller');

  // const { data, loading } = useGetMtoAllMilestonesQuery({
  //   variables: {
  //     id: modelID
  //   }
  // });

  const { commonlyUsedMilestones, allCommonMTOMilestones } = useMemo(() => {
    return (
      allMilestones.commonMilestones.reduce(
        (acc, commonMilestone) => {
          const usedMilestone = commonMilestone.commonSolutions.find(
            sol => sol.key === solution.key
          );

          if (usedMilestone) {
            acc.commonlyUsedMilestones.push(commonMilestone);
          } else {
            acc.allCommonMTOMilestones.push(commonMilestone);
          }
          return acc;
        },
        { commonlyUsedMilestones: [], allCommonMTOMilestones: [] } as {
          commonlyUsedMilestones: MTOCommonMilestone[];
          allCommonMTOMilestones: MTOCommonMilestone[];
        }
      ) || { commonlyUsedMilestones: [], allCommonMTOMilestones: [] }
    );
  }, [allMilestones, solution]);

  const allMTOMilestones = useMemo(
    () =>
      (allMilestones?.milestones || []).concat(allCommonMTOMilestones as any[]),
    [allMilestones, allCommonMTOMilestones]
  );

  const groupedOptions = [
    {
      label: modelToOperationsMiscT('modal.editMilestone.customSolution'),
      options: commonlyUsedMilestones.map(milestone => {
        return {
          label: milestone.name || '',
          value: milestone.key
        };
      })
    },
    {
      label: modelToOperationsMiscT('modal.editMilestone.otherSolutions'),
      options: (allMilestones?.milestones || []).map(milestone => {
        return {
          label: milestone.name || '',
          value: milestone.key || milestone.id
        };
      })
    }
  ];

  const createdMilestones = useMemo(
    () =>
      solution.milestones?.filter(milestone => !milestone.commonMilestone) ||
      [],
    [solution]
  );

  // Initial values for multiselect form component
  const initialValues = [...commonMilestoneKeys, ...milestoneIDs];

  // Checks to see if a milestone is a custom solution by its ID
  const isCustomMilestone = useCallback(
    (id: string) => {
      return createdMilestones.find(milestone => milestone.id === id);
    },
    [createdMilestones]
  );

  const [selectedMilestones, setSelectedMilestones] =
    useState<string[]>(initialValues);

  //   // Sets the solution IDs and common solution keys when the selectedMilestones state changes
  //   useEffect(() => {
  //     const custom: string[] = [];
  //     const common: MtoCommonSolutionKey[] = [];

  //     selectedMilestones.forEach(solution => {
  //       if (isCustomSolution(solution)) {
  //         custom.push(solution);
  //       } else if (!isSuggestedSolution(solution)) {
  //         common.push(solution as MtoCommonSolutionKey);
  //       }
  //     });

  //     const suggestedSolutions = mappedMilestones
  //       .filter(s =>
  //         commonMilestoneKeys.includes(s?.enum as MtoCommonSolutionKey)
  //       )
  //       .map(s => s?.enum) as MtoCommonSolutionKey[];

  //     setMilestoneIDs(custom);
  //     setCommonMilestoneKeys([
  //       ...(common as unknown as MtoCommonSolutionKey[]),
  //       ...suggestedSolutions
  //     ]);
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [
  //     selectedMilestones,
  //     isCustomSolution,
  //     setCommonMilestoneKeys,
  //     setMilestoneIDs,
  //     mappedMilestones
  //   ]);

  const selectedMilestoneCount: number =
    commonMilestoneKeys.length + milestoneIDs.length;

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
              'modal.editMilestone.selectedMilestoneCount',
              {
                count: selectedMilestoneCount
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
            initialValues={selectedMilestones}
            name="availableSolutions"
            onChange={values => {
              setSelectedMilestones(values);
            }}
          />
        </Grid>
      </Grid>
    </GridContainer>
  );
};

export default LinkMilestoneForm;
