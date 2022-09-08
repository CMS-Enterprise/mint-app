Cypress.Commands.add('clickOutside', () => {
  return cy.get('body').click(0, 0); // 0,0 here are the x and y coordinates
});
