<template>
  <view class="yd-page-container pb-[120rpx]">
    <wd-navbar
      :title="processName"
      left-arrow placeholder safe-area-inset-top fixed
      @click-left="handleBack"
    />

    <view v-if="loading" class="py-100rpx text-center">
      <wd-loading size="40rpx" />
      <view class="mt-24rpx text-26rpx text-[#999]">
        加载表单中...
      </view>
    </view>

    <template v-else>
      <view class="mx-24rpx mt-24rpx overflow-hidden rounded-16rpx bg-white">
        <FormCreate
          v-model="detailForm.value"
          v-model:api="fApi"
          :option="detailForm.option"
          :rule="detailForm.rule"
          style=""
          @change="handleFormChange"
        />
      </view>

      <view class="mx-24rpx mt-24rpx rounded-16rpx bg-white">
        <view class="p-24rpx">
          <view class="mb-16rpx flex items-center justify-between">
            <text class="text-28rpx text-[#333] font-bold">流程预览</text>
            <wd-loading v-if="processTimeLineLoading" size="32rpx" />
          </view>

          <ProcessInstanceTimeline
            v-if="activityNodes.length > 0"
            :activity-nodes="activityNodes"
            :show-status-icon="false"
            @select-user-confirm="selectUserConfirm"
          />

          <view v-else-if="!processTimeLineLoading" class="py-40rpx text-center">
            <text class="text-24rpx text-[#999]">暂无流程预览数据</text>
          </view>
        </view>
      </view>
    </template>

    <view v-if="!loading" class="yd-detail-footer">
      <view class="yd-detail-footer-actions">
        <wd-button type="primary" class="flex-1" :loading="submitting" @click="handleSubmit">
          提交
        </wd-button>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
// TODO @AI：注释风格，是不是参考 /Users/yunai/Java/yudao-ui-admin-uniapp-next-v4/src/pages-system/user 做一些优化；
// TODO @AI：方法内的注释；
// TODO @AI：变量注释；
// TODO @AI：html 相关的里面的注释；
import type { ApprovalNodeInfo } from '@/api/bpm/processInstance'
import type { FormCreateApi } from '@/pages-bpm/components/form-create/packages/wot-ui/types'
import type { FormCreatePreview } from '@/pages-bpm/utils'
import { onLoad } from '@dcloudio/uni-app'
import { useToast } from '@wot-ui/ui/components/wd-toast'
import { nextTick, ref, watch } from 'vue'
import { getProcessDefinition } from '@/api/bpm/definition'
import { createProcessInstance, getApprovalDetail, getProcessInstance } from '@/api/bpm/processInstance'
import FormCreate from '@/pages-bpm/components/form-create/packages/wot-ui/src/index.vue'
import ProcessInstanceTimeline from '@/pages-bpm/processInstance/detail/components/time-line.vue'
import { filterFormVariablesByFields, setConfAndFields2 } from '@/pages-bpm/utils'
import { navigateBackPlus } from '@/utils'
import { BpmCandidateStrategyEnum, BpmNodeIdEnum } from '@/utils/constants'

definePage({
  style: {
    navigationBarTitleText: '',
    navigationStyle: 'custom',
  },
})

const toast = useToast()

const loading = ref(true)
const submitting = ref(false)
const processTimeLineLoading = ref(false)
const initialized = ref(false)
const processName = ref('流程表单')
const processDefinitionId = ref('')
const processInstanceId = ref('')
const fApi = ref<FormCreateApi>()
const detailForm = ref<FormCreatePreview>({
  option: {},
  rule: [],
  value: {},
})
const activityNodes = ref<ApprovalNodeInfo[]>([])
const startUserSelectTasks = ref<ApprovalNodeInfo[]>([])
const startUserSelectAssignees = ref<Record<string, number[]>>({})
const tempStartUserSelectAssignees = ref<Record<string, number[]>>({})
let previewTimer: ReturnType<typeof setTimeout> | undefined

// TODO @AI：这里写个注释？
function handleBack() {
  navigateBackPlus('/pages-bpm/processInstance/create/index')
}

// TODO @AI：这里写个注释？
function handleFormChange(data: Record<string, any>) {
  detailForm.value.value = data
}

