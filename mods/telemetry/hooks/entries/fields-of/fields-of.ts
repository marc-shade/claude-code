import { EVENT_PREFIX } from '../event-prefix'
import type { Fields } from '../fields'

/**
 * One checked entry as its fields, the event under its prefix.
 *
 * @param event the event's name as the caller spelled it
 * @param props the properties as checked
 * @returns the entry's fields, the event name prefixed and the props attached
 */
export const fieldsOf = (event: string, props: Fields['props']): Fields => ({
  name: EVENT_PREFIX + event,
  props,
})
