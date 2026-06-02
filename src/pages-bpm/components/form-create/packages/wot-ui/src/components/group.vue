<template>
  <wd-form-item :title="rule.title" :title-width="titleWidth" :prop="rule.field" layout="vertical">
    <view class="fc-group-placeholder">
      暂不支持子表单组件
    </view>
  </wd-form-item>
</template>

<script lang="ts" setup>
import type { NormalizedFormCreateRule } from '../../../../types/typing'

defineProps<{
  rule: NormalizedFormCreateRule
  titleWidth?: string | number
}>()
</script>

<style lang="scss" scoped>
.fc-group-placeholder {
  color: #999;
  font-size: 26rpx;
  padding: 8rpx 0;
}
</style>
