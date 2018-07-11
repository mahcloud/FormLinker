# Form Linker

[![CircleCI](https://circleci.com/gh/AlchemyAlcove/FormLinker/tree/master.svg?style=svg&circle-token=fbf647c85c63e5cc1da67c51a0db06990dbd7868)](https://circleci.com/gh/AlchemyAlcove/FormLinker/tree/master)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/alchemyalcove/formlinker/blob/master/LICENSE)

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
