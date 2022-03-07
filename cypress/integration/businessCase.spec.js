describe('The Business Case Form', () => {
  beforeEach(() => {
    cy.localLogin({name: 'TEST'});
  });

  it('fills out all business case fields', () => {
    cy.visit('/');
    cy.contains('a', 'Easy Access to System Information').click();
    cy.contains('h1', 'Get governance approval');

    cy.get('[data-testid="start-biz-case-btn"]').click();

    // General Request Information
    // Autofilled Fields from System Intake
    cy.get('#BusinessCase-RequestName').should(
      'have.value',
      'Easy Access to System Information'
    );

    cy.get('#BusinessCase-RequesterName').should(
      'have.value',
      'John Requester'
    );

    cy.get('#BusinessCase-BusinessOwnerName').should(
      'have.value',
      'John BusinessOwner'
    );

    cy.get('#BusinessCase-RequesterPhoneNumber')
      .type('1234567890')
      .should('have.value', '1234567890');

    cy.contains('button', 'Next').click();

    // Request Description
    // Autofilled Field from System Intake
    cy.get('#BusinessCase-BusinessNeed').should(
      'have.value',
      'Business Need: The quick brown fox jumps over the lazy dog.'
    );

    cy.get('#BusinessCase-CmsBenefit')
      .type('CMS Benefit: The quick brown fox jumps over the lazy dog.')
      .should(
        'have.value',
        'CMS Benefit: The quick brown fox jumps over the lazy dog.'
      );

    cy.get('#BusinessCase-PriorityAlignment')
      .type('Priority Alignment: The quick brown fox jumps over the lazy dog.')
      .should(
        'have.value',
        'Priority Alignment: The quick brown fox jumps over the lazy dog.'
      );

    cy.get('#BusinessCase-SuccessIndicators')
      .type('Success Indicators: The quick brown fox jumps over the lazy dog.')
      .should(
        'have.value',
        'Success Indicators: The quick brown fox jumps over the lazy dog.'
      );

    cy.contains('button', 'Next').click();

    cy.businessCase.asIsSolution.fillNonBranchingFields();

    cy.contains('button', 'Next').click();

    cy.businessCase.preferredSolution.fillAllFields();

    cy.contains('button', 'Next').click();

    cy.businessCase.alternativeASolution.fillAllFields();

    cy.contains('button', 'Next').click();

    cy.get('h1').contains('Check your answers before sending');
    cy.window()
      .its('store')
      .invoke('getState')
      .its('businessCase')
      .its('form')
      .should('deep.include', {
        requestName: 'Easy Access to System Information',
        requester: {
          name: 'John Requester',
          phoneNumber: '1234567890'
        },
        businessOwner: {
          name: 'John BusinessOwner'
        },
        businessNeed:
          'Business Need: The quick brown fox jumps over the lazy dog.',
        cmsBenefit: 'CMS Benefit: The quick brown fox jumps over the lazy dog.',
        priorityAlignment:
          'Priority Alignment: The quick brown fox jumps over the lazy dog.',
        successIndicators:
          'Success Indicators: The quick brown fox jumps over the lazy dog.',
        asIsSolution: {
          title: 'Test As is Solution',
          summary: 'As is Solution Summary',
          pros: 'As is Solution Pros',
          cons: 'As is Solution Cons',
          estimatedLifecycleCost: {
            year1: {
              development: {
                isPresent: true,
                cost: '1'
              },
              operationsMaintenance: {
                isPresent: true,
                cost: '5'
              },
              other: {
                isPresent: false,
                cost: ''
              }
            },
            year2: {
              development: {
                isPresent: false,
                cost: ''
              },
              operationsMaintenance: {
                isPresent: true,
                cost: '5'
              },
              other: {
                isPresent: false,
                cost: ''
              }
            },
            year3: {
              development: {
                isPresent: false,
                cost: ''
              },
              operationsMaintenance: {
                isPresent: false,
                cost: ''
              },
              other: {
                isPresent: true,
                cost: '10'
              }
            },
            year4: {
              development: {
                isPresent: true,
                cost: '15'
              },
              operationsMaintenance: {
                isPresent: false,
                cost: ''
              },
              other: {
                isPresent: false,
                cost: ''
              }
            },
            year5: {
              development: {
                isPresent: false,
                cost: ''
              },
              operationsMaintenance: {
                isPresent: false,
                cost: ''
              },
              other: {
                isPresent: true,
                cost: '15'
              }
            }
          },
          costSavings: 'As is Solution Cost Savings'
        },
        preferredSolution: {
          title: 'Preferred Solution Title',
          summary: 'Preferred Solution Summary',
          acquisitionApproach: 'Preferred Solution Acquisition approach',
          security: {
            isApproved: false,
            isBeingReviewed: 'YES'
          },
          hosting: {
            cloudServiceType: 'Saas',
            location: 'AWS',
            type: 'cloud'
          },
          hasUserInterface: 'YES',
          pros: 'Preferred Solution Pros',
          cons: 'Preferred Solution Cons',
          estimatedLifecycleCost: {
            year1: {
              development: {
                isPresent: false,
                cost: ''
              },
              operationsMaintenance: {
                isPresent: true,
                cost: '5'
              },
              other: {
                isPresent: false,
                cost: ''
              }
            },
            year2: {
              development: {
                isPresent: true,
                cost: '10'
              },
              operationsMaintenance: {
                isPresent: false,
                cost: ''
              },
              other: {
                isPresent: false,
                cost: ''
              }
            },
            year3: {
              development: {
                isPresent: false,
                cost: ''
              },
              operationsMaintenance: {
                isPresent: false,
                cost: ''
              },
              other: {
                isPresent: true,
                cost: '15'
              }
            },
            year4: {
              development: {
                isPresent: false,
                cost: ''
              },
              operationsMaintenance: {
                isPresent: true,
                cost: '20'
              },
              other: {
                isPresent: false,
                cost: ''
              }
            },
            year5: {
              development: {
                isPresent: true,
                cost: '25'
              },
              operationsMaintenance: {
                isPresent: false,
                cost: ''
              },
              other: {
                isPresent: false,
                cost: ''
              }
            }
          },
          costSavings: '0'
        },
        alternativeA: {
          title: 'Alternative A Title',
          summary: 'Alternative A Summary',
          acquisitionApproach: 'Alternative A AcquisitionApproach',
          security: {
            isApproved: false,
            isBeingReviewed: 'YES'
          },
          hosting: {
            cloudServiceType: 'Saas',
            location: 'AWS',
            type: 'cloud'
          },
          hasUserInterface: 'YES',
          pros: 'Alternative A Pros',
          cons: 'Alternative A Cons',
          estimatedLifecycleCost: {
            year1: {
              development: {
                isPresent: true,
                cost: '2'
              },
              operationsMaintenance: {
                isPresent: false,
                cost: ''
              },
              other: {
                isPresent: true,
                cost: '4'
              }
            },
            year2: {
              development: {
                isPresent: false,
                cost: ''
              },
              operationsMaintenance: {
                isPresent: true,
                cost: '6'
              },
              other: {
                isPresent: false,
                cost: ''
              }
            },
            year3: {
              development: {
                isPresent: false,
                cost: ''
              },
              operationsMaintenance: {
                isPresent: false,
                cost: ''
              },
              other: {
                isPresent: true,
                cost: '8'
              }
            },
            year4: {
              development: {
                isPresent: false,
                cost: ''
              },
              operationsMaintenance: {
                isPresent: true,
                cost: '10'
              },
              other: {
                isPresent: false,
                cost: ''
              }
            },
            year5: {
              development: {
                isPresent: true,
                cost: '12'
              },
              operationsMaintenance: {
                isPresent: false,
                cost: ''
              },
              other: {
                isPresent: false,
                cost: ''
              }
            }
          },
          costSavings: 'Alternative A Cost Savings'
        }
      });
  });
});
