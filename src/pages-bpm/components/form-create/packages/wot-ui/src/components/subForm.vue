<template>
  <wd-form-item :title="rule.title" :title-width="titleWidth" :prop="rule.field" layout="vertical">
    <view class="fc-sub-form">
      <view v-for="(item, itemIndex) in rows" :key="itemIndex" class="fc-sub-form__item">
        <view class="fc-sub-form__header">
          <view class="fc-sub-form__header-main" @click="toggleItem(itemIndex)">
            <text class="fc-sub-form__title">{{ getItemTitle(itemIndex) }}</text>
            <text v-if="collapseEnabled" class="fc-sub-form__collapse">
              {{ isItemCollapsed(itemIndex) ? '展开' : '收起' }}
            </text>
          </view>
          <view class="fc-sub-form__actions">
            <wd-button v-if="sortEnabled" size="small" variant="plain" :disabled="disabled || itemIndex === 0" @click.stop="moveItem(itemIndex, itemIndex - 1)">
              上移
            </wd-button>
            <wd-button v-if="sortEnabled" size="small" variant="plain" :disabled="disabled || itemIndex === rows.length - 1" @click.stop="moveItem(itemIndex, itemIndex + 1)">
              下移
            </wd-button>
            <wd-button v-if="canRemove" size="small" type="error" variant="plain" :disabled="disabled" @click.stop="removeItem(itemIndex)">
              删除
            </wd-button>
          </view>
        </view>

        <view v-show="!isItemCollapsed(itemIndex)" class="fc-sub-form__body">
          <template v-for="childRule in getItemRules(itemIndex)" :key="`${itemIndex}_${childRule.__fcId}`">
            <view v-if="isHiddenFieldType(childRule)" style="display: none" />

            <view v-else-if="isLayoutTitleType(childRule)" class="fc-sub-form__layout-title">
              {{ childRule.title }}
            </view>

            <view v-else-if="isLayoutGapType(childRule)" class="fc-sub-form__layout-gap" :style="{ height: getLayoutGapHeight(childRule) }" />

            <FcAlert v-else-if="isAlertType(childRule)" :rule="getRenderRule(childRule, itemIndex)" style="" />

            <FcTitle v-else-if="isTitleType(childRule)" :rule="getRenderRule(childRule, itemIndex)" style="" />

            <FcHtml v-else-if="isHtmlType(childRule)" :rule="getRenderRule(childRule, itemIndex)" style="" />

            <FcDivider v-else-if="isDividerType(childRule)" :rule="getRenderRule(childRule, itemIndex)" style="" />

            <FcTag v-else-if="isTagType(childRule)" :rule="getRenderRule(childRule, itemIndex)" style="" />

            <FcImage v-else-if="isImageType(childRule)" :rule="getRenderRule(childRule, itemIndex)" style="" />

            <FcIframe v-else-if="isIframeType(childRule)" :rule="getRenderRule(childRule, itemIndex)" :title-width="childTitleWidth" style="" />

            <FcRichText
              v-else-if="isRichTextType(childRule)"
              :model-value="getItemValue(itemIndex, childRule.field)"
              :rule="getRenderRule(childRule, itemIndex)"
              :title-width="childTitleWidth"
              :disabled="isChildDisabled(childRule, itemIndex)"
              style=""
              @update:model-value="setItemValue(itemIndex, childRule.field, $event)"
            />

            <FcSignature
              v-else-if="isSignatureType(childRule)"
              :model-value="getItemValue(itemIndex, childRule.field)"
              :rule="getRenderRule(childRule, itemIndex)"
              :title-width="childTitleWidth"
              :disabled="isChildDisabled(childRule, itemIndex)"
              style=""
              @clear="handleChildRuleEvent(getRenderRule(childRule, itemIndex), 'clear')"
              @confirm="handleChildRuleEvent(getRenderRule(childRule, itemIndex), 'confirm', $event)"
              @update:model-value="setItemValue(itemIndex, childRule.field, $event)"
            />

            <wd-form-item v-else-if="isInputType(childRule)" :title="childRule.title" :title-width="childTitleWidth" :prop="getChildProp(itemIndex, childRule.field)">
              <wd-input
                :model-value="getItemValue(itemIndex, childRule.field)"
                :type="getInputType(childRule)"
                :placeholder="getPlaceholder(childRule)"
                :disabled="isChildDisabled(childRule, itemIndex)"
                clearable
                v-bind="getRuleProps(childRule)"
                @blur="handleChildRuleEvent(getRenderRule(childRule, itemIndex), 'blur', $event)"
                @clear="handleChildRuleEvent(getRenderRule(childRule, itemIndex), 'clear')"
                @update:model-value="setItemValue(itemIndex, childRule.field, $event)"
              />
            </wd-form-item>

            <wd-form-item v-else-if="isTextareaType(childRule)" :title="childRule.title" :title-width="childTitleWidth" :prop="getChildProp(itemIndex, childRule.field)" layout="vertical">
              <wd-textarea
                :model-value="getItemValue(itemIndex, childRule.field)"
                :placeholder="getPlaceholder(childRule)"
                :disabled="isChildDisabled(childRule, itemIndex)"
                clearable
                v-bind="getRuleProps(childRule)"
                @blur="handleChildRuleEvent(getRenderRule(childRule, itemIndex), 'blur', $event)"
                @clear="handleChildRuleEvent(getRenderRule(childRule, itemIndex), 'clear')"
                @update:model-value="setItemValue(itemIndex, childRule.field, $event)"
              />
            </wd-form-item>

            <wd-form-item v-else-if="isInputNumberType(childRule)" :title="childRule.title" :title-width="childTitleWidth" :prop="getChildProp(itemIndex, childRule.field)" center>
              <wd-input-number
                v-bind="getRuleProps(childRule)"
                :model-value="getInputNumberValue(itemIndex, childRule.field)"
                :min="childRule.props?.min"
                :max="childRule.props?.max"
                :step="childRule.props?.step || 1"
                :allow-null="childRule.props?.allowNull ?? true"
                :update-on-init="childRule.props?.updateOnInit ?? false"
                :disabled="isChildDisabled(childRule, itemIndex)"
                @update:model-value="setItemValue(itemIndex, childRule.field, $event)"
              />
            </wd-form-item>

            <FcUserSelect
              v-else-if="isUserSelectType(childRule)"
              :model-value="getItemValue(itemIndex, childRule.field)"
              :rule="getRenderRule(childRule, itemIndex)"
              :title-width="childTitleWidth"
              :disabled="isChildDisabled(childRule, itemIndex)"
              style=""
              @update:model-value="setItemValue(itemIndex, childRule.field, $event)"
            />

            <FcDeptSelect
              v-else-if="isDeptSelectType(childRule)"
              :model-value="getItemValue(itemIndex, childRule.field)"
              :rule="getRenderRule(childRule, itemIndex)"
              :title-width="childTitleWidth"
              :disabled="isChildDisabled(childRule, itemIndex)"
              style=""
              @update:model-value="setItemValue(itemIndex, childRule.field, $event)"
            />

            <FcDictSelect
              v-else-if="isDictSelectType(childRule)"
              :model-value="getItemValue(itemIndex, childRule.field)"
              :rule="getRenderRule(childRule, itemIndex)"
              :title-width="childTitleWidth"
              :disabled="isChildDisabled(childRule, itemIndex)"
              style=""
              @update:model-value="setItemValue(itemIndex, childRule.field, $event)"
            />

            <FcApiSelect
              v-else-if="isApiSelectType(childRule)"
              :model-value="getItemValue(itemIndex, childRule.field)"
              :rule="getRenderRule(childRule, itemIndex)"
              :title-width="childTitleWidth"
              :disabled="isChildDisabled(childRule, itemIndex)"
              style=""
              @update:model-value="setItemValue(itemIndex, childRule.field, $event)"
            />

            <FcAreaSelect
              v-else-if="isAreaSelectType(childRule)"
              :model-value="getItemValue(itemIndex, childRule.field)"
              :rule="getRenderRule(childRule, itemIndex)"
              :title-width="childTitleWidth"
              :disabled="isChildDisabled(childRule, itemIndex)"
              style=""
              @update:model-value="setItemValue(itemIndex, childRule.field, $event)"
            />

            <FcCascader
              v-else-if="isCascaderType(childRule)"
              :model-value="getItemValue(itemIndex, childRule.field)"
              :rule="getRenderRule(childRule, itemIndex)"
              :title-width="childTitleWidth"
              :disabled="isChildDisabled(childRule, itemIndex)"
              style=""
              @confirm="handleChildRuleEvent(getRenderRule(childRule, itemIndex), 'confirm', $event)"
              @update:model-value="setItemValue(itemIndex, childRule.field, $event)"
            />

            <FcCalendar
              v-else-if="isCalendarType(childRule)"
              :model-value="getItemValue(itemIndex, childRule.field)"
              :rule="getRenderRule(childRule, itemIndex)"
              :title-width="childTitleWidth"
              :disabled="isChildDisabled(childRule, itemIndex)"
              style=""
              @confirm="handleChildRuleEvent(getRenderRule(childRule, itemIndex), 'confirm', $event)"
              @update:model-value="setItemValue(itemIndex, childRule.field, $event)"
            />

            <FcTreeSelect
              v-else-if="isTreeSelectType(childRule)"
              :model-value="getItemValue(itemIndex, childRule.field)"
              :rule="getRenderRule(childRule, itemIndex)"
              :title-width="childTitleWidth"
              :disabled="isChildDisabled(childRule, itemIndex)"
              style=""
              @update:model-value="setItemValue(itemIndex, childRule.field, $event)"
            />

            <FcSelect
              v-else-if="isSelectType(childRule)"
              :model-value="getItemValue(itemIndex, childRule.field)"
              :rule="getRenderRule(childRule, itemIndex)"
              :title-width="childTitleWidth"
              :disabled="isChildDisabled(childRule, itemIndex)"
              style=""
              @confirm="handleChildRuleEvent(getRenderRule(childRule, itemIndex), 'confirm', $event)"
              @update:model-value="setItemValue(itemIndex, childRule.field, $event)"
            />

            <FcColorPicker
              v-else-if="isColorPickerType(childRule)"
              :model-value="getItemValue(itemIndex, childRule.field)"
              :rule="getRenderRule(childRule, itemIndex)"
              :title-width="childTitleWidth"
              :disabled="isChildDisabled(childRule, itemIndex)"
              style=""
              @update:model-value="setItemValue(itemIndex, childRule.field, $event)"
            />

            <FcRadio
              v-else-if="childRule.type === 'radio'"
              :model-value="getItemValue(itemIndex, childRule.field)"
              :rule="getRenderRule(childRule, itemIndex)"
              :title-width="childTitleWidth"
              :disabled="isChildDisabled(childRule, itemIndex)"
              style=""
              @update:model-value="setItemValue(itemIndex, childRule.field, $event)"
            />

            <FcCheckbox
              v-else-if="childRule.type === 'checkbox'"
              :model-value="getItemValue(itemIndex, childRule.field)"
              :rule="getRenderRule(childRule, itemIndex)"
              :title-width="childTitleWidth"
              :disabled="isChildDisabled(childRule, itemIndex)"
              style=""
              @update:model-value="setItemValue(itemIndex, childRule.field, $event)"
            />

            <wd-form-item v-else-if="childRule.type === 'switch'" :title="childRule.title" :title-width="childTitleWidth" :prop="getChildProp(itemIndex, childRule.field)" center>
              <wd-switch
                :model-value="getItemValue(itemIndex, childRule.field)"
                :disabled="isChildDisabled(childRule, itemIndex)"
                v-bind="getRuleProps(childRule)"
                @update:model-value="setItemValue(itemIndex, childRule.field, $event)"
              />
            </wd-form-item>

            <FcDatePicker
              v-else-if="isDatePickerType(childRule)"
              :model-value="getItemValue(itemIndex, childRule.field)"
              :rule="getRenderRule(childRule, itemIndex)"
              :title-width="childTitleWidth"
              :disabled="isChildDisabled(childRule, itemIndex)"
              style=""
              @confirm="handleChildRuleEvent(getRenderRule(childRule, itemIndex), 'confirm', $event)"
              @update:model-value="setItemValue(itemIndex, childRule.field, $event)"
            />

            <FcTimePicker
              v-else-if="isTimePickerType(childRule)"
              :model-value="getItemValue(itemIndex, childRule.field)"
              :rule="getRenderRule(childRule, itemIndex)"
              :title-width="childTitleWidth"
              :disabled="isChildDisabled(childRule, itemIndex)"
              style=""
              @confirm="handleChildRuleEvent(getRenderRule(childRule, itemIndex), 'confirm', $event)"
              @update:model-value="setItemValue(itemIndex, childRule.field, $event)"
            />

            <wd-form-item v-else-if="childRule.type === 'rate'" :title="childRule.title" :title-width="childTitleWidth" :prop="getChildProp(itemIndex, childRule.field)" center>
              <wd-rate
                :model-value="getItemValue(itemIndex, childRule.field)"
                :disabled="isChildDisabled(childRule, itemIndex)"
                v-bind="getRuleProps(childRule)"
                @update:model-value="setItemValue(itemIndex, childRule.field, $event)"
              />
            </wd-form-item>

            <wd-form-item v-else-if="isSliderType(childRule)" :title="childRule.title" :title-width="childTitleWidth" :prop="getChildProp(itemIndex, childRule.field)" layout="vertical">
              <wd-slider
                :model-value="getItemValue(itemIndex, childRule.field)"
                :disabled="isChildDisabled(childRule, itemIndex)"
                v-bind="getRuleProps(childRule)"
                :range="isSliderRangeType(childRule)"
                @change="setItemValue(itemIndex, childRule.field, $event)"
              />
            </wd-form-item>

            <FcUploader
              v-else-if="isUploadType(childRule)"
              :model-value="getItemValue(itemIndex, childRule.field)"
              :rule="getRenderRule(childRule, itemIndex)"
              :title-width="childTitleWidth"
              :disabled="isChildDisabled(childRule, itemIndex)"
              style=""
              @fail="handleChildRuleEvent(getRenderRule(childRule, itemIndex), 'fail', $event)"
              @remove="handleChildRuleEvent(getRenderRule(childRule, itemIndex), 'remove', $event)"
              @success="handleChildRuleEvent(getRenderRule(childRule, itemIndex), 'success', $event)"
              @update:model-value="setItemValue(itemIndex, childRule.field, $event)"
            />

            <FcTransfer
              v-else-if="isTransferType(childRule)"
              :model-value="getItemValue(itemIndex, childRule.field)"
              :rule="getRenderRule(childRule, itemIndex)"
              :title-width="childTitleWidth"
              :disabled="isChildDisabled(childRule, itemIndex)"
              style=""
              @update:model-value="setItemValue(itemIndex, childRule.field, $event)"
            />

            <FcSubForm
              v-else-if="isSubFormType(childRule)"
              :model-value="getItemValue(itemIndex, childRule.field)"
              :rule="getRenderRule(childRule, itemIndex)"
              :api="api"
              :option="option"
              :title-width="childTitleWidth"
              :disabled="isChildDisabled(childRule, itemIndex)"
              style=""
              @update:model-value="setItemValue(itemIndex, childRule.field, $event)"
            />

            <FcButton
              v-else-if="isButtonType(childRule)"
              :rule="getRenderRule(childRule, itemIndex)"
              :disabled="isChildDisabled(childRule, itemIndex)"
              style=""
              @click="handleChildRuleEvent(getRenderRule(childRule, itemIndex), 'click')"
            />

            <wd-form-item v-else-if="childRule.type === 'span'" :title="childRule.title" :title-width="childTitleWidth" :prop="getChildProp(itemIndex, childRule.field)">
              <view class="fc-sub-form__text">
                {{ formatDisplayValue(getItemValue(itemIndex, childRule.field)) }}
              </view>
            </wd-form-item>

            <view v-else class="fc-sub-form__unsupported">
              暂不支持「{{ childRule.title || childRule.type }}」子字段
            </view>
          </template>
        </view>
      </view>

      <wd-button v-if="canAdd" plain block type="primary" :disabled="disabled" @click="addItem">
        添加{{ rule.title || '子表单' }}
      </wd-button>

      <view v-else-if="rows.length === 0" class="fc-sub-form__empty">
        暂无{{ rule.title || '子表单' }}数据
      </view>
    </view>
  </wd-form-item>
