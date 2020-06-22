describe('Note app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Joonas Rautiainen',
      username: 'Croiven',
      password: 'asd123'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login from is shown', function () {
    cy.contains('username')
    cy.contains('password')
  })

  it('user can log in', function () {
    cy.get('#username').type('Croiven')
    cy.get('#password').type('asd123')
    cy.get('#login-button').click()

    cy.contains('Joonas Rautiainen logged in')
  })

  it('login fails with wrong password', function () {
    cy.get('#username').type('Croiven')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()

    cy.get('.error')
      .should('contain', 'wrong username or password')

    cy.get('html').should('not.contain', 'Joonas Rautiainen logged in')
  })

  describe.only('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'Croiven', password: 'asd123' })
    })

    it('a new blog can be created', function () {
      cy.contains('new blog').click()
      cy.get('#title').type('test title')
      cy.get('#author').type('test author')
      cy.get('#url').type('www.google.fi')
      cy.contains('save').click()
      cy.contains('test title')
    })

    describe('and several blogs exist', function () {
      beforeEach(function () {
        cy.createBlog({ title: 'first blog', author: 'first author', url: 'first url' })
        cy.createBlog({ title: 'second blog', author: 'second author', url: 'second url' })
        cy.createBlog({ title: 'third blog', author: 'third author', url: 'third url' })
        cy.createBlog({ title: 'fourth blog', author: 'fourth author', url: 'fourth url' })
        cy.createBlog({ title: 'fifth blog', author: 'fifth author', url: 'fifth url' })

      })

      it('can like', function () {
        cy.contains('second blog').parent().find('#show').click()
        cy.contains('second blog').parent().find('#like').click()
        cy.contains('second blog').parent().find('#likes').should('contain', '1')
      })

      it('can delete', function () {
        cy.contains('third blog').parent().find('#show').click()
        cy.contains('third blog').parent().find('#delete').click()
        cy.get('#all').should('not.contain', 'third author')
      })

      it.only('right order', function () {
        cy.contains('second blog').parent().find('#show').click()
        cy.contains('second blog').parent().find('#like').click()
        cy.contains('second blog').parent().find('#like').click()
        cy.contains('second blog').parent().find('#like').click()

        cy.contains('fourth blog').parent().find('#show').click()
        cy.contains('fourth blog').parent().find('#like').click()
        cy.contains('fourth blog').parent().find('#like').click()
        cy.contains('fourth blog').parent().find('#like').click()
        cy.contains('fourth blog').parent().find('#like').click()

        cy.contains('first blog').parent().find('#show').click()
        cy.contains('first blog').parent().find('#like').click()
        cy.contains('first blog').parent().find('#like').click()

        cy.contains('third blog').parent().find('#show').click()
        cy.contains('third blog').parent().find('#like').click()





        cy.get('.blog').eq(0).should('contain', 'fourth blog')
        cy.get('.blog').eq(1).should('contain', 'second blog')
        cy.get('.blog').eq(2).should('contain', 'first blog')
        cy.get('.blog').eq(3).should('contain', 'third blog')
        cy.get('.blog').eq(4).should('contain', 'fifth blog')

      })


    })

  })

})