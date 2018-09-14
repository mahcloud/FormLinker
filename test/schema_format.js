import FormLinker from "../src";
import test from "ava";

test("schema string format", t => {
  let fl = new FormLinker({
    schema: {
      foo: "string"
    }
  });

  t.deepEqual(fl.format("foo", "test"),
    {
      valid: true,
      parsed: "test",
      formatted: "test",
      errors: []
    });
});