</template>

<script lang="ts" setup>
import type { FormCreateApi, FormCreateOption, FormCreateRule, NormalizedFormCreateRule } from '../../../../types/typing'
import type { FormCreateProviderContext, FormCreateProviderState } from '../../../core/src/provider'
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { applyControlRules, applyRuleProviders, getDefaultValue, isRuleDisabled, isRuleHidden, normalizeSubFormRules, resolveRuleFetchEffects } from '../../../core/src'
import {
  getInputType,
  getPlaceholder,
  getRuleEventHandler,
  getRuleProps,
  INTERNAL_LAYOUT_TITLE_TYPE,
  isAlertType,
  isApiSelectType,
  isAreaSelectType,
  isButtonType,
  isCalendarType,
  isCascaderType,
  isColorPickerType,
  isDatePickerType,
  isDeptSelectType,
  isDictSelectType,
  isDividerType,
  isHiddenFieldType,
  isHtmlType,
  isIframeType,
  isImageType,
  isInputNumberType,
  isInputType,
  isLayoutGapType,
  isLayoutTitleType,
  isRichTextType,
  isSelectType,
  isSignatureType,
  isSliderRangeType,
  isSliderType,
  isSubFormType,
  isTagType,
  isTextareaType,
  isTimePickerType,
  isTitleType,
  isTransferType,
  isTreeSelectType,
  isUploadType,
  isUserSelectType,
} from '../core/utils'
import { parseRules } from '../parsers'
import FcButton from './button.vue'
import FcCalendar from './calendar.vue'
import FcCascader from './cascader.vue'
import FcCheckbox from './checkbox.vue'
import FcColorPicker from './colorPicker.vue'
import FcApiSelect from './custom/apiSelect.vue'
import FcAreaSelect from './custom/areaSelect.vue'
import FcDeptSelect from './custom/deptSelect.vue'
import FcDictSelect from './custom/dictSelect.vue'
import FcUserSelect from './custom/userSelect.vue'
import FcDatePicker from './datePicker.vue'
import FcAlert from './display/alert.vue'
import FcDivider from './display/divider.vue'
import FcHtml from './display/html.vue'
import FcImage from './display/image.vue'
import FcTag from './display/tag.vue'
import FcTitle from './display/title.vue'
import FcIframe from './iframe.vue'
import FcRadio from './radio.vue'
import FcRichText from './richText.vue'
import FcSelect from './select.vue'
import FcSignature from './signature.vue'
import FcTimePicker from './timePicker.vue'
import FcTransfer from './transfer.vue'
import FcTreeSelect from './treeSelect.vue'
import FcUploader from './uploader.vue'

