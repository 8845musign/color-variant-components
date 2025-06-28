export interface RGB {
  r: number
  g: number
  b: number
}

export interface RGBA extends RGB {
  a: number
}

export interface ColorVariable {
  id: string
  name: string
  color: RGB
  hex: string
}

export interface VariableCollection {
  id: string
  name: string
  colorCount: number
}

export interface CreateComponentsPayload {
  colorVariables: ColorVariable[]
  prefix?: string
}

export interface MessageHandlers {
  'get-collections': () => void
  'get-color-variables': (selectedCollectionIds: string[]) => void
  'create-components': (payload: CreateComponentsPayload | ColorVariable[]) => void
}

export interface UIMessages {
  'variable-collections': (collections: VariableCollection[]) => void
  'color-variables': (variables: ColorVariable[]) => void
}

// Figma types
export interface Variable {
  id: string
  name: string
  resolvedType: string
  valuesByMode: Record<string, any>
}

export interface VariableAlias {
  type: 'VARIABLE_ALIAS'
  id: string
}