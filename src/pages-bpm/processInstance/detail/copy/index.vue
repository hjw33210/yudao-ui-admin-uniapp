<template>
  <view class="yd-page-container">
    <!-- 顶部导航栏 -->
    <wd-navbar
      title="抄送任务"
      left-arrow placeholder safe-area-inset-top fixed
      @click-left="handleBack"
    />

    <!-- 操作表单 -->
    <view class="p-24rpx">
      <wd-form ref="formRef" :model="formData" :schema="formSchema">
        <wd-cell-group border>
          <!-- 抄送人 -->
          <UserPicker
            v-model="formData.copyUserIds"
            prop="copyUserIds"
            type="checkbox"
            label="抄送人："
            label-width="180rpx"
            placeholder="请选择抄送人"
          />
          <!-- 抄送意见 -->
          <wd-form-item prop="reason" title="抄送意见：" title-width="180rpx">
            <wd-textarea
              v-model="formData.reason"
              placeholder="请输入抄送意见"
              :maxlength="500"
              show-word-limit
              clearable
            />
          </wd-form-item>
        </wd-cell-group>
        <!-- 提交按钮 -->
        <view class="mt-48rpx">
          <wd-button
            type="primary"
            block
            :loading="formLoading"
            :disabled="formLoading"
            @click="handleSubmit"
          >
            抄送
          </wd-button>
        </view>
      </wd-form>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { FormInstance } from '@wot-ui/ui/components/wd-form/types'
import { useToast } from '@wot-ui/ui/components/wd-toast'
import { computed, reactive, ref } from 'vue'
import { copyTask } from '@/api/bpm/task'
import UserPicker from '@/components/system-select/user-picker.vue'
import { navigateBackPlus } from '@/utils'
import { createFormSchema } from '@/utils/wot'

const props = defineProps<{
  processInstanceId: string
  taskId: string
}>()

definePage({
  style: {
    navigationBarTitleText: '',
    navigationStyle: 'custom',
  },
})

const taskId = computed(() => props.taskId)
const processInstanceId = computed(() => props.processInstanceId)
const toast = useToast()
const formLoading = ref(false)
const formData = reactive({
  copyUserIds: [] as number[],
  reason: '',
})
const formSchema = createFormSchema({
  copyUserIds: [{ required: true, message: '抄送人不能为空' }],
})
const formRef = ref<FormInstance>()

/** 返回上一页 */
function handleBack() {
  navigateBackPlus(`/pages-bpm/processInstance/detail/index?id=${processInstanceId.value}&taskId=${taskId.value}`)
}

/** 提交操作 */
async function handleSubmit() {
  if (formLoading.value) {
    return
  }
  const { valid } = await formRef.value!.validate()
  if (!valid) {
    return
  }

  formLoading.value = true
  try {
    await copyTask({
      id: taskId.value as string,
      copyUserIds: formData.copyUserIds,
      reason: formData.reason,
    })
    toast.success('抄送成功')
    setTimeout(() => {
      uni.redirectTo({
        url: `/pages-bpm/processInstance/detail/index?id=${processInstanceId.value}&taskId=${taskId.value}`,
      })
    }, 500)
  } finally {
    formLoading.value = false
  }
}

/** 页面加载时 */
onMounted(() => {
  /** 初始化校验 */
  if (!props.taskId || !props.processInstanceId) {
    toast.show('参数错误')
  }
})
</script>
