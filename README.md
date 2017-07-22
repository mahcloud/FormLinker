# Form Linker

[![CircleCI](https://circleci.com/gh/AlchemyAlcove/FormLinker/tree/master.svg?style=svg&circle-token=fbf647c85c63e5cc1da67c51a0db06990dbd7868)](https://circleci.com/gh/AlchemyAlcove/FormLinker/tree/master)

Links form elements to each other.

```js
  let fl = new FormLinker({
    data: {
      foo: "bar"
    }
  });

  fl.registerField("foo", e.target);
  fl.getFieldFormValue("foo");
```

This library is built with React in mind.