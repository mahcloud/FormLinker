# Form Linker

[![CircleCI](https://circleci.com/gh/AlchemyAlcove/FormLinker/tree/master.svg?style=svg&circle-token=fbf647c85c63e5cc1da67c51a0db06990dbd7868)](https://circleci.com/gh/AlchemyAlcove/FormLinker/tree/master)

Links form elements to each other.

This library is built with React in mind.

## Install

npm i --save form-linker

## Example

Basic

```js
class Example extends React.Component {
  constructor(props) {
    super(props);

    this.fl = new FormLinker({
      data: {
        foo: "bar"
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
  componentDidMount() {
    this.fl.registerField(this.props.name, this);
  }

  render() {
    return(
      <input value={this.props.formLinker.getFieldValue(this.props.name)}/>
    );
  }
}
```

## Functions

getErrors(fieldName // String)

Returns an array of errors for the specified fieldName.


setErrors(errors // Array, fieldName // String)

Sets errors for the specified fieldName

setErrors([], fieldName // String)

Clears errors on the specified fieldName.

setErrors(errors // Object)

Sets errors for all keys in object. Uses key/attr as fieldName and value as error array.


getValue(fieldName // String)

Returns value for the specified fieldName.


setValue(value \\ Anything, fieldName \\ String)

Sets value for the specified fieldName

setValue(value \\ Object)

Sets values for all keys in object. Uses key/attr as fieldName and value as value.


extractDifferences(original \\ Object, fields \\ Array)

Returns a differences object. Each key represents a field with changes from the original data. The value of the object represents the current value.

original represents the original data set.

Fields represents an array of strings specifying the fields to check.