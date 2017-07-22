const _isArray = (value) => {
  if(_isNil(value)) { return(false); }

  return(value.constructor === Array);
};

const _isEmpty = (value) => {
  if(_isNil(value)) { return(true); }

  return(
    (isString(value) && value.length === 0)
    || (isArray(value) && value.length === 0)
    || (isObject(value) && Object.keys(value).length === 0)
  );
};

const _isNil = (value) => {
  return(value === null || typeof(value) === "undefined");
};

const _isNumber = (value) => {
  if(_isNil(value)) { return(false); }

  return(typeof(value) === "number");
};

const _isObject = (value) => {
  if(_isNil(value)) { return(false); }

  return(value.constructor === Object);
};

const _isString = (value) => {
  if(this.isNil(value)) { return(false); }

  return(typeof(value) === "string");
};

module.exports = class{
  constructor(options = {}) {
    this.fields = {};
    this.formData = options.data || {};
    this.parsedData = options.data || {};
    this.errorData = {};
    this.changeCallback = options.onChange;
  }

  /*
  // FIELDS
  */

  clearFieldErrors(attrName) {
    this.updateErrors(attrName, {});
  }

  focusOnField(attrName) {
    this.fields[attrName].refs["input"].focus();
  }

  getFieldErrors(attrName) {
    return(this.errorData[attrName] || []);
  }

  getFieldFormValue(attrName) {
    if(_isEmpty(this.formData[attrName]) && !_isNumber(this.formData[attrName])) {
      return("");
    } else {
      return(this.formData[attrName]);
    }
  }

  getFieldParsedValue(attrName) {
    if(_isEmpty(this.parsedData[attrName]) && !_isNumber(this.parsedData[attrName])) {
      return("");
    } else {
      return(this.parsedData[attrName]);
    }
  }

  handleFieldChange(attrName, results) {
    if(_isObject(results)) {
      if(results.hasOwnProperty("formatted")) {
        this.updateFormValue(attrName, results.formatted);
      }
      if(results.hasOwnProperty("parsed")) {
        this.updateParsedValue(attrName, results.parsed);
      }
    } else {
      this.updateFormValue(attrName, results);
      this.updateParsedValue(attrName, results);
    }
    this.fields[attrName].handleUpdate();
    if(typeof(this.changeCallback) === "function") {
      this.changeCallback();
    }
  }

  handleFieldBlur(attrName, results) {
    this.updateFormValue(attrName, results.formatted);
    this.updateParsedValue(attrName, results.parsed);
    this.updateErrors(attrName, results.errors);
  }

  registerField(name, input) {
    this.fields[name] = input;
  }

  setFieldErrors(attrName, errors) {
    this.updateErrors(attrName, errors);
  }

  unregisterField(name, input) {
    this.fields[name] = null;
  }

  updateAllFields() {
    for(let key in this.fields) {
      this.fields[key].handleUpdate();
    }
  }

  /*
  // FORM
  */

  getState(stateAttr) {
    if(_isNil(this.form)) {
      return({});
    } else if(_isNil(this.form.state)) {
      console.error("Form must have state to use the FormLinker");
      return({});
    } else {
      return(this.form.state[stateAttr]);
    }
  }

  isValid() {
    let valid = true;
    for(let key in this.fields) {
      if(!this.fields[key].formattedValue().valid) {
        valid = false;
      }
    }
    return(valid);
  }

  registerForm(form) {
    this.form = form;

    this.setState("formData", this.formData);
    this.setState("parsedData", this.parsedData);
    this.setState("errorData", this.errorData);

    this.updateAllFields();
  }

  setFormData(data) {
    Object.keys(this.fields).forEach((attrName) => {
      let attrValue = data[attrName];
      if(!_isNil(attrValue)) {
        this.handleFieldChange(attrName, {formatted: attrValue, parsed: attrValue});
      }
    });
  }

  setState(stateAttr, newState) {
    if(!_isNil(this.form)) {
      this.form.setState({
        [stateAttr]: newState
      });
    }
  }

  setFormErrors(errors) {
    Object.keys(this.fields).forEach((attrName) => {
      let attrErrors = errors[attrName];
      if(!_isNil(attrErrors)) {
        this.updateErrors(attrName, attrErrors);
      }
    });
  }

  triggerValidations() {
    for(let key in this.fields) {
      this.fields[key].blur();
    }
  }

  updateFormValue(attr, value) {
    this.formData[attr] = value;
    this.setState("formData", this.formData);
  }

  updateParsedValue(attr, value) {
    this.parsedData[attr] = value;
    this.setState("parsedData", this.parsedData);
  }

  updateErrors(attr, newErrors) {
    if(_isEmpty(newErrors)) {
      delete this.errorData[attr];
    } else {
      this.errorData[attr] = newErrors;
    }
    this.setState("errorData", this.errorData);
    this.fields[attr].handleUpdate();
  }
};
