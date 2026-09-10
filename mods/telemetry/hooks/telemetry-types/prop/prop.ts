import type { Choice } from '../choice'

/**
 * A property's value: a finite number, a boolean, or a Choice; never free
 * text.
 */
export type Prop = number | boolean | Choice
