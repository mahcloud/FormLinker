import FormLinker from "../../src";
import test from "ava";
import { NumberFormatter } from "form-formatters";

test("schema no original data", t => {
  let fl = new FormLinker({
    schema: {
      foo: "string.required"
    }
  });

  t.deepEqual({}, fl.originalData);
});

test("schema simple original data", t => {
  let fl = new FormLinker({
    data: {
      foo: "bar"
    },
    schema: {
      foo: "string.required"
    }
  });

  t.deepEqual({foo: "bar"}, fl.originalData);
});

test("complex original data", t => {
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
    number: NumberFormatter
  };

  let fl = new FormLinker({
    data: data,
    formatters: formatters,
    schema: {
      foo: "number",
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

  t.deepEqual(data, fl.originalData);
});
