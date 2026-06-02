import type { FormCreateOption, NormalizedFormCreateRule } from '../../../../types/typing'
import alias from './alias'

const INPUT_TYPES = new Set(['input', 'Input', 'field'])
const TEXTAREA_TYPES = new Set(['textarea'])
const NUMBER_TYPES = new Set(['inputNumber', 'InputNumber', 'number'])
const DATE_TYPES = new Set(['datePicker', 'DatePicker'])
const TIME_TYPES = new Set(['timePicker', 'TimePicker'])
const UPLOAD_TYPES = new Set(['upload', 'uploader', 'uploadFile', 'uploadImage', 'uploadImages', 'FileUpload', 'ImageUpload', 'ImagesUpload'])
const SELECT_TYPES = new Set(['select'])
const TREE_SELECT_TYPES = new Set(['treeSelect', 'TreeSelect', 'treeSelectMultiple'])

export function getWotType(rule: NormalizedFormCreateRule) {
  return alias[rule.type as keyof typeof alias] || rule.type
}

export function isInputType(rule: NormalizedFormCreateRule) {
  return INPUT_TYPES.has(rule.type)
}

export function isTextareaType(rule: NormalizedFormCreateRule) {
  return TEXTAREA_TYPES.has(rule.type) || rule.props?.type === 'textarea'
}

export function isInputNumberType(rule: NormalizedFormCreateRule) {
  return NUMBER_TYPES.has(rule.type)
}

export function isDatePickerType(rule: NormalizedFormCreateRule) {
  return DATE_TYPES.has(rule.type)
}

export function isTimePickerType(rule: NormalizedFormCreateRule) {
  return TIME_TYPES.has(rule.type)
}

export function isUploadType(rule: NormalizedFormCreateRule) {
  return UPLOAD_TYPES.has(rule.type)
}

export function isSelectType(rule: NormalizedFormCreateRule) {
  return SELECT_TYPES.has(rule.type)
}

export function isTreeSelectType(rule: NormalizedFormCreateRule) {
  return TREE_SELECT_TYPES.has(rule.type)
}

export function isApiSelectType(rule: NormalizedFormCreateRule) {
  return rule.type === 'ApiSelect'
}

export function isDictSelectType(rule: NormalizedFormCreateRule) {
  return rule.type === 'DictSelect'
}

export function isUserSelectType(rule: NormalizedFormCreateRule) {
  return rule.type === 'UserSelect'
}

export function isDeptSelectType(rule: NormalizedFormCreateRule) {
  return rule.type === 'DeptSelect'
}

export function getInputType(rule: NormalizedFormCreateRule) {
  return rule.props?.type || 'text'
}

export function getPlaceholder(rule: NormalizedFormCreateRule, prefix: '请输入' | '请选择' = '请输入') {
  return rule.props?.placeholder || `${prefix}${rule.title || ''}`
}

export function getTitleWidth(option: FormCreateOption) {
  return option.form?.titleWidth || option.form?.labelWidth || '200rpx'
}

export function getRuleProps(rule: NormalizedFormCreateRule) {
  const props = { ...(rule.props || {}) }
  delete props.modelValue
  delete props.options
  return props
}
