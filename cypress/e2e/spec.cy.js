describe('Login Page', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000/kaispe/login')
  })

  it('check that the Sign in text is render', () => {
    cy.visit('http://localhost:3000/kaispe/login')
    cy.get('[data-cy=counter]').should('have.text', 'Sign In')
  })

  it('check that the email and password is present in the login page', () => {
    cy.visit('http://localhost:3000/kaispe/login')
    cy.get('[data-cy=email-input]').should('be.visible')
    cy.get('[data-cy=password-input]').should('be.visible')
  })

  it('should show validation error when all field is blank', () => {
    cy.visit('http://localhost:3000/kaispe/login')
    cy.get('[data-cy=login-button]').click()
    cy.get('[data-cy=email-error]').should('exist')
    cy.get('[data-cy=password-error]').should('exist')
  })

  it('redirect to the success page when submit the admin credential ', () => {
    cy.visit('http://localhost:3000/kaispe/login')
    cy.get('[data-cy=email-input]').type('admin@kaispe.com')
    cy.get('[data-cy=password-input]').type('pass123')
    cy.get('[data-cy=login-button]').click()
     cy.url().should('include', '/admin-panel');
  })

  
  it('redirect to the success page when submit the user credential ', () => {
    cy.visit('http://localhost:3000/kaispe/login')
    cy.get('[data-cy=email-input]').type('user@kaispe.com')
    cy.get('[data-cy=password-input]').type('pass123')
    cy.get('[data-cy=login-button]').click()
     cy.url().should('include', '/quotation');
  })

})