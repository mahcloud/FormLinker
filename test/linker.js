import test from "ava";
import FormLinker from "../index";

test("test", t => {
  let fl = new FormLinker({
    data: {
      foo: "bar"
    }
  });

  t.deepEqual(fl.getFieldFormValue("foo"), "bar");
  t.deepEqual(fl.isValid(), true);
});
