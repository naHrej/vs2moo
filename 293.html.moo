
@program #293:html
header = {"HTTP/1.1 200 OK", "Content-Type: text/plain;", "", ""};
index = index(args[2], ":");
object = toobj(args[2][1..index - 1]);
if (object == undef)
  output = "Invalid object";
  return header + output;
endif
"get the verb";
attr = args[2][index + 1..$];
if (attr == "" || !$object_utils:has_verb(object, attr))
  output = {"Invalid verb"};
  return header + output;
endif
return header + {tostr("@program ", object, ":", attr)} + verb_code(object, attr) + {""} + {"."};

.

