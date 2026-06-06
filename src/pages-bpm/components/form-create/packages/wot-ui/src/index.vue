<template>
  <view class="fc-wot">
    <view class="fc-wot__content" :style="{ display: hidden ? 'none' : 'block' }">
      <wd-form
        ref="formRef"
        :model="formData"
        :schema="formSchema"
        :border="formOption.form?.border"
        :error-type="formOption.form?.errorType || 'toast'"
        :layout="formOption.form?.layout"
        :title-width="titleWidth"
        :value-align="formOption.form?.valueAlign"
      >
        <wd-cell-group :border="formOption.form?.border !== false">
          <template v-for="rule in visibleRules" :key="rule.__fcId">
            <view v-if="isHiddenFieldType(rule)" style="display: none" />

            <view v-else-if="isLayoutTitleType(rule)" class="fc-wot__layout-title">
              {{ rule.title }}
            </view>

            <view
              v-else-if="isLayoutGapType(rule)"
              class="fc-wot__layout-gap"
              :style="{ height: getLayoutGapHeight(rule) }"
            />

            <FcAlert
              v-else-if="isAlertType(rule)"
              :rule="rule"
              style=""
            />

            <FcTitle
              v-else-if="isTitleType(rule)"
              :rule="rule"
              style=""
            />

            <FcHtml
              v-else-if="isHtmlType(rule)"
              :rule="rule"
              style=""
            />

            <FcDivider
              v-else-if="isDividerType(rule)"
              :rule="rule"
              style=""
            />

            <FcTag
              v-else-if="isTagType(rule)"
              :rule="rule"
              style=""
            />

            <FcImage
              v-else-if="isImageType(rule)"
              :rule="rule"
              style=""
            />

            <FcIframe
              v-else-if="isIframeType(rule)"
              :rule="rule"
              :title-width="titleWidth"
              style=""
            />

            <FcRichText
              v-else-if="isRichTextType(rule)"
              :model-value="getValue(rule)"
              :rule="rule"
              :title-width="titleWidth"
              :disabled="isDisabled(rule)"
              style=""
              @update:model-value="handleUpdate(rule, $event)"
            />

            <FcSignature
              v-else-if="isSignatureType(rule)"
              :model-value="getValue(rule)"
              :rule="rule"
              :title-width="titleWidth"
              :disabled="isDisabled(rule)"
              style=""
              @clear="handleRuleEvent(rule, 'clear')"
              @confirm="handleRuleEvent(rule, 'confirm', $event)"
              @update:model-value="handleUpdate(rule, $event)"
            />

            <FcButton
              v-else-if="isButtonType(rule)"
              :rule="rule"
              :disabled="isDisabled(rule)"
              style=""
              @click="handleRuleEvent(rule, 'click')"
            />

            <wd-form-item
              v-else-if="isInputType(rule)"
              :title="rule.title"
              :title-width="titleWidth"
              :prop="rule.field"
            >
              <wd-input
                :model-value="getValue(rule)"
                :type="getInputType(rule)"
                :placeholder="getPlaceholder(rule)"
                :disabled="isDisabled(rule)"
                clearable
                v-bind="getRuleProps(rule)"
                @blur="handleRuleEvent(rule, 'blur', $event)"
                @clear="handleRuleEvent(rule, 'clear')"
                @update:model-value="handleUpdate(rule, $event)"
              />
            </wd-form-item>

            <wd-form-item
              v-else-if="isTextareaType(rule)"
              :title="rule.title"
              :title-width="titleWidth"
              :prop="rule.field"
              layout="vertical"
            >
              <wd-textarea
                :model-value="getValue(rule)"
                :placeholder="getPlaceholder(rule)"
                :disabled="isDisabled(rule)"
                clearable
                v-bind="getRuleProps(rule)"
                @blur="handleRuleEvent(rule, 'blur', $event)"
                @clear="handleRuleEvent(rule, 'clear')"
                @update:model-value="handleUpdate(rule, $event)"
              />
            </wd-form-item>

            <wd-form-item
              v-else-if="isInputNumberType(rule)"
              :title="rule.title"
              :title-width="titleWidth"
              :prop="rule.field"
              center
            >
              <wd-input-number
                v-bind="getRuleProps(rule)"
                :model-value="getInputNumberValue(rule)"
                :min="rule.props?.min"
                :max="rule.props?.max"
                :step="rule.props?.step || 1"
                :allow-null="rule.props?.allowNull ?? true"
                :update-on-init="rule.props?.updateOnInit ?? false"
                :disabled="isDisabled(rule)"
                @update:model-value="handleUpdate(rule, $event)"
              />
            </wd-form-item>

            <FcUserSelect
              v-else-if="isUserSelectType(rule)"
              :model-value="getValue(rule)"
              :rule="rule"
              :title-width="titleWidth"
              :disabled="isDisabled(rule)"
              style=""
              @update:model-value="handleUpdate(rule, $event)"
            />

            <FcDeptSelect
              v-else-if="isDeptSelectType(rule)"
              :model-value="getValue(rule)"
              :rule="rule"
              :title-width="titleWidth"
              :disabled="isDisabled(rule)"
              style=""
              @update:model-value="handleUpdate(rule, $event)"
            />

            <FcDictSelect
              v-else-if="isDictSelectType(rule)"
              :model-value="getValue(rule)"
              :rule="rule"
              :title-width="titleWidth"
              :disabled="isDisabled(rule)"
              style=""
              @update:model-value="handleUpdate(rule, $event)"
            />

            <FcApiSelect
              v-else-if="isApiSelectType(rule)"
              :model-value="getValue(rule)"
              :rule="rule"
              :title-width="titleWidth"
              :disabled="isDisabled(rule)"
              style=""
              @update:model-value="handleUpdate(rule, $event)"
            />

            <FcAreaSelect
              v-else-if="isAreaSelectType(rule)"
              :model-value="getValue(rule)"
              :rule="rule"
              :title-width="titleWidth"
              :disabled="isDisabled(rule)"
              style=""
              @update:model-value="handleUpdate(rule, $event)"
            />

            <FcCascader
              v-else-if="isCascaderType(rule)"
              :model-value="getValue(rule)"
              :rule="rule"
              :title-width="titleWidth"
              :disabled="isDisabled(rule)"
              style=""
              @confirm="handleRuleEvent(rule, 'confirm', $event)"
              @update:model-value="handleUpdate(rule, $event)"
            />

            <FcCalendar
              v-else-if="isCalendarType(rule)"
              :model-value="getValue(rule)"
              :rule="rule"
              :title-width="titleWidth"
              :disabled="isDisabled(rule)"
              style=""
              @confirm="handleRuleEvent(rule, 'confirm', $event)"
              @update:model-value="handleUpdate(rule, $event)"
            />

            <FcTreeSelect
              v-else-if="isTreeSelectType(rule)"
              :model-value="getValue(rule)"
              :rule="rule"
              :title-width="titleWidth"
              :disabled="isDisabled(rule)"
              style=""
              @update:model-value="handleUpdate(rule, $event)"
            />

            <FcTransfer
              v-else-if="isTransferType(rule)"
              :model-value="getValue(rule)"
              :rule="rule"
              :title-width="titleWidth"
              :disabled="isDisabled(rule)"
              style=""
              @update:model-value="handleUpdate(rule, $event)"
            />

            <FcSelect
              v-else-if="isSelectType(rule)"
              :model-value="getValue(rule)"
              :rule="rule"
              :title-width="titleWidth"
              :disabled="isDisabled(rule)"
              style=""
              @confirm="handleRuleEvent(rule, 'confirm', $event)"
              @update:model-value="handleUpdate(rule, $event)"
            />

            <FcColorPicker
              v-else-if="isColorPickerType(rule)"
              :model-value="getValue(rule)"
              :rule="rule"
              :title-width="titleWidth"
              :disabled="isDisabled(rule)"
              style=""
              @update:model-value="handleUpdate(rule, $event)"
            />

            <FcRadio
              v-else-if="rule.type === 'radio'"
              :model-value="getValue(rule)"
              :rule="rule"
              :title-width="titleWidth"
              :disabled="isDisabled(rule)"
              style=""
              @update:model-value="handleUpdate(rule, $event)"
            />

            <FcCheckbox
              v-else-if="rule.type === 'checkbox'"
              :model-value="getValue(rule)"
              :rule="rule"
              :title-width="titleWidth"
              :disabled="isDisabled(rule)"
              style=""
              @update:model-value="handleUpdate(rule, $event)"
            />

            <wd-form-item
              v-else-if="rule.type === 'switch'"
              :title="rule.title"
              :title-width="titleWidth"
              :prop="rule.field"
              center
            >
              <wd-switch
                :model-value="getValue(rule)"
                :disabled="isDisabled(rule)"
                v-bind="getRuleProps(rule)"
                @update:model-value="handleUpdate(rule, $event)"
              />
            </wd-form-item>

            <FcDatePicker
              v-else-if="isDatePickerType(rule)"
              :model-value="getValue(rule)"
              :rule="rule"
              :title-width="titleWidth"
              :disabled="isDisabled(rule)"
              style=""
              @confirm="handleRuleEvent(rule, 'confirm', $event)"
              @update:model-value="handleUpdate(rule, $event)"
            />

            <FcTimePicker
              v-else-if="isTimePickerType(rule)"
              :model-value="getValue(rule)"
              :rule="rule"
              :title-width="titleWidth"
              :disabled="isDisabled(rule)"
              style=""
              @confirm="handleRuleEvent(rule, 'confirm', $event)"
              @update:model-value="handleUpdate(rule, $event)"
            />

            <wd-form-item
              v-else-if="rule.type === 'rate'"
              :title="rule.title"
              :title-width="titleWidth"
              :prop="rule.field"
              center
            >
              <wd-rate
                :model-value="getValue(rule)"
                :disabled="isDisabled(rule)"
                v-bind="getRuleProps(rule)"
                @update:model-value="handleUpdate(rule, $event)"
              />
            </wd-form-item>

            <wd-form-item
              v-else-if="isSliderType(rule)"
              :title="rule.title"
              :title-width="titleWidth"
              :prop="rule.field"
              layout="vertical"
            >
              <wd-slider
                :model-value="getValue(rule)"
                :disabled="isDisabled(rule)"
                v-bind="getRuleProps(rule)"
                :range="isSliderRangeType(rule)"
                @change="handleUpdate(rule, $event)"
              />
            </wd-form-item>

            <FcUploader
              v-else-if="isUploadType(rule)"
              :model-value="getValue(rule)"
              :rule="rule"
              :title-width="titleWidth"
              :disabled="isDisabled(rule)"
              style=""
              @fail="handleRuleEvent(rule, 'fail', $event)"
              @remove="handleRuleEvent(rule, 'remove', $event)"
              @success="handleRuleEvent(rule, 'success', $event)"
              @update:model-value="handleUpdate(rule, $event)"
            />

            <FcSubForm
              v-else-if="isSubFormType(rule)"
              :model-value="getValue(rule)"
              :rule="rule"
              :api="api"
              :option="formOption"
              :title-width="titleWidth"
              :disabled="isDisabled(rule)"
              style=""
              @update:model-value="handleUpdate(rule, $event)"
            />

            <wd-form-item
              v-else-if="rule.type === 'span'"
              :title="rule.title"
              :title-width="titleWidth"
              :prop="rule.field"
            >
              <view class="fc-wot__text">
                {{ formatDisplayValue(getValue(rule)) }}
              </view>
            </wd-form-item>

            <wd-form-item
              v-else
              :title="rule.title || rule.type"
              :title-width="titleWidth"
              :prop="rule.field"
              layout="vertical"
            >
              <view class="fc-wot__unsupported">
                暂不支持「{{ rule.title || rule.type }}」组件
              </view>
            </wd-form-item>
          </template>

          <view v-if="visibleRules.length === 0" class="fc-wot__empty">
            暂无表单字段
          </view>
        </wd-cell-group>
      </wd-form>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { FormInstance } from '@wot-ui/ui/components/wd-form/types'
