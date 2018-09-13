import test from "ava";
import FormLinker from "../src";

test("extractDifferences returns object with changes", t => {
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

  let original = {
    foo: {
      bar: 41
    }
  }
  t.deepEqual(fl.extractDifferences(original), {foo: {bar: 42}});
  t.true(fl.isValid());
});

test("extractDifferences returns empty Object", t => {
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

  let original = {
    foo: {
      bar: 42
    }
  }
  t.deepEqual(fl.extractDifferences(original), {});
  t.true(fl.isValid());
});

test("extractDifferences multiple fields with 1 different", t => {
  let fl = new FormLinker({
    data: {
      foo: 42,
      bar: 15
    },
    schema: {
      foo: "number",
      bar: "number"
    }
  });

  let original = {
    foo: 41,
    bar: 15
  }
  t.deepEqual(fl.extractDifferences(original), { foo: 42 });
  t.true(fl.isValid());
});

test("extractDifferences multiple fields with many differences", t => {
  let fl = new FormLinker({
    data: {
      foo: 42,
      bar: 15,
      cat: false,
      dog: true,
      happy: true,
      sad: false
    },
    schema: {
      foo: "number",
      bar: "number",
      cat: "boolean",
      dog: "boolean",
      happy: "boolean",
      sad: "boolean"
    }
  });

  let original = {
    foo: 41,
    bar: 15,
    cat: true,
    dog: false,
    happy: false,
    sad: true
  }
  t.deepEqual(fl.extractDifferences(original), { foo: 42, cat: false, dog: true, happy: true, sad: false});
  t.true(fl.isValid());
});

test("extractDifferences multiple nested fields with many differences", t => {
  let fl = new FormLinker({
    data: {
      foo: 42,
      bar: 15,
      girl: {
        happy: true,
        sad: false
      },
      boy: {
        happy: true,
        sad: false
      }
    },
    schema: {
      foo: "number",
      bar: "number",
      girl: {
        happy: "boolean",
        sad: "boolean"
      },
      boy: {
        happy: "boolean",
        sad: "boolean"
      }
    }
  });

  let original = {
    foo: 41,
    bar: 15,
    girl: {
      happy: false,
      sad: true
    },
    boy: {
      happy: false,
      sad: true
    }
  }
  t.deepEqual(fl.extractDifferences(original), {"foo": 42, girl: {happy: true, sad: false}, boy: {happy: true, sad: false}});
  t.true(fl.isValid());
});
