require("source-map-support").install()
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(5);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	__webpack_require__(2);
	
	__webpack_require__(3);
	
	__webpack_require__(4);
	
	if (global._babelPolyfill) {
	  throw new Error("only one instance of babel-polyfill is allowed");
	}
	global._babelPolyfill = true;
	
	var DEFINE_PROPERTY = "defineProperty";
	function define(O, key, value) {
	  O[key] || Object[DEFINE_PROPERTY](O, key, {
	    writable: true,
	    configurable: true,
	    value: value
	  });
	}
	
	define(String.prototype, "padLeft", "".padStart);
	define(String.prototype, "padRight", "".padEnd);
	
	"pop,reverse,shift,keys,values,entries,indexOf,every,some,forEach,map,filter,find,findIndex,includes,join,slice,concat,push,splice,unshift,sort,lastIndexOf,reduce,reduceRight,copyWithin,fill".split(",").forEach(function (key) {
	  [][key] && define(Array, key, Function.call.bind([][key]));
	});

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("core-js/shim");

/***/ },
/* 3 */
/***/ function(module, exports) {

	/**
	 * Copyright (c) 2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
	 * additional grant of patent rights can be found in the PATENTS file in
	 * the same directory.
	 */
	
	!(function(global) {
	  "use strict";
	
	  var Op = Object.prototype;
	  var hasOwn = Op.hasOwnProperty;
	  var undefined; // More compressible than void 0.
	  var $Symbol = typeof Symbol === "function" ? Symbol : {};
	  var iteratorSymbol = $Symbol.iterator || "@@iterator";
	  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
	
	  var inModule = typeof module === "object";
	  var runtime = global.regeneratorRuntime;
	  if (runtime) {
	    if (inModule) {
	      // If regeneratorRuntime is defined globally and we're in a module,
	      // make the exports object identical to regeneratorRuntime.
	      module.exports = runtime;
	    }
	    // Don't bother evaluating the rest of this file if the runtime was
	    // already defined globally.
	    return;
	  }
	
	  // Define the runtime globally (as expected by generated code) as either
	  // module.exports (if we're in a module) or a new, empty object.
	  runtime = global.regeneratorRuntime = inModule ? module.exports : {};
	
	  function wrap(innerFn, outerFn, self, tryLocsList) {
	    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
	    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
	    var generator = Object.create(protoGenerator.prototype);
	    var context = new Context(tryLocsList || []);
	
	    // The ._invoke method unifies the implementations of the .next,
	    // .throw, and .return methods.
	    generator._invoke = makeInvokeMethod(innerFn, self, context);
	
	    return generator;
	  }
	  runtime.wrap = wrap;
	
	  // Try/catch helper to minimize deoptimizations. Returns a completion
	  // record like context.tryEntries[i].completion. This interface could
	  // have been (and was previously) designed to take a closure to be
	  // invoked without arguments, but in all the cases we care about we
	  // already have an existing method we want to call, so there's no need
	  // to create a new function object. We can even get away with assuming
	  // the method takes exactly one argument, since that happens to be true
	  // in every case, so we don't have to touch the arguments object. The
	  // only additional allocation required is the completion record, which
	  // has a stable shape and so hopefully should be cheap to allocate.
	  function tryCatch(fn, obj, arg) {
	    try {
	      return { type: "normal", arg: fn.call(obj, arg) };
	    } catch (err) {
	      return { type: "throw", arg: err };
	    }
	  }
	
	  var GenStateSuspendedStart = "suspendedStart";
	  var GenStateSuspendedYield = "suspendedYield";
	  var GenStateExecuting = "executing";
	  var GenStateCompleted = "completed";
	
	  // Returning this object from the innerFn has the same effect as
	  // breaking out of the dispatch switch statement.
	  var ContinueSentinel = {};
	
	  // Dummy constructor functions that we use as the .constructor and
	  // .constructor.prototype properties for functions that return Generator
	  // objects. For full spec compliance, you may wish to configure your
	  // minifier not to mangle the names of these two functions.
	  function Generator() {}
	  function GeneratorFunction() {}
	  function GeneratorFunctionPrototype() {}
	
	  // This is a polyfill for %IteratorPrototype% for environments that
	  // don't natively support it.
	  var IteratorPrototype = {};
	  IteratorPrototype[iteratorSymbol] = function () {
	    return this;
	  };
	
	  var getProto = Object.getPrototypeOf;
	  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
	  if (NativeIteratorPrototype &&
	      NativeIteratorPrototype !== Op &&
	      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
	    // This environment has a native %IteratorPrototype%; use it instead
	    // of the polyfill.
	    IteratorPrototype = NativeIteratorPrototype;
	  }
	
	  var Gp = GeneratorFunctionPrototype.prototype =
	    Generator.prototype = Object.create(IteratorPrototype);
	  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
	  GeneratorFunctionPrototype.constructor = GeneratorFunction;
	  GeneratorFunctionPrototype[toStringTagSymbol] =
	    GeneratorFunction.displayName = "GeneratorFunction";
	
	  // Helper for defining the .next, .throw, and .return methods of the
	  // Iterator interface in terms of a single ._invoke method.
	  function defineIteratorMethods(prototype) {
	    ["next", "throw", "return"].forEach(function(method) {
	      prototype[method] = function(arg) {
	        return this._invoke(method, arg);
	      };
	    });
	  }
	
	  runtime.isGeneratorFunction = function(genFun) {
	    var ctor = typeof genFun === "function" && genFun.constructor;
	    return ctor
	      ? ctor === GeneratorFunction ||
	        // For the native GeneratorFunction constructor, the best we can
	        // do is to check its .name property.
	        (ctor.displayName || ctor.name) === "GeneratorFunction"
	      : false;
	  };
	
	  runtime.mark = function(genFun) {
	    if (Object.setPrototypeOf) {
	      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
	    } else {
	      genFun.__proto__ = GeneratorFunctionPrototype;
	      if (!(toStringTagSymbol in genFun)) {
	        genFun[toStringTagSymbol] = "GeneratorFunction";
	      }
	    }
	    genFun.prototype = Object.create(Gp);
	    return genFun;
	  };
	
	  // Within the body of any async function, `await x` is transformed to
	  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
	  // `hasOwn.call(value, "__await")` to determine if the yielded value is
	  // meant to be awaited.
	  runtime.awrap = function(arg) {
	    return { __await: arg };
	  };
	
	  function AsyncIterator(generator) {
	    function invoke(method, arg, resolve, reject) {
	      var record = tryCatch(generator[method], generator, arg);
	      if (record.type === "throw") {
	        reject(record.arg);
	      } else {
	        var result = record.arg;
	        var value = result.value;
	        if (value &&
	            typeof value === "object" &&
	            hasOwn.call(value, "__await")) {
	          return Promise.resolve(value.__await).then(function(value) {
	            invoke("next", value, resolve, reject);
	          }, function(err) {
	            invoke("throw", err, resolve, reject);
	          });
	        }
	
	        return Promise.resolve(value).then(function(unwrapped) {
	          // When a yielded Promise is resolved, its final value becomes
	          // the .value of the Promise<{value,done}> result for the
	          // current iteration. If the Promise is rejected, however, the
	          // result for this iteration will be rejected with the same
	          // reason. Note that rejections of yielded Promises are not
	          // thrown back into the generator function, as is the case
	          // when an awaited Promise is rejected. This difference in
	          // behavior between yield and await is important, because it
	          // allows the consumer to decide what to do with the yielded
	          // rejection (swallow it and continue, manually .throw it back
	          // into the generator, abandon iteration, whatever). With
	          // await, by contrast, there is no opportunity to examine the
	          // rejection reason outside the generator function, so the
	          // only option is to throw it from the await expression, and
	          // let the generator function handle the exception.
	          result.value = unwrapped;
	          resolve(result);
	        }, reject);
	      }
	    }
	
	    if (typeof process === "object" && process.domain) {
	      invoke = process.domain.bind(invoke);
	    }
	
	    var previousPromise;
	
	    function enqueue(method, arg) {
	      function callInvokeWithMethodAndArg() {
	        return new Promise(function(resolve, reject) {
	          invoke(method, arg, resolve, reject);
	        });
	      }
	
	      return previousPromise =
	        // If enqueue has been called before, then we want to wait until
	        // all previous Promises have been resolved before calling invoke,
	        // so that results are always delivered in the correct order. If
	        // enqueue has not been called before, then it is important to
	        // call invoke immediately, without waiting on a callback to fire,
	        // so that the async generator function has the opportunity to do
	        // any necessary setup in a predictable way. This predictability
	        // is why the Promise constructor synchronously invokes its
	        // executor callback, and why async functions synchronously
	        // execute code before the first await. Since we implement simple
	        // async functions in terms of async generators, it is especially
	        // important to get this right, even though it requires care.
	        previousPromise ? previousPromise.then(
	          callInvokeWithMethodAndArg,
	          // Avoid propagating failures to Promises returned by later
	          // invocations of the iterator.
	          callInvokeWithMethodAndArg
	        ) : callInvokeWithMethodAndArg();
	    }
	
	    // Define the unified helper method that is used to implement .next,
	    // .throw, and .return (see defineIteratorMethods).
	    this._invoke = enqueue;
	  }
	
	  defineIteratorMethods(AsyncIterator.prototype);
	  runtime.AsyncIterator = AsyncIterator;
	
	  // Note that simple async functions are implemented on top of
	  // AsyncIterator objects; they just return a Promise for the value of
	  // the final result produced by the iterator.
	  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
	    var iter = new AsyncIterator(
	      wrap(innerFn, outerFn, self, tryLocsList)
	    );
	
	    return runtime.isGeneratorFunction(outerFn)
	      ? iter // If outerFn is a generator, return the full iterator.
	      : iter.next().then(function(result) {
	          return result.done ? result.value : iter.next();
	        });
	  };
	
	  function makeInvokeMethod(innerFn, self, context) {
	    var state = GenStateSuspendedStart;
	
	    return function invoke(method, arg) {
	      if (state === GenStateExecuting) {
	        throw new Error("Generator is already running");
	      }
	
	      if (state === GenStateCompleted) {
	        if (method === "throw") {
	          throw arg;
	        }
	
	        // Be forgiving, per 25.3.3.3.3 of the spec:
	        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
	        return doneResult();
	      }
	
	      context.method = method;
	      context.arg = arg;
	
	      while (true) {
	        var delegate = context.delegate;
	        if (delegate) {
	          var delegateResult = maybeInvokeDelegate(delegate, context);
	          if (delegateResult) {
	            if (delegateResult === ContinueSentinel) continue;
	            return delegateResult;
	          }
	        }
	
	        if (context.method === "next") {
	          // Setting context._sent for legacy support of Babel's
	          // function.sent implementation.
	          context.sent = context._sent = context.arg;
	
	        } else if (context.method === "throw") {
	          if (state === GenStateSuspendedStart) {
	            state = GenStateCompleted;
	            throw context.arg;
	          }
	
	          context.dispatchException(context.arg);
	
	        } else if (context.method === "return") {
	          context.abrupt("return", context.arg);
	        }
	
	        state = GenStateExecuting;
	
	        var record = tryCatch(innerFn, self, context);
	        if (record.type === "normal") {
	          // If an exception is thrown from innerFn, we leave state ===
	          // GenStateExecuting and loop back for another invocation.
	          state = context.done
	            ? GenStateCompleted
	            : GenStateSuspendedYield;
	
	          if (record.arg === ContinueSentinel) {
	            continue;
	          }
	
	          return {
	            value: record.arg,
	            done: context.done
	          };
	
	        } else if (record.type === "throw") {
	          state = GenStateCompleted;
	          // Dispatch the exception by looping back around to the
	          // context.dispatchException(context.arg) call above.
	          context.method = "throw";
	          context.arg = record.arg;
	        }
	      }
	    };
	  }
	
	  // Call delegate.iterator[context.method](context.arg) and handle the
	  // result, either by returning a { value, done } result from the
	  // delegate iterator, or by modifying context.method and context.arg,
	  // setting context.delegate to null, and returning the ContinueSentinel.
	  function maybeInvokeDelegate(delegate, context) {
	    var method = delegate.iterator[context.method];
	    if (method === undefined) {
	      // A .throw or .return when the delegate iterator has no .throw
	      // method always terminates the yield* loop.
	      context.delegate = null;
	
	      if (context.method === "throw") {
	        if (delegate.iterator.return) {
	          // If the delegate iterator has a return method, give it a
	          // chance to clean up.
	          context.method = "return";
	          context.arg = undefined;
	          maybeInvokeDelegate(delegate, context);
	
	          if (context.method === "throw") {
	            // If maybeInvokeDelegate(context) changed context.method from
	            // "return" to "throw", let that override the TypeError below.
	            return ContinueSentinel;
	          }
	        }
	
	        context.method = "throw";
	        context.arg = new TypeError(
	          "The iterator does not provide a 'throw' method");
	      }
	
	      return ContinueSentinel;
	    }
	
	    var record = tryCatch(method, delegate.iterator, context.arg);
	
	    if (record.type === "throw") {
	      context.method = "throw";
	      context.arg = record.arg;
	      context.delegate = null;
	      return ContinueSentinel;
	    }
	
	    var info = record.arg;
	
	    if (! info) {
	      context.method = "throw";
	      context.arg = new TypeError("iterator result is not an object");
	      context.delegate = null;
	      return ContinueSentinel;
	    }
	
	    if (info.done) {
	      // Assign the result of the finished delegate to the temporary
	      // variable specified by delegate.resultName (see delegateYield).
	      context[delegate.resultName] = info.value;
	
	      // Resume execution at the desired location (see delegateYield).
	      context.next = delegate.nextLoc;
	
	      // If context.method was "throw" but the delegate handled the
	      // exception, let the outer generator proceed normally. If
	      // context.method was "next", forget context.arg since it has been
	      // "consumed" by the delegate iterator. If context.method was
	      // "return", allow the original .return call to continue in the
	      // outer generator.
	      if (context.method !== "return") {
	        context.method = "next";
	        context.arg = undefined;
	      }
	
	    } else {
	      // Re-yield the result returned by the delegate method.
	      return info;
	    }
	
	    // The delegate iterator is finished, so forget it and continue with
	    // the outer generator.
	    context.delegate = null;
	    return ContinueSentinel;
	  }
	
	  // Define Generator.prototype.{next,throw,return} in terms of the
	  // unified ._invoke helper method.
	  defineIteratorMethods(Gp);
	
	  Gp[toStringTagSymbol] = "Generator";
	
	  Gp.toString = function() {
	    return "[object Generator]";
	  };
	
	  function pushTryEntry(locs) {
	    var entry = { tryLoc: locs[0] };
	
	    if (1 in locs) {
	      entry.catchLoc = locs[1];
	    }
	
	    if (2 in locs) {
	      entry.finallyLoc = locs[2];
	      entry.afterLoc = locs[3];
	    }
	
	    this.tryEntries.push(entry);
	  }
	
	  function resetTryEntry(entry) {
	    var record = entry.completion || {};
	    record.type = "normal";
	    delete record.arg;
	    entry.completion = record;
	  }
	
	  function Context(tryLocsList) {
	    // The root entry object (effectively a try statement without a catch
	    // or a finally block) gives us a place to store values thrown from
	    // locations where there is no enclosing try statement.
	    this.tryEntries = [{ tryLoc: "root" }];
	    tryLocsList.forEach(pushTryEntry, this);
	    this.reset(true);
	  }
	
	  runtime.keys = function(object) {
	    var keys = [];
	    for (var key in object) {
	      keys.push(key);
	    }
	    keys.reverse();
	
	    // Rather than returning an object with a next method, we keep
	    // things simple and return the next function itself.
	    return function next() {
	      while (keys.length) {
	        var key = keys.pop();
	        if (key in object) {
	          next.value = key;
	          next.done = false;
	          return next;
	        }
	      }
	
	      // To avoid creating an additional object, we just hang the .value
	      // and .done properties off the next function object itself. This
	      // also ensures that the minifier will not anonymize the function.
	      next.done = true;
	      return next;
	    };
	  };
	
	  function values(iterable) {
	    if (iterable) {
	      var iteratorMethod = iterable[iteratorSymbol];
	      if (iteratorMethod) {
	        return iteratorMethod.call(iterable);
	      }
	
	      if (typeof iterable.next === "function") {
	        return iterable;
	      }
	
	      if (!isNaN(iterable.length)) {
	        var i = -1, next = function next() {
	          while (++i < iterable.length) {
	            if (hasOwn.call(iterable, i)) {
	              next.value = iterable[i];
	              next.done = false;
	              return next;
	            }
	          }
	
	          next.value = undefined;
	          next.done = true;
	
	          return next;
	        };
	
	        return next.next = next;
	      }
	    }
	
	    // Return an iterator with no values.
	    return { next: doneResult };
	  }
	  runtime.values = values;
	
	  function doneResult() {
	    return { value: undefined, done: true };
	  }
	
	  Context.prototype = {
	    constructor: Context,
	
	    reset: function(skipTempReset) {
	      this.prev = 0;
	      this.next = 0;
	      // Resetting context._sent for legacy support of Babel's
	      // function.sent implementation.
	      this.sent = this._sent = undefined;
	      this.done = false;
	      this.delegate = null;
	
	      this.method = "next";
	      this.arg = undefined;
	
	      this.tryEntries.forEach(resetTryEntry);
	
	      if (!skipTempReset) {
	        for (var name in this) {
	          // Not sure about the optimal order of these conditions:
	          if (name.charAt(0) === "t" &&
	              hasOwn.call(this, name) &&
	              !isNaN(+name.slice(1))) {
	            this[name] = undefined;
	          }
	        }
	      }
	    },
	
	    stop: function() {
	      this.done = true;
	
	      var rootEntry = this.tryEntries[0];
	      var rootRecord = rootEntry.completion;
	      if (rootRecord.type === "throw") {
	        throw rootRecord.arg;
	      }
	
	      return this.rval;
	    },
	
	    dispatchException: function(exception) {
	      if (this.done) {
	        throw exception;
	      }
	
	      var context = this;
	      function handle(loc, caught) {
	        record.type = "throw";
	        record.arg = exception;
	        context.next = loc;
	
	        if (caught) {
	          // If the dispatched exception was caught by a catch block,
	          // then let that catch block handle the exception normally.
	          context.method = "next";
	          context.arg = undefined;
	        }
	
	        return !! caught;
	      }
	
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        var record = entry.completion;
	
	        if (entry.tryLoc === "root") {
	          // Exception thrown outside of any try block that could handle
	          // it, so set the completion value of the entire function to
	          // throw the exception.
	          return handle("end");
	        }
	
	        if (entry.tryLoc <= this.prev) {
	          var hasCatch = hasOwn.call(entry, "catchLoc");
	          var hasFinally = hasOwn.call(entry, "finallyLoc");
	
	          if (hasCatch && hasFinally) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            } else if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }
	
	          } else if (hasCatch) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            }
	
	          } else if (hasFinally) {
	            if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }
	
	          } else {
	            throw new Error("try statement without catch or finally");
	          }
	        }
	      }
	    },
	
	    abrupt: function(type, arg) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc <= this.prev &&
	            hasOwn.call(entry, "finallyLoc") &&
	            this.prev < entry.finallyLoc) {
	          var finallyEntry = entry;
	          break;
	        }
	      }
	
	      if (finallyEntry &&
	          (type === "break" ||
	           type === "continue") &&
	          finallyEntry.tryLoc <= arg &&
	          arg <= finallyEntry.finallyLoc) {
	        // Ignore the finally entry if control is not jumping to a
	        // location outside the try/catch block.
	        finallyEntry = null;
	      }
	
	      var record = finallyEntry ? finallyEntry.completion : {};
	      record.type = type;
	      record.arg = arg;
	
	      if (finallyEntry) {
	        this.method = "next";
	        this.next = finallyEntry.finallyLoc;
	        return ContinueSentinel;
	      }
	
	      return this.complete(record);
	    },
	
	    complete: function(record, afterLoc) {
	      if (record.type === "throw") {
	        throw record.arg;
	      }
	
	      if (record.type === "break" ||
	          record.type === "continue") {
	        this.next = record.arg;
	      } else if (record.type === "return") {
	        this.rval = this.arg = record.arg;
	        this.method = "return";
	        this.next = "end";
	      } else if (record.type === "normal" && afterLoc) {
	        this.next = afterLoc;
	      }
	
	      return ContinueSentinel;
	    },
	
	    finish: function(finallyLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.finallyLoc === finallyLoc) {
	          this.complete(entry.completion, entry.afterLoc);
	          resetTryEntry(entry);
	          return ContinueSentinel;
	        }
	      }
	    },
	
	    "catch": function(tryLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc === tryLoc) {
	          var record = entry.completion;
	          if (record.type === "throw") {
	            var thrown = record.arg;
	            resetTryEntry(entry);
	          }
	          return thrown;
	        }
	      }
	
	      // The context.catch method must only be called with a location
	      // argument that corresponds to a known catch block.
	      throw new Error("illegal catch attempt");
	    },
	
	    delegateYield: function(iterable, resultName, nextLoc) {
	      this.delegate = {
	        iterator: values(iterable),
	        resultName: resultName,
	        nextLoc: nextLoc
	      };
	
	      if (this.method === "next") {
	        // Deliberately forget the last sent value so that we don't
	        // accidentally pass it on to the delegate.
	        this.arg = undefined;
	      }
	
	      return ContinueSentinel;
	    }
	  };
	})(
	  // Among the various tricks for obtaining a reference to the global
	  // object, this seems to be the most reliable technique that does not
	  // use indirect eval (which violates Content Security Policy).
	  typeof global === "object" ? global :
	  typeof window === "object" ? window :
	  typeof self === "object" ? self : this
	);


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("core-js/fn/regexp/escape");

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.configure = exports.errors = undefined;
	
	__webpack_require__(6);
	
	var _models = __webpack_require__(7);
	
	var models = _interopRequireWildcard(_models);
	
	var _db = __webpack_require__(19);
	
	var _db2 = _interopRequireDefault(_db);
	
	var _errors2 = __webpack_require__(10);
	
	var _errors3 = _interopRequireDefault(_errors2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
	
	global.db = _db2.default;
	
	exports.default = models;
	exports.errors = _errors3.default;
	var configure = exports.configure = function () {
	  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(options) {
	    return regeneratorRuntime.wrap(function _callee$(_context) {
	      while (1) {
	        switch (_context.prev = _context.next) {
	          case 0:
	            global.hashSalt = options.secret.hash;
	            _context.next = 3;
	            return _db2.default.configure(options.database);
	
	          case 3:
	            return _context.abrupt('return', _context.sent);
	
	          case 4:
	          case 'end':
	            return _context.stop();
	        }
	      }
	    }, _callee, undefined);
	  }));
	
	  return function configure(_x) {
	    return _ref.apply(this, arguments);
	  };
	}();

