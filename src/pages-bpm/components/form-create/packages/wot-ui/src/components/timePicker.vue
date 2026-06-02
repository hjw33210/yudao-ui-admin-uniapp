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
    type="time"
    :title="placeholder"
    @confirm="handleConfirm"
  />
</template>

<script lang="ts" setup>
import type { NormalizedFormCreateRule } from '../../../../types/typing'
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
const pickerValue = computed(() => props.modelValue || '09:00')
const displayValue = computed(() => props.modelValue ? String(props.modelValue) : '')

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
