import React, { Dispatch, SetStateAction, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Label } from '@trussworks/react-uswds';
import {
  GetMtoAllMilestonesQuery,
  GetMtoSolutionQuery
} from 'gql/generated/graphql';

import HelpText from 'components/HelpText';
import UswdsReactLink from 'components/LinkWrapper';
import MultiSelect from 'components/MultiSelect';

import '../../index.scss';

type LinkSolutionFormProps = {
  solution: GetMtoSolutionQuery['mtoSolution'];
  milestoneIDs: string[];
  setMilestoneIDs: Dispatch<SetStateAction<string[]>>;
  allMilestones: GetMtoAllMilestonesQuery['modelPlan']['mtoMatrix'];
};

const LinkMilestoneForm = ({
  solution,
  milestoneIDs,
  setMilestoneIDs,
  allMilestones
}: LinkSolutionFormProps) => {
  const { t: modelToOperationsMiscT } = useTranslation('modelToOperationsMisc');
  const { t: solutionT } = useTranslation('mtoSolution');

  const { modelID = '' } = useParams<{ modelID: string }>();

  // Get all common milestones that have a suggested solution that is the same as the selected solution
  const commonlyUsedMilestones = useMemo(
    () =>
      allMilestones.commonMilestones.filter(
        milestones =>
          !!milestones.commonSolutions.find(sol => sol.key === solution.key)
      ),
    [allMilestones, solution]
  );

  // Get all common milestones that have a suggested solution that is the same as the selected solution
  const commonlyUsedExistingMilestones = useMemo(
    () =>
      allMilestones.milestones.filter(
        milestone =>
          !!commonlyUsedMilestones.some(
            commonMilestone => commonMilestone.key === milestone.key
          )
      ),
    [allMilestones, commonlyUsedMilestones]
  );

  // Gets all the milestones used in this MTO that are not commonly used ^
  const filteredMilestones = useMemo(() => {
    return allMilestones?.milestones.filter(
      milestone =>
        !commonlyUsedExistingMilestones.some(
          commonMilestone => commonMilestone.key === milestone.key
        )
    );
  }, [allMilestones, commonlyUsedExistingMilestones]);

  const groupedOptions = [
    // Milestones have are asscociated with the selected solution
    {
      label: modelToOperationsMiscT('modal.editSolution.customMilestone'),
      options: commonlyUsedExistingMilestones.map(milestone => {
        return {
          label: milestone.name || '',
          value: milestone.id || ''
        };
      })
    },
    // All other milestones
    {
      label: modelToOperationsMiscT('modal.editSolution.otherMilestones'),
      options: filteredMilestones.map(milestone => {
        return {
          label: milestone.name || '',
          value: milestone.id
        };
      })
    }
  ];

  return (
    <div className="padding-8 maxw-tablet">
      <h3 className="margin-bottom-2">
        {modelToOperationsMiscT('modal.editSolution.selectedMilestoneCount', {
          count: milestoneIDs.length
        })}
      </h3>

      <div className="text-base-dark mint-body-normal padding-bottom-4 border-bottom border-base-light">
        <Trans
          i18nKey="modelToOperationsMisc:modal.editSolution.visitMilestoneLibrary"
          components={{
            milestone: (
              <UswdsReactLink
                to={`/models/${modelID}/collaboration-area/model-to-operations/milestone-library`}
                state={{ scroll: true }}
              >
                {' '}
              </UswdsReactLink>
            )
          }}
        />
      </div>

      <Label htmlFor="available-solutions">
        {solutionT('milestones.label')}
      </Label>

      <HelpText className="margin-top-1">
        {modelToOperationsMiscT('modal.editSolution.helpText')}
      </HelpText>

      <MultiSelect
        id="available-milestones"
        inputId="available-milestones"
        ariaLabel={solutionT('milestones.label')}
        options={
          commonlyUsedExistingMilestones.length === 0
            ? groupedOptions[1].options
            : []
        }
        groupedOptions={
          commonlyUsedExistingMilestones.length > 0 ? groupedOptions : undefined
        }
        selectedLabel={solutionT('milestones.multiSelectLabel')}
        initialValues={milestoneIDs}
        name="availableMilestones"
        onChange={values => {
          setMilestoneIDs(values);
        }}
      />
    </div>
  );
};

export default LinkMilestoneForm;
