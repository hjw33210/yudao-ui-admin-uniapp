import type { FormSchema, FormSchemaIssue } from '@wot-ui/ui/components/wd-form/types'
import type { FormCreateFieldState, FormCreateRule, NormalizedFormCreateRule } from '../../../types/typing'
import { getValidateRules } from './provider'
import { isEmptyValue, isRuleHidden } from './utils'

export function createFormSchema(
  rules: () => NormalizedFormCreateRule[],
  fieldStates: Record<string, FormCreateFieldState>,
): FormSchema {
  return {
    async validate(model) {
      const issues: FormSchemaIssue[] = []
      for (const rule of rules()) {
        if (!rule.field || isRuleHidden(rule, fieldStates[rule.field])) {
          continue
        }
        const value = model[rule.field]
        for (const validateRule of getValidateRules(rule)) {
          if (validateRule.required && isEmptyValue(value)) {
            issues.push(createIssue(rule.field, validateRule.message || `${rule.title || '该字段'}不能为空`))
            break
          }
          if (isEmptyValue(value)) {
            continue
          }
          if (validateRule.pattern) {
            const pattern = typeof validateRule.pattern === 'string'
              ? new RegExp(validateRule.pattern)
              : validateRule.pattern
            if (!pattern.test(String(value))) {
              issues.push(createIssue(rule.field, validateRule.message || `${rule.title || '该字段'}格式不正确`))
              break
            }
          }
          if (validateRule.validator) {
            const result = await validateRule.validator(value)
            if (result === false || typeof result === 'string') {
              issues.push(createIssue(rule.field, typeof result === 'string' ? result : validateRule.message || `${rule.title || '该字段'}校验失败`))
              break
            }
          }
        }
      }
      return issues
    },
    isRequired(path) {
      const rule = rules().find(item => item.field === path)
      return !!(rule && getValidateRules(rule).some(item => item.required))
    },
  }
}

function createIssue(field: string, message: string): FormSchemaIssue {
  return {
    path: field.split('.'),
    message,
  }
}

export function createFieldStates(rules: FormCreateRule[]) {
  return rules.reduce<Record<string, FormCreateFieldState>>((states, rule) => {
    if (rule.field) {
      states[rule.field] = {}
    }
    return states
  }, {})
}
