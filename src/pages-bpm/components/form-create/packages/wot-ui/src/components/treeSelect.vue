<template>
  <view class="fc-tree-select">
    <wd-form-item
      :title="rule.title"
      :title-width="titleWidth"
      :prop="rule.field"
      :value="displayValue"
      :placeholder="placeholder"
      :is-link="!disabled"
      @click="open"
    />

    <wd-cascader
      v-if="!isMultiple"
      v-model:visible="visible"
      :model-value="cascaderValue"
      :options="treeOptions"
      :title="rule.title || '请选择'"
      :check-strictly="checkStrictly"
      text-key="text"
      value-key="value"
      children-key="children"
      @confirm="handleCascaderConfirm"
    />

    <wd-select-picker
      v-else
      v-model="pickerValue"
      v-model:visible="visible"
      :title="rule.title || '请选择'"
      :columns="flatOptions"
      :filter-placeholder="rule.props?.filterPlaceholder || '搜索选项'"
      custom-content-class="fc-tree-select__content"
      filterable
      label-key="label"
      type="checkbox"
      value-key="value"
      @cancel="emit('cancel')"
      @confirm="handleMultipleConfirm"
    />
  </view>
</template>

<script lang="ts" setup>
import type { CascaderOption } from '@wot-ui/ui/components/wd-cascader/types'
import type { NormalizedFormCreateRule } from '../../../../types/typing'
import { computed, ref, watch } from 'vue'
import { getPlaceholder } from '../core/utils'

type TreeSelectValue = string | number

interface TreeSelectFlatOption {
  disabled?: boolean
  displayLabel: string
  label: string
  value: TreeSelectValue
}

const props = defineProps<{
  disabled?: boolean
  modelValue?: any
  rule: NormalizedFormCreateRule
  titleWidth?: string | number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: any]
  'cancel': []
  'change': [value: any]
  'close': []
  'confirm': [value: any]
  'open': []
}>()

const visible = ref(false)
const pickerValue = ref<TreeSelectValue[]>([])

const placeholder = computed(() => getPlaceholder(props.rule, '请选择'))
const isMultiple = computed(() =>
  props.rule.type === 'treeSelectMultiple'
  || !!props.rule.props?.multiple
  || !!props.rule.props?.showCheckbox
  || props.rule.props?.mode === 'multiple',
)
const checkStrictly = computed(() => props.rule.props?.checkStrictly !== false)
const treeOptions = computed(() => normalizeTreeOptions(getTreeData()))
const flatOptions = computed(() => flattenTreeOptions(treeOptions.value))
const cascaderValue = computed(() => normalizeSingleValue(props.modelValue))
const displayValue = computed(() => {
  if (isMultiple.value) {
    return formatMultipleValue(props.modelValue)
  }
  return formatSingleValue(props.modelValue)
})

watch(
  () => [props.modelValue, isMultiple.value],
  () => {
    pickerValue.value = normalizeMultipleValue(props.modelValue)
  },
  { deep: true, immediate: true },
)

watch(visible, (value) => {
  if (value) {
    emit('open')
  } else {
    emit('close')
  }
})

function open() {
  if (props.disabled) {
    return
  }
  pickerValue.value = normalizeMultipleValue(props.modelValue)
  visible.value = true
}

function handleCascaderConfirm({ value }: { value: any }) {
  const selected = Array.isArray(value) ? value.at(-1) : value
  const nextValue = selected === '' || selected === undefined ? undefined : selected
  emit('update:modelValue', nextValue)
  emit('change', nextValue)
  emit('confirm', nextValue)
}

function handleMultipleConfirm({ value }: { value: any }) {
  const nextValue = Array.isArray(value) ? value : []
  emit('update:modelValue', nextValue)
  emit('change', nextValue)
  emit('confirm', nextValue)
}

function getTreeData() {
  const ruleProps = props.rule.props || {}
  const candidates = [
    ruleProps.data,
    ruleProps.options,
    ruleProps.treeData,
    props.rule.options,
  ]
  return candidates.find(item => Array.isArray(item)) || []
}