import type {
  FormCreateApi,
  FormCreateFieldState,
  FormCreateOption,
  FormCreateRule,
  NormalizedFormCreateRule,
} from '../../../types/typing'
import type { FormCreateProviderContext, FormCreateProviderState } from '../../core/src/provider'
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import {
  applyControlRules,
  applyRuleProviders,
  createApi,
  createFormSchema,
  createInitialFormData,
  getDefaultValue,
  isRuleDisabled,
  isRuleHidden,
  normalizeRules,
  resolveRuleFetchEffects,
} from '../../core/src'
import { deepMerge, hasOwn, toArray } from '../../utils/src'
import FcButton from './components/button.vue'
import FcCalendar from './components/calendar.vue'
import FcCascader from './components/cascader.vue'
import FcCheckbox from './components/checkbox.vue'
import FcColorPicker from './components/colorPicker.vue'
import FcApiSelect from './components/custom/apiSelect.vue'
import FcAreaSelect from './components/custom/areaSelect.vue'
import FcDeptSelect from './components/custom/deptSelect.vue'
import FcDictSelect from './components/custom/dictSelect.vue'
import FcUserSelect from './components/custom/userSelect.vue'
import FcDatePicker from './components/datePicker.vue'
import FcAlert from './components/display/alert.vue'
import FcDivider from './components/display/divider.vue'
import FcHtml from './components/display/html.vue'
import FcImage from './components/display/image.vue'
import FcTag from './components/display/tag.vue'
import FcTitle from './components/display/title.vue'
import FcIframe from './components/iframe.vue'
import FcRadio from './components/radio.vue'
import FcRichText from './components/richText.vue'
import FcSelect from './components/select.vue'
import FcSignature from './components/signature.vue'
import FcSubForm from './components/subForm.vue'
import FcTimePicker from './components/timePicker.vue'
import FcTransfer from './components/transfer.vue'
import FcTreeSelect from './components/treeSelect.vue'
import FcUploader from './components/uploader.vue'
import getConfig from './core/config'
import {
  getInputType,
  getPlaceholder,
  getRuleEventHandler,
  getRuleProps,
  getTitleWidth,
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
} from './core/utils'
import { parseRules } from './parsers'

