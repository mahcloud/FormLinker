import test from "ava";
import FormLinker from "../src";
import { CreditCardFormatter, DateFormatter, NumberFormatter, RequiredFormatter, WholeFormatter } from "form-formatters";

test("validate", t => {
  let fl = new FormLinker({
    data: {
      foo: null
    },
    schema: {
      foo: "string"
    }
  });

  fl.validateAll();
  t.deepEqual(fl.getError("foo"), []);
  t.true(fl.isValid());
});

test("multiple formatters valid", t => {
  const formatters = {
    "cc": CreditCardFormatter,
    "required": RequiredFormatter
  };

  let fl = new FormLinker({
    data: {
      cc: "1234-1234-1234-1234"
    },
    formatters: formatters,
    schema: {
      cc: "cc.required"
    }
  });

  fl.validate("cc");
  t.deepEqual(fl.getError("cc"), []);
});

test("multiple formatters date valid", t => {
  const formatters = {
    "date": DateFormatter,
    "required": RequiredFormatter
  };

  let fl = new FormLinker({
    data: {
      date: "10 10 2010"
    },
    formatters: formatters,
    schema: {
      date: "date.required"
    }
  });

  fl.validate("date");
  t.deepEqual(fl.getError("date"), []);
  t.deepEqual(fl.getValue("date"), "Oct 10, 2010");
});

test("multiple formatters num.whole valid", t => {
  const formatters = {
    "num": NumberFormatter,
    "required": RequiredFormatter,
    "whole": WholeFormatter
  };

  let fl = new FormLinker({
    data: {
      whole: "23"
    },
    formatters: formatters,
    schema: {
      whole: "num.whole.required"
    }
  });

  fl.validate("whole");
  t.deepEqual(fl.getError("whole"), []);
  t.deepEqual(fl.getValue("whole"), "23");
});

test("multiple formatters invalid", t => {
  const formatters = {
    "cc": CreditCardFormatter,
    "required": RequiredFormatter
  };

  let fl = new FormLinker({
    data: {
      cc: "1234"
    },
    formatters: formatters,
    schema: {
      cc: "cc.required"
    }
  });

  fl.validate("cc");
  t.deepEqual(fl.getError("cc"), ["FormFormatters.creditCardInvalid"]);
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
  t.deepEqual(fl.getValue("foo"), "23");
  fl.setValue("foo", null);
  t.deepEqual(fl.getError("foo"), []);
  t.deepEqual(fl.getValue("foo"), null);
  fl.validate("foo");
  t.deepEqual(fl.getError("foo"), ["FormFormatters.required"]);
});
