import test from "ava";
import FormLinker from "../src";

test("get default error", t => {
  let fl = new FormLinker({
    data: {
      foo: null
    },
    schema: {
      schema: {
        foo: "string"
      }
    }
  });

  t.deepEqual(fl.getError("foo"), []);
  t.true(fl.isValid());
});

test("get error", t => {
  let fl = new FormLinker({
    data: {
      foo: null
    },
    schema: {
      schema: {
        foo: "string"
      }
    }
  });

  fl.setError("foo", ["test"]);
  t.deepEqual(fl.getError("foo"), ["test"]);
  t.true(fl.isValid());
});