const props = withDefaults(defineProps<{
  api?: FormCreateApi
  disabled?: boolean
  modelValue?: Record<string, any>
  option?: FormCreateOption
  preview?: boolean
  readonly?: boolean
  rule?: FormCreateRule[]
}>(), {
  disabled: false,
  modelValue: () => ({}),
  option: () => ({}),
  preview: false,
  readonly: false,
  rule: () => [],
})

const emit = defineEmits<{
  'update:api': [api: FormCreateApi]
  'update:modelValue': [data: Record<string, any>]
  'change': [data: Record<string, any>, field?: string, value?: any]
  'emit-event': [name: string, ...args: any[]]
  'mounted': [api: FormCreateApi]
  'reset': [api: FormCreateApi]
  'submit': [data: Record<string, any>, api: FormCreateApi]
  'validate-fail': [errors: { prop: string, message: string }[], api: FormCreateApi]
}>()

const formRef = ref<FormInstance>()
const formData = ref<Record<string, any>>({})
const initialFormValues = ref<Record<string, any>>({})
const fieldStates = reactive<Record<string, FormCreateFieldState>>({})
const providerStates = reactive<Record<string, FormCreateProviderState>>({})
const apiRulePatches = reactive<Record<string, Partial<NormalizedFormCreateRule>>>({})
const changeStatus = ref(false)
const hidden = ref(false)
let api: FormCreateApi
// 用于识别本组件 emit('update:modelValue') 后父组件同步回绑的值，避免把用户输入写成 resetFields 的初始基准。
let syncingModelValue = false

