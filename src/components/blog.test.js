import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import Blog from './blog'

test('renders content', () => {
  const blog = {
    title: 'test123',
    author: 'testiukko',
    url: 'testurl',
    show: false,
    likes: 0
  }

  const component = render(
    <Blog blog={blog} />
  )

  expect(component.container).not.toHaveTextContent(
    '0'
  )

  expect(component.container).not.toHaveTextContent(
    'testurl'
  )


  const element = component.getByText(
    'test123 testiukko'
  )
  expect(element).toBeDefined()

})


test('renders all content', () => {
  const blog = {
    title: 'test123',
    author: 'testiukko',
    url: 'testurl',
    show: true,
    likes: 0
  }

  const component = render(
    <Blog blog={blog} />
  )

  expect(component.container).toHaveTextContent(
    '0'
  )

  expect(component.container).toHaveTextContent(
    'testurl'
  )

  expect(component.container).toHaveTextContent(
    'test123'
  )

  expect(component.container).toHaveTextContent(
    'testiukko'
  )

})


test('clicking the button calls event handler twice', async () => {
  const blog = {
    title: 'test123',
    author: 'testiukko',
    url: 'testurl',
    show: true,
    likes: 0
  }

  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} like={mockHandler} />
  )

  const button = component.getByText('like')
  fireEvent.click(button)
  fireEvent.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
