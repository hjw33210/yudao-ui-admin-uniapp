import type { FormCreateRule } from '../../../../types/typing'
import { normalizeOptions } from '../../../core/src'
import hidden from './hidden'
import row from './row'

const OPTION_TYPES = new Set(['checkbox', 'radio', 'select'])

export function parseRule(rule: FormCreateRule): FormCreateRule {
  if (rule.type === hidden.name) {
    return hidden.parse(rule)
  }
  if (rule.type === row.name) {
    return row.parse(rule)
  }
  if (OPTION_TYPES.has(rule.type) && !rule.options?.length && rule.props?.options) {
    return {
      ...rule,
      options: normalizeOptions(rule.props.options),
    }
  }
  if (rule.type === 'textarea') {
    return {
      ...rule,
      props: {
        ...(rule.props || {}),
        type: 'textarea',
      },
    }
  }
  return rule
}

export default [hidden, row]