const formOption = computed(() => getConfig(props.option))
const globalDisabled = computed(() => props.disabled || props.readonly || props.preview)
const titleWidth = computed(() => getTitleWidth(formOption.value))
const parsedRules = computed(() => parseRules(props.rule))
const baseRules = computed(() => normalizeRules(parsedRules.value))
const patchedBaseRules = computed(() => applyApiRulePatches(baseRules.value))
const controlResult = computed(() => applyControlRules(patchedBaseRules.value, formData.value))
const providerSourceRules = computed(() => applyApiRulePatches(controlResult.value.rules))
const providerContext: FormCreateProviderContext = {
  get api() {
    return api
  },
  get formData() {
    return formData.value
  },
  get option() {
    return formOption.value
  },
  states: providerStates,
}
const rules = computed(() => applyRuleProviders(providerSourceRules.value, providerContext))
const visibleRules = computed(() => rules.value.filter(rule => !isRuleHidden(rule, fieldStates[rule.field || ''])))
const formSchema = computed(() => createFormSchema(() => rules.value, fieldStates, parseRules, providerContext))

function getValue(rule: NormalizedFormCreateRule) {
  return rule.field ? formData.value[rule.field] : undefined
}

function getInputNumberValue(rule: NormalizedFormCreateRule) {
  const value = getValue(rule)
  return value === undefined || value === null ? '' : value
}

function handleUpdate(rule: NormalizedFormCreateRule, value: any) {
  if (!rule.field) {
    return
  }
  formData.value[rule.field] = value
  changeStatus.value = true
  handleRuleEvent(rule, 'change', value)
  emitChange(rule.field, value)
  runRuleUpdates(rule, value)
}

