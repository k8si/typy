/**
 * Created by kate on 9/25/14.
 */

import utils = require('./utils');

export class Code {
    public code: number; public args: string;
    constructor(code: number, args?: string){this.code=code; this.args=args;}
    public toString(): string {
        var info = this.code.toString(16);
        if (this.args) info += " " + this.args;
        return info
    }
}

//TODO finish these
//from https://github.com/daeken/RMarshal/blob/master/lib/rmarshal/opcodes.rb
export var OpsWithArgs = {
    STORE_NAME: new Code(0x5A, "names"),
    DELETE_NAME: new Code(0x5B, "names"),
    FOR_ITER: new Code(0x5D, "jrel"),
    STORE_ATTR: new Code(0x5F, "names"),
    DELETE_ATTR: new Code(0x60, "names"),
    STORE_GLOBAL: new Code(0x61, "names"),
    DELETE_GLOBAL: new Code(0x52, "names"),
    LOAD_CONST: new Code(0x64, "const"),
    LOAD_NAME: new Code(0x65, "names"),
    LOAD_ATTR: new Code(0x69, "names"),
    COMPARE_OP: new Code(0x6A, "compare"),
    IMPORT_NAME: new Code(0x6B, "names"),
    IMPORT_FROM: new Code(0x6C, "names"), //TODO seems to be broken

    JUMP_FORWARD: new Code(0x6E, "jrel"),
    JUMP_IF_FALSE: new Code(0x6F, "jrel"),
    JUMP_IF_TRUE: new Code(0x70, "jrel"),
    JUMP_ABSOLUTE: new Code(0x71, "jabs"),

    LOAD_GLOBAL: new Code(0x74, "names"),
    CONTINUE_LOOP: new Code(0x77, "jabs"),
    SETUP_LOOP: new Code(0x78, "jrel"),
    SETUP_EXCEPT: new Code(0x79, "jrel"),
    SETUP_FINALLY: new Code(0x7A, "jrel"),

    LOAD_FAST: new Code(0x7C, "local"),
    STORE_FAST: new Code(0x7D, "local"),
    DELETE_FAST: new Code(0x7E, "local"),

    LOAD_CLOSURE: new Code(0x87, "free"),
    LOAD_DEREF: new Code(0x88, "free"),
    STORE_DEREF: new Code(0x89, "free")
};



// TODO finish these
// from https://github.com/daeken/RMarshal/blob/master/lib/rmarshal/opcodes.rb
export enum Opcode {
    STOP_CODE = 0x00,
    POP_TOP = 0x01,
    ROT_TWO = 0x02,
    ROT_THREE = 0x03, //0x03 => [:ROT_THREE, nil],
    DUP_TOP = 0x04,    //	0x04 => [:DUP_TOP, nil],
    UNARY_POSITIVE = 0x0A,

    BINARY_ADD = 0x17,
    BINARY_DIVIDE = 0x15, //	0x15 => [:BINARY_DIVIDE, nil],
    BINARY_SUBSCR = 0x19, //	0x19 => [:BINARY_SUBSCR, nil],
    INPLACE_FLOOR_DIVIDE = 0x1C, //0x1C => [:INPLACE_FLOOR_DIVIDE, nil],

    STORE_SLICE = 0x28,

    STORE_MAP = 0x36,    //	0x36 => [:STORE_MAP, nil],
    INPLACE_ADD = 0x37, //0x37 => [:INPLACE_ADD, nil],
    STORE_SUBSCR = 0x3C,
    BINARY_LSHIFT = 0x3E,

    BINARY_AND = 0x40,
    GET_ITER = 0x44,
    PRINT_ITEM = 0x47, //	0x47 => [:PRINT_ITEM, nil],
    PRINT_NEWLINE = 0x48,
    INPLACE_XOR = 0x4E,

    RETURN_VALUE = 0x53,
    POP_BLOCK = 0x57, //and drop it	0x57 => [:POP_BLOCK, nil],
    STORE_NAME = 0x5A,

    STORE_GLOBAL = 0x61,
    DUP_TOPX = 0x63,

    /* 	0x64 : ['LOAD_CONST', 2, 'Pushes "co_consts[/consti/]" onto the stack.'], */
    LOAD_CONST = 0x64, //	0x64 => [:LOAD_CONST, :const],

    LOAD_NAME = 0x65,

    /*0x66 : ['BUILD_TUPLE', 2, 'Creates a tuple consuming /count/ items from the stack, and pushes the resulting
     tuple onto the stack.'], */
    BUILD_TUPLE = 0x66,

    /* 0x67 : ['BUILD_LIST', 2, 'Works as BUILD_TUPLE(/count/), but creates a list.'], */
    BUILD_LIST = 0x67, //	0x67 => [:BUILD_LIST, nil],

    /* 	0x69 : ['LOAD_ATTR', 2, 'Replaces TOS with getattr(TOS, co_names[/namei/]).'], */
    LOAD_ATTR = 0x69, //	0x69 => [:LOAD_ATTR, :name],

    COMPARE_OP = 0x6A, //[:COMPARE_OP, :compare]
    IMPORT_NAME = 0x6B, //	0x6B => [:IMPORT_NAME, :name],
    IMPORT_FROM = 0x6C,
    JUMP_FORWARD = 0x6E, //	0x6E => [:JUMP_FORWARD, :jrel],
    JUMP_IF_FALSE = 0x6F,

    JUMP_IF_TRUE = 0x70,
    JUMP_ABSOLUTE = 0x71, //0x71 => [:JUMP_ABSOLUTE, :jabs],
    LOAD_GLOBAL = 0x74,
    SETUP_LOOP = 0x78,    //0x78 => [:SETUP_LOOP, :jrel],
    SETUP_EXCEPT = 0x79,
    LOAD_FAST = 0x7C, //[:LOAD_FAST, :local] --> LOAD_FAST [varnames[idx]] ?
    STORE_FAST = 0x7D, //[:STORE_FAST, :local]

    //	0x83 : ['CALL_FUNCTION', 2, 'Calls a function. The low byte of /argc/ indicates the number of positional
    // parameters, the high byte the number of keyword parameters. On the stack, the opcode finds the keyword parameters
    // first. For each keyword argument, the value is on top of the key. Below the keyword parameters, the positional
    // parameters are on the stack, with the right-most parameter on top. Below the parameters, the function object to
    // call is on the stack. '],
    CALL_FUNCTION = 0x83,
    MAKE_FUNCTION = 0x84
}

//TODO what about regular Sets (not Frozensets)?
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
    TUPLE = 40, // '('
    LIST = 91,
    DICT = 123,
    FROZENSET = 62,
    CODE = 99 // 'c'
};