/**
 * Creates a Schema from the specification.
 *
 * @function
 * @param {string} typeName Name of the model being created.
 *    It can be chosen freely.
 * @param {object} schema Schema specification.
 */
export function createSchema(typeName, schema) {
  return {
    _type: 'schema',

    /**
     * Returns the schema specification.
     *
     * @returns {object} Schema specification.
     */
    getSchema: () => schema,

    /**
     * Returns the schema specification.
     *
     * @returns {object} Schema specification.
     */
    getFieldSchema: (name) => schema[name],

    /**
     * Returns the schema name.
     *
     * @returns {string} Schema name (also called ``typeName``).
     */
    getType: () => typeName,
  }
}
