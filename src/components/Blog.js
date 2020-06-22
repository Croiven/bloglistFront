import React from 'react'
import PropTypes from 'prop-types'



const Blog = ({ blog, toggleShow, like, deleteBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }



  return (
    <div id='blog' className='blog' style={blogStyle}>
      {blog.show ? (
        <div>
          <div>title: {blog.title}
            <button onClick={toggleShow} >hide</button></div>
          <div>url: {blog.url}</div>
          <div id='likes'>likes: {blog.likes}
            <button id='like' onClick={like}>like</button></div>
          <div>author: {blog.author}</div>
          <div><button id='delete' onClick={deleteBlog}>Delete</button></div>
        </div>
      ) : (<div>
        {blog.title} {blog.author}
        <button id='show' onClick={toggleShow} >show</button>
      </div>
      )}
    </div>
  )




}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  toggleShow: PropTypes.func.isRequired,
  like: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired
}


export default Blog
