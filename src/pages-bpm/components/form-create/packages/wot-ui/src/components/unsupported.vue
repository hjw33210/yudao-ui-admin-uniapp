<template>
  <wd-form-item :title="rule.title" :title-width="titleWidth" :prop="rule.field" layout="vertical">
    <view class="fc-unsupported">
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
  if (['transfer', 'Transfer', 'elTransfer', 'ElTransfer'].includes(props.rule.type)) {
    return '暂不支持「穿梭框」组件'
  }
  if (['tree', 'Tree'].includes(props.rule.type)) {
    return '暂不支持「树形控件」组件'
  }
  if (['signature', 'Signature', 'signaturePad', 'SignaturePad', 'sign', 'Sign'].includes(props.rule.type)) {
    return '暂不支持「手写签名」组件'
  }
  if (['Editor', 'Tinymce', 'tinymce', 'wangEditor', 'WangEditor'].includes(props.rule.type)) {
    return '暂不支持「富文本」组件'
  }
  if (['iframe', 'Iframe', 'IframeComponent', 'frame', 'Frame'].includes(props.rule.type)) {
    return '暂不支持「网页 iframe」组件'
  }
  return `暂不支持「${props.rule.title || props.rule.type}」组件`
})
</script>

<style lang="scss" scoped>
.fc-unsupported {
  color: #999;
  font-size: 26rpx;
  padding: 8rpx 0;
}
</style>