defineOptions({
  name: 'FcSubForm',
})

const props = defineProps<{
  api?: FormCreateApi
  disabled?: boolean
  modelValue?: any
  option?: FormCreateOption
  rule: NormalizedFormCreateRule
  titleWidth?: string | number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: any[]]
  'change': [value: any[]]
}>()

const collapsedRows = ref<Record<number, boolean>>({})
const providerStates = reactive<Record<string, Record<string, FormCreateProviderState>>>({})
const EMPTY_PROVIDER_STATES: Record<string, FormCreateProviderState> = {}
const baseChildRules = computed(() => normalizeSubFormRules(props.rule, parseRules, {
  createColumnTitleRule,
}))
const rows = computed(() => normalizeRows(props.modelValue))
const childTitleWidth = computed(() => props.rule.props?.childTitleWidth || props.rule.props?.labelWidth || props.titleWidth || '180rpx')
const min = computed(() => normalizeCount(props.rule.props?.min))
const max = computed(() => normalizeCount(props.rule.props?.max))
const expand = computed(() => normalizeCount(props.rule.props?.expand))
const sortEnabled = computed(() => props.rule.props?.sortBtn === true || props.rule.props?.sortable === true)
const collapseEnabled = computed(() => props.rule.props?.collapse === true || props.rule.props?.collapsible === true || props.rule.props?.foldable === true)
const defaultCollapsed = computed(() => props.rule.props?.defaultCollapsed === true || props.rule.props?.collapsed === true)
const canRemove = computed(() => !props.disabled && rows.value.length > min.value)
const canAdd = computed(() => !props.disabled && (!max.value || rows.value.length < max.value))
let providerFetchVersion = 0
let providerFetchTimer: ReturnType<typeof setTimeout> | undefined

