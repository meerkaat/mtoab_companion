function customInspect(value: unknown): string {
  return Deno.inspect(value, {
    colors: true,
    depth: 100,
    getters: true,
    iterableLimit: 100,
    showHidden: true,
    sorted: true,
    strAbbreviateSize: Infinity,
    trailingComma: true,
  });
}

function scratch() {
  let obj = { fn: "shaun", ln: "moseley" };

  console.log(customInspect(obj));

  // let obj1 = {0: "shaun", 1: "moseley"};
  // let obj1 = { 0: "shaun", 1: "moseley" } as unknown as Array<string>;
  let obj1 = Object.create(Array.prototype, {
    0: {
      configurable: true,
      enumerable: true,
      writable: true,
      value: "shaun",
    },
    1: {
      value: "moseley",
      configurable: true,
      enumerable: true,
      writable: true,
    },
  });
  console.log(customInspect(obj1));

  obj1.length = 2;
  // Object.setPrototypeOf(obj1, Array.prototype);

  console.log(customInspect(obj1));

  // for (const str of obj1) console.log(str);

  const obj2 = ["shaun", "moseley"];
  console.log(customInspect(obj2));

  console.log({
    isArray1: Array.isArray(obj1), // false
    isArray2: Array.isArray(obj2), // true
    instanceOfArray1: obj1 instanceof Array, // true
    instanceOfArray2: obj2 instanceof Array, // true
  });
}

scratch();
