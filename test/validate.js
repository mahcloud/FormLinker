import test from "ava";
import FormLinker from "../";
import { NumberFormatter, RequiredFormatter } from "form-formatters";

test("validate", t => {
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

  fl.validateAll();
  t.deepEqual(fl.getError("foo"), []);
  t.true(fl.isValid());
});

test("complex validate", t => {
  const data = {
    foo: 23,
    bar: 42,
    girl: {
      happy: true,
      sad: false,
      personality: {
        mood: "pleasant",
        quality: 10
      }
    },
    boy: {
      happy: true,
      sad: false
    }
  };

  const formatters = {
    "number": NumberFormatter,
    "required": RequiredFormatter
  };

  let fl = new FormLinker({
    data: data,
    formatters: formatters,
    schema: {
      foo: "number.required",
      bar: "number",
      girl: {
        happy: "boolean",
        sad: "boolean",
        personality: {
          mood: "string",
          quality: "number"
        }
      },
      boy: {
        happy: "boolean",
        sad: "boolean"
      }
    }
  });

  t.deepEqual(fl.getValue("foo"), 23);
  fl.validate("foo");
  t.deepEqual(fl.getValue("foo"), 23);
  fl.setValue("foo", null);
  t.deepEqual(fl.getError("foo"), []);
  t.deepEqual(fl.getValue("foo"), null);
  fl.validate("foo");
  t.deepEqual(fl.getError("foo"), ["FormFormatters.required"]);
});
