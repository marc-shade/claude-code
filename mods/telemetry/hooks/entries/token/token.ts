/**
 * The shape of an event name, a property key and a Choice member: a
 * snake_case token of at most 64 characters, starting with a letter.
 */
export const TOKEN = /^[a-z][a-z0-9_]{0,63}$/
