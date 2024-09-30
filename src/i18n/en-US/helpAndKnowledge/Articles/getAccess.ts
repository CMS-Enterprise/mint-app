const getAccess = {
  heading: 'How to get access to MINT',
  overviewHeading: 'How to get access to MINT',
  title: 'How to get access to MINT',
  description:
    'This guide covers the steps to get access to MINT through Enterprise User Administration (EUA) or Identity Management (IDM).',
  jobcodes: {
    heading: 'Which job code should I request?',
    description:
      'Use this chart to determine what job code to request by selecting the role that aligns most closely with what you do.',
    table: {
      rowHeader: {
        role: 'Your role',
        jobCodeToRequest: 'Job code to request'
      },
      rowOne: {
        role: 'CMS employees',
        jobCodeToRequest: 'MINT_USER in <0>EUA</0>'
      },
      rowTwo: {
        paragraph: 'These contractors <0>with</0> EUA access',
        roles: [
          'Medicare Administrative Contractors',
          'Shared System Maintainers',
          'Medicare Integrated Systems Testers'
        ],
        jobCodeToRequest: 'MINT_CONTRACTOR_FFS in <0>EUA</0>'
      },
      rowThree: {
        paragraph: 'These contractors <0>without</0> EUA access',
        roles: [
          'Medicare Administrative Contractors',
          'Shared System Maintainers',
          'Medicare Integrated Systems Testers'
        ],
        jobCodeToRequest: 'MINT Contractor in <0>IDM</0>'
      },
      rowFour: {
        role:
          'Any other CMS contractors with an approved need for access to MINT',
        jobCodeToRequest: 'MINT_NON_CMS in <0>EUA</0>'
      }
    }
  },
  stepsEUA: {
    heading: 'Requesting access through EUA',
    description:
      'Below is an overview of the process involved in creating your draft model plan.',
    first: {
      heading: 'Sign in to EUA',
      description: 'Visit <0>eua.cms.gov</0> and sign in with your credentials.'
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
          'Type the name of the job code into the search box (either <0>MINT_USER</0>, <0>MINT_CONTRACTOR_FFS</0> or <0>MINT_NON_CMS</0> determined using the chart above) and click the <0>Search</0> button.',
        five:
          'Check the box next to the job code, then click the <0>Select</0> button.',
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
  accessThroughIDM: 'Requesting access through IDM',
  stepsIDM: {
    first: {
      heading: 'Sign in to IDM',
      description: {
        one:
          'If you have access to EUA and are currently signed in, we recommend completing these steps in an incognito browser.',
        two:
          'Visit <0>home.idm.cms.gov</0> and sign in with your credentials. Do not use your PIV card.'
      }
    },
    second: {
      heading: 'Request a role',
      description: {
        one: 'Click the <0>Role Request</0> button.',
        two:
          'The Role Request window will appear with a dropdown to select an application. Select <0>Model Innovation Tool (MINT)</0>.',
        three: 'Then, select the role <0>MINT Contractor</0>.'
      }
    },
    third: {
      heading: 'Remote Identity Proofing (RIDP)',
      description: {
        one:
          'If you have previously requested a role for another application through your IDM account, you may not need to complete this step.',
        two:
          'Review the RIDP terms and conditions, check the “I agree to the terms and conditions” selection box, then click the <0>Next</0> button. The Identity Verification form appears.',
        three:
          'Complete the Identity Verification form and click the <0>Next</0> button. The RIDP proofing questions appear. ',
        four:
          'Answer the proofing questions and click the <0>Verify</0> button. ',
        five:
          'You will see an RIDP success message. Then, click the <0>Continue</0> button. '
      }
    },
    fourth: {
      heading: 'Review request',
      description: {
        one:
          'Review the role request information and enter the reason you need to access MINT.',
        two:
          'Then, click the <0>Submit Role Request</0> button. The Role Request window displays a Request ID and a message which states that the request was successfully submitted to an approver for action.',
        three:
          'The <0>My Requests</0> indicator on the Self Service Dashboard will update to display your current number of pending requests.'
      }
    },
    fifth: {
      heading: 'Role approval',
      description: {
        one:
          'After you submit your role request, the approver is notified. Follow-up emails may send upon approval, rejection, or expiration if no action is taken by an approver.',
        two:
          'If you wish to check the status of your role request, click <0>My Requests</0> on the Self Service Dashboard. All of your open requests will be listed there. You can also see all of your approved roles by clicking on <0>Manage My Roles</0>.'
      }
    },
    sixth: {
      heading: 'Sign in to MINT',
      description:
        'After your role request is approved, you can <0>sign in to MINT</0> using your IDM credentials.'
    }
  },
  questionsHeading: 'Questions or issues?',
  questions:
    'If you encounter issues or have questions about requesting access to MINT, please email <0>MINTTeam@cms.hhs.gov</0> for assistance.',
  accessInfo: 'Don’t have access yet?',
  learnHow: 'Learn how to get access'
};
export default getAccess;
