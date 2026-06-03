<template>
  <wd-form-item :title="rule.title" :title-width="titleWidth" :prop="rule.field" layout="vertical">
    <wd-upload
      :file-list="fileList"
      :accept="accept"
      :disabled="disabled"
      :limit="limit"
      :multiple="multiple"
      :max-size="maxSize"
      :action="action"
      :auto-upload="true"
      :upload-method="uploadMethod"
      @change="handleFileChange"
      @update:file-list="handleFileListUpdate"
      @remove="handleFileChange"
    />
  </wd-form-item>
</template>

<script lang="ts" setup>
import type { UploadFileItem } from '@wot-ui/ui/components/wd-upload/types'
import type { NormalizedFormCreateRule } from '../../../../types/typing'
import { computed } from 'vue'

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

const limit = computed(() => props.rule.props?.maxNumber || props.rule.props?.maxCount || props.rule.props?.limit || (isSingle() ? 1 : undefined))
const multiple = computed(() => !!props.rule.props?.multiple || (limit.value ? limit.value > 1 : false))
const accept = computed(() => {
  if (['ImageUpload', 'ImagesUpload', 'UploadImg', 'UploadImgs', 'uploadImage', 'uploadImages'].includes(props.rule.type)) {
    return 'image'
  }
  return props.rule.props?.acceptType || props.rule.props?.fileType || 'all'
})
const maxSize = computed(() => {
  const max = props.rule.props?.maxSize
  return typeof max === 'number' ? max * 1024 * 1024 : Number.MAX_VALUE
})
const action = computed(() => props.rule.props?.action || '/infra/file/upload')
const fileList = computed(() => normalizeFileList(props.modelValue))
const uploadMethod = computed(() => props.rule.props?.uploadMethod)

function normalizeFileList(value: any): UploadFileItem[] {
  const list = Array.isArray(value)
    ? value
    : typeof value === 'string' && value.includes(',')
      ? value.split(',').filter(Boolean)
      : value
        ? [value]
        : []
  return list.map((item, index) => {
    if (typeof item === 'string') {
      return {
        uid: index,
        name: item.slice(Math.max(0, item.lastIndexOf('/') + 1)),
        status: 'success',
        url: item,
      }
    }
    return {
      uid: item.uid ?? index,
      status: item.status || 'success',
      url: item.url || item.path || item.response?.url || '',
      ...item,
    }
  })
}

function handleFileListUpdate(nextFileList: UploadFileItem[]) {
  emitValue(nextFileList)
}

function handleFileChange(event: { fileList?: UploadFileItem[] }) {
  emitValue(event.fileList || fileList.value)
}

function emitValue(nextFileList: UploadFileItem[]) {
  const valueList = nextFileList
    .filter(item => item.status === 'success')
    .map((item: any) => getUploadedUrl(item))
    .filter(Boolean)
  const value = isSingle() ? (valueList[0] || '') : valueList
  emit('update:modelValue', value)
  emit('change', value)
}

function isSingle() {
  if (props.rule.props?.multiple || props.rule.props?.maxNumber > 1 || props.rule.props?.maxCount > 1 || props.rule.props?.limit > 1) {
    return false
  }
  return ['ImageUpload', 'UploadImg', 'UploadFile', 'uploadImage'].includes(props.rule.type) || props.rule.props?.maxNumber === 1 || props.rule.props?.maxCount === 1
}

function getUploadedUrl(item: UploadFileItem) {
  const response = parseResponse(item.response)
  if (typeof response === 'string') {
    return response
  }
  const data = response?.data
  if (typeof data === 'string') {
    return data
  }
  if (data && typeof data === 'object') {
    return data.url || data.fileUrl || data.path
  }
  return response?.url || item.url
}

function parseResponse(response?: string | Record<string, any>) {
  if (!response) {
    return undefined
  }
  if (typeof response !== 'string') {
    return response
  }
  try {
    return JSON.parse(response)
  } catch {
    return response
  }
}
</script>
