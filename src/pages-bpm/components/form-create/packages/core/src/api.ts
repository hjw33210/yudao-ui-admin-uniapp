import type { FormCreateApi, FormCreateApiContext } from '../../../types/typing'

export function createApi(ctx: FormCreateApiContext): FormCreateApi {
  const setFieldState = (field: string | undefined, key: 'disabled' | 'hidden', value: boolean) => {
    if (field) {
      if (!ctx.fieldStates[field]) {
        ctx.fieldStates[field] = {}
      }
      ctx.fieldStates[field][key] = value
      return
    }
    ctx.rules.value.forEach((rule) => {
      if (!rule.field) {
        return
      }
      if (!ctx.fieldStates[rule.field]) {
        ctx.fieldStates[rule.field] = {}
      }
      ctx.fieldStates[rule.field][key] = value
    })
  }

  const api: FormCreateApi = {
    async validate() {
      if (!ctx.formRef.value) {
        return { valid: true, errors: [] }
      }
      return ctx.formRef.value.validate()
    },
    formData() {
      return { ...ctx.formData.value }
    },
    getFormData() {
      return api.formData()
    },
    getValue(field) {
      return ctx.formData.value[field]
    },
    setValue(values) {
      ctx.formData.value = {
        ...ctx.formData.value,
        ...values,
      }
      ctx.emitChange()
    },
    coverValue(values) {
      ctx.formData.value = { ...values }
      ctx.emitChange()
    },
    disabled(status, field) {
      setFieldState(field, 'disabled', status)
    },
    hidden(status, field) {
      setFieldState(field, 'hidden', status)
    },
    setFieldPermission(field, permission) {
      if (permission === '1') {
        api.hidden(false, field)
        api.disabled(true, field)
      } else if (permission === '2') {
        api.hidden(false, field)
        api.disabled(false, field)
      } else if (permission === '3') {
        api.hidden(true, field)
      }
    },
  }

  return api
}
