<template>
  <view class="fc-wot">
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
          <view v-if="isLayoutTitleType(rule)" class="fc-wot__layout-title">
            {{ rule.title }}
          </view>

          <view
            v-else-if="isLayoutGapType(rule)"
            class="fc-wot__layout-gap"
            :style="{ height: getLayoutGapHeight(rule) }"
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
              :model-value="getValue(rule)"
              :min="rule.props?.min ?? 0"
              :max="rule.props?.max"
              :step="rule.props?.step || 1"
              :disabled="isDisabled(rule)"
              v-bind="getRuleProps(rule)"
              @update:model-value="handleUpdate(rule, $event)"
            />
          </wd-form-item>

          <FcUserSelect
            v-else-if="isUserSelectType(rule)"
            :model-value="getValue(rule)"
            :rule="rule"
            :title-width="titleWidth"
            :disabled="isDisabled(rule)"
            @update:model-value="handleUpdate(rule, $event)"
          />

          <FcDeptSelect
            v-else-if="isDeptSelectType(rule)"
            :model-value="getValue(rule)"
            :rule="rule"
            :title-width="titleWidth"
            :disabled="isDisabled(rule)"
            @update:model-value="handleUpdate(rule, $event)"
          />

          <FcDictSelect
            v-else-if="isDictSelectType(rule)"
            :model-value="getValue(rule)"
            :rule="rule"
            :title-width="titleWidth"
            :disabled="isDisabled(rule)"
            @update:model-value="handleUpdate(rule, $event)"
          />

          <FcApiSelect
            v-else-if="isApiSelectType(rule)"
            :model-value="getValue(rule)"
            :rule="rule"
            :title-width="titleWidth"
            :disabled="isDisabled(rule)"
            @update:model-value="handleUpdate(rule, $event)"
          />

          <FcTreeSelect
            v-else-if="isTreeSelectType(rule)"
            :model-value="getValue(rule)"
            :rule="rule"
            :title-width="titleWidth"
            :disabled="isDisabled(rule)"
            @update:model-value="handleUpdate(rule, $event)"
          />

          <FcSelect
            v-else-if="isSelectType(rule)"
            :model-value="getValue(rule)"
            :rule="rule"
            :title-width="titleWidth"
            :disabled="isDisabled(rule)"
            @update:model-value="handleUpdate(rule, $event)"
          />

          <FcRadio
            v-else-if="rule.type === 'radio'"
            :model-value="getValue(rule)"
            :rule="rule"
            :title-width="titleWidth"
            :disabled="isDisabled(rule)"
            @update:model-value="handleUpdate(rule, $event)"
          />

          <FcCheckbox
            v-else-if="rule.type === 'checkbox'"
            :model-value="getValue(rule)"
            :rule="rule"
            :title-width="titleWidth"
            :disabled="isDisabled(rule)"
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
            @update:model-value="handleUpdate(rule, $event)"
          />

          <FcTimePicker
            v-else-if="isTimePickerType(rule)"
            :model-value="getValue(rule)"
            :rule="rule"
            :title-width="titleWidth"
            :disabled="isDisabled(rule)"
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
            v-else-if="rule.type === 'slider'"
            :title="rule.title"
            :title-width="titleWidth"
            :prop="rule.field"
            layout="vertical"
          >
            <wd-slider
              :model-value="getValue(rule)"
              :disabled="isDisabled(rule)"
              v-bind="getRuleProps(rule)"
              @change="handleUpdate(rule, $event)"
            />
          </wd-form-item>

          <FcUploader
            v-else-if="isUploadType(rule)"
            :model-value="getValue(rule)"
            :rule="rule"
            :title-width="titleWidth"
            :disabled="isDisabled(rule)"
            @update:model-value="handleUpdate(rule, $event)"
          />

          <FcGroup
            v-else-if="isUnsupportedFormContainerType(rule)"
            :rule="rule"
            :title-width="titleWidth"
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
          >
            <wd-input
              :model-value="getValue(rule)"
              :placeholder="getPlaceholder(rule)"
              :disabled="isDisabled(rule)"
              clearable
              @update:model-value="handleUpdate(rule, $event)"
            />
          </wd-form-item>
        </template>

        <view v-if="visibleRules.length === 0" class="fc-wot__empty">
          暂无表单字段
        </view>
      </wd-cell-group>
    </wd-form>
  </view>
