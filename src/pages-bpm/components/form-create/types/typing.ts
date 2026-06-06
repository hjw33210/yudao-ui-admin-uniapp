import type { FormInstance } from '@wot-ui/ui/components/wd-form/types'
import type { Ref } from 'vue'

export const FORM_FIELD_PERMISSION = {
  HIDDEN: '3',
  READ: '1',
  WRITE: '2',
} as const

export type FormFieldPermission = typeof FORM_FIELD_PERMISSION[keyof typeof FORM_FIELD_PERMISSION]

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
  validator?: (value: unknown, rule?: FormCreateRule, api?: FormCreateApi) => boolean | string | void | Promise<boolean | string | void>
  [key: string]: any
}

export interface FormCreateFetchOption {
  action?: string | ((rule?: FormCreateRule, api?: FormCreateApi) => any)
  data?: Record<string, any>
  headers?: Record<string, any>
  header?: Record<string, any>
  key?: string
  method?: string
  onError?: (error: unknown, rule?: FormCreateRule, api?: FormCreateApi) => void
  parse?: string | ((body: any, rule?: FormCreateRule, api?: FormCreateApi) => any)
  query?: Record<string, any>
  to?: string
  [key: string]: any
}

export interface FormCreateLoadDataEffectOption {
  attr?: string
  copy?: boolean
  default?: any
  handler?: (get: (id: string, defaultValue?: any) => any, rule?: FormCreateRule, api?: FormCreateApi) => any
  template?: string
  to?: string
  [key: string]: any
}

export type FormCreateComponentValidateEffect = boolean | string | {
  message?: string
  method?: string | ((value: unknown, rule?: FormCreateRule, api?: FormCreateApi) => any)
  trigger?: string | string[]
  validator?: (value: unknown, rule?: FormCreateRule, api?: FormCreateApi) => any
  [key: string]: any
}

export interface FormCreateControl {
  value?: any
  condition?: '==' | '!=' | '<>' | '>' | '>=' | '<' | '<=' | 'in' | 'notIn' | 'on' | 'notOn' | 'between' | 'notBetween' | 'empty' | 'notEmpty' | 'pattern' | string
  method?: 'hidden' | 'display' | 'show' | 'if' | 'disabled' | 'enabled' | 'required' | string
  rule?: Array<FormCreateRule | string>
  append?: string
  prepend?: string
  child?: boolean
  handle?: (value: any, api?: FormCreateApi) => boolean
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
  control?: FormCreateControl | FormCreateControl[]
  effect?: {
    componentValidate?: FormCreateComponentValidateEffect
    disabled?: boolean
    display?: boolean
    fetch?: string | FormCreateFetchOption | ((rule?: FormCreateRule, api?: FormCreateApi) => FormCreateFetchOption | string | undefined)
    hidden?: boolean
    loadData?: FormCreateLoadDataEffectOption | FormCreateLoadDataEffectOption[]
    required?: boolean | string | FormCreateValidateRule
    show?: boolean
    t?: Record<string, string | {
      attr: string
      params?: Record<string, any>
      to?: string
    }>
    [key: string]: any
  }
  [key: string]: any
}

export interface FormCreateOption {
  fetch?: (option: FormCreateFetchOption, context?: { api?: FormCreateApi, rule?: FormCreateRule }) => Promise<any>
  form?: Record<string, any>
  row?: Record<string, any>
  submitBtn?: boolean | Record<string, any>
  resetBtn?: boolean | Record<string, any>
  formData?: Record<string, any>
  globalData?: Record<string, any>
  messages?: Record<string, string>
  t?: (id: string, params?: Record<string, any>) => string | undefined
  [key: string]: any
}

export interface FormCreateFieldState {
  disabled?: boolean
  hidden?: boolean
  required?: boolean
  controlDisabled?: boolean
  controlHidden?: boolean
  controlRequired?: boolean
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
  fetch: (option: FormCreateFetchOption) => Promise<any>
  getData: (id: string, defaultValue?: any) => any
  setValue: (values: Record<string, any>) => void
  coverValue: (values: Record<string, any>) => void
  disabled: (status: boolean, field?: string) => void
  hidden: (status: boolean, field?: string) => void
  t: (id: string, params?: Record<string, any>) => string | undefined
  setFieldPermission: (field: string, permission: FormFieldPermission | string) => void
}

export interface FormCreateApiContext {
  formRef: Ref<FormInstance | undefined>
  formData: Ref<Record<string, any>>
  option?: Readonly<Ref<FormCreateOption>>
  rules: Readonly<Ref<NormalizedFormCreateRule[]>>
  fieldStates: Record<string, FormCreateFieldState>
  emitChange: () => void
}
