import test from "ava";
import FormLinker from "../src/index";
const yup = require("yup");

test("set value", t => {
  let fl = new FormLinker({
    data: {
      foo: "bar"
    },
    schema: yup.object().shape({
      foo: yup.string()
    })
  });

  t.deepEqual(fl.getValue("foo"), "bar");
  fl.setValue("foo", "new bar");
  t.deepEqual(fl.getValue("foo"), "new bar");
  t.true(fl.isValid());
});

test("set nested value", t => {
  let fl = new FormLinker({
    data: {
      foo: {
        bar: "cake"
      }
    },
    schema: yup.object().shape({
      foo: yup.object().shape({
        bar: yup.string()
      })
    })
  });

  t.deepEqual(fl.getValue("foo.bar"), "cake");
  fl.setValue("foo.bar", "test");
  t.deepEqual(fl.getValue("foo.bar"), "test");
  t.true(fl.isValid());
});

test("set nested value to null", t => {
  let fl = new FormLinker({
    data: {
      foo: {
        bar: "cake"
      }
    },
    schema: yup.object().shape({
      foo: yup.object().shape({
        bar: yup.string()
      })
    })
  });

  t.deepEqual(fl.getValue("foo.bar"), "cake");
  fl.setValue("foo.bar", null);
  t.deepEqual(fl.getValue("foo.bar"), "");
  t.is(fl.isValid(), false);
});

test("set nested value to null", t => {
  let fl = new FormLinker({
    data: {
      foo: 42,
      bar: 15,
      girl: {
        happy: false,
        sad: true
      },
      boy: {
        happy: false,
        sad: true
      }
    },
    schema: yup.object().shape({
      foo: yup.number().required().positive().integer(),
      bar: yup.number().required().positive().integer(),
      girl: yup.object().shape({
        happy: yup.boolean(),
        sad: yup.boolean()
      }),
      boy: yup.object().shape({
        happy: yup.boolean(),
        sad: yup.boolean()
      })
    })
  });

  t.deepEqual(fl.getValue("foo"), 42);
  t.deepEqual(fl.getValue("bar"), 15);
  t.deepEqual(fl.getValue("girl.happy"), false);
  t.deepEqual(fl.getValue("girl.sad"), true);
  t.deepEqual(fl.getValue("boy.happy"), false);
  t.deepEqual(fl.getValue("boy.sad"), true);
  fl.setValues({
    foo: 23,
    girl: {
      happy: true
    },
    boy: {
      happy: true
    }
  });
  t.deepEqual(fl.getValue("foo"), 23);
  t.deepEqual(fl.getValue("bar"), 15);
  t.deepEqual(fl.getValue("girl.happy"), true);
  t.deepEqual(fl.getValue("girl.sad"), "");
  t.deepEqual(fl.getValue("boy.happy"), true);
  t.deepEqual(fl.getValue("boy.sad"), "");
  t.true(fl.isValid());
});