function normalizeTreeOptions(list: Record<string, any>[]): CascaderOption[] {
  const fields = getFieldNames()
  return list
    .map((item) => {
      const value = getNodeValue(item, fields.value)
      if (!isValidValue(value)) {
        return undefined
      }
      const text = getNodeText(item, fields.label, value)
      const children = Array.isArray(item[fields.children])
        ? normalizeTreeOptions(item[fields.children])
        : []
      return {
        disabled: item.disabled,
        text,
        tip: item.tip,
        value,
        ...(children.length ? { children } : {}),
      }
    })
    .filter(Boolean) as CascaderOption[]
}

function flattenTreeOptions(list: CascaderOption[], parentPath = ''): TreeSelectFlatOption[] {
  return list.flatMap((item) => {
    const label = String(item.text || item.value)
    const path = parentPath ? `${parentPath} / ${label}` : label
    return [
      {
        disabled: item.disabled,
        displayLabel: label,
        label: path,
        value: item.value as TreeSelectValue,
      },
      ...flattenTreeOptions((item.children || []) as CascaderOption[], path),
    ]
  })
}

function getFieldNames() {
  const fieldProps = props.rule.props?.props || props.rule.props?.fieldNames || {}
  return {
    children: fieldProps.children || props.rule.props?.childrenKey || 'children',
    label: fieldProps.label || props.rule.props?.labelKey || props.rule.props?.textKey || 'label',
    value: fieldProps.value || props.rule.props?.nodeKey || props.rule.props?.valueKey,
  }
}

function getNodeValue(item: Record<string, any>, configuredValueKey?: string): any {
  if (configuredValueKey && item[configuredValueKey] !== undefined) {
    return item[configuredValueKey]
  }
  return item.value ?? item.key ?? item.id
}

function getNodeText(item: Record<string, any>, configuredLabelKey: string | undefined, value: TreeSelectValue) {
  if (configuredLabelKey && item[configuredLabelKey] !== undefined) {
    return String(item[configuredLabelKey])
  }
  return String(item.label ?? item.text ?? item.name ?? item.title ?? value)
}

function formatSingleValue(value: any) {
  const nextValue = normalizeSingleValue(value)
  if (nextValue === '') {
    return ''
  }
  return findPathByValue(treeOptions.value, nextValue)?.map(item => item.text).join(' / ') || String(nextValue)
}

function formatMultipleValue(value: any) {
  const values = normalizeMultipleValue(value)
  if (values.length === 0) {
    return ''
  }
  const labels = values.map(item => getFlatLabel(item)).filter(Boolean)
  const visibleLabels = labels.slice(0, 2).join('、')
  return values.length > 2 ? `${visibleLabels} 等 ${values.length}项` : visibleLabels
}

function getFlatLabel(value: TreeSelectValue) {
  const selected = flatOptions.value.find(item => isSameValue(item.value, value))
  return selected?.displayLabel || String(value)
}

function findPathByValue(list: CascaderOption[], value: TreeSelectValue): CascaderOption[] | undefined {
  for (const item of list) {
    if (isSameValue(item.value as TreeSelectValue, value)) {
      return [item]
    }
    const children = item.children as CascaderOption[] | undefined
    if (children?.length) {
      const childPath = findPathByValue(children, value)
      if (childPath) {
        return [item, ...childPath]
      }
    }
  }
  return undefined
}

function normalizeSingleValue(value: any): TreeSelectValue | '' {
  const nextValue = Array.isArray(value) ? value[value.length - 1] : value
  return isValidValue(nextValue) ? nextValue : ''
}

function normalizeMultipleValue(value: any): TreeSelectValue[] {
  return Array.isArray(value) ? value.filter(isValidValue) : []
}

function isValidValue(value: any): value is TreeSelectValue {
  return (typeof value === 'string' || typeof value === 'number') && value !== ''
}

function isSameValue(left: TreeSelectValue, right: TreeSelectValue) {
  return left === right || String(left) === String(right)
}
</script>

<style lang="scss">
.fc-tree-select__content {
  height: 65vh !important;
  max-height: 65vh !important;
}
</style>
