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
    // TODO original data
    this.data = options.data || {};
    this.errors = {};
    this.changeCallback = options.onChange || function() {};
  }
  // TODO usse cloneDeep to make sure there are no references to data

  // calcFields should be used only to instantiate the fields instance variable
  calcFields(schema = this.schema, prefix = "", fields = []) {
    Object.keys(schema).forEach((key) => {
      if(typeof schema[key] === "object") {
        fields.concat(this.calcFields(schema[key], prefix + key + ".", fields));
      } else {
        fields.push(prefix + key);
      }
    });
    return(fields);
  }

  /*
  // ERRORS
  */

  // getError gets the errors for a specific field
  getError(fieldName) {
    return(this.errors[fieldName] || []);
  }

  // getErrors returns the entire error object
  getErrors() {
    return(this.errors);
  }

  // setError removes errors data if an empty array or sets the errors. It also calls the changeCallback.
  setError(fieldName, errors) {
    if(isEmpty(errors)) {
      delete this.errors[fieldName];
    } else {
      set(this.errors, fieldName, errors);
    }
    this.changeCallback();
  }

  // setErrors sets the errors object. It also calls the changeCallback.
  setErrors(errors) {
    this.errors = errors;
    this.changeCallback();
  }

  /*
  // FIELDS
  */

  // getValue gets the value of the field. Sets the value to an empty string if not an array, not a number, not a boolean, and empty.
  getValue(fieldName) {
    let data = get(this.data, fieldName);
    if(isEmpty(data) && !isBoolean(data) && !isNumber(data) && !isArray(data)) {
      return("");
    }
    return(data);
  }

  // getValues returns the data object.
  getValues() {
    return(this.data);
  }

  // setValue sets the field value to the masked value passed in. It also calls the changeCallback.
  setValue(fieldName, value) {
    set(this.data, fieldName, this.mask(fieldName, value));
    this.changeCallback();
  }

  // setValues sets the field value to the masked value passed in. It also calls the changeCallback.
  setValues(values) {
    this.calcFields(values).forEach((fieldName) => {
      set(this.data, fieldName, this.mask(fieldName, get(values, fieldName)));
    });
    this.changeCallback();
  }

  /*
   * FORMATTING
  */

  // format returns formatter results. If no formatter is defined for the schema key, then the formatter structure is returned assuming true.
  format(fieldName, value) {
    // TODO calculate options
    // TODO handle chained formatters like required
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

  // formatAll formats all fields in schema.
  formatAll(values) {
    // TODO format all
    return(values);
  }

  /*
   * MASKING
  */

  // mask masks data based on schema key. If no mask is defined for the schema key, then the original value is returned.
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
};
