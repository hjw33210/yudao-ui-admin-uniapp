import type { FormCreateOption, NormalizedFormCreateRule } from '../../../../types/typing'
import alias from './alias'

export const INTERNAL_LAYOUT_TITLE_TYPE = '__fcLayoutTitle'
export const INTERNAL_LAYOUT_GAP_TYPE = '__fcLayoutGap'

const INPUT_TYPES = new Set(['input', 'Input', 'field', 'password', 'url', 'email', 'search', 'text'])
const HIDDEN_TYPES = new Set(['hidden', 'Hidden'])
const TEXTAREA_TYPES = new Set(['textarea'])
const NUMBER_TYPES = new Set(['inputNumber', 'InputNumber', 'number'])
const DATE_TYPES = new Set(['datePicker', 'DatePicker'])
const TIME_TYPES = new Set(['timePicker', 'TimePicker', 'time'])
const BUTTON_TYPES = new Set(['button', 'Button', 'elButton', 'ElButton', 'el-button'])
const UPLOAD_TYPES = new Set(['upload', 'uploader', 'uploadFile', 'uploadImage', 'uploadImages', 'FileUpload', 'ImageUpload', 'ImagesUpload', 'UploadFile', 'UploadImg', 'UploadImgs'])
const SELECT_TYPES = new Set(['select', 'selectMultiple'])
const SLIDER_TYPES = new Set(['slider', 'sliderRange'])
const COLOR_PICKER_TYPES = new Set(['colorPicker', 'ColorPicker', 'elColorPicker', 'ElColorPicker', 'color-picker'])
const CASCADER_TYPES = new Set(['cascader', 'Cascader', 'elCascader', 'ElCascader'])
const CALENDAR_TYPES = new Set(['calendar', 'Calendar', 'elCalendar', 'ElCalendar', 'date', 'datetime', 'month', 'week', 'dateRange', 'daterange', 'datetimeRange', 'datetimerange', 'monthRange', 'monthrange', 'weekRange', 'weekrange'])
const TREE_SELECT_TYPES = new Set(['treeSelect', 'TreeSelect', 'treeSelectMultiple', 'tree', 'Tree'])
const TRANSFER_TYPES = new Set(['transfer', 'Transfer', 'elTransfer', 'ElTransfer'])
const SUB_FORM_TYPES = new Set(['group', 'Group', 'fcGroup', 'FcGroup', 'array', 'Array', 'tableForm', 'subTable', 'fcTableForm'])
const ALERT_TYPES = new Set(['alert', 'elAlert', 'ElAlert'])
const TITLE_TYPES = new Set(['title', 'Title', 'fcTitle', 'FcTitle'])
const HTML_TYPES = new Set(['html', 'Html', 'HTML'])
const DIVIDER_TYPES = new Set(['divider', 'Divider', 'elDivider', 'ElDivider'])
const TAG_TYPES = new Set(['tag', 'Tag', 'elTag', 'ElTag'])
const IMAGE_TYPES = new Set(['image', 'Image', 'img', 'Img', 'elImage', 'ElImage'])
const IFRAME_TYPES = new Set(['iframe', 'Iframe', 'IframeComponent', 'frame', 'Frame'])
const RICH_TEXT_TYPES = new Set(['Editor', 'editor', 'Tinymce', 'tinymce', 'wangEditor', 'WangEditor', 'richText', 'RichText'])
const SIGNATURE_TYPES = new Set(['signature', 'Signature', 'signaturePad', 'SignaturePad', 'sign', 'Sign'])
const AREA_SELECT_TYPES = new Set(['AreaSelect'])

export function getWotType(rule: NormalizedFormCreateRule) {
  return alias[rule.type as keyof typeof alias] || rule.type
}

export function isInputType(rule: NormalizedFormCreateRule) {
  return INPUT_TYPES.has(rule.type)
}

export function isHiddenFieldType(rule: NormalizedFormCreateRule) {
  return HIDDEN_TYPES.has(rule.type)
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

export function isCascaderType(rule: NormalizedFormCreateRule) {
  return CASCADER_TYPES.has(rule.type)
}

export function isCalendarType(rule: NormalizedFormCreateRule) {
  return CALENDAR_TYPES.has(rule.type)
}

export function isButtonType(rule: NormalizedFormCreateRule) {
  return BUTTON_TYPES.has(rule.type)
}

export function isUploadType(rule: NormalizedFormCreateRule) {
  return UPLOAD_TYPES.has(rule.type)
}

export function isSubFormType(rule: NormalizedFormCreateRule) {
  return SUB_FORM_TYPES.has(rule.type)
}

export function isTransferType(rule: NormalizedFormCreateRule) {
  return TRANSFER_TYPES.has(rule.type)
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

export function isIframeType(rule: NormalizedFormCreateRule) {
  return IFRAME_TYPES.has(rule.type)
}

export function isRichTextType(rule: NormalizedFormCreateRule) {
  return RICH_TEXT_TYPES.has(rule.type)
}

export function isSignatureType(rule: NormalizedFormCreateRule) {
  return SIGNATURE_TYPES.has(rule.type)
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

export function isSliderType(rule: NormalizedFormCreateRule) {
  return SLIDER_TYPES.has(rule.type)
}

export function isSliderRangeType(rule: NormalizedFormCreateRule) {
  return rule.type === 'sliderRange' || rule.props?.range === true
}

export function isColorPickerType(rule: NormalizedFormCreateRule) {
  return COLOR_PICKER_TYPES.has(rule.type)
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
  const typeMap: Record<string, string> = {
    email: 'email',
    password: 'password',
    search: 'search',
    text: 'text',
    url: 'url',
  }
  return rule.props?.type || typeMap[rule.type] || 'text'
}

export function getPlaceholder(rule: NormalizedFormCreateRule, prefix: '请输入' | '请选择' = '请输入') {
  return rule.props?.placeholder || `${prefix}${rule.title || ''}`
}

export function getTitleWidth(option: FormCreateOption) {
  return option.form?.titleWidth || option.form?.labelWidth || '200rpx'
}

export function getRuleProps(rule: NormalizedFormCreateRule) {
  const props = { ...(rule.props || {}) }
  delete props.disabled
  delete props.modelValue
  delete props.on
  delete props.onChange
  delete props.onClick
  delete props.options
  return props
}

export function toRuleEventHandlerName(eventName: string) {
  return `on${eventName
    .split(/[-_:]/)
    .filter(Boolean)
    .map(item => item.charAt(0).toUpperCase() + item.slice(1))
    .join('')}`
}

export function getRuleEventHandler(rule: NormalizedFormCreateRule, eventName: string) {
  const handlerName = toRuleEventHandlerName(eventName)
  return rule.on?.[eventName]
    || rule.props?.on?.[eventName]
    || rule.props?.[handlerName]
}
