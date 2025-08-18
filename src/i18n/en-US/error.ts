const error = {
  notFound: {
    heading: 'This page cannot be found.',
    thingsToTry: 'Here is a list of things you could try to check and fix:',
    list: [
      'Please check if the address you typed in is correct.',
      "If you've typed the address correctly, check the spelling.",
      "If you've copied and pasted the address, check that you've copied the entire address."
    ],
    tryAgain:
      'If none of the above have solved the problem, please return to the home page and try again.',
    goHome: 'Go back to the home page',
    modelPlanError: 'The model plan you are looking for does not exist.',
    fetchError:
      'There was an error fetching the requested data. Please try again later.'
  }
};

export default error;
