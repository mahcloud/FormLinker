import Schema from "./schema";
const get = require("lodash/get");
const isArray = require("lodash/isArray");
const isBoolean = require("lodash/isBoolean");
const isEqual = require("lodash/isEqual");
const isEmpty = require("lodash/isEmpty");
const isNil = require("lodash/isNil");
const isNumber = require("lodash/isNumber");
const set = require("lodash/set");

module.exports = class{
  constructor(options = {}) {
    this.schema = options.schema || new Schema();
    this.data = options.data || {};
    this.errors = {};
    this.changeCallback = options.onChange || function() {};
  }

  /*
  // ERRORS
  */

  getError(fieldName) {
    return(this.errors[fieldName] || []);
  }

  getErrors() {
    return(this.errors);
  }

  setError(fieldName, errors) {
    if(isEmpty(errors)) {
      delete this.errors[fieldName];
    } else {
      this.errors[fieldName] = errors;
    }
    this.changeCallback();
  }

  setErrors(errors) {
    this.errors = errors;
    this.changeCallback();
  }

  /*
  // FIELDS
  */

  getValue(fieldName) {
    let data = get(this.data, fieldName);
    if(isEmpty(data) && !isBoolean(data) && !isNumber(data) && !isArray(data)) {
      return("");
    }
    return(data);
  }

  getValues() {
    return(this.data);
  }

  setValue(fieldName, value) {
    // TODO: mask
    set(this.data, fieldName, value);
    this.changeCallback();
  }

  setValues(values) {
    // TODO: mask
    this.data = {...this.data, ...values};
    this.changeCallback();
  }

  /*
   * Validation
  */

  isValid() {
    return(this.schema.isValidSync(this.data));
  }

  validateAll() {
    // TODO: format or cast
    // TODO: assign error on failure
    /* this.schema.validate(value, { context: });
    this.schema.validate(this.data).catch((err) => {
      console.log(err.name, err.errors);
    }); */
    // const rule = yup.reach(this.schema, fieldName);
  }

  validate(fieldName) {
    // TODO: format or cast
    // TODO: assign error on failure
  }

  /*
  // Differences
  */

  extractDifferences(original, fields) {
    let differences = {};
    const data = this.data;

    fields.forEach((field) => {
      if((isNil(get(original, field)) || get(original, field) === "") && (isNil(get(data, field)) || get(data, field) === "")) {
        // do nothing
      } else if(!isEqual(get(original, field), get(data, field))) {
        differences[field] = get(data, field);
      }
    });
    return(differences);
  }
};
