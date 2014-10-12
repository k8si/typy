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

    BINARY_ADD = 0x17,

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
    LOAD_FAST = 0x7C, //[:LOAD_FAST, :local] --> LOAD_FAST [varnames[idx]] ?

    SETUP_EXCEPT = 0x79,

    CALL_FUNCTION = 0x83,
    MAKE_FUNCTION = 0x84
}

export enum TypeMap {
    NULL = 79,
    NONE = 78,
    FALSE = 70,
    TRUE = 84,
    STOPITER = 83,
    ELLIPSIS = 46,
    INT = 105,
    INT64 = 73,
    FLOAT = 102,
    BINARY_FLOAT = 103,
    COMPLEX = 120,
    BINARY_COMPLEX = 121,
    LONG = 108,
    STRING = 115,
    INTERNED = 116,
    STRINGREF = 82,
    UNICODE = 117,
    TUPLE = 40,
    LIST = 91,
    DICT = 123,
    FROZENSET = 62,
    CODE = 99
};


/*
 NULL O 79
 NONE N 78
 FALSE F 70
 TRUE T 84
 STOPITER S 83
 ELLIPSIS . 46
 INT i 105
 INT64 I 73
 FLOAT f 102
 BINARY_FLOAT g 103
 COMPLEX x 120
 BINARY_COMPLEX y 121
 LONG l 108
 STRING s 115
 INTERNED t 116
 STRINGREF R 82
 UNICODE u 117
 TUPLE ( 40
 LIST [ 91
 DICT { 123
 FROZENSET > 62
 CODE c 99
 */

//TODO is there a typechar for a plain old Set?
//TODO this should be an enum instead ( use charcodes )
//export var type_map = {
//    NULL: "O",
//    NONE: "N",
//    FALSE: "F",
//    TRUE: "T",
//    STOPITER: "S",
//    ELLIPSIS: ".",
//    INT: "i",
//    INT64: "I",
//    FLOAT: "f",
//    BINARY_FLOAT: "g",
//    COMPLEX: "x",
//    BINARY_COMPLEX: "y",
//    LONG: "l",
//    STRING: "s",
//    INTERNED: "t",
//    STRINGREF: "R",
//    UNICODE: "u",
//    TUPLE: "(",
//    LIST: "[",
//    DICT: "{",
//    FROZENSET: ">",
//    CODE: "c"
//};