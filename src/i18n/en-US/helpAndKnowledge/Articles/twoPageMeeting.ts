const twoPageMeeting = {
  title: 'About 2-page concept papers and review meetings',
  lastUpdatedDate: '2026-08-26',
  description:
    'Model teams can use this article to learn more about 2-page concept papers, access helpful resources, and ensure they are fully prepared for the 2-page concept review meeting with CMMI Front Office (FO). Others working with new model teams or interested in the CMMI model development process can use this article and the linked resources to learn more about the 2-page concept paper phase of the process.',
  contentInfo: {
    text: 'Much of the content below is also accessible in the 2-page concept paper template. <el>Download the template from SharePoint</el>',
    link: 'https://cmsgovonline.sharepoint.com/:w:/r/sites/cms-sharepoint-CMMI-Home/New%20Model%20Design%20Templates/2_Pager%20Template_June%202026.docx?d=wac67be0d30d140cc8f3bb57f1de21221&csf=1&web=1&e=yKMhgM'
  },
  summaryBox: {
    title: 'Sections of this article',
    list: [
      'Key resources for model teams writing 2-page concept papers',
      'About 2-page concept papers',
      'Template guidance',
      'Example 2-page concept papers'
    ]
  },
  keyResources: {
    introParagraph:
      'Visit the CMMI SharePoint site to access additional model development resources including those that will help with the creation of 2-page and 6-page concept papers.',
    cardOne: {
      heading: 'Helpful SharePoint links',
      linkOne: {
        text: 'CMMI New Model Design Library',
        link: 'https://cmsgov.slack.com/archives/D031K5C84AD/p1786651669353819?thread_ts=1786651333.913799&cid=D031K5C84AD'
      },
      linkTwo: {
        text: 'New Model Operational Handbook',
        link: 'https://cmsgovonline.sharepoint.com/:w:/r/sites/cms-sharepoint-CMMI-Home/New%20Model%20Design%20Templates/Model_Operational_Playbook_Guide_v3.docx?d=w31e5864cf58244f09186ff42b99f16fd&csf=1&web=1&e=ked219'
      }
    },
    cardTwo: {
      heading: '2-page concept paper template',
      hint: 'Download the template from SharePoint.',
      linkOne: {
        text: 'Go to the template on SharePoint',
        link: 'https://cmsgovonline.sharepoint.com/:w:/r/sites/cms-sharepoint-CMMI-Home/New%20Model%20Design%20Templates/2_Pager%20Template_June%202026.docx?d=wac67be0d30d140cc8f3bb57f1de21221&csf=1&web=1&e=yKMhgM'
      }
    }
  },
  about: {
    introParagraph:
      'The 2-pager is an early concept development and decision-screening tool. It is intended to help teams frame a model idea clearly enough for leadership to assess whether the concept should move forward, be refined, or stop early. Not every element will be fully answerable at this stage. Responses should be directional, concise, and grounded in the best available evidence and operational judgment.',
    note: 'Note: As teams begin drafting a 2-pager, they should consult group leadership and the Front Office early to support alignment and efficient use of staff time and other resources.',
    summarybox: {
      heading: 'General drafting guidance',
      list: [
        'Keep responses high level and strategic; this is not a full design document.',
        'Use plain language and make the causal logic easy to follow.',
        'Be specific where possible, especially on the problem, intervention, target population, expected outcomes, and major risks.',
        'Where details are still under development, identify the core hypothesis or working assumption rather than leaving sections blank.',
        'Draw on relevant internal and external learnings, including prior CMMI models, private-sector approaches, state-based efforts, academic evidence, and stakeholder input.',
        'Keep the answers succinct and within the 2-page limit.'
      ],
      footer:
        'Visit <el>SharePoint</el> for additional guidance and helpful resources such as the 2-page concept paper template.',
      footerLink:
        'https://cmsgovonline.sharepoint.com/:w:/r/sites/cms-sharepoint-CMMI-Home/New%20Model%20Design%20Templates/2_Pager%20Template_June%202026.docx?d=wac67be0d30d140cc8f3bb57f1de21221&csf=1&web=1&e=yKMhgM'
    }
  },
  templateGuidance: {
    accordionItems: {
      modelAim: {
        title: 'Model aim',
        content: {
          intro:
            'This statement should summarize the essence of the model and make clear who is affected, what changes, and over what period.'
        }
      },
      question1: {
        title: 'Question 1: High-level description of model elements',
        content: {
          intro:
            '<italic>What is the most important problem that this model aims to solve?</italic>',
          label: 'What to include:',
          list: [
            'The specific problem, gap, or barrier in care delivery, payment, access, coordination, information, or outcomes.',
            'How the problem affects beneficiaries’ and the healthcare system.',
            'Why this is an important or timely area for CMMI attention.',
            'Any evidence, prior experience, stakeholder input, or market observations that suggest the problem is significant.'
          ],
          summary:
            'What “good” looks like at this stage: <br/> A strong response defines the problem clearly, explains why it matters, and gives enough context for a reviewer to understand why the issue may warrant model development.'
        }
      },
      question2: {
        title:
          'Question 2: What is the intervention and Theory of Action of this model?',
        content: {
          intro:
            '<italic>Use this section to describe the core intervention and how it is expected to produce results.</italic>',
          label: 'What to include:',
          list: [
            'Describe the primary CMS/CMMI intervention by focusing on what CMS is doing differently.',
            'The major model features or design elements.',
            'What behaviors the model is intended to change among participants, providers, plans, or beneficiaries.',
            'How those changes are expected to improve cost, and quality, access, care experience, or other targeted outcomes. Must be broader than just cost and address some area of patient care, quality, outcomes.',
            'What would need to be true for the model to work.'
          ],
          summary:
            'What “good” looks like at this stage: <br/> A strong response makes the causal pathway visible: intervention → behavior change → care delivery or system change → measurable outcomes.'
        }
      },
      question3: {
        title: 'Question 3: What target population will this model serve?',
        content: {
          intro:
            '<italic>Use this section to describe who is intended to benefit from the model.</italic>',
          label: 'What to include:',
          list: [
            'Which Medicare and/or Medicaid beneficiaries are included.',
            'Relevant clinical, demographic, geographic, functional, or other defining characteristics.',
            'Why this population is appropriate for the intervention.',
            'Any unmet needs, access issues, or outcome variations in that make this population a priority.',
            'If known, whether the population appears large and identifiable enough to support future implementation and evaluation (e.g. target population is difficult to identify through claims).'
          ],
          summary:
            'What “good” looks like at this stage: <br/> A strong response makes it easy for a reviewer to understand exactly who the model is meant to serve and why that population is the right focus.'
        }
      },
      question4: {
        title: 'Question 4: Who are the target model participants?',
        content: {
          intro:
            '<italic>Use this section to identify the providers, organizations, plans, states, or other entities that would participate in the model.</italic>',
          label: 'What to include:',
          list: [
            'What types of entities would be eligible to participate.',
            'Why these are the right actors to deliver the intervention.',
            'Is the model mandatory or voluntary.'
          ],
          summary:
            'What “good” looks like at this stage: <br/> A strong response shows that the proposed participants are strategically appropriate and that there is a plausible path to engaging them in the model.'
        }
      },
      question5: {
        title: 'Question 5: What are the proposed cost measures?',
        content: {
          intro:
            '<italic>Use this section to describe the primary effects the model is expected to have.</italic>',
          label: 'What to include:',
          list: [
            'Expected effects on spending often resulting from shifts in utilization.',
            'What measures can be used to demonstrate the impacts of the model in evaluation.',
            'How the expected impacts align with the theory of action.',
            'Are the impacts expected to be direct (within the model) or indirect (spillover/downstream).'
          ],
          summary:
            'What “good” looks like at this stage: <br/> A strong response identifies a small number of meaningful expected impacts on cost and explains why those impacts are plausible given the design.'
        }
      },
      question6: {
        title: 'Question 6: What is the model’s primary quality goals?',
        content: {
          intro:
            '<italic>Use this section to describe the primary quality goals the model is designed to address.</italic>',
          label: 'What to include:',
          list: ['Expected goals.', 'Connection to theory of action.'],
          summary:
            'What “good” looks like at this stage: <br/> A strong response identifies a small number of meaningful expected impacts on cost and explains why those impacts are plausible given the design.'
        }
      },
      question7: {
        title:
          'Question 7: What are the potential risks that may prevent achieving the model’s cost or quality goals? Any other areas of consideration?',
        content: {
          intro:
            '<italic>Use this section to identify what could create catastrophic failures (e.g. enrollment/attribution risk or caregiver burden management risk). Other risks will be articulated in later stage development.</italic>',
          label: 'What to include:',
          list: [
            'Risks to beneficiary access and quality of care.',
            'Major implementation risks.',
            'Participation or market risks.',
            'Technology, data, legal, operational, or clearance risks.',
            'Evaluation-related risks, such as sample size, bias, timing, or data limitations.',
            'External factors beyond CMMI’s control that could influence success or failure.',
            'Any early mitigation strategies or issues that require further analysis.'
          ],
          summary:
            'What “good” looks like at this stage: <br/> A strong response clearly and candidly identifies major vulnerabilities and risks and demonstrates a clear understanding of what remains unresolved and needs further work.'
        }
      }
    }
  },
  examplePapers: {
    introParagraph:
      'While all models are different, and therefore the content within a 2-page concept paper may vary drastically, it could be helpful for model teams or other interested parties to see examples of what previous model teams have put together in the past.',
    exampleList: [
      {
        copy: 'ACCESS 2-page concept paper and documents',
        href: 'https://mint.cms.gov/models/4b7460d3-4bd1-4708-b749-13602a717519/read-view/documents'
      },
      {
        copy: 'PACE UP! 2-page concept paper and documents',
        href: 'https://mint.cms.gov/models/114219ed-9e83-46f4-8039-c2d46812ccd8/read-view/documents'
      }
    ]
  },
  footerSummaryBox: {
    title: 'Need help?',
    body: 'Contact the MINT team at <1>MINTTeam@cms.hhs.gov</1>'
  }
};

export default twoPageMeeting;
