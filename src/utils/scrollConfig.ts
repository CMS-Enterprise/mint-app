const scrollBlackList: string[] = [
  'read-only',
  'sample-model-plan',
  '/help-and-knowledge/operational-solutions',
  '?solution=',
  '&solution=',
  '?milestone=',
  '&milestone=',
  '?add-milestone=',
  '&add-milestone=',
  '?edit-milestone=',
  '?view-milestone=',
  '?view-solution=',
  '&view-milestone=',
  '&view-solution=',
  '&scroll-to-bottom',
  '&hide-added-milestones',
  '&type=',
  '&hide-milestones-without-solutions',
  '?hide-milestones-without-solutions=true',
  '&scroll-to-bottom',
  'it-systems-and-solutions?type'
];

const shouldScroll = (path: string, prevPath: string | undefined) => {
  return (
    !scrollBlackList.some(r => path.includes(r)) &&
    !scrollBlackList.some(r => prevPath?.includes(r))
  );
};

export default shouldScroll;