// TODO @AI：这里写个注释？
async function getProcessApprovalDetail() {
  if (!processDefinitionId.value) {
    return
  }

  processTimeLineLoading.value = true
  try {
    const data = await getApprovalDetail({
      processDefinitionId: processDefinitionId.value,
      activityId: BpmNodeIdEnum.START_USER_NODE_ID,
      processVariablesStr: JSON.stringify(detailForm.value.value || {}),
    })
    if (!data) {
      toast.show('查询不到审批详情信息')
      return
    }

    activityNodes.value = data.activityNodes || []
    startUserSelectTasks.value = (data.activityNodes || []).filter(
      node => BpmCandidateStrategyEnum.START_USER_SELECT === node.candidateStrategy,
    )

    if (startUserSelectTasks.value.length > 0) {
      for (const node of startUserSelectTasks.value) {
        const tempAssignees = tempStartUserSelectAssignees.value[node.id]
        startUserSelectAssignees.value[node.id] = tempAssignees?.length ? tempAssignees : []
      }
    }

    if (data.formFieldsPermission) {
      await nextTick()
      Object.entries(data.formFieldsPermission).forEach(([field, permission]) => {
        fApi.value?.setFieldPermission(field, permission)
      })
    }
  } finally {
    processTimeLineLoading.value = false
  }
}

// TODO @AI：这里写个注释？
function selectUserConfirm(activityId: string, userList: any[]) {
  startUserSelectAssignees.value[activityId] = userList?.map(item => item.id) || []
}

// TODO @AI：这里写个注释？
async function handleSubmit() {
  if (!fApi.value || submitting.value) {
    return
  }
  const { valid } = await fApi.value.validate()
  if (!valid) {
    return
  }

  if (startUserSelectTasks.value.length > 0) {
    for (const userTask of startUserSelectTasks.value) {
      const assignees = startUserSelectAssignees.value[userTask.id]
      if (!Array.isArray(assignees) || assignees.length === 0) {
        toast.show(`请选择${userTask.name}的审批人`)
        return
      }
    }
  }

  submitting.value = true
  try {
    await createProcessInstance({
      processDefinitionId: processDefinitionId.value,
      variables: filterFormVariablesByFields(detailForm.value.rule, fApi.value.formData()),
      startUserSelectAssignees: startUserSelectAssignees.value,
    })
    toast.success('发起流程成功')
    setTimeout(() => {
      navigateBackPlus('/pages/bpm/index')
    }, 1000)
  } finally {
    submitting.value = false
  }
}

// TODO @AI：这里写个注释？
watch(
  () => detailForm.value.value,
  () => {
    if (!initialized.value) {
      return
    }
    if (previewTimer) {
      clearTimeout(previewTimer)
    }
    previewTimer = setTimeout(() => {
      tempStartUserSelectAssignees.value = { ...startUserSelectAssignees.value }
      startUserSelectAssignees.value = {}
      getProcessApprovalDetail()
    }, 300)
  },
  { deep: true },
)

// TODO @AI：这里写个注释？
onLoad(async (options) => {
  const id = options?.processDefinitionId
  const instanceId = options?.processInstanceId
  if (!id) {
    toast.show('参数错误')
    loading.value = false
    return
  }

  processDefinitionId.value = id
  processInstanceId.value = instanceId || ''
  try {
    const definition = await getProcessDefinition(id)
    processName.value = definition.name || '流程表单'
    if (!definition.formFields?.length) {
      toast.show('该流程暂无表单字段')
      return
    }

    const formVariables = processInstanceId.value
      ? await getRestartFormVariables(definition.formFields)
      : {}
    setConfAndFields2(detailForm, definition.formConf, definition.formFields, formVariables)
    detailForm.value.option = {
      ...detailForm.value.option,
      submitBtn: false,
      resetBtn: false,
    }

    await nextTick()
    await getProcessApprovalDetail()
    initialized.value = true
  } catch (error: any) {
    const code = error?.code ?? error?.data?.code ?? error?.statusCode
    if (code !== 401) {
      console.error('加载流程表单失败:', error)
      toast.show('加载流程表单失败，请稍后重试')
    }
  } finally {
    loading.value = false
  }
})

// TODO @AI：这里写个注释？
async function getRestartFormVariables(formFields?: string[]) {
  const processInstance = await getProcessInstance(processInstanceId.value)
  if (!processInstance) {
    toast.show('重新发起流程失败，原因：流程实例不存在')
    return {}
  }
  return filterFormVariablesByFields(formFields, processInstance.formVariables || {})
}
</script>
