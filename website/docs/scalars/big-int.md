---
id: big-int
title: BigInt
sidebar_label: BigInt
---

A long integer type for [graphql-js](https://github.com/graphql/graphql-js). [It uses native `BigInt` implementation of JavaScript.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

```
GraphQLError: Argument "num" has invalid value 9007199254740990.
              Expected value of type ""Int"", found 9007199254740990.
```

In order to support `BigInt` in `JSON.parse` and `JSON.stringify`, it is recommended to install this npm package together with this scalar. Otherwise, JavaScript will serialize the value as string.
[json-bigint-patch](https://github.com/ardatan/json-bigint-patch)
