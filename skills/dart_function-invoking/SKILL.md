---
name: various-ways-to-invoke-functions-in-dart
description: "Invoke Dart functions using mixed positional and named argument ordering, the .call operator for function references, and Function.apply for dynamic invocation with symbol-keyed named parameters. Use when exploring Dart function call syntax, implementing dynamic dispatch patterns, or building flexible callback APIs in Dart."
metadata:
  url: https://rodydavis.com/posts/dart/function-invoking
  last_modified: Tue, 03 Feb 2026 20:04:32 GMT
---

# Various Ways to Invoke Functions in Dart

Dart supports flexible function invocation: mixed positional/named argument ordering, the `.call` operator, and dynamic `Function.apply` — each with different trade-offs for readability and performance.

## Setup

All examples use this function signature:

```dart
void myFunction(int a, int b, {int? c, int? d}) {
  print((a, b, c, d));
}
```

## Mixed Positional and Named Arguments

Positional arguments can be interleaved with named arguments in any order:

```dart
myFunction(1, 2, c: 3, d: 4);
myFunction(1, c: 3, d: 4, 2);
myFunction(c: 3, d: 4, 1, 2);
myFunction(c: 3, 1, 2, d: 4);
```

## The `.call` Operator

Use [`.call`](https://dart.dev/language/callable-objects) to invoke a function through a reference:

```dart
myFunction.call(1, 2, c: 3, d: 4);
```

## Dynamic Invocation with `Function.apply`

Use [`Function.apply`](https://api.flutter.dev/flutter/dart-core/Function/apply.html) for dynamic dispatch. Note: this increases JS compilation size and reduces performance in dart2js:

```dart
Function.apply(myFunction, [1, 2], {#c: 3, #d: 4});
```

## Result

All invocation methods produce identical output:

```
(1, 2, 3, 4)
```
