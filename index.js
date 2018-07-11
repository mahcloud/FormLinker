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
    this.schema = options.schema || {};
    this.fields = this.calcFields();
    this.formatters = options.formatters || {};
    this.masks = options.masks || {};
    this.data = options.data || {};
    this.errors = {};
    this.changeCallback = options.onChange || function() {};
  }

  calcFields(schema = this.schema, prefix = "", fields = []) {
    Object.keys(schema).forEach((key) => {
      if(typeof schema[key] === "object") {
        fields.concat(this.calcFields(schema[key], prefix + key + ".",  fields));
      } else {
	fields.push(prefix + key);
      }
    });
    return(fields);
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
    set(this.data, fieldName, this.mask(fieldName, value));
    this.changeCallback();
  }

  setValues(values) {
    // TODO: mask
    this.data = {...this.data, ...values};
    this.changeCallback();
  }

  /*
   * FORMATTING
  */

  format(fieldName, value) {
    // TODO calculate options
    const key = get(this.schema, fieldName);
    if(isNil(this.formatters[key])) {
      return({
        errors: [],
        formatted: value,
        parsed: value,
        valid: true
      });
    } else {
      return(this.formatters[key].format(value, {}));
    }
  }

  formatAll(values) {
    // TODO format all
    return(values);
  }

  /*
   * MASKING
  */

  mask(fieldName, value) {
    // TODO calculate options
    const key = get(this.schema, fieldName);
    if(isNil(this.formatters[key])) {
      return(value);
    } else {
      return(this.masks[key].mask(value, {}));
    }
  }

  /*
   * VALIDATION
  */

  isValid() {
    let flag = true;
    for(let i = 0; i < this.fields.length; i++) {
      const{valid} = this.format(this.fields[i], this.getValue(this.fields[i]));
      if(valid === false) {
        flag = false;
        break;
      }
    }
    return(flag);
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
    // TODO: format
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
