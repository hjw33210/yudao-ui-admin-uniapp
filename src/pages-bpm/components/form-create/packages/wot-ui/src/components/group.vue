<template>
  <wd-form-item :title="rule.title" :title-width="titleWidth" :prop="rule.field" layout="vertical">
    <view class="fc-group-placeholder">
      {{ unsupportedMessage }}
    </view>
  </wd-form-item>
</template>

<script lang="ts" setup>
import type { NormalizedFormCreateRule } from '../../../../types/typing'
import { computed } from 'vue'

const props = defineProps<{
  rule: NormalizedFormCreateRule
  titleWidth?: string | number
}>()

const unsupportedMessage = computed(() => {
  if (props.rule.title === '子表单') {
    return '暂不支持「子」表单组件'
  }
  if (props.rule.title === '分组') {
    return '暂不支持「分组」组件'
  }
  if (props.rule.title === '表格表单') {
    return '暂不支持「表格表单」组件'
  }
  if (['tableForm', 'subTable', 'fcTableForm'].includes(props.rule.type)) {
    return '暂不支持「表格表单」组件'
  }
  if (props.rule.type === 'group') {
    return '暂不支持「分组」组件'
  }
  return '暂不支持「子」表单组件'
})
</script>

<style lang="scss" scoped>
.fc-group-placeholder {
  color: #999;
  font-size: 26rpx;
  padding: 8rpx 0;
}
</style>
