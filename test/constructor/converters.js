import FormLinker from "../../";
import test from "ava";
import { DateConverter } from "form-formatters";

test("date converter", t => {
  let fl = new FormLinker({
    converters: {
      date: DateConverter
    },
    data: {
      foo: 1672531200
    },
    schema: {
      foo: "date.required"
    }
  });

  t.deepEqual({foo: "Jan 1, 2023"}, fl.data);
});
