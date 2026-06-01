<template>
  <wd-form-item
    title="上级菜单"
    title-width="180rpx"
    :value="selectedLabel"
    placeholder="请选择菜单"
    is-link
    @click="visible = true"
  />
  <wd-cascader
    v-model="selectedValue"
    v-model:visible="visible"
    :options="menuOptions"
    value-key="id"
    text-key="name"
    children-key="children"
    check-strictly
    title="请选择菜单"
    @update:model-value="handleChange"
  />
</template>

<script lang="ts" setup>
import type { CascaderOption } from '@wot-ui/ui/components/wd-cascader/types'
import type { Menu } from '@/api/system/menu'
import { computed, onMounted, ref, watch } from 'vue'
import { getSimpleMenuList } from '@/api/system/menu'
import { SystemMenuTypeEnum } from '@/utils/constants'

type MenuOption = CascaderOption & {
  children?: MenuOption[]
  id: number
  name: string
}

const props = defineProps<{
  modelValue?: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const menuList = ref<Menu[]>([])
const selectedValue = ref<number | string>(0)
const visible = ref(false)

const menuOptions = computed(() => [
  { id: 0, name: '主类目' },
  ...buildMenuTree(0),
])

const selectedLabel = computed(() => {
  if (selectedValue.value === 0 || selectedValue.value === '') {
    return '主类目'
  }
  const path = findMenuPath(Number(selectedValue.value))
  return path.length > 0
    ? path.map(item => item.name).join(' / ')
    : '主类目'
})

/** 监听外部值变化，回显选中值 */
watch(
  () => props.modelValue,
  (val) => {
    selectedValue.value = val ?? 0
  },
  { immediate: true },
)

/** 加载菜单列表 */
async function loadMenuList() {
  const list = await getSimpleMenuList()
  // 只保留目录和菜单
  menuList.value = list.filter(item => item.type !== SystemMenuTypeEnum.BUTTON)
}

/** 查找菜单路径 */
function findMenuPath(targetId: number): Menu[] {
  if (targetId === 0) {
    return []
  }
  const path: Menu[] = []
  const findPath = (parentId: number): boolean => {
    const items = menuList.value.filter(m => m.parentId === parentId)
    for (const item of items) {
      if (item.id === targetId || findPath(item.id!)) {
        path.unshift(item)
        return true
      }
    }
    return false
  }
  findPath(0)
  return path
}

function buildMenuTree(parentId: number): MenuOption[] {
  return menuList.value
    .filter((item): item is Menu & { id: number } => item.id !== undefined && item.parentId === parentId)
    .map((item) => {
      const children = buildMenuTree(item.id)
      const { children: _children, ...option } = item
      return children.length > 0 ? { ...option, children } : option
    })
}

/** 处理选中值变化 */
function handleChange(value: number | string | Array<number | string>) {
  const selected = Array.isArray(value) ? value.at(-1) : value
  emit('update:modelValue', selected === '' || selected === undefined ? 0 : Number(selected))
}

/** 初始化 */
onMounted(() => {
  loadMenuList()
})
</script>
