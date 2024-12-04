/*
Hook used to get the state/route of the modal for IT lead solution details
*/

import { useLocation } from 'react-router-dom';
import { findSolutionByRouteParam } from 'features/HelpAndKnowledge/SolutionsHelp';
import { HelpSolutionType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import { findSolutionByKey } from 'features/ModelPlan/TaskList/ITSolutions/_components/CheckboxCard';
import {
  MtoCommonSolutionKey,
  OperationalSolutionKey
} from 'gql/generated/graphql';

import usePrevLocation from 'hooks/usePrevious';

import useHelpSolution from './useHelpSolutions';

type SolutionModalState = {
  prevPathname: string;
  selectedSolution: HelpSolutionType | undefined;
  renderModal: boolean;
  loading: boolean;
};

const useModalSolutionState = (
  solutionKey?: OperationalSolutionKey | MtoCommonSolutionKey
): SolutionModalState => {
  const location = useLocation();

  const { helpSolutions, loading } = useHelpSolution();

  const params = new URLSearchParams(location.search);
  const solutionDetail = params.get('solution');

  const prevLocation = usePrevLocation(location);
  const prevPathname = prevLocation?.pathname + (prevLocation?.search || '');

  // Solution to render in modal
  const selectedSolution = findSolutionByRouteParam(
    solutionDetail,
    helpSolutions
  );

  const solutionMap = findSolutionByKey(
    solutionKey as OperationalSolutionKey | null,
    helpSolutions
  );

  const renderModal = solutionMap?.enum === solutionKey;

  return { prevPathname, selectedSolution, renderModal, loading };
};

export default useModalSolutionState;
