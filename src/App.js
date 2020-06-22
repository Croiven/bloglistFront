import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import './index.css'



const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [className, setClassName] = useState('message')
  const [user, setUser] = useState(null)
  const blogFormRef = React.createRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )

  }, [])


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])





  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      console.log('moi')
      setUsername('')
      setPassword('')
    } catch (exception) {
      setClassName('error')
      setMessage('wrong username or password')

      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setClassName('message')
        setMessage(`new blog ${returnedBlog.title} by ${returnedBlog.author} added`)


        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
  }

  const deleteBlog = id => {
    const blog = blogs.find(n => n.id === id)
    console.log(blog.title)

    if (window.confirm(`Delete ${blog.title}? `)) {
      setClassName('message')

      blogService
        .deleteObject(id)
        .then(setBlogs(blogs.filter(n => n.id !== id)))
        .then(setMessage(
          `deleted ${blog.title}`
        ))
        // eslint-disable-next-line no-unused-vars
        .catch(error => {
          setClassName('error')
          setMessage(`Information of ${blog.title} has already been removed from server`)
          setBlogs(blogs.filter(n => n.id !== id))

        })

      setTimeout(() => {
        setMessage(null)
      }, 5000)

    }
  }


  const toggleShowOf = (id) => {
    const blog = blogs.find(n => n.id === id)
    const changedBlog = { ...blog, show: !blog.show }

    blogService
      .update(id, changedBlog)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
      })
      // eslint-disable-next-line no-unused-vars
      .catch(error => {
        setClassName('error')
        setMessage(
          `Note '${blog.title}' was already removed from server`
        )
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
  }

  const likeOf = (id) => {
    const blog = blogs.find(n => n.id === id)
    const changedBlog = { ...blog, likes: blog.likes + 1 }

    blogService
      .update(id, changedBlog)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
      })
      // eslint-disable-next-line no-unused-vars
      .catch(error => {
        setClassName('message')
        setMessage(
          `Liked ${blog.title}`
        )
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
  }



  const loginForm = () => (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            id='username'
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            id='password'
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id="login-button" type="submit">login</button>
      </form>
    </div>
  )

  const blogForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const handleLogout = () => {
    window.localStorage.clear()
    window.location.reload(true)
  }


  blogs.sort((a, b) => (a.likes <= b.likes) ? 1 : -1)

  return (
    <div id='all'>
      <Notification message={message} className={className} />
      {user === null ?
        loginForm() :
        <div>
          {user.name} logged in
          <button onClick={handleLogout}>Logout</button>
          {blogForm()}
        </div>
      }

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog}
          toggleShow={() => toggleShowOf(blog.id)}
          like={() => likeOf(blog.id)}
          deleteBlog={() => deleteBlog(blog.id)}
        />
      )}
    </div>

  )
}

export default App