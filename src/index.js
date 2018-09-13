const get = require("lodash/get");
const isEqual = require("lodash/isEqual");
const isEmpty = require("lodash/isEmpty");
const isNil = require("lodash/isNil");
const set = require("lodash/set");

module.exports = class{
  constructor(options = {}) {
    this.schema = options.schema || {};
    this.fields = this.calcFields();
    this.converters = options.converters || {};
    this.formatters = options.formatters || {};
    this.masks = options.masks || {};
    this.data = {};
    this.setValuesFromParsed(options.data || {}, false);
    this.parsedData = options.data || {};
    this.originalData = Object.assign({}, this.parsedData);
    this.errors = {};
    this.changeCallback = options.onChange || function() {};
  }

  // calcFields should be used only to instantiate the fields instance variable
  calcFields(schema = this.schema, prefix = "", fields = []) {
    Object.keys(schema).forEach((key) => {
      if(typeof schema[key] === "object") {
        this.calcFields(schema[key], prefix + key + ".", fields);
      } else {
        fields.push(prefix + key);
      }
    });
    return(fields);
  }

  convert(fieldName, value) {
    const key = get(this.schema, fieldName);

    if(!isNil(key)) {
      key.split(".").forEach((converter) => {
        if(!isNil(this.converters[converter])) {
          value = this.converters[converter](value);
        }
      });
    }

    return(value);
  }

  /*
  // ERRORS
  */

  // getError gets the errors for a specific field
  getError(fieldName) {
    return(get(this.errors, fieldName) || []);
  }

  // getErrors returns the entire error object
  getErrors() {
    return(this.errors);
  }

  // setError removes errors data if an empty array or sets the errors. It also calls the changeCallback.
  setError(fieldName, errors, triggerCallback = true) {
    if(isEmpty(errors)) {
      delete this.errors[fieldName];
    } else {
      set(this.errors, fieldName, errors);
    }
    if(triggerCallback) {
      this.changeCallback();
    }
  }

  // setErrors sets the errors object. It also calls the changeCallback.
  setErrors(errors, triggerCallback = true) {
    this.errors = errors;
    if(triggerCallback) {
      this.changeCallback();
    }
  }

  /*
  // VALUES
  */

  // getValue gets the value of the field. Sets the value to an empty string if not an array, not a number, not a boolean, and empty.
  getValue(fieldName) {
    return(get(this.data, fieldName));
  }

  // getValues returns the data object.
  getValues() {
    return(this.data);
  }

  // setValue sets the field value to the masked value passed in. It also calls the changeCallback.
  setValue(fieldName, value, triggerCallback = true) {
    set(this.data, fieldName, this.mask(fieldName, value));
    set(this.parsedData, fieldName, this.format(fieldName, value).parsed);
    if(triggerCallback) {
      this.changeCallback();
    }
  }

  // setValues sets the field value to the masked value passed in. It also calls the changeCallback.
  setValues(values, triggerCallback = true) {
    this.fields.forEach((fieldName) => {
      let value = get(values, fieldName);
      if(typeof value !== "undefined") {
        this.setValue(fieldName, value, false);
      }
    });
    if(triggerCallback) {
      this.changeCallback();
    }
  }

  setValuesFromParsed(values) {
    this.fields.forEach((fieldName) => {
      let value = get(values, fieldName);
      if(typeof value !== "undefined") {
        set(this.data, fieldName, this.convert(fieldName, value));
      }
    });
  }

  /*
   * FORMATTING
  */

  // format returns formatter results. If no formatter is defined for the schema key, then the formatter structure is returned assuming true.
  format(fieldName, value) {
    const key = get(this.schema, fieldName);
    let response = {
      errors: [],
      formatted: value,
      parsed: value,
      valid: true
    };

    if(!isNil(key)) {
      key.split(".").forEach((formatter) => {
        if(!isNil(this.formatters[formatter])) {
          response = this.formatters[formatter](response);
        }
      });
    }

    return(response);
  }

  /*
   * MASKING
  */

  // mask masks data based on schema key. If no mask is defined for the schema key, then the original value is returned.
  mask(fieldName, value) {
    const key = get(this.schema, fieldName);
    let response = value;

    if(!isNil(key)) {
      key.split(".").forEach((mask) => {
        if(!isNil(this.masks[mask])) {
          response = this.masks[mask].mask(value);
        }
      });
    }

    return(response);
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

  validate(fieldName, triggerCallback = true) {
    const{errors, formatted, parsed} = this.format(fieldName, this.getValue(fieldName));
    this.setError(fieldName, errors, false);
    this.setValue(fieldName, formatted, false);
    set(this.parsedData, fieldName, parsed);

    if(triggerCallback) {
      this.changeCallback();
    }
  }

  validateAll(triggerCallback = true) {
    this.fields.forEach((field) => {
      this.validate(field, false);
    });

    if(triggerCallback) {
      this.changeCallback();
    }
  }

  /*
  // Differences
  */

  // extractDifferences returns an object of every key that has changed with the value it has changed to. This is great for sending only changes.
  extractDifferences(original) {
    let differences = {};
    const data = this.data;

    this.fields.forEach((field) => {
      if((isNil(get(original, field)) || get(original, field) === "") && (isNil(get(data, field)) || get(data, field) === "")) {
        // do nothing
      } else if(!isEqual(get(original, field), get(data, field))) {
        set(differences, field, get(data, field));
      }
    });
    return(differences);
  }

  /*
   * SCHEMA
  */

  updateSchema(schema) {
    this.schema = schema || {};
    this.fields = this.calcFields();
    this.validateAll();
    this.errors = {};
  }
};
