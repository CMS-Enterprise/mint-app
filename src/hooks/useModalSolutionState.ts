/*
Hook used to get the state/route of the modal for IT lead solution details
*/

import { useLocation } from 'react-router-dom';
import { findSolutionByRouteParam } from 'features/HelpAndKnowledge/SolutionsHelp';
import { HelpSolutionType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import { MtoCommonSolutionKey } from 'gql/generated/graphql';

import usePrevLocation from 'hooks/usePrevious';

import useHelpSolution from './useHelpSolutions';

type SolutionModalState = {
  prevPathname: string;
  selectedSolution: HelpSolutionType | undefined;
  renderModal: boolean;
  loading: boolean;
};

export const findSolutionByKey = (
  key: MtoCommonSolutionKey | null,
  solutions: HelpSolutionType[]
): HelpSolutionType | undefined => {
  if (!key) return undefined;
  return [...solutions].find(solution => solution.key === key);
};

const useModalSolutionState = (
  solutionKey?: MtoCommonSolutionKey
): SolutionModalState => {
  const location = useLocation();

  const { helpSolutions, loading } = useHelpSolution();

  const params = new URLSearchParams(location.search);
  const solutionDetail = params.get('solution');
  const solutionDetailModal = params.get('solution-key');

  const prevLocation = usePrevLocation(location);
  const prevPathname = prevLocation?.pathname + (prevLocation?.search || '');

  // Solution to render in modal
  const selectedSolution = findSolutionByRouteParam(
    solutionDetail || solutionDetailModal,
    helpSolutions,
    !!solutionDetailModal
  );

  const solutionMap = findSolutionByKey(
    solutionKey as MtoCommonSolutionKey | null,
    helpSolutions
  );

  const renderModal = solutionMap?.key === solutionKey;

  return { prevPathname, selectedSolution, renderModal, loading };
};

export default useModalSolutionState;
