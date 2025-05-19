const scrollBypass: string[] = [
  'read-only',
  'sample-model-plan',
  '/help-and-knowledge/operational-solutions',
  '?solution=',
  '&solution=',
  '&scroll-to-bottom',
  '/collaboration-area/model-to-operations'
];

const shouldScroll = (path: string, prevPath: string | undefined) => {
  return (
    !scrollBypass.some(r => path.includes(r)) &&
    !scrollBypass.some(r => prevPath?.includes(r))
  );
};

export default shouldScroll;
