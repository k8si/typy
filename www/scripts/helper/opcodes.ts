/**
 * Created by kate on 9/25/14.
 */

import utils = require('./utils');

//TODO finish filling in these lists

/** arg = index in name list (codeobject.names) **/
export var hasArgInNames = [
    Opcode.STORE_NAME,
    Opcode.DELETE_NAME,
    Opcode.STORE_ATTR,
    Opcode.DELETE_ATTR,
    Opcode.STORE_GLOBAL,
    Opcode.DELETE_GLOBAL,
    Opcode.LOAD_NAME,
    Opcode.LOAD_ATTR,
    Opcode.IMPORT_NAME,
    Opcode.IMPORT_FROM

];

/** arg = index in consts list (codeobject.consts) **/
export var hasArgInConsts = [
    Opcode.LOAD_CONST
];

/** arg = local variable number **/
export var hasArgInLocals = [
    Opcode.LOAD_FAST,
    Opcode.STORE_FAST,
    Opcode.DELETE_FAST
];

/** arg = target byte offset from beginning of code **/
export var hasJabs = [
    Opcode.JUMP_IF_FALSE_OR_POP,
    Opcode.JUMP_IF_TRUE_OR_POP,
    Opcode.JUMP_ABSOLUTE,
    Opcode.POP_JUMP_IF_FALSE,
    Opcode.POP_JUMP_IF_TRUE
];

export var hasJrel = [
    Opcode.JUMP_FORWARD,
    Opcode.FOR_ITER,
    Opcode.SETUP_LOOP
];

/** arg = int corresponding to comparison operator (see interpet.ts COMPARE_OP) **/
export var hasCompare = [Opcode.COMPARE_OP];

export var hasFree = [
    Opcode.MAKE_CLOSURE
];

/* OTHER:
 arg = number of sequence items:
 UNPACK_SEQUENCE
 FOR_ITER
 LIST_APPEND

 arg = number of items to duplicate:
 DUP_TOPX

 arg = number of tuple tiems
 BUILD_TUPLE

 arg = number of list items
 BUILD_LIST

 arg = number of set items
 BUILD_SET

 arg = "always zero for now"
 BUILD_MAP


 */

export var HAVE_ARGUMENT = 90; //any opcode >= 90 has an argument


//list taken from CPython: https://hg.python.org/cpython/file/7ba47bbfe38d/Include/opcode.h
export enum Opcode {
    STOP_CODE = 0,
    POP_TOP = 1,
    ROT_TWO = 2,
    ROT_THREE = 3,
    DUP_TOP = 4,
    ROT_FOUR = 5,
    NOP = 9,
    UNARY_POSITIVE = 10,
    UNARY_NEGATIVE = 11,
    UNARY_NOT = 12,
    UNARY_CONVERT = 13,
    UNARY_INVERT = 15,
    BINARY_POWER = 19,
    BINARY_MULTIPLY = 20,
    BINARY_DIVIDE = 21,
    BINARY_MODULO = 22,
    BINARY_ADD = 23,
    BINARY_SUBTRACT = 24,
    BINARY_SUBSCR = 25,
    BINARY_FLOOR_DIVIDE = 26,
    BINARY_TRUE_DIVIDE = 27,
    INPLACE_FLOOR_DIVIDE = 28,
    INPLACE_TRUE_DIVIDE = 29,
    SLICE = 30,
    STORE_SLICE = 40,
    DELETE_SLICE = 50,
    STORE_MAP = 54,
    INPLACE_ADD = 55,
    INPLACE_SUBTRACT = 56,
    INPLACE_MULTIPLY = 57,
    INPLACE_DIVIDE = 58,
    INPLACE_MODULO = 59,
    STORE_SUBSCR = 60,
    DELETE_SUBSCR = 61,
    BINARY_LSHIFT = 62,
    BINARY_RSHIFT = 63,
    BINARY_AND = 64,
    BINARY_XOR = 65,
    BINARY_OR = 66,
    INPLACE_POWER = 67,
    GET_ITER = 68,
    PRINT_EXPR = 70,
    PRINT_ITEM = 71,
    PRINT_NEWLINE = 72,
    PRINT_ITEM_TO = 73,
    PRINT_NEWLINE_TO = 74,
    INPLACE_LSHIFT = 75,
    INPLACE_RSHIFT = 76,
    INPLACE_AND = 77,
    INPLACE_XOR = 78,
    INPLACE_OR = 79,
    BREAK_LOOP = 80,
    WITH_CLEANUP = 81,
    LOAD_LOCALS = 82,
    RETURN_VALUE = 83,
    IMPORT_STAR = 84,
    EXEC_STMT = 85,
    YIELD_VALUE = 86,
    POP_BLOCK = 87,
    END_FINALLY = 88,
    BUILD_CLASS = 89,

