import FormLinker from "../";
import test from "ava";

test("schema simple fields", t => {
  let fl = new FormLinker({
    schema: {
      foo: "string.required"
    }
  });

  t.deepEqual(["foo"], fl.fields);
});

test("schema fields", t => {
  let fl = new FormLinker({
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

  t.deepEqual(["foo", "bar", "girl.happy", "girl.sad", "girl.personality.mood", "girl.personality.quality", "boy.happy", "boy.sad"], fl.fields);
});
