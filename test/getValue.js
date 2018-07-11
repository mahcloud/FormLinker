import test from "ava";
import FormLinker from "../src/index";
const yup = require("yup");

test("get value", t => {
  let fl = new FormLinker({
    data: {
      foo: "bar"
    },
    schema: yup.object().shape({
      foo: yup.string()
    })
  });

  t.deepEqual(fl.getValue("foo"), "bar");
  t.true(fl.isValid());
});

test("Deep Data", t => {
  let fl = new FormLinker({
    data: {
      foo: {
        bar: "Test"
      }
    },
    schema: yup.object().shape({
      foo: yup.object().shape({
        bar: yup.string()
      })
    })
  });

  t.is(fl.getValue("foo.bar"), "Test");
  t.true(fl.isValid());
});

test("Is a Boolean", t => {
  let fl = new FormLinker({
    data: {
      foo: {
        bar: true
      }
    },
    schema: yup.object().shape({
      foo: yup.object().shape({
        bar: yup.boolean()
      })
    })
  });

  t.is(fl.getValue("foo.bar"), true);
  t.true(fl.isValid());
});

test("Is a empty Array", t => {
  let fl = new FormLinker({
    data: {
      foo: {
        bar: []
      }
    },
    schema: yup.object().shape({
      foo: yup.object().shape({
        bar: yup.array()
      })
    })
  });

  t.is(fl.getValue("foo.bar").length, 0);
  t.true(fl.isValid());
});

test("Is a Number", t => {
  let fl = new FormLinker({
    data: {
      foo: {
        bar: 42
      }
    },
    schema: yup.object().shape({
      foo: yup.object().shape({
        bar: yup.number().positive().integer()
      })
    })
  });

  t.is(fl.getValue("foo.bar"), 42);
  t.true(fl.isValid());
});

test("Deep Data", t => {
  let fl = new FormLinker({
    data: {
      foo: {
        bar: "Test"
      }
    },
    schema: yup.object().shape({
      foo: yup.object().shape({
        bar: yup.string()
      })
    })
  });

  t.is(fl.getValue("foo.bar"), "Test");
  t.true(fl.isValid());
});

test("Deep data boolean", t => {
  let fl = new FormLinker({
    data: {
      foo: {
        bar: true
      }
    },
    schema: yup.object().shape({
      foo: yup.object().shape({
        bar: yup.boolean()
      })
    })
  });

  t.is(fl.getValue("foo.bar"), true);
  t.true(fl.isValid());
});

test("Deep data empty Array", t => {
  let fl = new FormLinker({
    data: {
      foo: {
        bar: []
      }
    },
    schema: yup.object().shape({
      foo: yup.object().shape({
        bar: yup.array()
      })
    })
  });

  t.is(fl.getValue("foo.bar").length, 0);
  t.true(fl.isValid());
});

test("Deep data number", t => {
  let fl = new FormLinker({
    data: {
      foo: {
        bar: 42
      }
    },
    schema: yup.object().shape({
      foo: yup.object().shape({
        bar: yup.number().positive().integer()
      })
    })
  });

  t.is(fl.getValue("foo.bar"), 42);
  t.true(fl.isValid());
});

test("Invalid deep data number", t => {
  let fl = new FormLinker({
    data: {
      foo: {
        bar: null
      }
    },
    schema: yup.object().shape({
      foo: yup.object().shape({
        bar: yup.number()
      })
    })
  });

  t.is(fl.getValue("foo.bar"), "");
  t.is(fl.isValid(), false);
});