watch(
  () => [props.modelValue, baseChildRules.value, min.value, expand.value],
  () => ensureRows(),
  { deep: true, immediate: true },
)

watch(
  () => baseChildRules.value,
  () => {
    clearProviderStates()
    scheduleProviderFetchEffects()
  },
  { deep: true },
)

watch(
  () => [rows.value, props.option?.globalData],
  () => scheduleProviderFetchEffects(),
  { deep: true, immediate: true },
)

function createColumnTitleRule(column: Record<string, any>, index: number): FormCreateRule | undefined {
  const label = column.label || column.title || column.name
  if (!label) {
    return undefined
  }
  return {
    type: INTERNAL_LAYOUT_TITLE_TYPE,
    title: label,
    __fcId: `${INTERNAL_LAYOUT_TITLE_TYPE}_${props.rule.__fcId}_${index}`,
    __originType: 'tableFormColumn',
  }
}

function ensureRows() {
  const minCount = Math.max(min.value, expand.value)
  if (rows.value.length >= minCount) {
    return
  }
  const nextRows = [...rows.value]
  while (nextRows.length < minCount) {
    nextRows.push(createDefaultRow())
  }
  emitValue(nextRows)
}

function normalizeRows(value: any): Record<string, any>[] {
  if (!Array.isArray(value)) {
    return []
  }
  return value.map(item => (item && typeof item === 'object' && !Array.isArray(item) ? item : {}))
}

