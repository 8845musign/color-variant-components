/** @jsx h */
import { h } from 'preact'
import { render } from '@testing-library/preact'
import { describe, it, expect } from 'vitest'
import { StatusIndicator } from '../StatusIndicator'

describe('StatusIndicator', () => {
  it('should render message when show is true', () => {
    const { getByText } = render(
      <StatusIndicator show={true} message="Loading..." />
    )
    
    expect(getByText('Loading...')).toBeTruthy()
  })

  it('should not render when show is false', () => {
    const { container } = render(
      <StatusIndicator show={false} message="Loading..." />
    )
    
    expect(container.firstChild).toBeNull()
  })

  it('should have correct CSS class', () => {
    const { container } = render(
      <StatusIndicator show={true} message="Processing" />
    )
    
    const status = container.querySelector('.status')
    expect(status).toBeTruthy()
    expect(status).toHaveClass('show')
  })
})