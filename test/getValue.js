import test from "ava";
import FormLinker from "../src";

test("get value", t => {
  let fl = new FormLinker({
    data: {
      foo: "bar"
    },
    schema: {
      foo: "string"
    }
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
    schema: {
      foo: {
        bar: "string"
      }
    }
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
    schema: {
      foo: {
        bar: "boolean"
      }
    }
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
    schema: {
      foo: {
        bar: "array"
      }
    }
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
    schema: {
      foo: {
        bar: "number"
      }
    }
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
    schema: {
      foo: {
        bar: "string"
      }
    }
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
    schema: {
      foo: {
        bar: "boolean"
      }
    }
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
    schema: {
      foo: {
        bar: "array"
      }
    }
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
    schema: {
      foo: {
        bar: "number"
      }
    }
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
    schema: {
      foo: {
        bar: "number.required"
      }
    }
  });

  t.is(fl.getValue("foo.bar"), null);
  t.true(fl.isValid());
});