function normalizeCount(value: any) {
  const count = Number(value)
  return Number.isFinite(count) && count > 0 ? count : 0
}

function createDefaultRow() {
  const defaultValue = props.rule.props?.defaultValue
  const row = defaultValue && typeof defaultValue === 'object' && !Array.isArray(defaultValue) ? { ...defaultValue } : {}
  fillDefaultRow(row, baseChildRules.value)
  fillDefaultRow(row, applyControlRules(baseChildRules.value, row).rules)
  return row
}

function fillDefaultRow(row: Record<string, any>, rules: NormalizedFormCreateRule[]) {
  rules.forEach((childRule) => {
    if (!childRule.field || row[childRule.field] !== undefined) {
      return
    }
    row[childRule.field] = childRule.value !== undefined ? childRule.value : getDefaultValue(childRule)
  })
}

function getItemRules(itemIndex: number) {
  const result = getItemControlResult(itemIndex)
  const providerContext = getItemProviderContext(itemIndex)
  const rules = applyRuleProviders(result?.rules || baseChildRules.value, providerContext)
  return rules.filter(rule => !isRuleHidden(rule, getItemFieldState(itemIndex, rule)))
}

function getItemProviderContext(itemIndex: number): FormCreateProviderContext {
  return {
    api: props.api,
    formData: rows.value[itemIndex] || {},
    option: props.option,
    states: getItemProviderStates(itemIndex) || EMPTY_PROVIDER_STATES,
  }
}

