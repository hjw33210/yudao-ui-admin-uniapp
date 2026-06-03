import type { FormCreateOption, NormalizedFormCreateRule } from '../../../../types/typing'
import alias from './alias'

export const INTERNAL_LAYOUT_TITLE_TYPE = '__fcLayoutTitle'
export const INTERNAL_LAYOUT_GAP_TYPE = '__fcLayoutGap'

const INPUT_TYPES = new Set(['input', 'Input', 'field'])
const TEXTAREA_TYPES = new Set(['textarea'])
const NUMBER_TYPES = new Set(['inputNumber', 'InputNumber', 'number'])
const DATE_TYPES = new Set(['datePicker', 'DatePicker'])
const TIME_TYPES = new Set(['timePicker', 'TimePicker'])
const BUTTON_TYPES = new Set(['button', 'Button', 'elButton', 'ElButton', 'el-button'])
const UPLOAD_TYPES = new Set(['upload', 'uploader', 'uploadFile', 'uploadImage', 'uploadImages', 'FileUpload', 'ImageUpload', 'ImagesUpload', 'UploadFile', 'UploadImg', 'UploadImgs'])
const SELECT_TYPES = new Set(['select'])
const TREE_SELECT_TYPES = new Set(['treeSelect', 'TreeSelect', 'treeSelectMultiple'])
const UNSUPPORTED_FORM_CONTAINER_TYPES = new Set(['group', 'subForm', 'fcSubForm', 'array', 'tableForm', 'subTable', 'fcTableForm'])
const ALERT_TYPES = new Set(['alert', 'elAlert', 'ElAlert'])
const TITLE_TYPES = new Set(['title', 'Title', 'fcTitle', 'FcTitle'])
const HTML_TYPES = new Set(['html', 'Html', 'HTML', 'richText', 'RichText'])
const DIVIDER_TYPES = new Set(['divider', 'Divider', 'elDivider', 'ElDivider'])
const TAG_TYPES = new Set(['tag', 'Tag', 'elTag', 'ElTag'])
const IMAGE_TYPES = new Set(['image', 'Image', 'img', 'Img', 'elImage', 'ElImage'])
const AREA_SELECT_TYPES = new Set(['AreaSelect'])
const UNSUPPORTED_INTERACTION_TYPES = new Set(['transfer', 'Transfer', 'elTransfer', 'ElTransfer', 'tree', 'Tree', 'signature', 'Signature', 'signaturePad', 'SignaturePad', 'sign', 'Sign', 'Editor', 'Tinymce', 'tinymce', 'wangEditor', 'WangEditor', 'iframe', 'Iframe', 'IframeComponent', 'frame', 'Frame'])

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

export function isButtonType(rule: NormalizedFormCreateRule) {
  return BUTTON_TYPES.has(rule.type)
}

export function isUploadType(rule: NormalizedFormCreateRule) {
  return UPLOAD_TYPES.has(rule.type)
}

export function isUnsupportedFormContainerType(rule: NormalizedFormCreateRule) {
  return UNSUPPORTED_FORM_CONTAINER_TYPES.has(rule.type)
}

export function isAlertType(rule: NormalizedFormCreateRule) {
  return ALERT_TYPES.has(rule.type)
}

export function isTitleType(rule: NormalizedFormCreateRule) {
  return TITLE_TYPES.has(rule.type)
}

export function isHtmlType(rule: NormalizedFormCreateRule) {
  return HTML_TYPES.has(rule.type)
}

export function isDividerType(rule: NormalizedFormCreateRule) {
  return DIVIDER_TYPES.has(rule.type)
}

export function isTagType(rule: NormalizedFormCreateRule) {
  return TAG_TYPES.has(rule.type)
}

export function isImageType(rule: NormalizedFormCreateRule) {
  return IMAGE_TYPES.has(rule.type)
}

export function isUnsupportedInteractionType(rule: NormalizedFormCreateRule) {
  return UNSUPPORTED_INTERACTION_TYPES.has(rule.type)
}

export function isLayoutTitleType(rule: NormalizedFormCreateRule) {
  return rule.type === INTERNAL_LAYOUT_TITLE_TYPE
}

export function isLayoutGapType(rule: NormalizedFormCreateRule) {
  return rule.type === INTERNAL_LAYOUT_GAP_TYPE
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

export function isAreaSelectType(rule: NormalizedFormCreateRule) {
  return AREA_SELECT_TYPES.has(rule.type)
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
