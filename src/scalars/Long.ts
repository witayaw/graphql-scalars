import { GraphQLScalarType } from 'graphql';
import { GraphQLBigIntConfig } from './BigInt';

export const GraphQLLongConfig = /*#__PURE__*/ Object.assign(
  {},
  GraphQLBigIntConfig,
  {
    name: 'Long',
  },
);

export const GraphQLLong = /*#__PURE__*/ new GraphQLScalarType(
  GraphQLLongConfig,
);