/***/ },
/* 6 */
/***/ function(module, exports) {

	/**
	 * Copyright (c) 2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
	 * additional grant of patent rights can be found in the PATENTS file in
	 * the same directory.
	 */
	
	!(function(global) {
	  "use strict";
	
	  var hasOwn = Object.prototype.hasOwnProperty;
	  var undefined; // More compressible than void 0.
	  var $Symbol = typeof Symbol === "function" ? Symbol : {};
	  var iteratorSymbol = $Symbol.iterator || "@@iterator";
	  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
	
	  var inModule = typeof module === "object";
	  var runtime = global.regeneratorRuntime;
	  if (runtime) {
	    if (inModule) {
	      // If regeneratorRuntime is defined globally and we're in a module,
	      // make the exports object identical to regeneratorRuntime.
	      module.exports = runtime;
	    }
	    // Don't bother evaluating the rest of this file if the runtime was
	    // already defined globally.
	    return;
	  }
	
	  // Define the runtime globally (as expected by generated code) as either
	  // module.exports (if we're in a module) or a new, empty object.
	  runtime = global.regeneratorRuntime = inModule ? module.exports : {};
	
	  function wrap(innerFn, outerFn, self, tryLocsList) {
	    // If outerFn provided, then outerFn.prototype instanceof Generator.
	    var generator = Object.create((outerFn || Generator).prototype);
	    var context = new Context(tryLocsList || []);
	
	    // The ._invoke method unifies the implementations of the .next,
	    // .throw, and .return methods.
	    generator._invoke = makeInvokeMethod(innerFn, self, context);
	
	    return generator;
	  }
	  runtime.wrap = wrap;
	
	  // Try/catch helper to minimize deoptimizations. Returns a completion
	  // record like context.tryEntries[i].completion. This interface could
	  // have been (and was previously) designed to take a closure to be
	  // invoked without arguments, but in all the cases we care about we
	  // already have an existing method we want to call, so there's no need
	  // to create a new function object. We can even get away with assuming
	  // the method takes exactly one argument, since that happens to be true
	  // in every case, so we don't have to touch the arguments object. The
	  // only additional allocation required is the completion record, which
	  // has a stable shape and so hopefully should be cheap to allocate.
	  function tryCatch(fn, obj, arg) {
	    try {
	      return { type: "normal", arg: fn.call(obj, arg) };
	    } catch (err) {
	      return { type: "throw", arg: err };
	    }
	  }
	
	  var GenStateSuspendedStart = "suspendedStart";
	  var GenStateSuspendedYield = "suspendedYield";
	  var GenStateExecuting = "executing";
	  var GenStateCompleted = "completed";
	
	  // Returning this object from the innerFn has the same effect as
	  // breaking out of the dispatch switch statement.
	  var ContinueSentinel = {};
	
	  // Dummy constructor functions that we use as the .constructor and
	  // .constructor.prototype properties for functions that return Generator
	  // objects. For full spec compliance, you may wish to configure your
	  // minifier not to mangle the names of these two functions.
	  function Generator() {}
	  function GeneratorFunction() {}
	  function GeneratorFunctionPrototype() {}
	
	  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
	  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
	  GeneratorFunctionPrototype.constructor = GeneratorFunction;
	  GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction";
	
	  // Helper for defining the .next, .throw, and .return methods of the
	  // Iterator interface in terms of a single ._invoke method.
	  function defineIteratorMethods(prototype) {
	    ["next", "throw", "return"].forEach(function(method) {
	      prototype[method] = function(arg) {
	        return this._invoke(method, arg);
	      };
	    });
	  }
	
	  runtime.isGeneratorFunction = function(genFun) {
	    var ctor = typeof genFun === "function" && genFun.constructor;
	    return ctor
	      ? ctor === GeneratorFunction ||
	        // For the native GeneratorFunction constructor, the best we can
	        // do is to check its .name property.
	        (ctor.displayName || ctor.name) === "GeneratorFunction"
	      : false;
	  };
	
	  runtime.mark = function(genFun) {
	    if (Object.setPrototypeOf) {
	      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
	    } else {
	      genFun.__proto__ = GeneratorFunctionPrototype;
	      if (!(toStringTagSymbol in genFun)) {
	        genFun[toStringTagSymbol] = "GeneratorFunction";
	      }
	    }
	    genFun.prototype = Object.create(Gp);
	    return genFun;
	  };
	
	  // Within the body of any async function, `await x` is transformed to
	  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
	  // `value instanceof AwaitArgument` to determine if the yielded value is
	  // meant to be awaited. Some may consider the name of this method too
	  // cutesy, but they are curmudgeons.
	  runtime.awrap = function(arg) {
	    return new AwaitArgument(arg);
	  };
	
	  function AwaitArgument(arg) {
	    this.arg = arg;
	  }
	
	  function AsyncIterator(generator) {
	    function invoke(method, arg, resolve, reject) {
	      var record = tryCatch(generator[method], generator, arg);
	      if (record.type === "throw") {
	        reject(record.arg);
	      } else {
	        var result = record.arg;
	        var value = result.value;
	        if (value instanceof AwaitArgument) {
	          return Promise.resolve(value.arg).then(function(value) {
	            invoke("next", value, resolve, reject);
	          }, function(err) {
	            invoke("throw", err, resolve, reject);
	          });
	        }
	
	        return Promise.resolve(value).then(function(unwrapped) {
	          // When a yielded Promise is resolved, its final value becomes
	          // the .value of the Promise<{value,done}> result for the
	          // current iteration. If the Promise is rejected, however, the
	          // result for this iteration will be rejected with the same
	          // reason. Note that rejections of yielded Promises are not
	          // thrown back into the generator function, as is the case
	          // when an awaited Promise is rejected. This difference in
	          // behavior between yield and await is important, because it
	          // allows the consumer to decide what to do with the yielded
	          // rejection (swallow it and continue, manually .throw it back
	          // into the generator, abandon iteration, whatever). With
	          // await, by contrast, there is no opportunity to examine the
	          // rejection reason outside the generator function, so the
	          // only option is to throw it from the await expression, and
	          // let the generator function handle the exception.
	          result.value = unwrapped;
	          resolve(result);
	        }, reject);
	      }
	    }
	
	    if (typeof process === "object" && process.domain) {
	      invoke = process.domain.bind(invoke);
	    }
	
	    var previousPromise;
	
	    function enqueue(method, arg) {
	      function callInvokeWithMethodAndArg() {
	        return new Promise(function(resolve, reject) {
	          invoke(method, arg, resolve, reject);
	        });
	      }
	
	      return previousPromise =
	        // If enqueue has been called before, then we want to wait until
	        // all previous Promises have been resolved before calling invoke,
	        // so that results are always delivered in the correct order. If
	        // enqueue has not been called before, then it is important to
	        // call invoke immediately, without waiting on a callback to fire,
	        // so that the async generator function has the opportunity to do
	        // any necessary setup in a predictable way. This predictability
	        // is why the Promise constructor synchronously invokes its
	        // executor callback, and why async functions synchronously
	        // execute code before the first await. Since we implement simple
	        // async functions in terms of async generators, it is especially
	        // important to get this right, even though it requires care.
	        previousPromise ? previousPromise.then(
	          callInvokeWithMethodAndArg,
	          // Avoid propagating failures to Promises returned by later
	          // invocations of the iterator.
	          callInvokeWithMethodAndArg
	        ) : callInvokeWithMethodAndArg();
	    }
	
	    // Define the unified helper method that is used to implement .next,
	    // .throw, and .return (see defineIteratorMethods).
	    this._invoke = enqueue;
	  }
	
	  defineIteratorMethods(AsyncIterator.prototype);
	
	  // Note that simple async functions are implemented on top of
	  // AsyncIterator objects; they just return a Promise for the value of
	  // the final result produced by the iterator.
	  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
	    var iter = new AsyncIterator(
	      wrap(innerFn, outerFn, self, tryLocsList)
	    );
	
	    return runtime.isGeneratorFunction(outerFn)
	      ? iter // If outerFn is a generator, return the full iterator.
	      : iter.next().then(function(result) {
	          return result.done ? result.value : iter.next();
	        });
	  };
	
	  function makeInvokeMethod(innerFn, self, context) {
	    var state = GenStateSuspendedStart;
	
	    return function invoke(method, arg) {
	      if (state === GenStateExecuting) {
	        throw new Error("Generator is already running");
	      }
	
	      if (state === GenStateCompleted) {
	        if (method === "throw") {
	          throw arg;
	        }
	
	        // Be forgiving, per 25.3.3.3.3 of the spec:
	        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
	        return doneResult();
	      }
	
	      while (true) {
	        var delegate = context.delegate;
	        if (delegate) {
	          if (method === "return" ||
	              (method === "throw" && delegate.iterator[method] === undefined)) {
	            // A return or throw (when the delegate iterator has no throw
	            // method) always terminates the yield* loop.
	            context.delegate = null;
	
	            // If the delegate iterator has a return method, give it a
	            // chance to clean up.
	            var returnMethod = delegate.iterator["return"];
	            if (returnMethod) {
	              var record = tryCatch(returnMethod, delegate.iterator, arg);
	              if (record.type === "throw") {
	                // If the return method threw an exception, let that
	                // exception prevail over the original return or throw.
	                method = "throw";
	                arg = record.arg;
	                continue;
	              }
	            }
	
	            if (method === "return") {
	              // Continue with the outer return, now that the delegate
	              // iterator has been terminated.
	              continue;
	            }
	          }
	
	          var record = tryCatch(
	            delegate.iterator[method],
	            delegate.iterator,
	            arg
	          );
	
	          if (record.type === "throw") {
	            context.delegate = null;
	
	            // Like returning generator.throw(uncaught), but without the
	            // overhead of an extra function call.
	            method = "throw";
	            arg = record.arg;
	            continue;
	          }
	
	          // Delegate generator ran and handled its own exceptions so
	          // regardless of what the method was, we continue as if it is
	          // "next" with an undefined arg.
	          method = "next";
	          arg = undefined;
	
	          var info = record.arg;
	          if (info.done) {
	            context[delegate.resultName] = info.value;
	            context.next = delegate.nextLoc;
	          } else {
	            state = GenStateSuspendedYield;
	            return info;
	          }
	
	          context.delegate = null;
	        }
	
	        if (method === "next") {
	          // Setting context._sent for legacy support of Babel's
	          // function.sent implementation.
	          context.sent = context._sent = arg;
	
	        } else if (method === "throw") {
	          if (state === GenStateSuspendedStart) {
	            state = GenStateCompleted;
	            throw arg;
	          }
	
	          if (context.dispatchException(arg)) {
	            // If the dispatched exception was caught by a catch block,
	            // then let that catch block handle the exception normally.
	            method = "next";
	            arg = undefined;
	          }
	
	        } else if (method === "return") {
	          context.abrupt("return", arg);
	        }
	
	        state = GenStateExecuting;
	
	        var record = tryCatch(innerFn, self, context);
	        if (record.type === "normal") {
	          // If an exception is thrown from innerFn, we leave state ===
	          // GenStateExecuting and loop back for another invocation.
	          state = context.done
	            ? GenStateCompleted
	            : GenStateSuspendedYield;
	
	          var info = {
	            value: record.arg,
	            done: context.done
	          };
	
	          if (record.arg === ContinueSentinel) {
	            if (context.delegate && method === "next") {
	              // Deliberately forget the last sent value so that we don't
	              // accidentally pass it on to the delegate.
	              arg = undefined;
	            }
	          } else {
	            return info;
	          }
	
	        } else if (record.type === "throw") {
	          state = GenStateCompleted;
	          // Dispatch the exception by looping back around to the
	          // context.dispatchException(arg) call above.
	          method = "throw";
	          arg = record.arg;
	        }
	      }
	    };
	  }
	
	  // Define Generator.prototype.{next,throw,return} in terms of the
	  // unified ._invoke helper method.
	  defineIteratorMethods(Gp);
	
	  Gp[iteratorSymbol] = function() {
	    return this;
	  };
	
	  Gp[toStringTagSymbol] = "Generator";
	
	  Gp.toString = function() {
	    return "[object Generator]";
	  };
	
	  function pushTryEntry(locs) {
	    var entry = { tryLoc: locs[0] };
	
	    if (1 in locs) {
	      entry.catchLoc = locs[1];
	    }
	
	    if (2 in locs) {
	      entry.finallyLoc = locs[2];
	      entry.afterLoc = locs[3];
	    }
	
	    this.tryEntries.push(entry);
	  }
	
	  function resetTryEntry(entry) {
	    var record = entry.completion || {};
	    record.type = "normal";
	    delete record.arg;
	    entry.completion = record;
	  }
	
	  function Context(tryLocsList) {
	    // The root entry object (effectively a try statement without a catch
	    // or a finally block) gives us a place to store values thrown from
	    // locations where there is no enclosing try statement.
	    this.tryEntries = [{ tryLoc: "root" }];
	    tryLocsList.forEach(pushTryEntry, this);
	    this.reset(true);
	  }
	
	  runtime.keys = function(object) {
	    var keys = [];
	    for (var key in object) {
	      keys.push(key);
	    }
	    keys.reverse();
	
	    // Rather than returning an object with a next method, we keep
	    // things simple and return the next function itself.
	    return function next() {
	      while (keys.length) {
	        var key = keys.pop();
	        if (key in object) {
	          next.value = key;
	          next.done = false;
	          return next;
	        }
	      }
	
	      // To avoid creating an additional object, we just hang the .value
	      // and .done properties off the next function object itself. This
	      // also ensures that the minifier will not anonymize the function.
	      next.done = true;
	      return next;
	    };
	  };
	
	  function values(iterable) {
	    if (iterable) {
	      var iteratorMethod = iterable[iteratorSymbol];
	      if (iteratorMethod) {
	        return iteratorMethod.call(iterable);
	      }
	
	      if (typeof iterable.next === "function") {
	        return iterable;
	      }
	
	      if (!isNaN(iterable.length)) {
	        var i = -1, next = function next() {
	          while (++i < iterable.length) {
	            if (hasOwn.call(iterable, i)) {
	              next.value = iterable[i];
	              next.done = false;
	              return next;
	            }
	          }
	
	          next.value = undefined;
	          next.done = true;
	
	          return next;
	        };
	
	        return next.next = next;
	      }
	    }
	
	    // Return an iterator with no values.
	    return { next: doneResult };
	  }
	  runtime.values = values;
	
	  function doneResult() {
	    return { value: undefined, done: true };
	  }
	
	  Context.prototype = {
	    constructor: Context,
	
	    reset: function(skipTempReset) {
	      this.prev = 0;
	      this.next = 0;
	      // Resetting context._sent for legacy support of Babel's
	      // function.sent implementation.
	      this.sent = this._sent = undefined;
	      this.done = false;
	      this.delegate = null;
	
	      this.tryEntries.forEach(resetTryEntry);
	
	      if (!skipTempReset) {
	        for (var name in this) {
	          // Not sure about the optimal order of these conditions:
	          if (name.charAt(0) === "t" &&
	              hasOwn.call(this, name) &&
	              !isNaN(+name.slice(1))) {
	            this[name] = undefined;
	          }
	        }
	      }
	    },
	
	    stop: function() {
	      this.done = true;
	
	      var rootEntry = this.tryEntries[0];
	      var rootRecord = rootEntry.completion;
	      if (rootRecord.type === "throw") {
	        throw rootRecord.arg;
	      }
	
	      return this.rval;
	    },
	
	    dispatchException: function(exception) {
	      if (this.done) {
	        throw exception;
	      }
	
	      var context = this;
	      function handle(loc, caught) {
	        record.type = "throw";
	        record.arg = exception;
	        context.next = loc;
	        return !!caught;
	      }
	
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        var record = entry.completion;
	
	        if (entry.tryLoc === "root") {
	          // Exception thrown outside of any try block that could handle
	          // it, so set the completion value of the entire function to
	          // throw the exception.
	          return handle("end");
	        }
	
	        if (entry.tryLoc <= this.prev) {
	          var hasCatch = hasOwn.call(entry, "catchLoc");
	          var hasFinally = hasOwn.call(entry, "finallyLoc");
	
	          if (hasCatch && hasFinally) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            } else if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }
	
	          } else if (hasCatch) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            }
	
	          } else if (hasFinally) {
	            if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }
	
	          } else {
	            throw new Error("try statement without catch or finally");
	          }
	        }
	      }
	    },
	
	    abrupt: function(type, arg) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc <= this.prev &&
	            hasOwn.call(entry, "finallyLoc") &&
	            this.prev < entry.finallyLoc) {
	          var finallyEntry = entry;
	          break;
	        }
	      }
	
	      if (finallyEntry &&
	          (type === "break" ||
	           type === "continue") &&
	          finallyEntry.tryLoc <= arg &&
	          arg <= finallyEntry.finallyLoc) {
	        // Ignore the finally entry if control is not jumping to a
	        // location outside the try/catch block.
	        finallyEntry = null;
	      }
	
	      var record = finallyEntry ? finallyEntry.completion : {};
	      record.type = type;
	      record.arg = arg;
	
	      if (finallyEntry) {
	        this.next = finallyEntry.finallyLoc;
	      } else {
	        this.complete(record);
	      }
	
	      return ContinueSentinel;
	    },
	
	    complete: function(record, afterLoc) {
	      if (record.type === "throw") {
	        throw record.arg;
	      }
	
	      if (record.type === "break" ||
	          record.type === "continue") {
	        this.next = record.arg;
	      } else if (record.type === "return") {
	        this.rval = record.arg;
	        this.next = "end";
	      } else if (record.type === "normal" && afterLoc) {
	        this.next = afterLoc;
	      }
	    },
	
	    finish: function(finallyLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.finallyLoc === finallyLoc) {
	          this.complete(entry.completion, entry.afterLoc);
	          resetTryEntry(entry);
	          return ContinueSentinel;
	        }
	      }
	    },
	
	    "catch": function(tryLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc === tryLoc) {
	          var record = entry.completion;
	          if (record.type === "throw") {
	            var thrown = record.arg;
	            resetTryEntry(entry);
	          }
	          return thrown;
	        }
	      }
	
	      // The context.catch method must only be called with a location
	      // argument that corresponds to a known catch block.
	      throw new Error("illegal catch attempt");
	    },
	
	    delegateYield: function(iterable, resultName, nextLoc) {
	      this.delegate = {
	        iterator: values(iterable),
	        resultName: resultName,
	        nextLoc: nextLoc
	      };
	
	      return ContinueSentinel;
	    }
	  };
	})(
	  // Among the various tricks for obtaining a reference to the global
	  // object, this seems to be the most reliable technique that does not
	  // use indirect eval (which violates Content Security Policy).
	  typeof global === "object" ? global :
	  typeof window === "object" ? window :
	  typeof self === "object" ? self : this
	);


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _user = __webpack_require__(8);
	
	Object.keys(_user).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _user[key];
	    }
	  });
	});

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _user = __webpack_require__(9);
	
	Object.keys(_user).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _user[key];
	    }
	  });
	});
	
	var _profile = __webpack_require__(16);
	
	Object.keys(_profile).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _profile[key];
	    }
	  });
	});

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.User = undefined;
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _errors = __webpack_require__(10);
	
	var _errors2 = _interopRequireDefault(_errors);
	
	var _hashids = __webpack_require__(13);
	
	var _hashids2 = _interopRequireDefault(_hashids);
	
	var _validator = __webpack_require__(14);
	
	var _profile = __webpack_require__(16);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var ERRORS = {
	  SendVerifyCodeFailed: 400,
	  SendVerifyEmailFailed: 400,
	  UserNameDuplicated: 400,
	  PhoneNumberDuplicated: 400,
	  EmailDuplicated: 400,
	  CreateUserFailed: 400,
	  InvalidIdentification: 401,
	  InvalidVerifyCode: 400,
	  UserInactive: 400,
	  SavePasswordFailed: 400,
	  SendVerifyCodeTooOften: 400,
	  UserNotFound: 404,
	  UserNameSetTwice: 400,
	  UserUnauthorized: 401,
	  UserIdentityRequired: 400,
	  InvalidUserToken: 400,
	  UserTokenExpired: 400
	};
	
	_errors2.default.register(ERRORS);
	
	var User = function () {
	  function User(data) {
	    _classCallCheck(this, User);
	
	    if (data) {
	      if (data.id) this.id = data.id;
	      // 用户名，全局唯一
	      if (data.name) this.name = data.name;
	      if (data.mobile) this.mobile = data.mobile;
	      if (data.email) this.email = data.email;
	    }
	  }
	
	  _createClass(User, [{
	    key: 'login',
	    value: function () {
	      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(password) {
	        var data;
	        return regeneratorRuntime.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                data = {
	                  mobile: this.mobile,
	                  email: this.email,
	                  name: this.name,
	                  password: password
	                };
	
	                (0, _validator.validate)(data, (0, _validator.getSchema)(User.SCHEMA, 'mobile', 'email', 'name', 'password'));
	
	                if (!this.mobile) {
	                  _context.next = 8;
	                  break;
	                }
	
	                _context.next = 5;
	                return User.phoneLogin(this.mobile.region, this.mobile.number, password);
	
	              case 5:
	                return _context.abrupt('return', _context.sent);
	
	              case 8:
	                if (!this.email) {
	                  _context.next = 14;
	                  break;
	                }
	
	                _context.next = 11;
	                return User.emailLogin(this.email, password);
	
	              case 11:
	                return _context.abrupt('return', _context.sent);
	
	              case 14:
	                if (!this.name) {
	                  _context.next = 18;
	                  break;
	                }
	
	                _context.next = 17;
	                return User.userNameLogin(this.name, password);
	
	              case 17:
	                return _context.abrupt('return', _context.sent);
	
	              case 18:
	                throw new _errors2.default.UserIdentityRequiredError();
	
	              case 19:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, this);
	      }));
	
	      function login(_x) {
	        return _ref.apply(this, arguments);
	      }
	
	      return login;
	    }()
	  }, {
	    key: 'changePassword',
	    value: function () {
	      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(password, oldPassword) {
	        var ext, data, v, query, params, result;
	        return regeneratorRuntime.wrap(function _callee2$(_context2) {
	          while (1) {
	            switch (_context2.prev = _context2.next) {
	              case 0:
	                ext = {
	                  password: _validator.Joi.string().min(6)
	                };
	                data = {
	                  id: this.id,
	                  password: password,
	                  oldPassword: oldPassword
	                };
	                v = (0, _validator.validate)(data, (0, _validator.getSchema)(User.SCHEMA, 'id', 'password', 'oldPassword'), ext);
	
	                this.id = v.id;
	                query = '\n      UPDATE "user".user\n      SET password = crypt($4, gen_salt(\'bf\', 8))\n      WHERE\n        id = $1\n        AND password = crypt($2, password)\n        AND status = $3\n      RETURNING id\n      ;';
	                params = [this.id, oldPassword, User.STATUS.ACTIVE, password];
	                _context2.next = 8;
	                return db.query(query, params);
	
	              case 8:
	                result = _context2.sent;
	
	                if (!(result.rowCount <= 0)) {
	                  _context2.next = 11;
	                  break;
	                }
	
	                throw new _errors2.default.InvalidIdentificationError();
	
	              case 11:
	                return _context2.abrupt('return', new User(this));
	
	              case 12:
	              case 'end':
	                return _context2.stop();
	            }
	          }
	        }, _callee2, this);
	      }));
	
	      function changePassword(_x2, _x3) {
	        return _ref2.apply(this, arguments);
	      }
	
	      return changePassword;
	    }()
	
	    // 如果手機號未註冊過，發送驗證碼
	    // 如果手機號註冊過但沒有激活，重新發送驗證碼
	    // 如果手機號註冊並且激活過，拋錯
	    // 此时phoneNumber是合并regionCode和phoneNumber
	
	  }, {
	    key: 'verify',
	    value: function () {
	      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(verifyCode) {
	        var data;
	        return regeneratorRuntime.wrap(function _callee3$(_context3) {
	          while (1) {
	            switch (_context3.prev = _context3.next) {
	              case 0:
	                data = {
	                  mobile: this.mobile,
	                  email: this.email,
	                  verifyCode: verifyCode
	                };
	
	                (0, _validator.validate)(data, (0, _validator.getSchema)(User.SCHEMA, 'mobile', 'email', 'verifyCode'));
	
	                if (!this.mobile) {
	                  _context3.next = 8;
	                  break;
	                }
	
	                _context3.next = 5;
	                return User.verifyPhone(this.mobile.region, this.mobile.number, verifyCode);
	
	              case 5:
	                return _context3.abrupt('return', _context3.sent);
	
	              case 8:
	                if (!this.email) {
	                  _context3.next = 12;
	                  break;
	                }
	
	                _context3.next = 11;
	                return User.verifyEmail(this.email, verifyCode);
	
	              case 11:
	                return _context3.abrupt('return', _context3.sent);
	
	              case 12:
	                throw new _errors2.default.UserIdentityRequiredError();
	
	              case 13:
	              case 'end':
	                return _context3.stop();
	            }
	          }
	        }, _callee3, this);
	      }));
	
	      function verify(_x4) {
	        return _ref3.apply(this, arguments);
	      }
	
	      return verify;
	    }()
	
	    // 验证手机验证码是否有效
	    // 返回临时用户id
	
	  }, {
	    key: 'savePassword',
	
	
	    // 设置密码，设置用户已通过验证状态
	    value: function () {
	      var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(password) {
	        var _this = this;
	
	        var ext, data, v;
	        return regeneratorRuntime.wrap(function _callee5$(_context5) {
	          while (1) {
	            switch (_context5.prev = _context5.next) {
	              case 0:
	                ext = {
	                  password: _validator.Joi.string().min(6)
	                };
	                data = {
	                  id: this.id,
	                  password: password
	                };
	                v = (0, _validator.validate)(data, (0, _validator.getSchema)(User.SCHEMA, 'id', 'password'), ext);
	
	                this.id = v.id;
	                _context5.next = 6;
	                return db.transaction(function () {
	                  var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(client) {
	                    var query, params, result;
	                    return regeneratorRuntime.wrap(function _callee4$(_context4) {
	                      while (1) {
	                        switch (_context4.prev = _context4.next) {
	                          case 0:
	                            query = '\n        UPDATE "user".user\n        SET\n          password = crypt($3, gen_salt(\'bf\', 8)),\n          status = $4\n        WHERE\n          id = $1\n          AND status = $2\n        ;';
	                            params = [_this.id, User.STATUS.INACTIVE, password, User.STATUS.ACTIVE];
	                            _context4.next = 4;
	                            return client.query(query, params);
	
	                          case 4:
	                            result = _context4.sent;
	
	                            if (!(result.rowCount <= 0)) {
	                              _context4.next = 7;
	                              break;
	                            }
	
	                            throw new _errors2.default.SavePasswordFailedError();
	
	                          case 7:
	                          case 'end':
	                            return _context4.stop();
	                        }
	                      }
	                    }, _callee4, _this);
	                  }));
	
	                  return function (_x6) {
	                    return _ref5.apply(this, arguments);
	                  };
	                }());
	
	              case 6:
	                return _context5.abrupt('return', new User(this));
	
	              case 7:
	              case 'end':
	                return _context5.stop();
	            }
	          }
	        }, _callee5, this);
	      }));
	
	      function savePassword(_x5) {
	        return _ref4.apply(this, arguments);
	      }
	
	      return savePassword;
	    }()
	  }, {
	    key: 'sendVerifyCode',
	    value: function () {
	      var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(verifyCode) {
	        var data;
	        return regeneratorRuntime.wrap(function _callee6$(_context6) {
	          while (1) {
	            switch (_context6.prev = _context6.next) {
	              case 0:
	                data = {
	                  mobile: this.mobile,
	                  email: this.email,
	                  verifyCode: verifyCode
	                };
	
	                (0, _validator.validate)(data, (0, _validator.getSchema)(User.SCHEMA, 'mobile', 'email', 'verifyCode'));
	
	                if (!this.mobile) {
	                  _context6.next = 7;
	                  break;
	                }
	
	                _context6.next = 5;
	                return User.sendForgotVerifyCode(this.mobile.region, this.mobile.number, verifyCode);
	
	              case 5:
	                _context6.next = 13;
	                break;
	
	              case 7:
	                if (!this.email) {
	                  _context6.next = 12;
	                  break;
	                }
	
	                _context6.next = 10;
	                return User.sendForgotVerifyEmail(this.email, verifyCode);
	
	              case 10:
	                _context6.next = 13;
	                break;
	
	              case 12:
	                throw new _errors2.default.UserIdentityRequiredError();
	
	              case 13:
	              case 'end':
	                return _context6.stop();
	            }
	          }
	        }, _callee6, this);
	      }));
	
	      function sendVerifyCode(_x7) {
	        return _ref6.apply(this, arguments);
	      }
	
	      return sendVerifyCode;
	    }()
	
	    // 如果手機號未註冊過 或 註冊過但沒有激活，抛错
	
	  }, {
	    key: 'verifyCode',
	    value: function () {
	      var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(_verifyCode) {
	        var data;
	        return regeneratorRuntime.wrap(function _callee7$(_context7) {
	          while (1) {
	            switch (_context7.prev = _context7.next) {
	              case 0:
	                data = {
	                  mobile: this.mobile,
	                  email: this.email,
	                  verifyCode: _verifyCode
	                };
	
	                (0, _validator.validate)(data, (0, _validator.getSchema)(User.SCHEMA, 'mobile', 'email', 'verifyCode'));
	
	                if (!this.mobile) {
	                  _context7.next = 8;
	                  break;
	                }
	
	                _context7.next = 5;
	                return User.verifyForgotPasswordPhone(this.mobile.region, this.mobile.number, _verifyCode);
	
	              case 5:
	                return _context7.abrupt('return', _context7.sent);
	
	              case 8:
	                if (!this.email) {
	                  _context7.next = 12;
	                  break;
	                }
	
	                _context7.next = 11;
	                return User.verifyForgotPasswordEmail(this.email, _verifyCode);
	
	              case 11:
	                return _context7.abrupt('return', _context7.sent);
	
	              case 12:
	                throw new _errors2.default.UserIdentityRequiredError();
	
	              case 13:
	              case 'end':
	                return _context7.stop();
	            }
	          }
	        }, _callee7, this);
	      }));
	
	      function verifyCode(_x8) {
	        return _ref7.apply(this, arguments);
	      }
	
	      return verifyCode;
	    }()
	
	    // 验证找回密码手机验证码是否有效
	    // 返回用户id
	
	  }, {
	    key: 'resetPassword',
	    value: function () {
	      var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(password, token) {
	        var ext, data, v, hash, decoded, _decoded, uId, expire, query, params, result;
	
	        return regeneratorRuntime.wrap(function _callee8$(_context8) {
	          while (1) {
	            switch (_context8.prev = _context8.next) {
	              case 0:
	                ext = {
	                  password: _validator.Joi.string().min(6)
	                };
	                data = {
	                  id: this.id,
	                  password: password,
	                  token: token
	                };
	                v = (0, _validator.validate)(data, (0, _validator.getSchema)(User.SCHEMA, 'id', 'password', 'token'), ext);
	
	                this.id = v.id;
	                // check token
	                hash = new _hashids2.default(hashSalt, 8);
	                decoded = hash.decode(token);
	
	                if (!(!decoded || decoded.length < 2)) {
	                  _context8.next = 8;
	                  break;
	                }
	
	                throw new _errors2.default.InvalidUserTokenError();
	
	              case 8:
	                _decoded = _slicedToArray(decoded, 2), uId = _decoded[0], expire = _decoded[1];
	
	                if (!(!uId || uId !== this.id || !expire || expire * 1000 - 30 * 60 * 1000 > Date.now())) {
	                  _context8.next = 11;
	                  break;
	                }
	
	                throw new _errors2.default.InvalidUserTokenError();
	
	              case 11:
	                if (!(expire * 1000 < Date.now())) {
	                  _context8.next = 13;
	                  break;
	                }
	
	                throw new _errors2.default.UserTokenExpiredError();
	
	              case 13:
	                query = '\n      UPDATE "user".user\n      SET password = crypt($3, gen_salt(\'bf\', 8))\n      WHERE\n        id = $1\n        AND status = $2\n      RETURNING id\n      ;';
	                params = [this.id, User.STATUS.ACTIVE, password];
	                _context8.next = 17;
	                return db.query(query, params);
	
	              case 17:
	                result = _context8.sent;
	
	                if (!(result.rowCount <= 0)) {
	                  _context8.next = 20;
	                  break;
	                }
	
	                throw new _errors2.default.UserNotFoundError();
	
	              case 20:
	                return _context8.abrupt('return', new User(this));
	
	              case 21:
	              case 'end':
	                return _context8.stop();
	            }
	          }
	        }, _callee8, this);
	      }));
	
	      function resetPassword(_x9, _x10) {
	        return _ref8.apply(this, arguments);
	      }
	
	      return resetPassword;
	    }()
	  }], [{
	    key: 'checkAuth',
	    value: function () {
	      var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee9(userId) {
	        var query, result;
	        return regeneratorRuntime.wrap(function _callee9$(_context9) {
	          while (1) {
	            switch (_context9.prev = _context9.next) {
	              case 0:
	                query = '\n      SELECT 1\n      FROM "user".user\n      WHERE\n        id = $1\n        AND status = $2\n      ;';
	                /* eslint-disable no-undef */
	
	                _context9.next = 3;
	                return db.query(query, [userId, this.STATUS.ACTIVE]);
	
	              case 3:
	                result = _context9.sent;
	
	                if (!(result.rowCount <= 0)) {
	                  _context9.next = 6;
	                  break;
	                }
	
	                throw new _errors2.default.UserUnauthorizedError();
	
	              case 6:
	              case 'end':
	                return _context9.stop();
	            }
	          }
	        }, _callee9, this);
	      }));
	
	      function checkAuth(_x11) {
	        return _ref9.apply(this, arguments);
	      }
	
	      return checkAuth;
	    }()
	  }, {
	    key: 'phoneLogin',
	    value: function () {
	      var _ref10 = _asyncToGenerator(regeneratorRuntime.mark(function _callee10(region, number, password) {
	        var query, result, row, _ref11, nickname, user;
	
	        return regeneratorRuntime.wrap(function _callee10$(_context10) {
	          while (1) {
	            switch (_context10.prev = _context10.next) {
	              case 0:
	                query = '\n      SELECT id, status\n      FROM "user".user\n      WHERE\n        region_code = $1\n        AND phone_number = $2\n        AND password = crypt($3, password)\n      ;';
	                _context10.next = 3;
	                return db.query(query, [region, number, password]);
	
	              case 3:
	                result = _context10.sent;
	
	                if (!(result.rowCount <= 0)) {
	                  _context10.next = 6;
	                  break;
	                }
	
	                throw new _errors2.default.InvalidIdentificationError();
	
	              case 6:
	                row = result.rows[0];
	
	                if (!(row.status === User.STATUS.INACTIVE)) {
	                  _context10.next = 9;
	                  break;
	                }
	
	                throw new _errors2.default.UserInactiveError();
	
	              case 9:
	                _context10.next = 11;
	                return _profile.Profile.getProfileLite(row.id);
	
	              case 11:
	                _ref11 = _context10.sent;
	                nickname = _ref11.nickname;
	                user = {
	                  id: row.id,
	                  nickname: nickname,
	                  mobile: { region: region, number: number }
	                };
	                return _context10.abrupt('return', new _profile.Profile(user));
	
	              case 15:
	              case 'end':
	                return _context10.stop();
	            }
	          }
	        }, _callee10, this);
	      }));
	
	      function phoneLogin(_x12, _x13, _x14) {
	        return _ref10.apply(this, arguments);
	      }
	
	      return phoneLogin;
	    }()
	  }, {
	    key: 'emailLogin',
	    value: function () {
	      var _ref12 = _asyncToGenerator(regeneratorRuntime.mark(function _callee11(email, password) {
	        var query, result, row, _ref13, nickname, user;
	
	        return regeneratorRuntime.wrap(function _callee11$(_context11) {
	          while (1) {
	            switch (_context11.prev = _context11.next) {
	              case 0:
	                query = '\n      SELECT id, status\n      FROM "user".user\n      WHERE\n        email ILIKE $1\n        AND password = crypt($2, password)\n      ;';
	                /* eslint-disable no-undef */
	
	                _context11.next = 3;
	                return db.query(query, [email, password]);
	
	              case 3:
	                result = _context11.sent;
	
	                if (!(result.rowCount <= 0)) {
	                  _context11.next = 6;
	                  break;
	                }
	
	                throw new _errors2.default.InvalidIdentificationError();
	
	              case 6:
	                row = result.rows[0];
	
	                if (!(row.status === User.STATUS.INACTIVE)) {
	                  _context11.next = 9;
	                  break;
	                }
	
	                throw new _errors2.default.UserInactiveError();
	
	              case 9:
	                _context11.next = 11;
	                return _profile.Profile.getProfileLite(row.id);
	
	              case 11:
	                _ref13 = _context11.sent;
	                nickname = _ref13.nickname;
	                user = {
	                  id: row.id,
	                  nickname: nickname,
	                  email: email
	                };
	                return _context11.abrupt('return', new _profile.Profile(user));
	
	              case 15:
	              case 'end':
	                return _context11.stop();
	            }
	          }
	        }, _callee11, this);
	      }));
	
	      function emailLogin(_x15, _x16) {
	        return _ref12.apply(this, arguments);
	      }
	
	      return emailLogin;
	    }()
	  }, {
	    key: 'userNameLogin',
	    value: function () {
	      var _ref14 = _asyncToGenerator(regeneratorRuntime.mark(function _callee12(name, password) {
	        var query, result, row, _ref15, nickname, user;
	
	        return regeneratorRuntime.wrap(function _callee12$(_context12) {
	          while (1) {
	            switch (_context12.prev = _context12.next) {
	              case 0:
	                query = '\n      SELECT id, status\n      FROM "user".user\n      WHERE\n        name ILIKE $1\n        AND password = crypt($2, password)\n      ;';
	                /* eslint-disable no-undef */
	
	                _context12.next = 3;
	                return db.query(query, [name, password]);
	
	              case 3:
	                result = _context12.sent;
	
	                if (!(result.rowCount <= 0)) {
	                  _context12.next = 6;
	                  break;
	                }
	
	                throw new _errors2.default.InvalidIdentificationError();
	
	              case 6:
	                row = result.rows[0];
	
	                if (!(row.status === User.STATUS.INACTIVE)) {
	                  _context12.next = 9;
	                  break;
	                }
	
	                throw new _errors2.default.UserInactiveError();
	
	              case 9:
	                _context12.next = 11;
	                return _profile.Profile.getProfileLite(row.id);
	
	              case 11:
	                _ref15 = _context12.sent;
	                nickname = _ref15.nickname;
	                user = {
	                  id: row.id,
	                  nickname: nickname,
	                  name: name
	                };
	                return _context12.abrupt('return', new _profile.Profile(user));
	
	              case 15:
	              case 'end':
	                return _context12.stop();
	            }
	          }
	        }, _callee12, this);
	      }));
	
	      function userNameLogin(_x17, _x18) {
	        return _ref14.apply(this, arguments);
	      }
	
	      return userNameLogin;
	    }()
	  }, {
	    key: 'sendVerifyCode',
	    value: function () {
	      var _ref16 = _asyncToGenerator(regeneratorRuntime.mark(function _callee13(phoneNumber, verifyCode) {
	        var queryUser, resultUser, query, result, row, _query, _result;
	
	        return regeneratorRuntime.wrap(function _callee13$(_context13) {
	          while (1) {
	            switch (_context13.prev = _context13.next) {
	              case 0:
	                (0, _validator.validate)({ phoneNumber: phoneNumber, verifyCode: verifyCode }, (0, _validator.getSchema)(this.SCHEMA, 'phoneNumber', 'verifyCode'));
	                queryUser = '\n      SELECT\n        unix_now() - a.time AS time_span,\n        b.status\n      FROM "user".verify_code AS a\n      LEFT JOIN "user".user AS b\n      ON a.name = (b.region_code || b.phone_number)\n      WHERE\n        a.name = $1\n        AND action = $2\n      ;';
	                _context13.next = 4;
	                return db.query(queryUser, [phoneNumber, this.ACTION.SIGNUP]);
	
	              case 4:
	                resultUser = _context13.sent;
	
	                if (!(resultUser.rowCount <= 0)) {
	                  _context13.next = 14;
	                  break;
	                }
	
	                // 不曾发送过验证码，不曾注册过
	                query = '\n        INSERT INTO "user".verify_code (name, verify_code, action)\n        VALUES ($1, $2, $3)\n        ;';
	                _context13.next = 9;
	                return db.query(query, [phoneNumber, verifyCode, this.ACTION.SIGNUP]);
	
	              case 9:
	                result = _context13.sent;
	
	                if (!(result.rowCount <= 0)) {
	                  _context13.next = 12;
	                  break;
	                }
	
	                throw new _errors2.default.SendVerifyCodeFailedError();
	
	              case 12:
	                _context13.next = 25;
	                break;
	
	              case 14:
	                row = resultUser.rows[0];
	                // 手機號已註冊
	
	                if (!(row.status === this.STATUS.ACTIVE)) {
	                  _context13.next = 17;
	                  break;
	                }
	
	                throw new _errors2.default.PhoneNumberDuplicatedError();
	
	              case 17:
	                if (!(row.time_span < 30)) {
	                  _context13.next = 19;
	                  break;
	                }
	
	                throw new _errors2.default.SendVerifyCodeTooOftenError();
	
	              case 19:
	                // 重發驗證碼
	                _query = '\n        UPDATE "user".verify_code\n        SET\n          verify_code = $3,\n          time = unix_now(),\n          verified = false\n        WHERE\n          name = $1\n          AND action = $2\n        ;';
	                _context13.next = 22;
	                return db.query(_query, [phoneNumber, this.ACTION.SIGNUP, verifyCode]);
	
	              case 22:
	                _result = _context13.sent;
	
	                if (!(_result.rowCount <= 0)) {
	                  _context13.next = 25;
	                  break;
	                }
	
	                throw new _errors2.default.SendVerifyCodeFailedError();
	
	              case 25:
	              case 'end':
	                return _context13.stop();
	            }
	          }
	        }, _callee13, this);
	      }));
	
	      function sendVerifyCode(_x19, _x20) {
	        return _ref16.apply(this, arguments);
	      }
	
	      return sendVerifyCode;
	    }()
	
	    // 如果邮箱未註冊過，發送验证邮件
	    // 如果邮箱註冊過但沒有激活，重新發送驗證邮件
	    // 如果邮箱註冊並且激活過，拋錯
	
	  }, {
	    key: 'sendVerifyEmail',
	    value: function () {
	      var _ref17 = _asyncToGenerator(regeneratorRuntime.mark(function _callee14(email, verifyCode) {
	        var queryUser, resultUser, query, result, row, _query2, params, _result2;
	
	        return regeneratorRuntime.wrap(function _callee14$(_context14) {
	          while (1) {
	            switch (_context14.prev = _context14.next) {
	              case 0:
	                (0, _validator.validate)({ email: email, verifyCode: verifyCode }, (0, _validator.getSchema)(this.SCHEMA, 'email', 'verifyCode'), ['email']);
	                queryUser = '\n      SELECT\n        unix_now() - a.time AS time_span,\n        b.status\n      FROM "user".verify_code AS a\n      LEFT JOIN "user".user AS b\n      ON a.name ILIKE b.email\n      WHERE\n        a.name ILIKE $1\n        AND a.action = $2\n      ;';
	                _context14.next = 4;
	                return db.query(queryUser, [email, this.ACTION.SIGNUP]);
	
	              case 4:
	                resultUser = _context14.sent;
	
	                if (!(resultUser.rowCount <= 0)) {
	                  _context14.next = 14;
	                  break;
	                }
	
	                // 未注册，发送验证码
	                query = '\n        INSERT INTO "user".verify_code (name, verify_code, action)\n        VALUES ($1, $2, $3)\n        ;';
	                _context14.next = 9;
	                return db.query(query, [email, verifyCode, this.ACTION.SIGNUP]);
	
	              case 9:
	                result = _context14.sent;
	
	                if (!(result.rowCount <= 0)) {
	                  _context14.next = 12;
	                  break;
	                }
	
	                throw new _errors2.default.SendVerifyEmailFailedError();
	
	              case 12:
	                _context14.next = 26;
	                break;
	
	              case 14:
	                row = resultUser.rows[0];
	                // email已註冊
	
	                if (!(row.status === this.STATUS.ACTIVE)) {
	                  _context14.next = 17;
	                  break;
	                }
	
	                throw new _errors2.default.EmailDuplicatedError();
	
	              case 17:
	                if (!(row.time_span < 30)) {
	                  _context14.next = 19;
	                  break;
	                }
	
	                throw new _errors2.default.SendVerifyCodeTooOftenError();
	
	              case 19:
	                // 重發驗證邮件
	                _query2 = '\n        UPDATE "user".verify_code\n        SET\n          verify_code = $3,\n          time = unix_now(),\n          verified = false\n        WHERE\n          name ILIKE $1\n          AND action = $2\n        ;';
	                params = [email, this.ACTION.SIGNUP, verifyCode];
	                _context14.next = 23;
	                return db.query(_query2, params);
	
	              case 23:
	                _result2 = _context14.sent;
	
	                if (!(_result2.rowCount <= 0)) {
	                  _context14.next = 26;
	                  break;
	                }
	
	                throw new _errors2.default.SendVerifyEmailFailedError();
	
	              case 26:
	              case 'end':
	                return _context14.stop();
	            }
	          }
	        }, _callee14, this);
	      }));
	
	      function sendVerifyEmail(_x21, _x22) {
	        return _ref17.apply(this, arguments);
	      }
	
	      return sendVerifyEmail;
	    }()
	  }, {
	    key: 'verifyPhone',
	    value: function () {
	      var _ref18 = _asyncToGenerator(regeneratorRuntime.mark(function _callee15(region, number, verifyCode) {
	        var query, params, result, queryUser, resultUser, user;
	        return regeneratorRuntime.wrap(function _callee15$(_context15) {
	          while (1) {
	            switch (_context15.prev = _context15.next) {
	              case 0:
	                // verify by code in 30 minutes
	                // verify code expired after verified pass
	                query = '\n      UPDATE "user".verify_code\n      SET verified = true\n      WHERE\n        name = $1\n        AND verify_code = $2\n        AND action = $3\n        AND NOT verified\n        AND unix_now() - time <= 30 * 60\n      ;';
	                params = [region + number, verifyCode, User.ACTION.SIGNUP];
	                _context15.next = 4;
	                return db.query(query, params);
	
	              case 4:
	                result = _context15.sent;
	
	                if (!(result.rowCount <= 0)) {
	                  _context15.next = 7;
	                  break;
	                }
	
	                throw new _errors2.default.InvalidVerifyCodeError();
	
	              case 7:
	                queryUser = 'SELECT "user".upsert_user_phone($1, $2) AS id;';
	                _context15.next = 10;
	                return db.query(queryUser, [region, number]);
	
	              case 10:
	                resultUser = _context15.sent;
	
	                if (!(resultUser.rowCount <= 0)) {
	                  _context15.next = 13;
	                  break;
	                }
	
	                throw new _errors2.default.InvalidVerifyCodeError();
	
	              case 13:
	                user = {
	                  id: resultUser.rows[0].id,
	                  mobile: { region: region, number: number }
	                };
	                return _context15.abrupt('return', new _profile.Profile(user));
	
	              case 15:
	              case 'end':
	                return _context15.stop();
	            }
	          }
	        }, _callee15, this);
	      }));
	
	      function verifyPhone(_x23, _x24, _x25) {
	        return _ref18.apply(this, arguments);
	      }
	
	      return verifyPhone;
	    }()
	  }, {
	    key: 'verifyEmail',
	    value: function () {
	      var _ref19 = _asyncToGenerator(regeneratorRuntime.mark(function _callee16(email, verifyCode) {
	        var query, params, result, queryUser, resultUser, user;
	        return regeneratorRuntime.wrap(function _callee16$(_context16) {
	          while (1) {
	            switch (_context16.prev = _context16.next) {
	              case 0:
	                query = '\n      UPDATE "user".verify_code\n      SET verified = true\n      WHERE\n        name ILIKE $1\n        AND verify_code = $2\n        AND action = $3\n        AND NOT verified\n        AND unix_now() - time <= 30 * 60\n      ;';
	                params = [email, verifyCode, User.ACTION.SIGNUP];
	                _context16.next = 4;
	                return db.query(query, params);
	
	              case 4:
	                result = _context16.sent;
	
	                if (!(result.rowCount <= 0)) {
	                  _context16.next = 7;
	                  break;
	                }
	
	                throw new _errors2.default.InvalidVerifyCodeError();
	
	              case 7:
	                queryUser = 'SELECT "user".upsert_user_email($1) AS id;';
	                _context16.next = 10;
	                return db.query(queryUser, [email]);
	
	              case 10:
	                resultUser = _context16.sent;
	
	                if (!(resultUser.rowCount <= 0)) {
	                  _context16.next = 13;
	                  break;
	                }
	
	                throw new _errors2.default.InvalidVerifyCodeError();
	
	              case 13:
	                user = {
	                  id: resultUser.rows[0].id,
	                  email: email
	                };
	                return _context16.abrupt('return', new _profile.Profile(user));
	
	              case 15:
	              case 'end':
	                return _context16.stop();
	            }
	          }
	        }, _callee16, this);
	      }));
	
	      function verifyEmail(_x26, _x27) {
	        return _ref19.apply(this, arguments);
	      }
	
	      return verifyEmail;
	    }()
	  }, {
	    key: 'getUser',
	    value: function () {
	      var _ref20 = _asyncToGenerator(regeneratorRuntime.mark(function _callee17(userId) {
	        var query, params, result, row;
	        return regeneratorRuntime.wrap(function _callee17$(_context17) {
	          while (1) {
	            switch (_context17.prev = _context17.next) {
	              case 0:
	                (0, _validator.validate)({ id: userId }, (0, _validator.getSchema)(this.SCHEMA, 'id'));
	                query = '\n      SELECT name, phone_number, email\n      FROM "user".user\n      WHERE\n        id = $1\n        AND status = $2\n      ;';
	                params = [userId, this.STATUS.ACTIVE];
	                _context17.next = 5;
	                return db.query(query, params);
	
	              case 5:
	                result = _context17.sent;
	
	                if (!(result.rowCount <= 0)) {
	                  _context17.next = 8;
	                  break;
	                }
	
	                throw new _errors2.default.UserNotFoundError();
	
	              case 8:
	                row = result.rows[0];
	                return _context17.abrupt('return', new User({
	                  id: userId,
	                  name: row.name,
	                  mobile: {
	                    region: row.region_code,
	                    number: row.phone_number
	                  },
	                  email: row.email
	                }));
	
	              case 10:
	              case 'end':
	                return _context17.stop();
	            }
	          }
	        }, _callee17, this);
	      }));
	
	      function getUser(_x28) {
	        return _ref20.apply(this, arguments);
	      }
	
	      return getUser;
	    }()
	  }, {
	    key: 'sendForgotVerifyCode',
	    value: function () {
	      var _ref21 = _asyncToGenerator(regeneratorRuntime.mark(function _callee18(region, number, verifyCode) {
	        var phoneNumber, queryUser, resultUser, row, query, result, _query3, _result3;
	
	        return regeneratorRuntime.wrap(function _callee18$(_context18) {
	          while (1) {
	            switch (_context18.prev = _context18.next) {
	              case 0:
	                phoneNumber = region + number;
	                queryUser = '\n      SELECT unix_now() - b.time AS time_span\n      FROM  "user".user AS a\n      LEFT JOIN "user".verify_code AS b\n      ON\n        (a.region_code || a.phone_number) = b.name\n        AND b.action = $4\n      WHERE\n        a.region_code = $1\n        AND a.phone_number = $2\n        AND a.status = $3\n      ;';
	                /* eslint-disable no-undef */
	
	                _context18.next = 4;
	                return db.query(queryUser, [region, number, this.STATUS.ACTIVE, this.ACTION.FORGOT]);
	
	              case 4:
	                resultUser = _context18.sent;
	
	                if (!(resultUser.rowCount <= 0)) {
	                  _context18.next = 7;
	                  break;
	                }
	
	                throw new _errors2.default.UserNotFoundError();
	
	              case 7:
	                row = resultUser.rows[0];
	
	                if (!(!row.time_span && row.time_span !== 0)) {
	                  _context18.next = 17;
	                  break;
	                }
	
	                // 不曾发送过找回密码验证码
	                query = '\n        INSERT INTO "user".verify_code (name, verify_code, action)\n        VALUES ($1, $2, $3)\n        ;';
	                _context18.next = 12;
	                return db.query(query, [phoneNumber, verifyCode, this.ACTION.FORGOT]);
	
	              case 12:
	                result = _context18.sent;
	
	                if (!(result.rowCount <= 0)) {
	                  _context18.next = 15;
	                  break;
	                }
	
	                throw new _errors2.default.SendVerifyCodeFailedError();
	
	              case 15:
	                _context18.next = 25;
	                break;
	
	              case 17:
	                if (!(row.time_span < 30)) {
	                  _context18.next = 19;
	                  break;
	                }
	
	                throw new _errors2.default.SendVerifyCodeTooOftenError();
	
	              case 19:
	                // 重發驗證碼
	                _query3 = '\n        UPDATE "user".verify_code\n        SET\n          verify_code = $3,\n          time = unix_now(),\n          verified = false\n        WHERE\n          name = $1\n          AND action = $2\n        ;';
	                _context18.next = 22;
	                return db.query(_query3, [phoneNumber, this.ACTION.FORGOT, verifyCode]);
	
	              case 22:
	                _result3 = _context18.sent;
	
	                if (!(_result3.rowCount <= 0)) {
	                  _context18.next = 25;
	                  break;
	                }
	
	                throw new _errors2.default.SendVerifyCodeFailedError();
	
	              case 25:
	              case 'end':
	                return _context18.stop();
	            }
	          }
	        }, _callee18, this);
	      }));
	
	      function sendForgotVerifyCode(_x29, _x30, _x31) {
	        return _ref21.apply(this, arguments);
	      }
	
	      return sendForgotVerifyCode;
	    }()
	
	    // 如果邮箱未註冊過 或 註冊過但沒有激活，抛错
	
	  }, {
	    key: 'sendForgotVerifyEmail',
	    value: function () {
	      var _ref22 = _asyncToGenerator(regeneratorRuntime.mark(function _callee19(email, verifyCode) {
	        var queryUser, resultUser, row, query, result, _query4, _result4;
	
	        return regeneratorRuntime.wrap(function _callee19$(_context19) {
	          while (1) {
	            switch (_context19.prev = _context19.next) {
	              case 0:
	                queryUser = '\n      SELECT unix_now() - b.time AS time_span\n      FROM  "user".user AS a\n      LEFT JOIN "user".verify_code AS b\n      ON\n        a.email ILIKE b.name\n        AND b.action = $3\n      WHERE\n        a.email ILIKE $1\n        AND a.status = $2\n      ;';
	                /* eslint-disable no-undef */
	
	                _context19.next = 3;
	                return db.query(queryUser, [email, this.STATUS.ACTIVE, this.ACTION.FORGOT]);
	
	              case 3:
	                resultUser = _context19.sent;
	
	                if (!(resultUser.rowCount <= 0)) {
	                  _context19.next = 6;
	                  break;
	                }
	
	                throw new _errors2.default.UserNotFoundError();
	
	              case 6:
	                row = resultUser.rows[0];
	
	                if (!(!row.time_span && row.time_span !== 0)) {
	                  _context19.next = 16;
	                  break;
	                }
	
	                // 不曾发送过找回密码验证码
	                query = '\n        INSERT INTO "user".verify_code (name, verify_code, action)\n        VALUES ($1, $2, $3)\n        ;';
	                _context19.next = 11;
	                return db.query(query, [email, verifyCode, this.ACTION.FORGOT]);
	
	              case 11:
	                result = _context19.sent;
	
	                if (!(result.rowCount <= 0)) {
	                  _context19.next = 14;
	                  break;
	                }
	
	                throw new _errors2.default.SendVerifyCodeFailedError();
	
	              case 14:
	                _context19.next = 24;
	                break;
	
	              case 16:
	                if (!(row.time_span < 30)) {
	                  _context19.next = 18;
	                  break;
	                }
	
	                throw new _errors2.default.SendVerifyCodeTooOftenError();
	
	              case 18:
	                // 重發驗證碼
	                _query4 = '\n        UPDATE "user".verify_code\n        SET\n          verify_code = $3,\n          time = unix_now(),\n          verified = false\n        WHERE\n          name ILIKE $1\n          AND action = $2\n        ;';
	                _context19.next = 21;
	                return db.query(_query4, [email, this.ACTION.FORGOT, verifyCode]);
	
	              case 21:
	                _result4 = _context19.sent;
	
	                if (!(_result4.rowCount <= 0)) {
	                  _context19.next = 24;
	                  break;
	                }
	
	                throw new _errors2.default.SendVerifyCodeFailedError();
	
	              case 24:
	              case 'end':
	                return _context19.stop();
	            }
	          }
	        }, _callee19, this);
	      }));
	
	      function sendForgotVerifyEmail(_x32, _x33) {
	        return _ref22.apply(this, arguments);
	      }
	
	      return sendForgotVerifyEmail;
	    }()
	  }, {
	    key: 'verifyForgotPasswordPhone',
	    value: function () {
	      var _ref23 = _asyncToGenerator(regeneratorRuntime.mark(function _callee20(region, number, verifyCode) {
	        var query, params, result, hash, expire, userId;
	        return regeneratorRuntime.wrap(function _callee20$(_context20) {
	          while (1) {
	            switch (_context20.prev = _context20.next) {
	              case 0:
	                // verify by code in 30 minutes
	                // verify code expired after verified pass
	                query = '\n      UPDATE "user".verify_code AS a\n      SET verified = true\n      FROM "user".user AS b\n      WHERE\n        a.name = (b.region_code || b.phone_number)\n        AND a.name = $1\n        AND a.verify_code = $2\n        AND a.action = $3\n        AND b.status = $4\n        AND NOT a.verified\n        AND unix_now() - a.time <= 30 * 60\n      RETURNING b.id\n      ;';
	                params = [region + number, verifyCode, User.ACTION.FORGOT, User.STATUS.ACTIVE];
	                _context20.next = 4;
	                return db.query(query, params);
	
	              case 4:
	                result = _context20.sent;
	
	                if (!(result.rowCount <= 0)) {
	                  _context20.next = 7;
	                  break;
	                }
	
	                throw new _errors2.default.InvalidVerifyCodeError();
	
	              case 7:
	                hash = new _hashids2.default(hashSalt, 8);
	                // expired in 30 min
	
	                expire = Math.floor(Date.now() / 1000 + 30 * 60);
	                userId = result.rows[0].id;
	                return _context20.abrupt('return', {
	                  id: userId,
	                  token: hash.encode(userId, expire)
	                });
	
	              case 11:
	              case 'end':
	                return _context20.stop();
	            }
	          }
	        }, _callee20, this);
	      }));
	
	      function verifyForgotPasswordPhone(_x34, _x35, _x36) {
	        return _ref23.apply(this, arguments);
	      }
	
	      return verifyForgotPasswordPhone;
	    }()
	
	    // 验证找回密码手机验证码是否有效
	    // 返回用户id
	
	  }, {
	    key: 'verifyForgotPasswordEmail',
	    value: function () {
	      var _ref24 = _asyncToGenerator(regeneratorRuntime.mark(function _callee21(email, verifyCode) {
	        var query, params, result, hash, expire, userId;
	        return regeneratorRuntime.wrap(function _callee21$(_context21) {
	          while (1) {
	            switch (_context21.prev = _context21.next) {
	              case 0:
	                // verify by code in 30 minutes
	                // verify code expired after verified pass
	                query = '\n      UPDATE "user".verify_code AS a\n      SET verified = true\n      FROM "user".user AS b\n      WHERE\n        a.name ILIKE b.email\n        AND a.name ILIKE $1\n        AND a.verify_code = $2\n        AND a.action = $3\n        AND b.status = $4\n        AND NOT a.verified\n        AND unix_now() - a.time <= 30 * 60\n      RETURNING b.id\n      ;';
	                params = [email, verifyCode, User.ACTION.FORGOT, User.STATUS.ACTIVE];
	                _context21.next = 4;
	                return db.query(query, params);
	
	              case 4:
	                result = _context21.sent;
	
	                if (!(result.rowCount <= 0)) {
	                  _context21.next = 7;
	                  break;
	                }
	
	                throw new _errors2.default.InvalidVerifyCodeError();
	
	              case 7:
	                hash = new _hashids2.default(hashSalt, 8);
	                // expired in 30 min
	
	                expire = Math.floor(Date.now() / 1000 + 30 * 60);
	                userId = result.rows[0].id;
	                return _context21.abrupt('return', {
	                  id: userId,
	                  token: hash.encode(userId, expire)
	                });
	
	              case 11:
	              case 'end':
	                return _context21.stop();
	            }
	          }
	        }, _callee21, this);
	      }));
	
	      function verifyForgotPasswordEmail(_x37, _x38) {
	        return _ref24.apply(this, arguments);
	      }
	
	      return verifyForgotPasswordEmail;
	    }()
	  }]);
	
	  return User;
	}();
	
	exports.User = User;
	User.SCHEMA = {
	  /* eslint-disable newline-per-chained-call */
	  id: _validator.Joi.number().integer().min(1000000000).required(),
	  regionCode: _validator.Joi.string().required(),
	  phoneNumber: _validator.Joi.string().required(),
	  verifyCode: _validator.Joi.number().integer().min(100000).max(999999).required(),
	  email: _validator.Joi.string().email().allow('', null),
	  name: _validator.Joi.string().allow('', null),
	  password: _validator.Joi.string().required(),
	  oldPassword: _validator.Joi.string().required(),
	  mobile: _validator.Joi.object({
	    region: _validator.Joi.string().required(),
	    number: _validator.Joi.string().required()
	  }).allow('', null),
	  token: _validator.Joi.string().required()
	};
	User.STATUS = {
	  INACTIVE: 1,
	  ACTIVE: 2,
	  DISABLED: 9
	};
	User.ACTION = {
	  SIGNUP: 1,
	  LOGIN: 2,
	  FORGOT: 3
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _restifyErrors = __webpack_require__(11);
	
	var _restifyErrors2 = _interopRequireDefault(_restifyErrors);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function normalize(name) {
	  /* eslint-disable no-param-reassign */
	  // name = name.charAt(0).toUpperCase() + name.slice(1)
	  if (!name.endsWith('Error')) {
	    return name + 'Error';
	  }
	  return name;
	}
	
	_restifyErrors2.default.localization = __webpack_require__(12);
	
	_restifyErrors2.default.lang = function (error) {
	  if (error.message) return error.message;
	  var name = error.name.slice(0, -5);
	  return _restifyErrors2.default.localization[name];
	};
	
	_restifyErrors2.default.register = function (options) {
	  Object.keys(options).forEach(function (name) {
	    var config = options[name];
	    var errorName = normalize(name);
	    switch (typeof config === 'undefined' ? 'undefined' : _typeof(config)) {
	      case 'number':
	        if (config % 1 === 0) {
	          _restifyErrors2.default.makeConstructor(errorName, {
	            statusCode: config
	          });
	          return;
	        }
	        break;
	      case 'object':
	        _restifyErrors2.default.makeConstructor(errorName, config);
	        return;
	      default:
	    }
	    throw new Error('Invalid error config for ' + errorName);
	  });
	};
	
	exports.default = _restifyErrors2.default;

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("restify-errors");

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = {
		"UserUnauthorized": "无效的用户",
		"SendVerifyCodeFailed": "发送验证码失败",
		"SendVerifyEmailFailed": "发送验证邮件失败",
		"InvalidVerifyCode": "验证码无效或已过期",
		"CreateUserFailed": "创建用户失败",
		"PhoneNumberDuplicated": "该手机号已被注册",
		"EmailDuplicated": "该邮箱地址已被注册",
		"InvalidIdentification": "身份验证失败，请重新登录",
		"UserInactive": "用户尚未激活",
		"SavePasswordFailed": "保存密码失败",
		"SendVerifyCodeTooOften": "发送验证码过于频繁，请稍后再试",
		"UserNotFound": "未找到指定用户",
		"SaveEventFailed": "保存活动失败",
		"DeleteEventFailed": "删除活动失败",
		"CancelEventFailed": "取消活动失败",
		"EventNotFound": "未找到指定活动",
		"EventFinished": "活动已结束",
		"EventCanceled": "活动已取消",
		"EventDeleted": "活动已删除",
		"EventNotStarted": "活动尚未开始",
		"EventStarted": "活动已开始",
		"EventPublished": "活动已经发布，请勿重复发布",
		"PublishingEventStarted": "已过活动开始时间，请编辑后重新发布",
		"SaveProfileFailed": "保存用户信息失败",
		"SaveSignatureFailed": "更新签名档失败",
		"SendMessageFailed": "发送消息失败",
		"InvalidMessageDestination": "不能给自己发消息",
		"UserNameSetTwice": "用户名只能设置一次，设置之后不能修改",
		"NotAttendee": "非活动的参与者",
		"EventNotFinished": "活动结束后才能进行评价",
		"RatingFailed": "评价失败",
		"FinishEventFailed": "结束活动失败",
		"InvitationNotFound": "未找到指定活动邀请",
		"InvalidEventTime": "活动结束时间不能早于开始时间",
		"PublishEventFailed": "发布活动失败",
		"OrderNotFound": "未找到指定订单",
		"SaveCityFailed": "保存城市信息失败",
		"SelfFollowingNotAllowed": "不能关注自己",
		"NeedFollowing": "需关注对方才能进行此操作",
		"InvalidNext": "无效的分页标识",
		"WeatherDataOutOfRange": "你请求的天气情况超出范围",
		"SelfFlirtNotAllowed": "只能想认识其他参与者",
		"InvalidEventCategory": "无效的活动类型",
		"InvalidProfile": "无效的个人信息",
		"UserNicknameDuplicated": "该昵称已被占用",
		"CommentMomentFailed": "评论失败",
		"DeleteCommentFailed": "删除评论失败",
		"ApplyClosed": "该活动报名已截止",
		"EventCommentNotFound": "未找到指定活动留言",
		"NoPermission": "根据用户设置，你没有权限进行此操作",
		"InvalidEventToken": "无效的活动标识",
		"ProfileRequired": "你尚未设置个人信息",
		"NotAudience": "你不符合目标人群特征",
		"InvalidCampaignTime": "结束时间不能早于开始时间",
		"SaveCampaignFailed": "创建活动失败",
		"CampaignFailed": "参加促销活动失败",
		"CreateTopicFailed": "创建话题失败",
		"RemoveTopicFailed": "删除话题失败",
		"TopicNotFound": "未找到指定话题",
		"ReplyTopicFailed": "回复话题失败",
		"ClearEventFailed": "结清活动费用失败",
		"InvalidPaymentAmount": "无效的活动金额",
		"RemoveTopicCommentFailed": "删除话题回复失败",
		"NotOrganizer": "你不是组织者，没有权限进行此操作",
		"InvalidFeeMode": "只有AA制活动才能设置收款金额",
		"ApplyQuotaExceed": "所选人数超过限额",
		"ApplyInventoryExceed": "库存不足",
		"EventApplied": "不能重复报名",
		"CreateOrderFailed": "创建订单失败",
		"CampaignNotFound": "未找到指定促销活动",
		"CampaignQuotaExceed": "参加活动次数超过限额",
		"MasterNameDuplicated": "管理员用户名重复",
		"CreateMasterFailed": "创建管理员失败",
		"PasswordNotChanged": "新旧密码不能相同",
		"MasterNotFound": "未找到指定管理员",
		"InvalidMasterStatus": "管理员账号已激活",
		"ActivateMasterFailed": "激活管理员账号失败",
		"NotApproved": "你参加活动的申请尚未通过批准",
		"AttendeeValidated": "已通过验证",
		"ValidateAttendeeFailed": "验票失败",
		"MobileRequired": "请先绑定手机号",
		"SavePromotionFailed": "保存促销信息失败",
		"PromotionNotFound": "未找到指定促销活动",
		"FriendInvited": "不能重复邀请好友",
		"EventTokenExpired": "活动二维码已过期",
		"SendFeedbackFailed": "发送反馈失败",
		"ReportEventFailed": "举报活动失败",
		"UserIdentityRequired": "请输入手机号或邮箱",
		"InvalidUserToken": "验证码无效",
		"UserTokenExpired": "验证码已过期，请重新验证",
		"InvalidEventStatus": "无效的活动状态",
		"LinkingPrivateEvent": "不能连接私人活动",
		"LinkingEventInventoryExceeded": "连接的活动库存超过总库存",
		"OrderExpired": "订单已过期，请重新报名参加活动",
		"ReportUserFailed": "举报用户失败",
		"ReportAppFailed": "反馈失败",
		"SaveAppVersionFailed": "保存版本信息失败",
		"AppVersionNotFound": "未找到指定的版本信息",
		"SaveAppPlatformFailed": "保存平台信息失败",
		"PublishAppVersionFailed": "发布版本信息失败",
		"InvalidPlatform": "无效的平台名称",
		"EventHasAttendee": "已有用户参加活动，不能取消",
		"AppPlatformNotFound": "未找到制定平台信息",
		"EventNotCanceled": "只能删除已取消的活动",
		"PlatformDuplicated": "平台名称重复",
		"PlatformCodeDuplicated": "平台识别码重复",
		"InvalidEventFeeId": "无效的票据标识"
	};

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = require("hashids");

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Joi = exports.getSchema = exports.validate = undefined;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _joi = __webpack_require__(15);
	
	var _joi2 = _interopRequireDefault(_joi);
	
	var _errors = __webpack_require__(10);
	
	var _errors2 = _interopRequireDefault(_errors);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	var ERRORS = {
	  ValidationFailed: {
	    statusCode: 400
	  }
	};
	_errors2.default.register(ERRORS);
	
	function validate(data, schema, ext) {
	  if ((typeof schema === 'undefined' ? 'undefined' : _typeof(schema)) === 'object') {
	    /* eslint-disable no-param-reassign */
	    schema = _joi2.default.object(schema);
	  }
	  if (ext) {
	    if (Array.isArray(ext)) {
	      var required = {};
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;
	
	      try {
	        for (var _iterator = ext[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var r = _step.value;
	
	          required[r] = _joi2.default.required();
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	
	      ext = _joi2.default.object(required);
	    } else if ((typeof ext === 'undefined' ? 'undefined' : _typeof(ext)) === 'object') {
	      ext = _joi2.default.object(ext);
	    }
	    schema = schema.concat(ext);
	  }
	  var result = _joi2.default.validate(data, schema);
	  if (result.error) {
	    throw new _errors2.default.ValidationFailedError(result.error.details[0]);
	  }
	  if (result.value && Object.keys(data).length > 0) {
	    var _iteratorNormalCompletion2 = true;
	    var _didIteratorError2 = false;
	    var _iteratorError2 = undefined;
	
	    try {
	      for (var _iterator2 = Object.keys(data)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	        var key = _step2.value;
	
	        if (result.value.hasOwnProperty(key)) {
	          data[key] = result.value[key];
	        }
	      }
	    } catch (err) {
	      _didIteratorError2 = true;
	      _iteratorError2 = err;
	    } finally {
	      try {
	        if (!_iteratorNormalCompletion2 && _iterator2.return) {
	          _iterator2.return();
	        }
	      } finally {
	        if (_didIteratorError2) {
	          throw _iteratorError2;
	        }
	      }
	    }
	  }
	  return result.value;
	}
	
	function getSchema(schema) {
	  var schemaKeys = [];
	
	  for (var _len = arguments.length, keys = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    keys[_key - 1] = arguments[_key];
	  }
	
	  var _iteratorNormalCompletion3 = true;
	  var _didIteratorError3 = false;
	  var _iteratorError3 = undefined;
	
	  try {
	    for (var _iterator3 = keys[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	      var key = _step3.value;
	
	      if (Array.isArray(key)) {
	        schemaKeys.push.apply(schemaKeys, _toConsumableArray(key));
	      } else {
	        schemaKeys.push(key);
	      }
	    }
	  } catch (err) {
	    _didIteratorError3 = true;
	    _iteratorError3 = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion3 && _iterator3.return) {
	        _iterator3.return();
	      }
	    } finally {
	      if (_didIteratorError3) {
	        throw _iteratorError3;
	      }
	    }
	  }
	
	  var sub = {};
	  var _iteratorNormalCompletion4 = true;
	  var _didIteratorError4 = false;
	  var _iteratorError4 = undefined;
	
	  try {
	    for (var _iterator4 = schemaKeys[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	      var _key2 = _step4.value;
	
	      sub[_key2] = schema[_key2];
	    }
	  } catch (err) {
	    _didIteratorError4 = true;
	    _iteratorError4 = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion4 && _iterator4.return) {
	        _iterator4.return();
	      }
	    } finally {
	      if (_didIteratorError4) {
	        throw _iteratorError4;
	      }
	    }
	  }
	
	  return sub;
	}
	
	exports.validate = validate;
	exports.getSchema = getSchema;
	exports.Joi = _joi2.default;

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = require("joi");

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Profile = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	__webpack_require__(17);
	
	var _errors = __webpack_require__(10);
	
	var _errors2 = _interopRequireDefault(_errors);
	
	var _validator = __webpack_require__(14);
	
	var _user = __webpack_require__(9);
	
	var _city = __webpack_require__(18);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var ERRORS = {
	  SaveProfileFailed: 400,
	  SaveSignatureFailed: 400,
	  SaveInterestsFailed: 400,
	  SaveAddressFailed: 400,
	  InvalidProfile: 400,
	  UserNicknameDuplicated: 400,
	  MobileRequired: 400
	};
	
	_errors2.default.register(ERRORS);
	
	var Profile = exports.Profile = function () {
	  function Profile(data) {
	    _classCallCheck(this, Profile);
	
	    if (data) {
	      if (data.id) this.id = data.id;
	      if (data.name) this.name = data.name;
	      if (data.mobile) this.mobile = data.mobile;
	      if (data.email) this.email = data.email;
	      if (data.nickname) this.nickname = data.nickname;
	      if (data.avatar) this.avatar = data.avatar;
	      if (data.birthday) this.birthday = data.birthday;
	      if (data.gender || data.gender === 0) this.gender = data.gender;
	      if (data.geo) this.geo = data.geo;
	      if (data.signature) this.signature = data.signature;
	      if (data.interests && data.interests.length > 0) this.interests = data.interests;
	      if (data.address) this.address = data.address;
	      if (data.followings || data.followings === 0) this.followings = data.followings;
	      if (data.followers || data.followers === 0) this.followers = data.followers;
	      if (data.following || data.following === false) this.following = data.following;
	      if (data.follower || data.follower === false) this.follower = data.follower;
	      if (data.friend || data.friend === false) this.friend = data.friend;
	    }
	  }
	
	  _createClass(Profile, [{
	    key: 'save',
	    value: function () {
	      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
	        var v, profile, cityCode, query, result, queryUsername, resultUsername, queryVerifyPhone, params, resultVerifyPhone, queryPhone, queryVerifyEmail, _params, resultVerifyEmail, queryEmail;
	
	        return regeneratorRuntime.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                if (!(Object.keys(this).length <= 1)) {
	                  _context.next = 2;
	                  break;
	                }
	
	                throw new _errors2.default.InvalidProfileError();
	
	              case 2:
	                v = (0, _validator.validate)(this, (0, _validator.getSchema)(Profile.SCHEMA, 'id', 'nickname', 'avatar', 'birthday', 'gender', 'geo', 'signature', 'interests', 'address', 'name', 'mobile', 'email'));
	
	                this.gender = v.gender;
	                _context.next = 6;
	                return _user.User.checkAuth(this.id);
	
	              case 6:
	                _context.prev = 6;
	                _context.next = 9;
	                return Profile.getProfile(this.id);
	
	              case 9:
	                profile = _context.sent;
	
	                this.nickname = this.nickname || profile.nickname;
	                this.avatar = this.avatar || profile.avatar;
	                this.birthday = this.birthday || profile.birthday;
	                this.gender = this.gender || this.gender === 0 ? this.gender : profile.gender || 0;
	                this.geo = this.geo || profile.geo;
	                this.signature = this.signature !== null ? this.signature : profile.signature;
	                this.interests = this.interests || profile.interests;
	                this.address = this.address || profile.address;
	                _context.next = 20;
	                return _city.City.getCityCode(this.geo);
	
	              case 20:
	                this.geo = _context.sent;
	                cityCode = this.geo ? this.geo.city.id : null;
	                // update profile
	
	                query = 'SELECT "user".upsert_profile($1, $2, $3, $4, $5, $6, $7, $8, $9);';
	                /* eslint-disable no-undef */
	
	                _context.next = 25;
	                return db.query(query, [this.id, this.nickname, this.avatar, this.birthday, this.gender, cityCode, this.signature, this.interests, this.address]);
	
	              case 25:
	                result = _context.sent;
	
	                if (!(result.rowCount <= 0)) {
	                  _context.next = 28;
	                  break;
	                }
	
	                throw new _errors2.default.SaveProfileFailedError();
	
	              case 28:
	                if (!this.name) {
	                  _context.next = 37;
	                  break;
	                }
	
	                if (!profile.name) {
	                  _context.next = 31;
	                  break;
	                }
	
	                throw new _errors2.default.UserNameSetTwiceError();
	
	              case 31:
	                queryUsername = '\n          UPDATE "user".user\n          SET name = $2\n          WHERE\n            id = $1\n            AND name IS NULL\n          ;';
	                _context.next = 34;
	                return db.query(queryUsername, [this.id, this.name]);
	
	              case 34:
	                resultUsername = _context.sent;
	
	                if (!(resultUsername.rowCount <= 0)) {
	                  _context.next = 37;
	                  break;
	                }
	
	                throw new _errors2.default.UserNameSetTwiceError();
	
	              case 37:
	                if (!this.mobile) {
	                  _context.next = 49;
	                  break;
	                }
	
	                queryVerifyPhone = '\n          UPDATE "user".verify_code\n          SET verified = true\n          WHERE\n            name = $1\n            AND verify_code = $2\n            AND action = $3\n            AND NOT verified\n            AND unix_now() - time <= 30 * 60\n          ;';
	                params = [this.mobile.region + this.mobile.number, this.mobile.verifyCode, _user.User.ACTION.SIGNUP];
	                _context.next = 42;
	                return db.query(queryVerifyPhone, params);
	
	              case 42:
	                resultVerifyPhone = _context.sent;
	
	                if (!(resultVerifyPhone.rowCount <= 0)) {
	                  _context.next = 45;
	                  break;
	                }
	
	                throw new _errors2.default.InvalidVerifyCodeError();
	
	              case 45:
	                queryPhone = '\n          UPDATE "user".user\n          SET\n            region_code = $2,\n            phone_number = $3\n          WHERE id = $1\n          ;';
	                _context.next = 48;
	                return db.query(queryPhone, [this.id, this.mobile.region, this.mobile.number]);
	
	              case 48:
	                delete this.mobile.verifyCode;
	
	              case 49:
	                if (!this.email) {
	                  _context.next = 61;
	                  break;
	                }
	
	                queryVerifyEmail = '\n          UPDATE "user".verify_code\n          SET verified = true\n          WHERE\n            name ILIKE $1\n            AND verify_code = $2\n            AND action = $3\n            AND NOT verified\n            AND unix_now() - time <= 30 * 60\n          ;';
	                _params = [this.email.email, this.email.verifyCode, _user.User.ACTION.SIGNUP];
	                _context.next = 54;
	                return db.query(queryVerifyEmail, _params);
	
	              case 54:
	                resultVerifyEmail = _context.sent;
	
	                if (!(resultVerifyEmail.rowCount <= 0)) {
	                  _context.next = 57;
	                  break;
	                }
	
	                throw new _errors2.default.InvalidVerifyCodeError();
	
	              case 57:
	                queryEmail = '\n          UPDATE "user".user\n          SET email = $2\n          WHERE id = $1\n          ;';
	                _context.next = 60;
	                return db.query(queryEmail, [this.id, this.email.email]);
	
	              case 60:
	                delete this.email.verifyCode;
	
	              case 61:
	                _context.next = 71;
	                break;
	
	              case 63:
	                _context.prev = 63;
	                _context.t0 = _context['catch'](6);
	
	                if (!(_context.t0.code === '23505')) {
	                  _context.next = 70;
	                  break;
	                }
	
	                if (!_context.t0.detail.includes('(lower(name::text))')) {
	                  _context.next = 68;
	                  break;
	                }
	
	                throw new _errors2.default.UserNameDuplicatedError();
	
	              case 68:
	                if (!_context.t0.detail.includes('(lower(nickname::text))')) {
	                  _context.next = 70;
	                  break;
	                }
	
	                throw new _errors2.default.UserNicknameDuplicatedError();
	
	              case 70:
	                throw _context.t0;
	
	              case 71:
	                return _context.abrupt('return', new Profile(this));
	
	              case 72:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, this, [[6, 63]]);
	      }));
	
	      function save() {
	        return _ref.apply(this, arguments);
	      }
	
	      return save;
	    }()
	  }], [{
	    key: 'getProfileLite',
	    value: function () {
	      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(userId) {
	        var query, result, row;
	        return regeneratorRuntime.wrap(function _callee2$(_context2) {
	          while (1) {
	            switch (_context2.prev = _context2.next) {
	              case 0:
	                query = '\n      SELECT nickname\n      FROM "user".profile\n      WHERE user_id = $1\n      ;';
	                _context2.next = 3;
	                return db.query(query, [userId]);
	
	              case 3:
	                result = _context2.sent;
	
	                if (!(result.rowCount <= 0)) {
	                  _context2.next = 6;
	                  break;
	                }
	
	                return _context2.abrupt('return', {});
	
	              case 6:
	                row = result.rows[0];
	                return _context2.abrupt('return', {
	                  nickname: row.nickname
	                });
	
	              case 8:
	              case 'end':
	                return _context2.stop();
	            }
	          }
	        }, _callee2, this);
	      }));
	
	      function getProfileLite(_x) {
	        return _ref2.apply(this, arguments);
	      }
	
	      return getProfileLite;
	    }()
	  }, {
	    key: 'getProfile',
	    value: function () {
	      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(id, friendId) {
	        var userId, query, result, row, p;
	        return regeneratorRuntime.wrap(function _callee3$(_context3) {
	          while (1) {
	            switch (_context3.prev = _context3.next) {
	              case 0:
	                (0, _validator.validate)({ id: id, friendId: friendId }, (0, _validator.getSchema)(this.SCHEMA, 'id', 'friendId'));
	                _context3.next = 3;
	                return _user.User.checkAuth(id);
	
	              case 3:
	                userId = friendId || id;
	                query = '\n      SELECT\n        a.*,\n        b.country_code,\n        b.country,\n        b.province,\n        b.city AS city_name,\n        c.followings,\n        c.followers,\n        d.phone_number,\n        d.email,\n        d.name\n      FROM "user".profile AS a\n      LEFT JOIN "user".user AS d\n      ON a.user_id = d.id\n      LEFT JOIN "user".summary AS c\n      ON a.user_id = c.user_id\n      LEFT JOIN "user".city AS b\n      ON a.city = b.id\n      WHERE\n        a.user_id = $1\n      ;';
	                _context3.next = 7;
	                return db.query(query, [userId]);
	
	              case 7:
	                result = _context3.sent;
	
	                if (!(result.rowCount <= 0)) {
	                  _context3.next = 10;
	                  break;
	                }
	
	                return _context3.abrupt('return', new Profile({ id: userId }));
	
	              case 10:
	                row = result.rows[0];
	                p = {
	                  id: userId,
	                  nickname: row.nickname,
	                  avatar: row.avatar,
	                  gender: row.gender || 0,
	                  geo: row.city_name ? {
	                    country: {
	                      name: row.country,
	                      code: row.country_code
	                    },
	                    province: row.province,
	                    city: {
	                      name: row.city_name,
	                      id: row.city
	                    }
	                  } : null,
	                  signature: row.signature,
	                  interests: row.interests,
	                  address: row.address,
	                  followers: row.followers || 0,
	                  followings: row.followings || 0
	                };
	
	                if (!friendId || id === friendId) {
	                  p.birthday = row.birthday ? row.birthday.toFormat('YYYY-MM-DD') : null;
	                  p.name = row.name;
	                  p.mobile = {
	                    region: row.region_code,
	                    number: row.phone_number
	                  };
	                  p.email = row.email;
	                } else {
	                  // 对方是否关注了我，和我是否关注了对方
	                  p.follower = false;
	                  p.following = false;
	                }
	                return _context3.abrupt('return', new Profile(p));
	
	              case 14:
	              case 'end':
	                return _context3.stop();
	            }
	          }
	        }, _callee3, this);
	      }));
	
	      function getProfile(_x2, _x3) {
	        return _ref3.apply(this, arguments);
	      }
	
	      return getProfile;
	    }()
	  }, {
	    key: 'checkMobile',
	    value: function () {
	      var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(userId) {
	        var query, result, row;
	        return regeneratorRuntime.wrap(function _callee4$(_context4) {
	          while (1) {
	            switch (_context4.prev = _context4.next) {
	              case 0:
	                query = '\n      SELECT region_code, phone_number\n      FROM "user".user\n      WHERE\n        id = $1\n        AND status = $2\n      ;';
	                _context4.next = 3;
	                return db.query(query, [userId, _user.User.STATUS.ACTIVE]);
	
	              case 3:
	                result = _context4.sent;
	
	                if (!(result.rowCount <= 0)) {
	                  _context4.next = 6;
	                  break;
	                }
	
	                throw new _errors2.default.UserNotFoundError();
	
	              case 6:
	                row = result.rows[0];
	
	                if (!(!row.region_code || !row.phone_number)) {
	                  _context4.next = 9;
	                  break;
	                }
	
	                throw new _errors2.default.MobileRequiredError();
	
	              case 9:
	              case 'end':
	                return _context4.stop();
	            }
	          }
	        }, _callee4, this);
	      }));
	
	      function checkMobile(_x4) {
	        return _ref4.apply(this, arguments);
	      }
	
	      return checkMobile;
	    }()
	  }, {
	    key: 'getThumbProfile',
	    value: function () {
	      var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(userId, client) {
	        var query, result, row;
	        return regeneratorRuntime.wrap(function _callee5$(_context5) {
	          while (1) {
	            switch (_context5.prev = _context5.next) {
	              case 0:
	                /* eslint-disable no-param-reassign */
	                client = client || db;
	                query = '\n      SELECT *\n      FROM "user".profile\n      WHERE user_id = $1\n      ;';
	                _context5.next = 4;
	                return client.query(query, [userId]);
	
	              case 4:
	                result = _context5.sent;
	
	                if (!(result.rowCount <= 0)) {
	                  _context5.next = 7;
	                  break;
	                }
	
	                throw new _errors2.default.UserNotFoundError();
	
	              case 7:
	                row = result.rows[0];
	                return _context5.abrupt('return', new Profile({
	                  id: userId,
	                  nickname: row.nickname,
	                  avatar: row.avatar
	                }));
	
	              case 9:
	              case 'end':
	                return _context5.stop();
	            }
	          }
	        }, _callee5, this);
	      }));
	
	      function getThumbProfile(_x5, _x6) {
	        return _ref5.apply(this, arguments);
	      }
	
	      return getThumbProfile;
	    }()
	  }]);
	
	  return Profile;
	}();
	
	Profile.SCHEMA = {
	  /* eslint-disable newline-per-chained-call */
	  id: _validator.Joi.number().integer().min(1000000000).required(),
	  friendId: _validator.Joi.number().integer().min(1000000000),
	  name: _validator.Joi.string().allow('', null),
	  nickname: _validator.Joi.string().allow('', null),
	  avatar: _validator.Joi.string().allow('', null),
	  birthday: _validator.Joi.date().max('now').allow('', null).raw(),
	  gender: _validator.Joi.number().integer().min(0).max(2).allow('', null),
	  geo: _validator.Joi.object({
	    country: _validator.Joi.object({
	      name: _validator.Joi.string().required(),
	      code: _validator.Joi.string().required()
	    }).required(),
	    province: _validator.Joi.string().required(),
	    city: _validator.Joi.object({
	      name: _validator.Joi.string().required(),
	      id: _validator.Joi.number().integer().min(1).allow('', null)
	    }).required()
	  }).allow(null),
	  signature: _validator.Joi.string().allow('', null),
	  interests: _validator.Joi.array().items(_validator.Joi.string()).allow('', null),
	  address: _validator.Joi.string().allow('', null),
	  mobile: _validator.Joi.object({
	    region: _validator.Joi.string().required(),
	    number: _validator.Joi.string().required(),
	    verifyCode: _validator.Joi.number().integer().min(100000).max(999999).required()
	  }).allow(null),
	  email: _validator.Joi.object({
	    email: _validator.Joi.string().email().required(),
	    verifyCode: _validator.Joi.number().integer().min(100000).max(999999).required()
	  }).allow(null)
	};

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = require("date-utils");

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.City = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _errors = __webpack_require__(10);
	
	var _errors2 = _interopRequireDefault(_errors);
	
	var _validator = __webpack_require__(14);
	
	var _user = __webpack_require__(9);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var ERRORS = {
	  SaveCityFailed: 400
	};
	
	_errors2.default.register(ERRORS);
	
	var City = exports.City = function () {
	  function City() {
	    _classCallCheck(this, City);
	  }
	
	  _createClass(City, null, [{
	    key: 'getCityCode',
	    value: function () {
	      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(geo) {
	        var country, province, city, query, params, result, queryNew, resultNew;
	        return regeneratorRuntime.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                if (geo) {
	                  _context.next = 2;
	                  break;
	                }
	
	                return _context.abrupt('return', null);
	
	              case 2:
	                country = geo.country, province = geo.province, city = geo.city;
	                query = '\n      SELECT id\n      FROM "user".city\n      WHERE\n        country_code ILIKE $1\n        AND country ILIKE $2\n        AND province ILIKE $3\n        AND city ILIKE $4\n      ;';
	                /* eslint-disable no-undef */
	
	                params = [country.code, country.name, province, city.name];
	                _context.next = 7;
	                return db.query(query, params);
	
	              case 7:
	                result = _context.sent;
	
	                if (!(result.rowCount > 0)) {
	                  _context.next = 11;
	                  break;
	                }
	
	                /* eslint-disable no-param-reassign */
	                geo.city.id = result.rows[0].id;
	                return _context.abrupt('return', geo);
	
	              case 11:
	                queryNew = '\n      INSERT INTO "user".city (country_code, country, province, city)\n      SELECT $1::varchar, $2::varchar, $3::varchar, $4::varchar\n      WHERE NOT EXISTS (\n        SELECT id\n        FROM "user".city\n        WHERE\n          country_code ILIKE $1\n          AND country ILIKE $2\n          AND province ILIKE $3\n          AND city ILIKE $4\n      ) RETURNING id\n      ;';
	                _context.next = 14;
	                return db.query(queryNew, params);
	
	              case 14:
	                resultNew = _context.sent;
	
	                if (!(resultNew.rowCount <= 0)) {
	                  _context.next = 17;
	                  break;
	                }
	
	                throw new _errors2.default.SaveCityFailedError();
	
	              case 17:
	                geo.city.id = resultNew.rows[0].id;
	                return _context.abrupt('return', geo);
	
	              case 19:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, this);
	      }));
	
	      function getCityCode(_x) {
	        return _ref.apply(this, arguments);
	      }
	
	      return getCityCode;
	    }()
	  }]);
	
	  return City;
	}();
	
	City.SCHEMA = {
	  /* eslint-disable newline-per-chained-call */
	  country: _validator.Joi.string().required().invalid('UNKNOWN'),
	  userId: _validator.Joi.number().integer().min(1000000000).required()
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var query = function () {
	  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
	    var args,
	        connection,
	        database,
	        client,
	        _args = arguments;
	    return regeneratorRuntime.wrap(function _callee$(_context) {
	      while (1) {
	        switch (_context.prev = _context.next) {
	          case 0:
	            args = slice.call(_args);
	            connection = null;
	            database = args[0];
	
	            if (!_connections2.default.postgres.hasOwnProperty(database)) {
	              _context.next = 10;
	              break;
	            }
	
	            connection = _connections2.default.postgres[database];
	
	            if (connection) {
	              _context.next = 7;
	              break;
	            }
	
	            throw new Error('Connection[' + database + '] isn\'t existed');
	
	          case 7:
	            args = slice.call(_args, 1);
	            _context.next = 13;
	            break;
	
	          case 10:
	            connection = _connections2.default.postgres.default;
	
	            if (connection) {
	              _context.next = 13;
	              break;
	            }
	
	            throw new Error('Connection.default does not existed');
	
	          case 13:
	            client = null;
	            _context.prev = 14;
	
	            client = _pgThen2.default.Client(connection);
	            _context.next = 18;
	            return client.query.apply(client, args);
	
	          case 18:
	            return _context.abrupt('return', _context.sent);
	
	          case 21:
	            _context.prev = 21;
	            _context.t0 = _context['catch'](14);
	            throw _context.t0;
	
	          case 24:
	            _context.prev = 24;
	
	            if (client) client.end();
	            return _context.finish(24);
	
	          case 27:
	          case 'end':
	            return _context.stop();
	        }
	      }
	    }, _callee, this, [[14, 21, 24, 27]]);
	  }));
	
	  return function query() {
	    return _ref.apply(this, arguments);
	  };
	}();
	
	var transaction = function () {
	  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(database, actions) {
	    var connection, client, result;
	    return regeneratorRuntime.wrap(function _callee2$(_context2) {
	      while (1) {
	        switch (_context2.prev = _context2.next) {
	          case 0:
	            connection = null;
	
	            if (typeof database === 'function') {
	              actions = database;
	              connection = _connections2.default.postgres.default;
	            } else {
	              connection = _connections2.default.postgres[database];
	            }
	            client = null;
	            _context2.prev = 3;
	
	            client = _pgThen2.default.Client(connection);
	            _context2.next = 7;
	            return client.query('BEGIN');
	
	          case 7:
	            _context2.next = 9;
	            return actions(client);
	
	          case 9:
	            result = _context2.sent;
	            _context2.next = 12;
	            return client.query('COMMIT');
	
	          case 12:
	            return _context2.abrupt('return', result);
	
	          case 15:
	            _context2.prev = 15;
	            _context2.t0 = _context2['catch'](3);
	            _context2.next = 19;
	            return client.query('ROLLBACK');
	
	          case 19:
	            throw _context2.t0;
	
	          case 20:
	            _context2.prev = 20;
	
	            if (client) client.end();
	            return _context2.finish(20);
	
	          case 23:
	          case 'end':
	            return _context2.stop();
	        }
	      }
	    }, _callee2, this, [[3, 15, 20, 23]]);
	  }));
	
	  return function transaction(_x, _x2) {
	    return _ref2.apply(this, arguments);
	  };
	}();
	
	var _pgThen = __webpack_require__(20);
	
	var _pgThen2 = _interopRequireDefault(_pgThen);
	
	var _connections = __webpack_require__(21);
	
	var _connections2 = _interopRequireDefault(_connections);
	
	var _manager = __webpack_require__(22);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
	
	var slice = [].slice;
	
	// configure pg
	_pgThen2.default.pg.defaults.parseInt8 = true;
	
	function configure(options) {
	  _connections2.default.configure(options);
	  return new _manager.DbManager({ connections: _connections2.default });
	}
	
	exports.default = { configure: configure, query: query, transaction: transaction };

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = require("pg-then");