function emitChange(field?: string, value?: any) {
  changeStatus.value = true
  const data = { ...formData.value }
  syncingModelValue = true
  emit('update:modelValue', data)
  emit('change', data, field, value)
  callOptionHook('onChange', data, field, value)
  emit('emit-event', 'change', data, field, value, api)
}

function callOptionHook(name: keyof FormCreateOption, ...args: any[]) {
  const handler = formOption.value[name]
  if (typeof handler !== 'function') {
    return
  }
  try {
    handler(...args, api)
  } catch (error) {
    console.warn(`[form-create] option.${String(name)} failed`, error)
  }
}

function handleRuleEvent(rule: NormalizedFormCreateRule, eventName: string, ...args: any[]) {
  const handler = getRuleEventHandler(rule, eventName)
  if (typeof handler === 'function') {
    try {
      handler(...args, rule, api)
    } catch (error) {
      console.warn(`[form-create] rule ${eventName} event failed`, error)
    }
  }
  emit('emit-event', eventName, ...args, rule, api)
  getRuleEmitEventNames(rule, eventName).forEach((emitName) => {
    ;(emit as any)(emitName, ...args)
    emit('emit-event', emitName, ...args, rule, api)
  })
}

function getRuleEmitEventNames(rule: NormalizedFormCreateRule, eventName: string) {
  return toArray(rule.emit)
    .map(item => normalizeRuleEmitName(rule, eventName, item))
    .filter(Boolean) as string[]
}

function normalizeRuleEmitName(rule: NormalizedFormCreateRule, eventName: string, emitConfig: any) {
  if (!emitConfig) {
    return undefined
  }
  const name = typeof emitConfig === 'string' ? emitConfig : emitConfig.name
  if (name !== eventName) {
    return undefined
  }
  const prefix = typeof emitConfig === 'object'
    ? emitConfig.prefix || emitConfig.emitPrefix || rule.emitPrefix || rule.field || rule.name
    : rule.emitPrefix || rule.field || rule.name
  return prefix ? toKebabCase(`${prefix}-${eventName}`) : undefined
}

function toKebabCase(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_:.]+/g, '-')
    .toLowerCase()
}

function getRuleLinks(rule: NormalizedFormCreateRule) {
  if (!rule.link) {
    return []
  }
  return Array.isArray(rule.link) ? rule.link : [rule.link]
}

function isPartialRule(value: unknown): value is Partial<FormCreateRule> {
  return !!value
    && typeof value === 'object'
    && !Array.isArray(value)
    && typeof (value as { then?: unknown }).then !== 'function'
}

function runRuleUpdates(sourceRule: NormalizedFormCreateRule, value: any) {
  if (!sourceRule.field && !sourceRule.name) {
    return
  }
  const sourceFields = [sourceRule.field, sourceRule.name].filter(Boolean) as string[]
  const visited = new Set<string>()
  runRuleUpdate(sourceRule, sourceRule.field, value, sourceRule, visited)
  rules.value.forEach((rule) => {
    if (rule.__fcId === sourceRule.__fcId || typeof rule.update !== 'function') {
      return
    }
    const links = getRuleLinks(rule)
    if (links.some(link => sourceFields.includes(link))) {
      runRuleUpdate(rule, sourceRule.field, value, sourceRule, visited)
    }
  })
}

function runRuleUpdate(
  rule: NormalizedFormCreateRule,
  linkField: string | undefined,
  value: any,
  origin: NormalizedFormCreateRule,
  visited: Set<string>,
) {
  if (typeof rule.update !== 'function' || visited.has(rule.__fcId)) {
    return
  }
  visited.add(rule.__fcId)
  try {
    const result = rule.update(rule.field ? formData.value[rule.field] : value, rule, api, {
      field: rule.field,
      formData: { ...formData.value },
      linkField,
      origin,
      value,
    })
    if (typeof result === 'boolean') {
      if (rule.field) {
        api.hidden(result, rule.field)
      }
    } else if (isPartialRule(result)) {
      api.mergeRule(rule.__fcId, result)
    }
  } catch (error) {
    console.warn('[form-create] rule.update failed', error)
  }
}

function emitReset() {
  callOptionHook('onReset')
  emit('reset', api)
  emit('emit-event', 'reset', api)
}

function emitSubmit(data: Record<string, any>) {
  callOptionHook('onSubmit', data)
  emit('submit', data, api)
  emit('emit-event', 'submit', data, api)
}

