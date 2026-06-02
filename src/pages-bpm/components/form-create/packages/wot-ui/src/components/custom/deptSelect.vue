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
    :title="rule.title || '选择部门'"
    :columns="options"
    :type="isMultiple ? 'checkbox' : 'radio'"
    :show-confirm="isMultiple"
    :loading="loading"
    :filter-placeholder="rule.props?.filterPlaceholder || '搜索部门'"
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
import { loadDeptOptions } from './api'
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
const options = ref<any[]>([])
const pickerValue = ref<any>([])
const visible = ref(false)

const isMultiple = computed(() => isMultipleSelect(props.rule))
const placeholder = computed(() => getPlaceholder(props.rule, '请选择'))
const returnType = computed(() => props.rule.props?.returnType === 'name' ? 'name' : 'id')
const displayValue = computed(() =>
  formatSelectedSummary(props.modelValue, options.value, isMultiple.value, '个部门'),
)

watch(
  () => [props.modelValue, isMultiple.value],
  () => {
    pickerValue.value = normalizeSelectValue(props.modelValue, isMultiple.value)
  },
  { deep: true, immediate: true },
)

watch(
  () => [props.rule.props, returnType.value],
  () => loadOptions(),
  { deep: true, immediate: true },
)

function open() {
  if (props.disabled) {
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
  try {
    options.value = await loadDeptOptions(returnType.value)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss">
@use './style.scss';
</style>