function getItemProviderStates(itemIndex: number) {
  return providerStates[getProviderStateKey(itemIndex)]
}

function ensureItemProviderStates(itemIndex: number) {
  const key = String(itemIndex)
  if (!providerStates[key]) {
    providerStates[key] = {}
  }
  return providerStates[key]
}

function getProviderStateKey(itemIndex: number) {
  return String(itemIndex)
}

function getItemFieldState(itemIndex: number, rule: NormalizedFormCreateRule) {
  return rule.field ? getItemControlResult(itemIndex)?.fieldStates[rule.field] : undefined
}

let controlCacheRules: NormalizedFormCreateRule[] | undefined
let rowControlCache = new WeakMap<Record<string, any>, ReturnType<typeof applyControlRules>>()

function getItemControlResult(itemIndex: number) {
  const rules = baseChildRules.value
  if (controlCacheRules !== rules) {
    controlCacheRules = rules
    rowControlCache = new WeakMap<Record<string, any>, ReturnType<typeof applyControlRules>>()
  }
  const row = rows.value[itemIndex]
  if (!row) {
    return applyControlRules(rules, {})
  }
  const cached = rowControlCache.get(row)
  if (cached) {
    return cached
  }
  const result = applyControlRules(rules, row)
  rowControlCache.set(row, result)
  return result
}

function getRenderRule(rule: NormalizedFormCreateRule, itemIndex: number): NormalizedFormCreateRule {
  return {
    ...rule,
    field: getChildProp(itemIndex, rule.field),
  }
}

function getChildProp(itemIndex: number, field?: string) {
  return field && props.rule.field ? `${props.rule.field}.${itemIndex}.${field}` : field
}

function getItemValue(itemIndex: number, field?: string) {
  if (!field) {
    return undefined
  }
  return rows.value[itemIndex]?.[field]
}

