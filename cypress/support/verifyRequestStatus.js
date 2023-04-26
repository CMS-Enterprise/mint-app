// Verifies each status code of an array of intercepts

const verifyStatus = interceptions => {
  interceptions.forEach(interception => {
    cy.wrap(interception.response.statusCode).should('eq', 200);
  });
};

export default verifyStatus;
