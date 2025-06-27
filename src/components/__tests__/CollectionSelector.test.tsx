/** @jsx h */
import { h } from 'preact'
import { render, fireEvent } from '@testing-library/preact'
import { describe, it, expect, vi } from 'vitest'
import { CollectionSelector } from '../CollectionSelector'
import { VariableCollection } from '../../types'

describe('CollectionSelector', () => {
  const mockCollections: VariableCollection[] = [
    { id: 'col1', name: 'Brand Colors', colorCount: 12 },
    { id: 'col2', name: 'UI Colors', colorCount: 8 }
  ]

  it('should render section heading and info', () => {
    const { getByText } = render(
      <CollectionSelector
        collections={mockCollections}
        selectedCollections={[]}
        onCollectionToggle={() => {}}
        onLoadVariables={() => {}}
      />
    )
    
    expect(getByText('Select Collections')).toBeTruthy()
    expect(getByText('Choose which variable collections to use for generating color swatches:')).toBeTruthy()
  })

  it('should render all collections', () => {
    const { container } = render(
      <CollectionSelector
        collections={mockCollections}
        selectedCollections={[]}
        onCollectionToggle={() => {}}
        onLoadVariables={() => {}}
      />
    )
    
    const items = container.querySelectorAll('.collection-item')
    expect(items).toHaveLength(2)
  })

  it('should show empty state when no collections', () => {
    const { getByText } = render(
      <CollectionSelector
        collections={[]}
        selectedCollections={[]}
        onCollectionToggle={() => {}}
        onLoadVariables={() => {}}
      />
    )
    
    expect(getByText('No variable collections found in this file')).toBeTruthy()
  })

  it('should call onCollectionToggle when collection clicked', () => {
    const onToggle = vi.fn()
    const { container } = render(
      <CollectionSelector
        collections={mockCollections}
        selectedCollections={[]}
        onCollectionToggle={onToggle}
        onLoadVariables={() => {}}
      />
    )
    
    const firstItem = container.querySelector('.collection-item')!
    fireEvent.click(firstItem)
    
    expect(onToggle).toHaveBeenCalledWith('col1')
  })

  it('should disable button when no collections selected', () => {
    const { getByText } = render(
      <CollectionSelector
        collections={mockCollections}
        selectedCollections={[]}
        onCollectionToggle={() => {}}
        onLoadVariables={() => {}}
      />
    )
    
    const button = getByText('Load Selected Collections') as HTMLButtonElement
    expect(button.disabled).toBe(true)
  })

  it('should enable button when collections selected', () => {
    const { getByText } = render(
      <CollectionSelector
        collections={mockCollections}
        selectedCollections={['col1']}
        onCollectionToggle={() => {}}
        onLoadVariables={() => {}}
      />
    )
    
    const button = getByText('Load Selected Collections') as HTMLButtonElement
    expect(button.disabled).toBe(false)
  })

  it('should call onLoadVariables when button clicked', () => {
    const onLoad = vi.fn()
    const { getByText } = render(
      <CollectionSelector
        collections={mockCollections}
        selectedCollections={['col1']}
        onCollectionToggle={() => {}}
        onLoadVariables={onLoad}
      />
    )
    
    const button = getByText('Load Selected Collections')
    fireEvent.click(button)
    
    expect(onLoad).toHaveBeenCalledTimes(1)
  })
})