import {
  ASTNode,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
  IntValueNode,
  Kind,
  ObjectValueNode,
  print,
} from 'graphql';

type BufferJson = { type: 'Buffer'; data: number[] };
const base64Validator =
  /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;
const hexValidator = /^([0-9a-fA-F]{2})+$/;

function hexValidate(value: string) {
  const isHex = hexValidator.test(value);
  if (isHex) {
    return global.Buffer.from(value, 'hex');
  }
  return null;
}

function base64Validate(value: string) {
  // console.log('base64Validate');
  const isBase64 = base64Validator.test(value);

  if (isBase64) {
    // console.log('base64 is valid');
    return global.Buffer.from(value, 'base64');
    // return null;
  }
  // console.log('isBase64: ', isBase64);
  return null;
}

function validate(value: Buffer | string | BufferJson) {
  if (typeof value !== 'string' && !(value instanceof global.Buffer)) {
    throw new TypeError(
      `Value is not an instance of Buffer: ${JSON.stringify(value)}`,
    );
  }
  if (typeof value === 'string') {
    const retValue = hexValidate(value) ?? base64Validate(value);
    // console.log('retValue :', retValue);
    if (!retValue) {
      throw new TypeError(
        `Value is not a valid base64 or hex encoded string: ${JSON.stringify(
          value,
        )}`,
      );
    }
    return retValue as Buffer;
  }
  return value;
}

function parseObject(ast: ObjectValueNode) {
  const key = ast.fields[0].value;
  const value = ast.fields[1].value;
  if (
    ast.fields.length === 2 &&
    key.kind === Kind.STRING &&
    key.value === 'Buffer' &&
    value.kind === Kind.LIST
  ) {
    return global.Buffer.from(
      value.values.map((astValue: IntValueNode) => parseInt(astValue.value)),
    );
  }
  throw new TypeError(
    `Value is not a JSON representation of Buffer: ${print(ast)}`,
  );
}

export const GraphQLByteConfig: GraphQLScalarTypeConfig<
  Buffer | string | BufferJson,
  Buffer
> = /*#__PURE__*/ {
  name: 'Byte',
  description: 'The `Byte` scalar type represents byte value as a Buffer',
  serialize: validate,
  parseValue: validate,
  parseLiteral(ast: ASTNode) {
    switch (ast.kind) {
      case Kind.STRING:
        return validate(ast.value);
      case Kind.OBJECT:
        return parseObject(ast);
      default:
        throw new TypeError(
          `Can only parse base64 or hex encoded strings as Byte, but got a: ${ast.kind}`,
        );
    }
  },
  extensions: {
    codegenScalarType: 'Buffer | string',
  },
};

export const GraphQLByte: GraphQLScalarType =
  /*#__PURE__*/ new GraphQLScalarType(GraphQLByteConfig);