/***/ },
/* 21 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var connections = {
	  postgres: {},
	  redis: {}
	};
	
	function init(type, name, options) {
	  if (name === 'default') {
	    throw new Error('databse name "default" is reserved.');
	  }
	  var arr = [type === 'postgres' ? 'postgresql' : type, '://'];
	  var credentials = options.credentials;
	  if (credentials) {
	    if (credentials.username) {
	      arr.push(options.credentials.username);
	    } else if (type === 'postgres') {
	      throw new Error('Missing username in postgres credentials');
	    }
	    if (credentials.password) {
	      arr.push(':');
	      arr.push(options.credentials.password);
	    }
	    arr.push('@');
	  }
	  arr.push(options.host);
	  if (options.port) {
	    arr.push(':');
	    arr.push(options.port);
	  }
	  var server = arr.join('');
	  arr.push('/');
	  arr.push(options.db);
	  var connection = {
	    server: server,
	    db: options.db,
	    database: options.db,
	    string: arr.join(''),
	    host: options.host,
	    port: options.port,
	    options: options.options,
	    default: options.default
	  };
	  if (credentials) {
	    if (credentials.username) {
	      connection.user = credentials.username;
	    }
	    if (credentials.password) {
	      connection.password = credentials.password;
	    }
	  }
	  connections[type][name] = connection;
	  if (connection.default) {
	    connections[type].default = connection;
	  }
	}
	
	function configure(config) {
	  for (var type in config) {
	    var typedConfig = config[type];
	    for (var name in typedConfig) {
	      var options = typedConfig[name];
	      options.default = options.default || Object.keys(typedConfig).length === 1;
	      init(type, name, options);
	    }
	  }
	}
	
	exports.default = {
	  configure: configure,
	  postgres: connections.postgres,
	  redis: connections.redis
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.DbManager = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _fs = __webpack_require__(23);
	
	var _fs2 = _interopRequireDefault(_fs);
	
	var _path = __webpack_require__(24);
	
	var _path2 = _interopRequireDefault(_path);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var DbManager = exports.DbManager = function () {
	  function DbManager(data) {
	    _classCallCheck(this, DbManager);
	
	    this.connections = data.connections;
	    this.version = data.version;
	  }
	
	  _createClass(DbManager, [{
	    key: 'dropDbIfExists',
	    value: function () {
	      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
	        var dbname, queryTerminate, queryDrop;
	        return regeneratorRuntime.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                dbname = this.connections.postgres.default.db;
	                queryTerminate = '\n      SELECT pg_terminate_backend(pg_stat_activity.pid)\n      FROM pg_stat_activity\n      WHERE pg_stat_activity.datname = $1\n      ;';
	                /* eslint-disable no-undef */
	
	                _context.next = 4;
	                return db.query('postgres', queryTerminate, [dbname]);
	
	              case 4:
	                queryDrop = 'DROP DATABASE IF EXISTS "' + dbname + '";';
	                _context.next = 7;
	                return db.query('postgres', queryDrop);
	
	              case 7:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, this);
	      }));
	
	      function dropDbIfExists() {
	        return _ref.apply(this, arguments);
	      }
	
	      return dropDbIfExists;
	    }()
	  }, {
	    key: 'createDbIfNotExists',
	    value: function () {
	      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
	        var dbname, queryCheck, result, queryCreate;
	        return regeneratorRuntime.wrap(function _callee2$(_context2) {
	          while (1) {
	            switch (_context2.prev = _context2.next) {
	              case 0:
	                if (this.connections.postgres.postgres) {
	                  _context2.next = 2;
	                  break;
	                }
	
	                return _context2.abrupt('return');
	
	              case 2:
	                // Can't create database
	                dbname = this.connections.postgres.default.db;
	                queryCheck = '\n      SELECT 1 AS exists\n      FROM pg_database\n      WHERE datname = $1\n      ';
	                _context2.next = 6;
	                return db.query('postgres', queryCheck, [dbname]);
	
	              case 6:
	                result = _context2.sent;
	
	                if (!(result.rowCount === 0)) {
	                  _context2.next = 11;
	                  break;
	                }
	
	                queryCreate = 'CREATE DATABASE "' + dbname + '"';
	                _context2.next = 11;
	                return db.query('postgres', queryCreate);
	
	              case 11:
	              case 'end':
	                return _context2.stop();
	            }
	          }
	        }, _callee2, this);
	      }));
	
	      function createDbIfNotExists() {
	        return _ref2.apply(this, arguments);
	      }
	
	      return createDbIfNotExists;
	    }()
	  }, {
	    key: 'getCurrentVersion',
	    value: function () {
	      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
	        var queryCheck, resultCheck, queryGetVersion, resultVersion, currentVer;
	        return regeneratorRuntime.wrap(function _callee3$(_context3) {
	          while (1) {
	            switch (_context3.prev = _context3.next) {
	              case 0:
	                queryCheck = '\n      SELECT 1 AS exists FROM pg_class WHERE relname = \'version\';\n    ';
	                _context3.next = 3;
	                return db.query(queryCheck);
	
	              case 3:
	                resultCheck = _context3.sent;
	
	                if (!(resultCheck.rowCount === 0)) {
	                  _context3.next = 6;
	                  break;
	                }
	
	                return _context3.abrupt('return', -1);
	
	              case 6:
	                queryGetVersion = 'SELECT ver FROM version ORDER BY ver DESC LIMIT 1;';
	                _context3.next = 9;
	                return db.query(queryGetVersion);
	
	              case 9:
	                resultVersion = _context3.sent;
	
	                if (!(resultVersion.rowCount === 0)) {
	                  _context3.next = 12;
	                  break;
	                }
	
	                return _context3.abrupt('return', -1);
	
	              case 12:
	                currentVer = resultVersion.rows[0].ver;
	
	                this.version = currentVer;
	                return _context3.abrupt('return', currentVer);
	
	              case 15:
	              case 'end':
	                return _context3.stop();
	            }
	          }
	        }, _callee3, this);
	      }));
	
	      function getCurrentVersion() {
	        return _ref3.apply(this, arguments);
	      }
	
	      return getCurrentVersion;
	    }()
	  }, {
	    key: 'getPatchFolders',
	    value: function () {
	      var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
	        var patchMainPath, currentVer, clusters, patchFolders, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, c, folders, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, f, ver;
	
	        return regeneratorRuntime.wrap(function _callee4$(_context4) {
	          while (1) {
	            switch (_context4.prev = _context4.next) {
	              case 0:
	                patchMainPath = _path2.default.join(__dirname, 'patches');
	                _context4.next = 3;
	                return this.getCurrentVersion();
	
	              case 3:
	                currentVer = _context4.sent;
	                clusters = _fs2.default.readdirSync(patchMainPath);
	                patchFolders = [];
	                _iteratorNormalCompletion = true;
	                _didIteratorError = false;
	                _iteratorError = undefined;
	                _context4.prev = 9;
	                _iterator = clusters[Symbol.iterator]();
	
	              case 11:
	                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
	                  _context4.next = 47;
	                  break;
	                }
	
	                c = _step.value;
	
	                if (!(c.charAt(0) === '.')) {
	                  _context4.next = 15;
	                  break;
	                }
	
	                return _context4.abrupt('continue', 44);
	
	              case 15:
	                folders = _fs2.default.readdirSync(_path2.default.join(patchMainPath, c));
	                _iteratorNormalCompletion2 = true;
	                _didIteratorError2 = false;
	                _iteratorError2 = undefined;
	                _context4.prev = 19;
	                _iterator2 = folders[Symbol.iterator]();
	
	              case 21:
	                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
	                  _context4.next = 30;
	                  break;
	                }
	
	                f = _step2.value;
	
	                if (!(f.charAt(0) === '.')) {
	                  _context4.next = 25;
	                  break;
	                }
	
	                return _context4.abrupt('continue', 27);
	
	              case 25:
	                ver = Number.parseFloat(f);
	
	                if (ver > currentVer) {
	                  patchFolders.push([ver, _path2.default.join(patchMainPath, c, f)]);
	                }
	
	              case 27:
	                _iteratorNormalCompletion2 = true;
	                _context4.next = 21;
	                break;
	
	              case 30:
	                _context4.next = 36;
	                break;
	
	              case 32:
	                _context4.prev = 32;
	                _context4.t0 = _context4['catch'](19);
	                _didIteratorError2 = true;
	                _iteratorError2 = _context4.t0;
	
	              case 36:
	                _context4.prev = 36;
	                _context4.prev = 37;
	
	                if (!_iteratorNormalCompletion2 && _iterator2.return) {
	                  _iterator2.return();
	                }
	
	              case 39:
	                _context4.prev = 39;
	
	                if (!_didIteratorError2) {
	                  _context4.next = 42;
	                  break;
	                }
	
	                throw _iteratorError2;
	
	              case 42:
	                return _context4.finish(39);
	
	              case 43:
	                return _context4.finish(36);
	
	              case 44:
	                _iteratorNormalCompletion = true;
	                _context4.next = 11;
	                break;
	
	              case 47:
	                _context4.next = 53;
	                break;
	
	              case 49:
	                _context4.prev = 49;
	                _context4.t1 = _context4['catch'](9);
	                _didIteratorError = true;
	                _iteratorError = _context4.t1;
	
	              case 53:
	                _context4.prev = 53;
	                _context4.prev = 54;
	
	                if (!_iteratorNormalCompletion && _iterator.return) {
	                  _iterator.return();
	                }
	
	              case 56:
	                _context4.prev = 56;
	
	                if (!_didIteratorError) {
	                  _context4.next = 59;
	                  break;
	                }
	
	                throw _iteratorError;
	
	              case 59:
	                return _context4.finish(56);
	
	              case 60:
	                return _context4.finish(53);
	
	              case 61:
	                patchFolders.sort(function (a, b) {
	                  return a[0] - b[0];
	                });
	                return _context4.abrupt('return', patchFolders);
	
	              case 63:
	              case 'end':
	                return _context4.stop();
	            }
	          }
	        }, _callee4, this, [[9, 49, 53, 61], [19, 32, 36, 44], [37,, 39, 43], [54,, 56, 60]]);
	      }));
	
	      function getPatchFolders() {
	        return _ref4.apply(this, arguments);
	      }
	
	      return getPatchFolders;
	    }()
	  }, {
	    key: 'updateVersion',
	    value: function () {
	      var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(client, patchVer) {
	        var currentVer, query;
	        return regeneratorRuntime.wrap(function _callee5$(_context5) {
	          while (1) {
	            switch (_context5.prev = _context5.next) {
	              case 0:
	                _context5.next = 2;
	                return this.getCurrentVersion();
	
	              case 2:
	                currentVer = _context5.sent;
	
	                if (!(patchVer <= currentVer)) {
	                  _context5.next = 5;
	                  break;
	                }
	
	                return _context5.abrupt('return');
	
	              case 5:
	                query = 'INSERT INTO version (ver) VALUES ($1);';
	                _context5.next = 8;
	                return client.query(query, [patchVer]);
	
	              case 8:
	                this.version = patchVer;
	
	              case 9:
	              case 'end':
	                return _context5.stop();
	            }
	          }
	        }, _callee5, this);
	      }));
	
	      function updateVersion(_x, _x2) {
	        return _ref5.apply(this, arguments);
	      }
	
	      return updateVersion;
	    }()
	  }, {
	    key: 'update',
	    value: function () {
	      var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7() {
	        var _this = this;
	
	        var patchFolders;
	        return regeneratorRuntime.wrap(function _callee7$(_context7) {
	          while (1) {
	            switch (_context7.prev = _context7.next) {
	              case 0:
	                _context7.next = 2;
	                return this.createDbIfNotExists();
	
	              case 2:
	                _context7.next = 4;
	                return this.getPatchFolders();
	
	              case 4:
	                patchFolders = _context7.sent;
	                _context7.next = 7;
	                return db.transaction(function () {
	                  var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(client) {
	                    var _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, patchFolder, patchVer, patchPath, ver, files, updatorPath, updator, query;
	
	                    return regeneratorRuntime.wrap(function _callee6$(_context6) {
	                      while (1) {
	                        switch (_context6.prev = _context6.next) {
	                          case 0:
	                            _iteratorNormalCompletion3 = true;
	                            _didIteratorError3 = false;
	                            _iteratorError3 = undefined;
	                            _context6.prev = 3;
	                            _iterator3 = patchFolders[Symbol.iterator]();
	
	                          case 5:
	                            if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
	                              _context6.next = 34;
	                              break;
	                            }
	
	                            patchFolder = _step3.value;
	                            patchVer = patchFolder[0];
	                            patchPath = patchFolder[1];
	                            _context6.next = 11;
	                            return _this.getCurrentVersion();
	
	                          case 11:
	                            ver = _context6.sent;
	
	                            if (!(patchVer <= ver)) {
	                              _context6.next = 14;
	                              break;
	                            }
	
	                            return _context6.abrupt('continue', 31);
	
	                          case 14:
	                            files = _fs2.default.readdirSync(patchPath);
	
	                            if (!files.includes('update.js')) {
	                              _context6.next = 22;
	                              break;
	                            }
	
	                            updatorPath = '.' + _path2.default.join(patchPath, 'update.js').slice(__dirname.length);
	                            updator = __webpack_require__(25)(updatorPath);
	                            _context6.next = 20;
	                            return updator.putPatch(client);
	
	                          case 20:
	                            _context6.next = 29;
	                            break;
	
	                          case 22:
	                            if (!files.includes('query.sql')) {
	                              _context6.next = 28;
	                              break;
	                            }
	
	                            query = _fs2.default.readFileSync(_path2.default.join(patchPath, 'query.sql'), 'utf8');
	                            _context6.next = 26;
	                            return client.query(query);
	
	                          case 26:
	                            _context6.next = 29;
	                            break;
	
	                          case 28:
	                            return _context6.abrupt('continue', 31);
	
	                          case 29:
	                            _context6.next = 31;
	                            return _this.updateVersion(client, patchVer);
	
	                          case 31:
	                            _iteratorNormalCompletion3 = true;
	                            _context6.next = 5;
	                            break;
	
	                          case 34:
	                            _context6.next = 40;
	                            break;
	
	                          case 36:
	                            _context6.prev = 36;
	                            _context6.t0 = _context6['catch'](3);
	                            _didIteratorError3 = true;
	                            _iteratorError3 = _context6.t0;
	
	                          case 40:
	                            _context6.prev = 40;
	                            _context6.prev = 41;
	
	                            if (!_iteratorNormalCompletion3 && _iterator3.return) {
	                              _iterator3.return();
	                            }
	
	                          case 43:
	                            _context6.prev = 43;
	
	                            if (!_didIteratorError3) {
	                              _context6.next = 46;
	                              break;
	                            }
	
	                            throw _iteratorError3;
	
	                          case 46:
	                            return _context6.finish(43);
	
	                          case 47:
	                            return _context6.finish(40);
	
	                          case 48:
	                          case 'end':
	                            return _context6.stop();
	                        }
	                      }
	                    }, _callee6, _this, [[3, 36, 40, 48], [41,, 43, 47]]);
	                  }));
	
	                  return function (_x3) {
	                    return _ref7.apply(this, arguments);
	                  };
	                }());
	
	              case 7:
	              case 'end':
	                return _context7.stop();
	            }
	          }
	        }, _callee7, this);
	      }));
	
	      function update() {
	        return _ref6.apply(this, arguments);
	      }
	
	      return update;
	    }()
	  }, {
	    key: 'rebuild',
	    value: function () {
	      var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee8() {
	        return regeneratorRuntime.wrap(function _callee8$(_context8) {
	          while (1) {
	            switch (_context8.prev = _context8.next) {
	              case 0:
	                _context8.next = 2;
	                return this.dropDbIfExists();
	
	              case 2:
	                _context8.next = 4;
	                return this.update();
	
	              case 4:
	              case 'end':
	                return _context8.stop();
	            }
	          }
	        }, _callee8, this);
	      }));

	      function rebuild() {
	        return _ref8.apply(this, arguments);
	      }

	      return rebuild;
	    }()
	  }]);

	  return DbManager;
	}();

/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 24 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./connections": 21,
		"./connections.js": 21,
		"./index": 19,
		"./index.js": 19,
		"./manager": 22,
		"./manager.js": 22,
		"./patches/000-049/00/query.sql": 26,
		"./patches/000-049/01/query.sql": 27,
		"./patches/000-049/02/query.sql": 28
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 25;


/***/ },
/* 26 */
/***/ function(module, exports) {

	module.exports = require("./patches/000-049/00/query.sql");

/***/ },
/* 27 */
/***/ function(module, exports) {

	module.exports = require("./patches/000-049/01/query.sql");

/***/ },
/* 28 */
/***/ function(module, exports) {

	module.exports = require("./patches/000-049/02/query.sql");

/***/ }
/******/ ]);
//# sourceMappingURL=models.js.map