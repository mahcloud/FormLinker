# Form Linker

[![CircleCI](https://circleci.com/gh/AlchemyAlcove/FormLinker/tree/master.svg?style=svg&circle-token=fbf647c85c63e5cc1da67c51a0db06990dbd7868)](https://circleci.com/gh/AlchemyAlcove/FormLinker/tree/master)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/alchemyalcove/formlinker/blob/master/LICENSE)

Links form elements to each other.

## Install

npm i --save form-linker

## Example

Basic

```js
import { EmailFormatter, EmailMask, NumberFormatter, NumberMask, RequiredFormatter } from "form-formatter";

class Example extends React.Component {
  constructor(props) {
    super(props);

    this.fl = new FormLinker({
      data: {
        age: 23,
	email: "test@test.com"
      },
      schema: {
        age: "number.required",
	email: "email.required"
      },
      formatters: {
        "email": EmailFormatter,
        "number": NumberFormatter,
        "required": RequiredFormatter
      },
      masks: {
        "email": EmailMask,
        "number": NumberMask
      },
      onChange: () => this.forceUpdate()
    });
  }

  render() {
    return(
      <form>
        <Input formLinker={this.fl} name="foo"/>
        <Input formLinker={this.fl} name="email"/>
      </form>
    );
  }
}

class Input extends React.Component {
  render() {
    return(
      <input value={this.props.formLinker.getValue(this.props.name)} onChange={(e) => this.props.formLinker.setValue(this.props.name, e.target.value)} onBlur={() => this.props.formLinker.validate(this.props.name)}/>
    );
  }
}
```

## Constructor options

### data

Provide initial data for the form.


### schema

Provide structure of data as nested object with dot deliminated string values.

Each string is represented in the formatters and masks options. When validating the schema uses the formatters to validate each form field. When setting a value the masks are used to limit user input.


### Formatters

Object where keys match schema string values and values map to the formatter to handle values.

Formatters should have a format function that takes a single value.

Formatters should return data in an object like:

```json
{
errors: [],
formatted: "$1,000.00",
parsed: 1000.00,
valid: true
}
```


### Masks

Object where keys match schema string values and values map to the mask to handle values.

Makes should have a mask function that takes a single value and returns a single value.


## Functions

### Error Functions
getError(fieldName // String)

Returns an array of errors for the specified fieldName.


getErrors()

Returns all errors in the same structure as the schema.


setError(fieldName // String, errors // Array)

Sets errors for the specified fieldName

setError(fieldName // String, [])

Clears errors on the specified fieldName.


setErrors(errors // Object)

Sets errors for all keys in object. Uses key/attr as fieldName and value as error array.

When setting an object of errors, we assume that the developer wants to clear out all previous errors and start with a new error set as defined. So when calling this function, all previous errors are removed.


### Value Functions

getValue(fieldName // String)

Returns value for the specified fieldName.


getValues()

Returns all values in the structure of the schema.


setValue(fieldName \\ String, value \\ Anything)

Sets value for the specified fieldName

setValues(value \\ Object)

Sets values for all keys in object. Uses key/attr as fieldName and value as value.


### Validating Functions

isValid()

Returns a boolean of whether the form is valid or not. This uses the schema to check validation.

validate(fieldName // String)

Returns null. This function sets errors and formatting for the specified fieldName.

validateAll()

Returns null. Calls validate on all fields in the schema.


### Differences Functions

extractDifferences(original \\ Object, fields \\ Array)

Returns a differences object. Each key represents a field with changes from the original data. The value of the object represents the current value.

original represents the original data set.

Fields represents an array of strings specifying the fields to check.
