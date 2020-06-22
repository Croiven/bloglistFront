import React, { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }



  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      show: true
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')

  }

  return (
    <div className="formDiv">


      <h2>create new</h2>

      <form onSubmit={addBlog}>
        <label>
          Title:
          <input
            id='title'
            value={newTitle}
            onChange={handleTitleChange}
          />
        </label>
        <br />
        <label>
          Author:
          <input
            id='author'
            value={newAuthor}
            onChange={handleAuthorChange}
          />
        </label>
        <br />
        <label>
          Url:
          <input
            id='url'
            value={newUrl}
            onChange={handleUrlChange}
          />
        </label>
        <br />
        <button type="submit">save</button>
      </form>


    </div>
  )




}

export default BlogForm