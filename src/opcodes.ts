/**
 * Created by kate on 9/25/14.
 */

import utils = require('./utils');

// TODO finish these
export enum Opcode {
    STOP_CODE = 0x00,
    POP_TOP = 0x01,
    ROT_TWO = 0x02,
    UNARY_POSITIVE = 0x0A,

    STORE_SLICE = 0x28,

    STORE_SUBSCR = 0x3C,
    BINARY_LSHIFT = 0x3E,

    BINARY_AND = 0x40,
    INPLACE_XOR = 0x4E,

    RETURN_VALUE = 0x53,
    STORE_NAME = 0x5A,

    STORE_GLOBAL = 0x61,
    DUP_TOPX = 0x63,
    LOAD_CONST = 0x64,
    LOAD_NAME = 0x65,
    LOAD_ATTR = 0x69,
    IMPORT_FROM = 0x6C,
    JUMP_IF_FALSE = 0x6F,

    JUMP_IF_TRUE = 0x70,
    LOAD_GLOBAL = 0x74,

    SETUP_EXCEPT = 0x79,

    MAKE_FUNCTION = 0x84
}

//TODO is there a typechar for a plain old Set?
export var type_map = {
    NULL: "O",
    NONE: "N",
    FALSE: "F",
    TRUE: "T",
    STOPITER: "S",
    ELLIPSIS: ".",
    INT: "i",
    INT64: "I",
    FLOAT: "f",
    BINARY_FLOAT: "g",
    COMPLEX: "x",
    BINARY_COMPLEX: "y",
    LONG: "l",
    STRING: "s",
    INTERNED: "t",
    STRINGREF: "R",
    UNICODE: "u",
    TUPLE: "(",
    LIST: "[",
    DICT: "{",
    FROZENSET: ">",
    CODE: "c"
};