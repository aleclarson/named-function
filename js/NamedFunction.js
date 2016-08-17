var NamedFunction, createImpl;

require("isDev");

Object.defineProperty(Function.prototype, "getName", {
  writable: true,
  value: function() {
    return this.name;
  }
});

createImpl = function(isDev) {
  var NamedFunction, renameFunction;
  NamedFunction = function NamedFunction(name, fn) { return renameFunction(fn, name) };
  if (isDev) {
    renameFunction = function(orig, name) {
      var fn;
      fn = Function("orig", "return function " + name + "() { return orig.apply(this, arguments) }")(orig);
      fn.__orig = orig;
      fn.toString = NamedFunction.toString;
      return fn;
    };
    NamedFunction.toString = function() {
      return Function.prototype.toString.call(this.__orig).replace(/^function([^\(\r]+)/, "function " + this.name);
    };
  } else {
    renameFunction = function(fn, name) {
      fn.getName = function() {
        return name;
      };
      return fn;
    };
  }
  NamedFunction.createImpl = createImpl;
  return NamedFunction;
};

module.exports = NamedFunction = createImpl(isDev);

//# sourceMappingURL=map/NamedFunction.map
