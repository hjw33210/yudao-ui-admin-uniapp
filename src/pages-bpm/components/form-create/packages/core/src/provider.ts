import type { FormCreateRule, FormCreateValidateRule } from '../../../types/typing'

export function getRequiredRule(rule: FormCreateRule): FormCreateValidateRule | undefined {
  if (rule.$required === true) {
    return {
      required: true,
      message: `${rule.title || '该字段'}不能为空`,
    }
  }
  if (typeof rule.$required === 'string') {
    return {
      required: true,
      message: rule.$required,
    }
  }
  if (rule.$required && typeof rule.$required === 'object') {
    return {
      required: true,
      ...rule.$required,
    }
  }
  const validate = rule.validate?.find(item => item.required)
  return validate ? { ...validate, required: true } : undefined
}

export function getValidateRules(rule: FormCreateRule): FormCreateValidateRule[] {
  const rules = [...(rule.validate || [])]
  const requiredRule = getRequiredRule(rule)
  if (requiredRule && !rules.some(item => item.required)) {
    rules.unshift(requiredRule)
  }
  return rules
}
