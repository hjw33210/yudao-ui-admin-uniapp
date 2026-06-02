import type { FormCreateOptionItem, FormCreateRule, FormCreateValue, NormalizedFormCreateRule } from '../../../types/typing'
import { hasOwn, isEmptyValue } from '../../utils/src'

const FIELDLESS_TYPES = new Set(['html', 'divider', 'alert'])

export function normalizeRules(rules: FormCreateRule[] = []): NormalizedFormCreateRule[] {
  const result: NormalizedFormCreateRule[] = []
  const walk = (rule: FormCreateRule | undefined, indexPath: string) => {
    if (!rule || FIELDLESS_TYPES.has(rule.type)) {
      return
    }
    const children = getRuleChildren(rule)
    if (!rule.field && children.length > 0) {
      walkChildren(children, indexPath)
      return
    }
    result.push({
      ...rule,
      props: { ...(rule.props || {}) },
      options: normalizeOptions(rule.options || rule.props?.options),
      __fcId: rule.__fcId || `${rule.field || rule.type || 'field'}_${indexPath}`,
      __originType: rule.__originType || rule.type,
    })
  }
  const walkChildren = (children: FormCreateRule[], indexPath: string) => {
    children.forEach((child, index) => walk(child, `${indexPath}_${index}`))
  }
  rules.forEach((rule, index) => walk(rule, String(index)))
  return result
}

function getRuleChildren(rule: FormCreateRule): FormCreateRule[] {
  return normalizeChildRules(rule.children || rule.props?.children || rule.props?.rows || rule.props?.columns)
}

function normalizeChildRules(children: unknown): FormCreateRule[] {
  if (!children) {
    return []
  }
  if (Array.isArray(children)) {
    return children.flatMap(item => normalizeChildRules(item))
  }
  if (typeof children !== 'object') {
    return []
  }
  const child = children as FormCreateRule
  if (child.type || child.field) {
    return [child]
  }
  return normalizeChildRules(child.children || child.props?.children || child.props?.rows || child.props?.columns)
}

export function normalizeOptions(options?: FormCreateOptionItem[]) {
  if (!Array.isArray(options)) {
    return []
  }
  return options.map(item => ({
    ...item,
    label: item.label ?? item.text ?? String(item.value ?? ''),
    text: item.text ?? item.label ?? String(item.value ?? ''),
  }))
}

export function getDefaultValueByType(type: string): FormCreateValue {
  switch (type) {
    case 'checkbox':
    case 'upload':
    case 'uploadFile':
    case 'uploadImage':
    case 'uploadImages':
    case 'FileUpload':
    case 'ImagesUpload':
      return []
    case 'ImageUpload':
      return ''
    case 'switch':
      return false
    case 'inputNumber':
    case 'InputNumber':
    case 'number':
      return undefined
    case 'rate':
    case 'slider':
      return 0
    default:
      return ''
  }
}

export function createInitialFormData(
  rules: NormalizedFormCreateRule[],
  values: Record<string, any> = {},
) {
  const data: Record<string, any> = {}
  rules.forEach((rule) => {
    if (!rule.field) {
      return
    }
    if (hasOwn(values, rule.field)) {
      data[rule.field] = values[rule.field]
    } else if (rule.value !== undefined) {
      data[rule.field] = rule.value
    } else {
      data[rule.field] = getDefaultValue(rule)
    }
  })
  return data
}

function getDefaultValue(rule: NormalizedFormCreateRule): FormCreateValue {
  const isMultiple = rule.type === 'treeSelectMultiple' || rule.props?.multiple || rule.props?.mode === 'multiple'
  if ((rule.type === 'select' || rule.type.endsWith('Select') || rule.type === 'treeSelectMultiple') && isMultiple) {
    return []
  }
  return getDefaultValueByType(rule.type)
}

export function getAllowedFieldSet(rules: FormCreateRule[]) {
  return new Set(rules.map(rule => rule.field).filter(Boolean) as string[])
}

export function isRuleHidden(rule: FormCreateRule, state?: { hidden?: boolean }) {
  return state?.hidden === true || rule.hidden === true || rule.display === false
}

export function isRuleDisabled(globalDisabled: boolean, state?: { disabled?: boolean }) {
  return globalDisabled || state?.disabled === true
}

export { isEmptyValue }