function getInputNumberValue(itemIndex: number, field?: string) {
  const value = getItemValue(itemIndex, field)
  return value === undefined || value === null ? '' : value
}

function setItemValue(itemIndex: number, field: string | undefined, value: any) {
  if (!field) {
    return
  }
  const nextRows = [...rows.value]
  nextRows[itemIndex] = {
    ...(nextRows[itemIndex] || {}),
    [field]: value,
  }
  emitValue(nextRows)
  const rule = getItemRules(itemIndex).find(item => item.field === field)
  if (rule) {
    handleChildRuleEvent(getRenderRule(rule, itemIndex), 'change', value)
  }
}

function handleChildRuleEvent(rule: NormalizedFormCreateRule, eventName: string, ...args: any[]) {
  const handler = getRuleEventHandler(rule, eventName)
  if (typeof handler !== 'function') {
    return
  }
  try {
    handler(...args, rule, props.api)
  } catch (error) {
    console.warn(`[form-create] child rule ${eventName} event failed`, error)
  }
}

function addItem() {
  if (!canAdd.value) {
    return
  }
  emitValue([...rows.value, createDefaultRow()])
}

function removeItem(itemIndex: number) {
  if (!canRemove.value) {
    return
  }
  const nextRows = [...rows.value]
  nextRows.splice(itemIndex, 1)
  removeCollapsedRow(itemIndex)
  removeProviderRow(itemIndex)
  emitValue(nextRows)
}

function moveItem(fromIndex: number, toIndex: number) {
  if (props.disabled || toIndex < 0 || toIndex >= rows.value.length || fromIndex === toIndex) {
    return
  }
  const nextRows = [...rows.value]
  const [item] = nextRows.splice(fromIndex, 1)
  nextRows.splice(toIndex, 0, item)
  moveCollapsedRow(fromIndex, toIndex)
  moveProviderRow(fromIndex, toIndex)
  emitValue(nextRows)
}

function removeCollapsedRow(removeIndex: number) {
  const nextCollapsed: Record<number, boolean> = {}
  Object.entries(collapsedRows.value).forEach(([key, value]) => {
    const index = Number(key)
    if (!Number.isInteger(index) || index === removeIndex) {
      return
    }
    nextCollapsed[index > removeIndex ? index - 1 : index] = value
  })
  collapsedRows.value = nextCollapsed
}

function moveCollapsedRow(fromIndex: number, toIndex: number) {
  const nextCollapsed: Record<number, boolean> = {}
  Object.entries(collapsedRows.value).forEach(([key, value]) => {
    const index = Number(key)
    if (!Number.isInteger(index)) {
      return
    }
    if (index === fromIndex) {
      nextCollapsed[toIndex] = value
    } else if (index === toIndex) {
      nextCollapsed[fromIndex] = value
    } else {
      nextCollapsed[index] = value
    }
  })
  collapsedRows.value = nextCollapsed
}

function clearProviderStates() {
  Object.keys(providerStates).forEach((key) => {
    delete providerStates[key]
  })
}

function removeProviderRow(removeIndex: number) {
  const nextStates: Record<string, Record<string, FormCreateProviderState>> = {}
  Object.entries(providerStates).forEach(([key, value]) => {
    const index = Number(key)
    if (!Number.isInteger(index) || index === removeIndex) {
      return
    }
    nextStates[String(index > removeIndex ? index - 1 : index)] = value
  })
  clearProviderStates()
  Object.assign(providerStates, nextStates)
}

function moveProviderRow(fromIndex: number, toIndex: number) {
  const nextStates: Record<string, Record<string, FormCreateProviderState>> = {}
  Object.entries(providerStates).forEach(([key, value]) => {
    const index = Number(key)
    if (!Number.isInteger(index)) {
      return
    }
    if (index === fromIndex) {
      nextStates[String(toIndex)] = value
    } else if (index === toIndex) {
      nextStates[String(fromIndex)] = value
    } else {
      nextStates[key] = value
    }
  })
  clearProviderStates()
  Object.assign(providerStates, nextStates)
}

function emitValue(value: Record<string, any>[]) {
  emit('update:modelValue', value)
  emit('change', value)
}

