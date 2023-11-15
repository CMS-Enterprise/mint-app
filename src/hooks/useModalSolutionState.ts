/*
Hook used to get the state/route of the modal for IT lead solution details
*/

import { useLocation } from 'react-router-dom';

import usePrevLocation from 'hooks/usePrevious';
import { findSolutionByRouteParam } from 'views/HelpAndKnowledge/SolutionsHelp';
import { HelpSolutionType } from 'views/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import useHelpSolution from './useHelpSolutions';

type SolutionModalState = {
  prevPathname: string;
  selectedSolution: HelpSolutionType | undefined;
  renderModal: boolean;
};

const useModalSolutionState = (
  solutionKey: string | null
): SolutionModalState => {
  const location = useLocation();

  const { helpSolutions } = useHelpSolution();

  const params = new URLSearchParams(location.search);
  const solutionDetail = params.get('solution');

  const prevLocation = usePrevLocation(location);
  const prevPathname = prevLocation?.pathname + (prevLocation?.search || '');

  // Solution to render in modal
  const selectedSolution = findSolutionByRouteParam(
    solutionDetail,
    helpSolutions
  );

  const renderModal = selectedSolution?.enum === solutionKey;

  return { prevPathname, selectedSolution, renderModal };
};

export default useModalSolutionState;
