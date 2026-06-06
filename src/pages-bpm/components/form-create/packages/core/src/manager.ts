import type { FormSchema, FormSchemaIssue } from '@wot-ui/ui/components/wd-form/types'
import type { FormCreateFieldState, FormCreateRule, NormalizedFormCreateRule } from '../../../types/typing'
import type { FormCreateProviderContext } from './provider'
import type { ParseSubFormRules } from './subForm'
import { applyControlRules } from './control'
import { getValidateRules } from './provider'
import { isSubFormRule, normalizeSubFormRules } from './subForm'
import { isEmptyValue, isRuleHidden } from './utils'

export function createFormSchema(
  rules: () => NormalizedFormCreateRule[],
  fieldStates: Record<string, FormCreateFieldState>,
  parseSubFormRules?: ParseSubFormRules,
  providerContext?: FormCreateProviderContext,
): FormSchema {
  return {
    async validate(model) {
      const issues: FormSchemaIssue[] = []
      for (const rule of rules()) {
        if (!rule.field || isRuleHidden(rule, fieldStates[rule.field])) {
          continue
        }
        const value = model[rule.field]
        if (isSubFormRule(rule)) {
          await validateSubFormRule(rule, value, issues, rule.field, fieldStates[rule.field], parseSubFormRules, providerContext)
          continue
        }
        for (const validateRule of getValidateRules(rule, fieldStates[rule.field], providerContext)) {
          if (validateRule.required && isEmptyValue(value)) {
            issues.push(createIssue(rule.field, validateRule.message || `${rule.title || '该字段'}不能为空`))
            break
          }
          if (isEmptyValue(value)) {
            continue
          }
          if (validateRule.pattern) {
            const pattern = typeof validateRule.pattern === 'string' ? new RegExp(validateRule.pattern) : validateRule.pattern
            if (!pattern.test(String(value))) {
              issues.push(createIssue(rule.field, validateRule.message || `${rule.title || '该字段'}格式不正确`))
              break
            }
          }
          if (validateRule.validator) {
            const result = await validateRule.validator(value, rule, providerContext?.api)
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
      const prop = normalizePath(path)
      const rule = rules().find(item => item.field === prop)
      if (rule) {
        return getValidateRules(rule, fieldStates[rule.field], providerContext).some(item => item.required)
      }
      const childRule = findSubFormChildRule(rules(), prop, parseSubFormRules)
      return !!(childRule && getValidateRules(childRule, undefined, providerContext).some(item => item.required))
    },
  }
}

async function validateSubFormRule(
  rule: NormalizedFormCreateRule,
  value: any,
  issues: FormSchemaIssue[],
  fieldPath: string = rule.field || '',
  state?: FormCreateFieldState,
  parseSubFormRules?: ParseSubFormRules,
  providerContext?: FormCreateProviderContext,
) {
  for (const validateRule of getValidateRules(rule, state, providerContext)) {
    if (validateRule.required && (!Array.isArray(value) || value.length === 0)) {
      issues.push(createIssue(fieldPath, validateRule.message || `${rule.title || '子表单'}不能为空`))
      return
    }
  }

  if (!Array.isArray(value) || value.length === 0) {
    return
  }

  const children = normalizeSubFormRules(rule, parseSubFormRules)
  for (let rowIndex = 0; rowIndex < value.length; rowIndex++) {
    const row = value[rowIndex]
    const controlResult = applyControlRules(children, row || {})
    for (const childRule of controlResult.rules) {
      const childState = childRule.field ? controlResult.fieldStates[childRule.field] : undefined
      if (!childRule.field || isRuleHidden(childRule, childState)) {
        continue
      }
      const childValue = row?.[childRule.field]
      const childPath = getSubFormPath(fieldPath, rowIndex, childRule.field)
      if (isSubFormRule(childRule)) {
        await validateSubFormRule(childRule, childValue, issues, childPath, childState, parseSubFormRules, {
          ...providerContext,
          formData: row || {},
        })
        continue
      }
      for (const validateRule of getValidateRules(childRule, childState, {
        ...providerContext,
        formData: row || {},
      })) {
        if (validateRule.required && isEmptyValue(childValue)) {
          issues.push(createIssue(childPath, validateRule.message || `${childRule.title || '该字段'}不能为空`))
          break
        }
        if (isEmptyValue(childValue)) {
          continue
        }
        if (validateRule.pattern) {
          const pattern = typeof validateRule.pattern === 'string' ? new RegExp(validateRule.pattern) : validateRule.pattern
          if (!pattern.test(String(childValue))) {
            issues.push(createIssue(childPath, validateRule.message || `${childRule.title || '该字段'}格式不正确`))
            break
          }
        }
        if (validateRule.validator) {
          const result = await validateRule.validator(childValue, childRule, providerContext?.api)
          if (result === false || typeof result === 'string') {
            issues.push(createIssue(childPath, typeof result === 'string' ? result : validateRule.message || `${childRule.title || '该字段'}校验失败`))
            break
          }
        }
      }
    }
  }
}

function findSubFormChildRule(rules: NormalizedFormCreateRule[], path: string, parseSubFormRules?: ParseSubFormRules) {
  for (const rule of rules) {
    if (!rule.field || !isSubFormRule(rule)) {
      continue
    }
    const childPath = getSubFormChildPath(path, rule.field)
    if (!childPath) {
      continue
    }
    const childRule = findSubFormChildRuleByPath(rule, childPath, parseSubFormRules)
    if (childRule) {
      return childRule
    }
  }
}

function findSubFormChildRuleByPath(rule: FormCreateRule, childPath: string, parseSubFormRules?: ParseSubFormRules): NormalizedFormCreateRule | undefined {
  for (const childRule of normalizeSubFormRules(rule, parseSubFormRules)) {
    if (!childRule.field) {
      continue
    }
    if (childPath === childRule.field) {
      return childRule
    }
    const nestedPath = getSubFormChildPath(childPath, childRule.field)
    if (nestedPath && isSubFormRule(childRule)) {
      const nestedChildRule = findSubFormChildRuleByPath(childRule, nestedPath, parseSubFormRules)
      if (nestedChildRule) {
        return nestedChildRule
      }
    }
  }
}

function getSubFormChildPath(path: string, field: string) {
  const prefix = `${field}.`
  if (!path.startsWith(prefix)) {
    return undefined
  }
  const rest = path.slice(prefix.length)
  const rowSeparatorIndex = rest.indexOf('.')
  return rowSeparatorIndex >= 0 ? rest.slice(rowSeparatorIndex + 1) : undefined
}

function getSubFormPath(field: string, rowIndex: number, childField: string) {
  return `${field}.${rowIndex}.${childField}`
}

function normalizePath(path: unknown) {
  return Array.isArray(path) ? path.join('.') : String(path)
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