function isChildDisabled(rule: NormalizedFormCreateRule, itemIndex: number) {
  return isRuleDisabled(!!props.disabled || !!rule.props?.disabled, getItemFieldState(itemIndex, rule), rule)
}

function toggleItem(itemIndex: number) {
  if (!collapseEnabled.value) {
    return
  }
  collapsedRows.value = {
    ...collapsedRows.value,
    [itemIndex]: !isItemCollapsed(itemIndex),
  }
}

function isItemCollapsed(itemIndex: number) {
  if (!collapseEnabled.value) {
    return false
  }
  return collapsedRows.value[itemIndex] ?? defaultCollapsed.value
}

function getItemTitle(itemIndex: number) {
  const title = props.rule.props?.title
  if (typeof title === 'string' && title.trim()) {
    return title.replace('{index}', String(itemIndex + 1))
  }
  return `${props.rule.title || '子表单'} ${itemIndex + 1}`
}

function formatDisplayValue(value: any) {
  if (Array.isArray(value)) {
    return value.join('，')
  }
  if (value === undefined || value === null || value === '') {
    return '-'
  }
  return String(value)
}

function getLayoutGapHeight(rule: NormalizedFormCreateRule) {
  const height = rule.props?.height
  if (typeof height === 'number') {
    return `${height}px`
  }
  if (typeof height === 'string' && height.trim()) {
    return height
  }
  return '24rpx'
}

function scheduleProviderFetchEffects() {
  providerFetchVersion += 1
  const version = providerFetchVersion
  if (providerFetchTimer) {
    clearTimeout(providerFetchTimer)
  }
  providerFetchTimer = setTimeout(() => {
    providerFetchTimer = undefined
    void refreshProviderFetchEffects(version)
  }, 300)
}

async function refreshProviderFetchEffects(version: number) {
  const results: Array<{
    results: Awaited<ReturnType<typeof resolveRuleFetchEffects>>
    states: Record<string, FormCreateProviderState>
  }> = []
  for (let itemIndex = 0; itemIndex < rows.value.length; itemIndex += 1) {
    const states = ensureItemProviderStates(itemIndex)
    const context = getItemProviderContext(itemIndex)
    const controlResult = getItemControlResult(itemIndex)
    const itemResults = await resolveRuleFetchEffects(controlResult.rules, context)
    results.push({ results: itemResults, states })
  }
  if (version !== providerFetchVersion) {
    return
  }
  results.forEach(({ results: itemResults, states }) => {
    itemResults.forEach((result) => {
      if (!states[result.fieldId]) {
        states[result.fieldId] = {}
      }
      states[result.fieldId].fetchLoaded = true
      states[result.fieldId].fetchPatch = result.patch
    })
  })
}

onBeforeUnmount(() => {
  providerFetchVersion += 1
  if (providerFetchTimer) {
    clearTimeout(providerFetchTimer)
    providerFetchTimer = undefined
  }
})
</script>

<style lang="scss" scoped>
.fc-sub-form {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  width: 100%;
}

.fc-sub-form__item {
  overflow: hidden;
  background: #f8f9fb;
  border: 1rpx solid #eceff3;
  border-radius: 12rpx;
}

.fc-sub-form__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
  min-height: 80rpx;
  padding: 0 20rpx;
  background: #fff;
  border-bottom: 1rpx solid #eceff3;
}

.fc-sub-form__header-main {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 12rpx;
  min-width: 0;
}

.fc-sub-form__title {
  overflow: hidden;
  color: #1f2329;
  flex: 1;
  font-size: 28rpx;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fc-sub-form__collapse {
  color: #3b7cff;
  flex-shrink: 0;
  font-size: 24rpx;
}

.fc-sub-form__actions {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 8rpx;
}

.fc-sub-form__body {
  overflow: hidden;
}

.fc-sub-form__layout-title {
  color: #1f2329;
  font-size: 28rpx;
  font-weight: 600;
  line-height: 40rpx;
  padding: 24rpx 24rpx 8rpx;
}

.fc-sub-form__layout-gap {
  background: transparent;
}

.fc-sub-form__text {
  color: #333;
  font-size: 28rpx;
  line-height: 1.6;
  word-break: break-all;
}

.fc-sub-form__unsupported,
.fc-sub-form__empty {
  color: #999;
  font-size: 26rpx;
  padding: 24rpx;
  text-align: center;
}
</style>