</template>

<script lang="ts" setup>
import type { FormInstance } from '@wot-ui/ui/components/wd-form/types'
import type { FormCreateApi, FormCreateFieldState, FormCreateOption, FormCreateRule, NormalizedFormCreateRule } from '../../../types/typing'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { createApi, createFormSchema, createInitialFormData, isRuleDisabled, isRuleHidden, normalizeRules } from '../../core/src'
import { deepMerge } from '../../utils/src'
import { FcApiSelect, FcCheckbox, FcDatePicker, FcDeptSelect, FcDictSelect, FcGroup, FcRadio, FcSelect, FcTimePicker, FcTreeSelect, FcUploader, FcUserSelect } from './components'
import getConfig from './core/config'
import {
  getInputType,
  getPlaceholder,
  getRuleProps,
  getTitleWidth,
  isApiSelectType,
  isDatePickerType,
  isDeptSelectType,
  isDictSelectType,
  isInputNumberType,
  isInputType,
  isLayoutGapType,
  isLayoutTitleType,
  isSelectType,
  isTextareaType,
  isTimePickerType,
  isTreeSelectType,
  isUnsupportedFormContainerType,
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
  'mounted': [api: FormCreateApi]
}>()

const formRef = ref<FormInstance>()
const formData = ref<Record<string, any>>({})
const fieldStates = reactive<Record<string, FormCreateFieldState>>({})

const formOption = computed(() => getConfig(props.option))
const titleWidth = computed(() => getTitleWidth(formOption.value))
const parsedRules = computed(() => parseRules(props.rule))
const rules = computed(() => normalizeRules(parsedRules.value))
const visibleRules = computed(() => rules.value.filter(rule => !isRuleHidden(rule, fieldStates[rule.field || ''])))
const formSchema = computed(() => createFormSchema(() => rules.value, fieldStates))

watch(
  rules,
  (nextRules) => {
    nextRules.forEach((rule) => {
      if (rule.field && !fieldStates[rule.field]) {
        fieldStates[rule.field] = {}
      }
    })
  },
  { immediate: true },
)

watch(
  () => [props.modelValue, props.option?.formData, props.rule],
  () => {
    const initialValues = deepMerge<Record<string, any>>(formOption.value.formData || {}, props.modelValue || {})
    formData.value = createInitialFormData(rules.value, initialValues)
  },
  { deep: true, immediate: true },
)

function getValue(rule: NormalizedFormCreateRule) {
  return rule.field ? formData.value[rule.field] : undefined
}

function handleUpdate(rule: NormalizedFormCreateRule, value: any) {
  if (!rule.field) {
    return
  }
  formData.value[rule.field] = value
  emitChange(rule.field, value)
}

function emitChange(field?: string, value?: any) {
  const data = { ...formData.value }
  emit('update:modelValue', data)
  emit('change', data, field, value)
}

function isDisabled(rule: NormalizedFormCreateRule) {
  const globalDisabled = props.disabled || props.readonly || props.preview || !!rule.props?.disabled
  return isRuleDisabled(globalDisabled, fieldStates[rule.field || ''])
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
    return `${height}rpx`
  }
  if (typeof height === 'string' && height.trim()) {
    return height
  }
  return '24rpx'
}

const api = createApi({
  emitChange: () => emitChange(),
  fieldStates,
  formData,
  formRef,
  rules,
})

onMounted(() => {
  emit('update:api', api)
  emit('mounted', api)
})

defineExpose({
  ...api,
  api,
})
</script>

<style lang="scss" scoped>
@import './style/index.scss';
</style>
