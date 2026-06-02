<template>
  <wd-form-item
    :title="rule.title"
    :title-width="titleWidth"
    :prop="rule.field"
    :value="displayValue"
    :placeholder="placeholder"
    is-link
    @click="open"
  />
  <wd-datetime-picker
    v-model:visible="visible"
    :model-value="pickerValue"
    :type="pickerType"
    :title="placeholder"
    @confirm="handleConfirm"
  />
</template>

<script lang="ts" setup>
import type { NormalizedFormCreateRule } from '../../../../types/typing'
import dayjs from 'dayjs'
import { computed, ref } from 'vue'
import { getPlaceholder } from '../core/utils'

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

const visible = ref(false)
const placeholder = computed(() => getPlaceholder(props.rule, '请选择'))
const pickerType = computed(() => props.rule.props?.type || 'date')
const pickerValue = computed(() => props.modelValue === undefined || props.modelValue === null || props.modelValue === '' ? Date.now() : props.modelValue)
const displayValue = computed(() => {
  if (props.modelValue === undefined || props.modelValue === null || props.modelValue === '') {
    return ''
  }
  const format = pickerType.value === 'datetime'
    ? 'YYYY-MM-DD HH:mm'
    : pickerType.value === 'year-month'
      ? 'YYYY-MM'
      : pickerType.value === 'year'
        ? 'YYYY'
        : 'YYYY-MM-DD'
  return dayjs(props.modelValue).isValid() ? dayjs(props.modelValue).format(format) : String(props.modelValue)
})

function open() {
  if (!props.disabled) {
    visible.value = true
  }
}

function handleConfirm({ value }: { value: any }) {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>
