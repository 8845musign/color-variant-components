/** @jsx h */
import { h } from 'preact'
import { render, fireEvent } from '@testing-library/preact'
import { describe, it, expect, vi } from 'vitest'
import { CollectionItem } from '../CollectionItem'
import { VariableCollection } from '../../types'

describe('CollectionItem', () => {
  const mockCollection: VariableCollection = {
    id: 'col-1',
    name: 'Design System',
    colorCount: 24
  }

  it('should render collection name and count', () => {
    const { getByText } = render(
      <CollectionItem 
        collection={mockCollection} 
        isSelected={false} 
        onToggle={() => {}} 
      />
    )
    
    expect(getByText('Design System')).toBeTruthy()
    expect(getByText('24 colors')).toBeTruthy()
  })

  it('should apply selected class when selected', () => {
    const { container, rerender } = render(
      <CollectionItem 
        collection={mockCollection} 
        isSelected={false} 
        onToggle={() => {}} 
      />
    )
    
    expect(container.querySelector('.collection-item')).not.toHaveClass('selected')
    
    rerender(
      <CollectionItem 
        collection={mockCollection} 
        isSelected={true} 
        onToggle={() => {}} 
      />
    )
    
    expect(container.querySelector('.collection-item')).toHaveClass('selected')
  })

  it('should call onToggle when clicked', () => {
    const onToggle = vi.fn()
    const { container } = render(
      <CollectionItem 
        collection={mockCollection} 
        isSelected={false} 
        onToggle={onToggle} 
      />
    )
    
    const item = container.querySelector('.collection-item')!
    fireEvent.click(item)
    
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('should toggle checkbox when clicked', () => {
    const onToggle = vi.fn()
    const { container } = render(
      <CollectionItem 
        collection={mockCollection} 
        isSelected={false} 
        onToggle={onToggle} 
      />
    )
    
    const checkbox = container.querySelector('input[type="checkbox"]')!
    fireEvent.change(checkbox, { target: { checked: true } })
    
    // Change event should trigger onToggle once
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('should have correct accessibility label', () => {
    const { container } = render(
      <CollectionItem 
        collection={mockCollection} 
        isSelected={false} 
        onToggle={() => {}} 
      />
    )
    
    const checkbox = container.querySelector('input[type="checkbox"]')
    expect(checkbox).toHaveAttribute('aria-label', 'Select Design System')
  })
})