    //opcodes from here have an argument
    STORE_NAME = 90,
    DELETE_NAME = 91,
    UNPACK_SEQUENCE = 92,
    FOR_ITER = 93,
    LIST_APPEND = 94,
    STORE_ATTR = 95,
    DELETE_ATTR = 96,
    STORE_GLOBAL = 97,
    DELETE_GLOBAL = 98,
    DUP_TOPX = 99,
    LOAD_CONST = 100,
    LOAD_NAME = 101,
    BUILD_TUPLE = 102,
    BUILD_LIST = 103,
    BUILD_SET = 104,
    BUILD_MAP = 105,
    LOAD_ATTR = 106,
    COMPARE_OP = 107,
    IMPORT_NAME = 108,
    IMPORT_FROM = 109,
    JUMP_FORWARD = 110,
    JUMP_IF_FALSE_OR_POP = 111,
    JUMP_IF_TRUE_OR_POP = 112,
    JUMP_ABSOLUTE = 113,
    POP_JUMP_IF_FALSE = 114,
    POP_JUMP_IF_TRUE = 115,
    LOAD_GLOBAL = 116,
    CONTINUE_LOOP = 119,
    SETUP_LOOP = 120,
    SETUP_EXCEPT = 121,
    SETUP_FINALLY = 122,
    LOAD_FAST = 124,
    STORE_FAST = 125,
    DELETE_FAST = 126,
    RAISE_VARARGS = 130,
    CALL_FUNCTION = 131,
    MAKE_FUNCTION = 132,
    BUILD_SLICE = 133,
    MAKE_CLOSURE = 134,
    LOAD_CLOSURE = 135,
    LOAD_DEREF = 136,
    STORE_DEREF = 137,
    CALL_FUNCTION_VAR = 140,
    CALL_FUNCTION_KW = 141,
    CALL_FUNCTION_VAR_KW = 142,
    SETUP_WITH = 143,
    EXTENDED_ARG = 145,
    SET_ADD = 146,
    MAP_ADD = 147
}

//TODO what about regular Sets (not Frozensets)?
export enum TypeMap {
    NULL = 79,          //'O'
    NONE = 78,         //'N'
    FALSE = 70,        //'F'
    TRUE = 84,         // 'T'
    STOPITER = 83,     // 'S'
    ELLIPSIS = 46,     // '.'
    INT = 105,        //'i'
    INT64 = 73,       // 'I'
    FLOAT = 102, //'f'
    BINARY_FLOAT = 103,   // 'g'
    COMPLEX = 120,  // 'x'
    BINARY_COMPLEX = 121, // 'y'
    LONG = 108,     // 'l'
    STRING = 115,   // 's'
    INTERNED = 116, // 't'
    STRINGREF = 82, // 'R'
    UNICODE = 117,  // 'u'
    TUPLE = 40,     // '('
    LIST = 91,      // '['
    DICT = 123,     // '{'
    SET = 60,       // '<'
    FROZENSET = 62, // '>'
    CODE = 99,      // 'c'
    UNKNOWN = 63    // '?'
};