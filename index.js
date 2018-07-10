const isArray = require("lodash/isArray");
const isBoolean = require("lodash/isBoolean");
const isEqual = require("lodash/isEqual");
const isEmpty = require("lodash/isEmpty");
const isNil = require("lodash/isNil");
const isNumber = require("lodash/isNumber");
const set = require("lodash/set");
const get = require("lodash/get");

module.exports = class{
  constructor(options = {}) {
    this.data = options.data || {};
    this.errors = {};
    this.changeCallback = options.onChange || function() {};
  }

  /*
  // ERRORS
  */

  getErrors(fieldName) {
    return(this.errors[fieldName] || []);
  }

  setErrors(errors, fieldName) {
    if(isNil(fieldName)) {
      this.data = {...this.errors, ...errors};
      /* Object.keys(errors).forEach((fieldName) => {
        let fieldErrors = errors[fieldName];
        if(!isNil(fieldErrors)) {
          this.setErrors(fieldErrors, fieldName);
        }
      }); */
    } else {
      if(isEmpty(errors)) {
        delete this.errors[fieldName];
      } else {
        this.errors[fieldName] = errors;
      }
    }
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

  setValue(value, fieldName) {
    if(isNil(fieldName)) {
      set(this.data, fieldName, value);
    } else {
      this.data = {...this.data, ...value};
      /* Object.keys(value).forEach((fieldName) => {
        let fieldValue = value[fieldName];
        if(!isNil(fieldValue)) {
          this.setValue(fieldValue, fieldName);
        }
      }); */
    }
    this.changeCallback();
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
