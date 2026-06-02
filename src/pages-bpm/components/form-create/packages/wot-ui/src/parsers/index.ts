import type { FormCreateRule } from '../../../../types/typing'
import { normalizeOptions } from '../../../core/src'
import card from './card'
import hidden from './hidden'
import row from './row'
import space from './space'
import table from './table'

const OPTION_TYPES = new Set(['checkbox', 'radio', 'select'])
const LAYOUT_PARSERS = [row, table, card, space]

export function parseRules(rules: FormCreateRule[] = []): FormCreateRule[] {
  return rules.flatMap((rule, index) => parseRuleNode(rule, String(index)))
}

export function parseRule(rule: FormCreateRule): FormCreateRule {
  return parseBaseRule(rule)
}

function parseRuleNode(rule: FormCreateRule, indexPath: string): FormCreateRule[] {
  const layoutParser = LAYOUT_PARSERS.find(parser => parser.match(rule))
  if (layoutParser) {
    return layoutParser.render(rule, indexPath, parseRuleNode)
  }
  return [parseBaseRule(rule)]
}

function parseBaseRule(rule: FormCreateRule): FormCreateRule {
  if (rule.type === hidden.name) {
    return hidden.parse(rule)
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

export default [hidden, row, table, card, space]
