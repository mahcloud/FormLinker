"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var get = require("lodash/get");
var isEqual = require("lodash/isEqual");
var isEmpty = require("lodash/isEmpty");
var isNil = require("lodash/isNil");
var set = require("lodash/set");

module.exports = function () {
  function _class() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, _class);

    this.schema = options.schema || {};
    this.fields = this.calcFields();
    this.formatters = options.formatters || {};
    this.masks = options.masks || {};
    this.data = {};
    this.setValues(options.data || {}, false);
    this.parsedData = options.data || {};
    this.originalData = Object.assign({}, this.parsedData);
    this.errors = {};
    this.validateAll(false);
    this.errors = {};
    this.changeCallback = options.onChange || function () {};
  }

  // calcFields should be used only to instantiate the fields instance variable


  _createClass(_class, [{
    key: "calcFields",
    value: function calcFields() {
      var schema = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.schema;

      var _this = this;

      var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
      var fields = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

      Object.keys(schema).forEach(function (key) {
        if (_typeof(schema[key]) === "object") {
          _this.calcFields(schema[key], prefix + key + ".", fields);
        } else {
          fields.push(prefix + key);
        }
      });
      return fields;
    }

    /*
    // ERRORS
    */

    // getError gets the errors for a specific field

  }, {
    key: "getError",
    value: function getError(fieldName) {
      return get(this.errors, fieldName) || [];
    }

    // getErrors returns the entire error object

  }, {
    key: "getErrors",
    value: function getErrors() {
      return this.errors;
    }

    // setError removes errors data if an empty array or sets the errors. It also calls the changeCallback.

  }, {
    key: "setError",
    value: function setError(fieldName, errors) {
      var triggerCallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      if (isEmpty(errors)) {
        delete this.errors[fieldName];
      } else {
        set(this.errors, fieldName, errors);
      }
      if (triggerCallback) {
        this.changeCallback();
      }
    }

    // setErrors sets the errors object. It also calls the changeCallback.

  }, {
    key: "setErrors",
    value: function setErrors(errors) {
      var triggerCallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      this.errors = errors;
      if (triggerCallback) {
        this.changeCallback();
      }
    }

    /*
    // FIELDS
    */

    // getValue gets the value of the field. Sets the value to an empty string if not an array, not a number, not a boolean, and empty.

  }, {
    key: "getValue",
    value: function getValue(fieldName) {
      return get(this.data, fieldName);
    }

    // getValues returns the data object.

  }, {
    key: "getValues",
    value: function getValues() {
      return this.data;
    }

    // setValue sets the field value to the masked value passed in. It also calls the changeCallback.

  }, {
    key: "setValue",
    value: function setValue(fieldName, value) {
      var triggerCallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      set(this.data, fieldName, this.mask(fieldName, value));
      if (triggerCallback) {
        this.changeCallback();
      }
    }

    // setValues sets the field value to the masked value passed in. It also calls the changeCallback.

  }, {
    key: "setValues",
    value: function setValues(values) {
      var _this2 = this;

      var triggerCallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      this.fields.forEach(function (fieldName) {
        var value = get(values, fieldName);
        if (typeof value !== "undefined") {
          set(_this2.data, fieldName, _this2.mask(fieldName, value));
        }
      });
      if (triggerCallback) {
        this.changeCallback();
      }
    }

    /*
     * FORMATTING
    */

    // format returns formatter results. If no formatter is defined for the schema key, then the formatter structure is returned assuming true.

  }, {
    key: "format",
    value: function format(fieldName, value) {
      var _this3 = this;

      var key = get(this.schema, fieldName);
      var response = {
        errors: [],
        formatted: value,
        parsed: value,
        valid: true
      };

      if (!isNil(key)) {
        key.split(".").forEach(function (formatter) {
          if (!isNil(_this3.formatters[formatter])) {
            var newResponse = _this3.formatters[formatter].format(response.formatted);
            response = {
              errors: response.errors.concat(newResponse.errors),
              formatted: newResponse.formatted,
              parsed: newResponse.parsed,
              valid: response.valid && newResponse.valid
            };
          }
        });
      }

      return response;
    }

    /*
     * MASKING
    */

    // mask masks data based on schema key. If no mask is defined for the schema key, then the original value is returned.

  }, {
    key: "mask",
    value: function mask(fieldName, value) {
      var _this4 = this;

      var key = get(this.schema, fieldName);
      var response = value;

      if (!isNil(key)) {
        key.split(".").forEach(function (mask) {
          if (!isNil(_this4.masks[mask])) {
            response = _this4.masks[mask].mask(value);
          }
        });
      }

      return response;
    }

    /*
     * VALIDATION
    */

  }, {
    key: "isValid",
    value: function isValid() {
      var flag = true;
      for (var i = 0; i < this.fields.length; i++) {
        var _format = this.format(this.fields[i], this.getValue(this.fields[i])),
            valid = _format.valid;

        if (valid === false) {
          flag = false;
          break;
        }
      }
      return flag;
    }
  }, {
    key: "validate",
    value: function validate(fieldName) {
      var triggerCallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      var _format2 = this.format(fieldName, this.getValue(fieldName)),
          errors = _format2.errors,
          formatted = _format2.formatted,
          parsed = _format2.parsed;

      this.setError(fieldName, errors, false);
      this.setValue(fieldName, formatted, false);
      set(this.parsedData, fieldName, parsed);

      if (triggerCallback) {
        this.changeCallback();
      }
    }
  }, {
    key: "validateAll",
    value: function validateAll() {
      var _this5 = this;

      var triggerCallback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      this.fields.forEach(function (field) {
        _this5.validate(field, false);
      });

      if (triggerCallback) {
        this.changeCallback();
      }
    }

    /*
    // Differences
    */

    // extractDifferences returns an object of every key that has changed with the value it has changed to. This is great for sending only changes.

  }, {
    key: "extractDifferences",
    value: function extractDifferences(original) {
      var differences = {};
      var data = this.data;

      this.fields.forEach(function (field) {
        if ((isNil(get(original, field)) || get(original, field) === "") && (isNil(get(data, field)) || get(data, field) === "")) {
          // do nothing
        } else if (!isEqual(get(original, field), get(data, field))) {
          set(differences, field, get(data, field));
        }
      });
      return differences;
    }

    /*
     * SCHEMA
    */

  }, {
    key: "updateSchema",
    value: function updateSchema(schema) {
      this.schema = schema || {};
      this.fields = this.calcFields();
      this.validateAll();
      this.errors = {};
    }
  }]);

  return _class;
}();