function emitValidateFail(errors: { prop: string, message: string }[]) {
  callOptionHook('onValidateFail', errors)
  emit('validate-fail', errors, api)
  emit('emit-event', 'validate-fail', errors, api)
}

function isDisabled(rule: NormalizedFormCreateRule) {
  return isRuleDisabled(globalDisabled.value || !!rule.props?.disabled, fieldStates[rule.field || ''], rule)
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

function applyApiRulePatches(nextRules: NormalizedFormCreateRule[]) {
  return nextRules.map((rule) => {
    const patch = apiRulePatches[rule.__fcId]
    return patch ? deepMerge<NormalizedFormCreateRule>(rule, patch) : rule
  })
}

api = createApi({
  changeStatus,
  disabled: globalDisabled,
  emitChange: () => emitChange(),
  emitReset,
  emitSubmit,
  emitValidateFail,
  fieldStates,
  formData,
  formRef,
  hidden,
  initialFormData: initialFormValues,
  option: formOption,
  refresh: () => scheduleProviderFetchEffects(),
  rulePatches: apiRulePatches,
  rules,
})

let providerFetchVersion = 0
let providerFetchTimer: ReturnType<typeof setTimeout> | undefined

watch(
  () => [props.modelValue, props.option?.formData, props.rule],
  () => {
    if (syncingModelValue && isSamePlainValue(props.modelValue || {}, formData.value)) {
      syncingModelValue = false
      return
    }
    syncingModelValue = false
    const initialValues = deepMerge<Record<string, any>>(formOption.value.formData || {}, props.modelValue || {})
    initialFormValues.value = initialValues
    formData.value = createInitialFormData(baseRules.value, initialValues)
  },
  { deep: true, immediate: true },
)

function isSamePlainValue(left: unknown, right: unknown) {
  try {
    return JSON.stringify(left) === JSON.stringify(right)
  } catch {
    return false
  }
}

watch(
  rules,
  (nextRules) => {
    nextRules.forEach((rule) => {
      if (rule.field && !fieldStates[rule.field]) {
        fieldStates[rule.field] = {}
      }
      if (rule.field && !hasOwn(formData.value, rule.field)) {
        formData.value[rule.field] = hasOwn(initialFormValues.value, rule.field)
          ? initialFormValues.value[rule.field]
          : rule.value !== undefined ? rule.value : getDefaultValue(rule)
      }
    })
  },
  { immediate: true },
)

watch(
  () => controlResult.value.fieldStates,
  (nextStates) => {
    const fields = new Set([
      ...Object.keys(fieldStates),
      ...Object.keys(nextStates),
    ])
    fields.forEach((field) => {
      if (!fieldStates[field]) {
        fieldStates[field] = {}
      }
      fieldStates[field].controlHidden = nextStates[field]?.controlHidden
      fieldStates[field].controlDisabled = nextStates[field]?.controlDisabled
      fieldStates[field].controlRequired = nextStates[field]?.controlRequired
    })
  },
  { deep: true, immediate: true },
)

watch(
  () => [controlResult.value.rules, formData.value, formOption.value.globalData],
  () => {
    scheduleProviderFetchEffects()
  },
  { deep: true, immediate: true },
)

function scheduleProviderFetchEffects() {
  if (providerFetchTimer) {
    clearTimeout(providerFetchTimer)
  }
  providerFetchTimer = setTimeout(() => {
    providerFetchTimer = undefined
    void refreshProviderFetchEffects()
  }, 300)
}

async function refreshProviderFetchEffects() {
  const version = ++providerFetchVersion
  const results = await resolveRuleFetchEffects(providerSourceRules.value, providerContext)
  if (version !== providerFetchVersion) {
    return
  }
  results.forEach((result) => {
    if (!providerStates[result.fieldId]) {
      providerStates[result.fieldId] = {}
    }
    providerStates[result.fieldId].fetchLoaded = true
    providerStates[result.fieldId].fetchPatch = result.patch
  })
}

onBeforeUnmount(() => {
  if (providerFetchTimer) {
    clearTimeout(providerFetchTimer)
    providerFetchTimer = undefined
  }
})

onMounted(() => {
  emit('update:api', api)
  emit('mounted', api)
  callOptionHook('onMounted')
  emit('emit-event', 'mounted', api)
})

defineExpose({
  ...api,
  api,
})
</script>

<style lang="scss" scoped>
@import './style/index.scss';
</style>
