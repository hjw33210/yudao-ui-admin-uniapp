<template>
  <wd-form-item
    :title="rule.title"
    :title-width="titleWidth"
    :prop="rule.field"
    :value="displayValue"
    :placeholder="placeholder"
    :is-link="!disabled"
    @click="open"
  />

  <wd-select-picker
    v-model="pickerValue"
    v-model:visible="visible"
    :title="rule.title || '选择选项'"
    :columns="options"
    :type="isMultiple ? 'checkbox' : 'radio'"
    :show-confirm="isMultiple"
    :loading="loading"
    :filter-placeholder="rule.props?.filterPlaceholder || '搜索选项'"
    custom-content-class="fc-custom-select__content"
    filterable
    label-key="label"
    value-key="value"
    @confirm="handleConfirm"
  />
</template>

<script lang="ts" setup>
import type { NormalizedFormCreateRule } from '../../../../../types/typing'
import { computed, ref, watch } from 'vue'
import { loadApiSelectOptions } from './api'
import { formatSelectedSummary, isMultipleSelect, normalizeSelectValue } from './utils'
import { getPlaceholder } from '../../core/utils'

const props = defineProps<{
  disabled?: boolean
  modelValue?: any
  rule: NormalizedFormCreateRule
  titleWidth?: string | number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: any]
  change: [value: any]
}>()

const loading = ref(false)
const loadError = ref('')
const options = ref<any[]>([])
const pickerValue = ref<any>([])
const visible = ref(false)

const isMultiple = computed(() => isMultipleSelect(props.rule))
const placeholder = computed(() => getPlaceholder(props.rule, '请选择'))
const displayValue = computed(() =>
  formatSelectedSummary(props.modelValue, options.value, isMultiple.value, '项'),
)

watch(
  () => [props.modelValue, isMultiple.value],
  () => {
    pickerValue.value = normalizeSelectValue(props.modelValue, isMultiple.value)
  },
  { deep: true, immediate: true },
)

watch(
  () => props.rule.props,
  () => loadOptions(),
  { deep: true, immediate: true },
)

async function open() {
  if (props.disabled) {
    return
  }
  if (loadError.value && !loading.value) {
    await loadOptions()
  }
  if (loadError.value && options.value.length === 0) {
    return
  }
  pickerValue.value = normalizeSelectValue(props.modelValue, isMultiple.value)
  visible.value = true
}

function handleConfirm({ value }: { value: any }) {
  const nextValue = isMultiple.value
    ? Array.isArray(value) ? value : []
    : value === '' ? undefined : value
  emit('update:modelValue', nextValue)
  emit('change', nextValue)
}

async function loadOptions() {
  loading.value = true
  loadError.value = ''
  try {
    options.value = await loadApiSelectOptions(props.rule)
  } catch (error) {
    console.error('加载接口选项失败:', error)
    options.value = []
    loadError.value = '接口选项加载失败，请稍后重试'
    showLoadError(loadError.value)
  } finally {
    loading.value = false
  }
}

function showLoadError(message: string) {
  uni.showToast({
    icon: 'none',
    title: message,
  })
}
</script>

<style lang="scss">
@use './style.scss';
</style>
