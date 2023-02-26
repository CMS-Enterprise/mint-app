const scrollBlackList: string[] = [
  'read-only',
  'sample-model-plan',
  '?page=',
  '/help-and-knowledge/operational-solutions'
];

const shouldScroll = (path: string) =>
  !scrollBlackList.some(r => path.includes(r));

export default shouldScroll;
