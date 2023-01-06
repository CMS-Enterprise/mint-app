const scrollBlackList: string[] = ['read-only', 'sample-model-plan'];

const shouldScroll = (path: string) =>
  !scrollBlackList.some(r => path.split('/').includes(r));

export default shouldScroll;
