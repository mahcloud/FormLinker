import test from "ava";
import FormLinker from "../index";

test("test", t => {
  let fl = new FormLinker({
    data: {
      foo: "bar"
    }
  });

  t.deepEqual(fl.getFieldFormValue("foo"), "bar");
  t.true(fl.isValid());
});

test("Deep Data", t => {
  let fl = new FormLinker({
    data: {
      foo: {
        bar: "Test"
      }
    }
  });

  t.is(fl.getFieldFormValue("foo.bar"), "Test");
  t.true(fl.isValid());
});

test("Is a Boolean", t => {
  let fl = new FormLinker({
    data: {
      foo: {
        bar: true
      }
    }
  });

  t.is(fl.getFieldFormValue("foo.bar"), true);
  t.true(fl.isValid());
});

test("Is a empty Array", t => {
  let fl = new FormLinker({
    data: {
      foo: {
        bar: []
      }
    }
  });

  t.is(fl.getFieldFormValue("foo.bar").length, 0);
  t.true(fl.isValid());
});

test("Is a Boolean", t => {
  let fl = new FormLinker({
    data: {
      foo: {
        bar: 42
      }
    }
  });

  t.is(fl.getFieldFormValue("foo.bar"), 42);
  t.true(fl.isValid());
});

test("Deep Data", t => {
  let fl = new FormLinker({
    data: {
      foo: {
        bar: "Test"
      }
    }
  });

  t.is(fl.getFieldFormValue("foo.bar"), "Test");
  t.true(fl.isValid());
});

test("Is a Boolean", t => {
  let fl = new FormLinker({
    data: {
      foo: {
        bar: true
      }
    }
  });

  t.is(fl.getFieldFormValue("foo.bar"), true);
  t.true(fl.isValid());
});

test("Is a empty Array", t => {
  let fl = new FormLinker({
    data: {
      foo: {
        bar: []
      }
    }
  });

  t.is(fl.getFieldFormValue("foo.bar").length, 0);
  t.true(fl.isValid());
});

test("Is a Boolean", t => {
  let fl = new FormLinker({
    data: {
      foo: {
        bar: 42
      }
    }
  });

  t.is(fl.getFieldFormValue("foo.bar"), 42);
  t.true(fl.isValid());
});

test("extractDifferences returns object with changes", t => {
  let fl = new FormLinker({
    data: {
      foo: {
        bar: 42
      }
    }
  });

  let original = {
    foo: {
      bar: 41
    }
  }
  t.deepEqual(fl.extractDifferences(original, ["foo.bar"]), { "foo.bar": 42 });
  t.true(fl.isValid());
})

test("extractDifferences returns empty Object", t => {
  let fl = new FormLinker({
    data: {
      foo: {
        bar: 42
      }
    }
  });

  let original = {
    foo: {
      bar: 42
    }
  }
  t.deepEqual(fl.extractDifferences(original, ["foo.bar"]), {});
  t.true(fl.isValid());
})

test("extractDifferences multiple fields with 1 different", t => {
  let fl = new FormLinker({
    data: {
      foo: 42,
      bar: 15
    }
  });

  let original = {
    foo: 41,
    bar: 15
  }
  t.deepEqual(fl.extractDifferences(original, ["foo", "bar"]), { foo: 42 });
  t.true(fl.isValid());
})

test("extractDifferences multiple fields with many differences", t => {
  let fl = new FormLinker({
    data: {
      foo: 42,
      bar: 15,
      cat: false,
      dog: true,
      happy: true,
      sad: false
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
  t.deepEqual(fl.extractDifferences(original, ["foo", "bar", "cat", "dog", "happy", "sad"]), { foo: 42, cat: false, dog: true, happy: true, sad: false});
  t.true(fl.isValid());
})

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
  t.deepEqual(fl.extractDifferences(original, ["foo", "bar", "girl.happy", "girl.sad", "boy.happy", "boy.sad"]), {"foo": 42, "girl.happy": true, "girl.sad": false, "boy.happy": true, "boy.sad": false});
  t.true(fl.isValid());
})
