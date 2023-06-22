const getAccess = {
  heading: 'How to get access to MINT',
  overviewHeading: 'How to get access to MINT',
  title: 'How to get access to MINT',
  description:
    'This guide covers the steps to get access to MINT through Enterprise User Administration (EUA) or Identity Management (IDM).',
  summaryBox: {
    copy: 'Should I request access through EUA or IDM?',
    listItem: {
      employees: 'CMS employees should request access through EUA.',
      contractors:
        'CMS contractors with an approved need for access to MINT, Medicare Administrative Contractors, Shared System Maintainers, and Medicare Integrated Systems Testers should request access through IDM.'
    }
  },
  steps: {
    heading: 'Access through EUA',
    description:
      'Below is an overview of the process involved in creating your draft model plan.',
    first: {
      heading: 'Sign in to EUA',
      description: {
        one: 'Visit ',
        two: ' and sign in with your credentials.'
      }
    },
    second: {
      heading: 'Request a job code',
      description: {
        one:
          'Click <0>Modify My Job Codes</0> in the Tasks menu on the left side of the screen.',
        two:
          'Read and confirm the process of modifying job codes. Then, click the <0>Next</0> button.',
        three:
          'You’ll see a screen with all of your active job codes. Below the list, click the <0>Add a Job Code</0> button.',
        four:
          'Type <0>MINT_USER</0> into the search box and click the <0>Search</0> button.',
        five:
          'Check the box next to MINT_USER, then click the <0>Select</0> button.',
        six:
          'Enter a justification reason, then click the <0>Finish</0> button.'
      }
    },
    third: {
      heading: 'Job code approval',
      description:
        'Once you’ve submitted your job code request, you’ll receive an email with the status. Your request must be approved by your supervisor and the MINT Team. You’ll receive email updates during that process.'
    },
    fourth: {
      heading: 'Sign in to MINT',
      description:
        'After you’ve received an email that your job code request is approved, you can <0>sign in to MINT</0> using your EUA credentials (this is your four-character user ID and password).'
    }
  },
  accessThroughIDM: 'Access through IDM',
  accessInfo1:
    'If you’re a contractor and don’t have an IDM account or your current IDM account uses your EUA credentials (your four-character user ID and password), you must create a new one.',
  accessInfo2: 'Visit ',
  accessInfo3:
    ' and click <0>New User Registration</0> to create an account. We recommend using an email address for your new user ID, so it’s easy to remember.',
  questionsHeading: 'Questions or issues?',
  questions:
    'If you encounter issues or have questions about requesting access to MINT, please email <0>MINTTeam@cms.hhs.gov</0> for assistance.'
};
export default getAccess;
