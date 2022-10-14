const scrollBlackList: string[] = ['read-only'];

const shouldScroll = (path: string) =>
  !scrollBlackList.includes(path.split('/')[3]); // Checking for only first path as possible blacklist, as subsequent paths contain variable ids

export default shouldScroll;
