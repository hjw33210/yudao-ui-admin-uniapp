import type { FormInstance } from '@wot-ui/ui/components/wd-form/types'
import type { Ref } from 'vue'

export type FormCreateValue = string | number | boolean | null | undefined | any[] | Record<string, any>

export interface FormCreateOptionItem {
  label?: string
  text?: string
  value?: string | number | boolean
  disabled?: boolean
  children?: FormCreateOptionItem[]
  [key: string]: any
}

export interface FormCreateValidateRule {
  required?: boolean
  message?: string
  pattern?: RegExp | string
  trigger?: string | string[]
  validator?: (value: unknown) => boolean | string | void | Promise<boolean | string | void>
  [key: string]: any
}

export interface FormCreateRule {
  type: string
  field?: string
  title?: string
  value?: FormCreateValue
  props?: Record<string, any>
  options?: FormCreateOptionItem[]
  children?: FormCreateRule[]
  validate?: FormCreateValidateRule[]
  $required?: boolean | string | FormCreateValidateRule
  hidden?: boolean
  display?: boolean
  info?: string
  name?: string
  className?: string
  [key: string]: any
}

export interface FormCreateOption {
  form?: Record<string, any>
  row?: Record<string, any>
  submitBtn?: boolean | Record<string, any>
  resetBtn?: boolean | Record<string, any>
  formData?: Record<string, any>
  [key: string]: any
}

export interface FormCreateFieldState {
  disabled?: boolean
  hidden?: boolean
}

export interface NormalizedFormCreateRule extends FormCreateRule {
  __fcId: string
  __originType: string
}

export interface FormCreateManager {
  formData: Ref<Record<string, any>>
  fieldStates: Record<string, FormCreateFieldState>
  rules: Ref<NormalizedFormCreateRule[]>
  visibleRules: Ref<NormalizedFormCreateRule[]>
}

export interface FormCreateApi {
  validate: () => Promise<{ valid: boolean, errors: { prop: string, message: string }[] }>
  formData: () => Record<string, any>
  getFormData: () => Record<string, any>
  getValue: (field: string) => any
  setValue: (values: Record<string, any>) => void
  coverValue: (values: Record<string, any>) => void
  disabled: (status: boolean, field?: string) => void
  hidden: (status: boolean, field?: string) => void
  setFieldPermission: (field: string, permission: string) => void
}

export interface FormCreateApiContext {
  formRef: Ref<FormInstance | undefined>
  formData: Ref<Record<string, any>>
  rules: Readonly<Ref<NormalizedFormCreateRule[]>>
  fieldStates: Record<string, FormCreateFieldState>
  emitChange: () => void
}
