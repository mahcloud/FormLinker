import test from "ava";
import FormLinker from "../index";

test("test", t => {
  let fl = new FormLinker({
    data: {
      foo: "bar"
    }
  });

  t.deepEqual(fl.getValue("foo"), "bar");
  // t.true(fl.isValid());
});

test("Deep Data", t => {
  let fl = new FormLinker({
    data: {
      foo: {
        bar: "Test"
      }
    }
  });

  t.is(fl.getValue("foo.bar"), "Test");
  // t.true(fl.isValid());
});

test("Is a Boolean", t => {
  let fl = new FormLinker({
    data: {
      foo: {
        bar: true
      }
    }
  });

  t.is(fl.getValue("foo.bar"), true);
  // t.true(fl.isValid());
});

test("Is a empty Array", t => {
  let fl = new FormLinker({
    data: {
      foo: {
        bar: []
      }
    }
  });

  t.is(fl.getValue("foo.bar").length, 0);
  // t.true(fl.isValid());
});

test("Is a Number", t => {
  let fl = new FormLinker({
    data: {
      foo: {
        bar: 42
      }
    }
  });

  t.is(fl.getValue("foo.bar"), 42);
  // t.true(fl.isValid());
});

test("Deep Data", t => {
  let fl = new FormLinker({
    data: {
      foo: {
        bar: "Test"
      }
    }
  });

  t.is(fl.getValue("foo.bar"), "Test");
  // t.true(fl.isValid());
});

test("Deep data boolean", t => {
  let fl = new FormLinker({
    data: {
      foo: {
        bar: true
      }
    }
  });

  t.is(fl.getValue("foo.bar"), true);
  // t.true(fl.isValid());
});

test("Deep data empty Array", t => {
  let fl = new FormLinker({
    data: {
      foo: {
        bar: []
      }
    }
  });

  t.is(fl.getValue("foo.bar").length, 0);
  // t.true(fl.isValid());
});

test("Deep data number", t => {
  let fl = new FormLinker({
    data: {
      foo: {
        bar: 42
      }
    }
  });

  t.is(fl.getValue("foo.bar"), 42);
  // t.true(fl.isValid());
});
