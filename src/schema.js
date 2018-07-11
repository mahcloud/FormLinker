const isNil = require("lodash/isNil");

module.exports = class{
  constructor(options = {}) {
    this.formatters = options.formatters || {};
    this.masks = options.masks || {};
    this.schema = options.schema || {};
  }

  fields(schema = this.schema, prefix = "", fields = []) {
    Object.keys(schema).forEach((key) => {
      if(typeof schema[key] === "object") {
        fields.concat(this.fields(schema[key], prefix + key + ".",  fields));
      } else {
	fields.push(prefix + key);
      }
    });

    return(fields);
  }

  format(key, value, options) {
    return(this.formatters[key].format(value, options));
  }

  formatAll(values) {
    return(values);
  }

  mask(key, value, options) {
    return(this.masks[key].mask(value, options));
  }
};