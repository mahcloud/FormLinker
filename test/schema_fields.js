import test from "ava";
import Schema from "../src/schema";

test("schema fields", t => {
  let schema = new Schema({
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

  t.deepEqual(["foo", "bar", "girl.happy", "girl.sad", "girl.personality.mood", "girl.personality.quality", "boy.happy", "boy.sad"], schema.fields());
});
