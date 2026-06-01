<template>
  <wd-form-item
    :title="label"
    title-width="180rpx"
    :prop="prop || undefined"
    :value="selectedLabel"
    placeholder="请选择"
    is-link
    @click="visible = true"
  />
  <wd-cascader
    v-model="selectedValue"
    v-model:visible="visible"
    :options="deptOptions"
    value-key="id"
    text-key="name"
    children-key="children"
    check-strictly
    title="请选择部门"
    @update:model-value="handleChange"
  />
</template>

<script lang="ts" setup>
import type { CascaderOption } from '@wot-ui/ui/components/wd-cascader/types'
import type { Dept } from '@/api/system/dept'
import { computed, onMounted, ref, watch } from 'vue'
import { getSimpleDeptList } from '@/api/system/dept'

type DeptOption = CascaderOption & {
  children?: DeptOption[]
  id: number
  name: string
}

const props = withDefaults(defineProps<{
  modelValue?: number
  label?: string
  prop?: string
  showRoot?: boolean // 是否显示顶级部门节点
}>(), {
  label: '上级部门',
  prop: '',
  showRoot: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | undefined): void
}>()

const deptList = ref<Dept[]>([])
const selectedValue = ref<number | string>('')
const visible = ref(false)

const deptOptions = computed(() => {
  const topDepts = buildDeptTree(0)
  return props.showRoot
    ? [{ id: 0, name: '顶级部门' }, ...topDepts]
    : topDepts
})

const selectedLabel = computed(() => {
  if (selectedValue.value === '' || selectedValue.value === undefined) {
    return ''
  }
  if (selectedValue.value === 0) {
    return '顶级部门'
  }
  const path = findDeptPath(Number(selectedValue.value))
  return path.length > 0
    ? path.map(item => item.name).join('/')
    : ''
})

/** 监听外部值变化，回显选中值 */
watch(
  () => props.modelValue,
  (val) => {
    selectedValue.value = val ?? (props.showRoot ? 0 : '')
  },
  { immediate: true },
)

/** 加载部门列表 */
async function loadDeptList() {
  deptList.value = await getSimpleDeptList()
}

function buildDeptTree(parentId: number): DeptOption[] {
  return deptList.value
    .filter((item): item is Dept & { id: number } => item.id !== undefined && item.parentId === parentId)
    .map((item) => {
      const children = buildDeptTree(item.id)
      const { children: _children, ...option } = item
      return children.length > 0 ? { ...option, children } : option
    })
}

/** 查找部门路径 */
function findDeptPath(targetId: number): Dept[] {
  const path: Dept[] = []
  const findPath = (parentId: number): boolean => {
    const items = deptList.value.filter(d => d.parentId === parentId)
    for (const item of items) {
      if (item.id === targetId || findPath(item.id)) {
        path.unshift(item)
        return true
      }
    }
    return false
  }
  findPath(0)
  return path
}

/** 处理选中值变化 */
function handleChange(value: number | string | Array<number | string>) {
  const selected = Array.isArray(value) ? value.at(-1) : value
  emit('update:modelValue', selected === '' || selected === undefined ? (props.showRoot ? 0 : undefined) : Number(selected))
}

/** 初始化 */
onMounted(() => {
  loadDeptList()
})
</script>
