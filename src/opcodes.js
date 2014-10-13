/**
* Created by kate on 9/25/14.
*/
var Code = (function () {
    function Code(code, args) {
        this.code = code;
        this.args = args;
    }
    Code.prototype.toString = function () {
        var info = this.code.toString(16);
        if (this.args)
            info += " " + this.args;
        return info;
    };
    return Code;
})();
exports.Code = Code;

exports.OpsWithArgs = {
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
    IMPORT_FROM: new Code(0x6C, "names"),
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
(function (Opcode) {
    Opcode[Opcode["STOP_CODE"] = 0x00] = "STOP_CODE";
    Opcode[Opcode["POP_TOP"] = 0x01] = "POP_TOP";
    Opcode[Opcode["ROT_TWO"] = 0x02] = "ROT_TWO";
    Opcode[Opcode["ROT_THREE"] = 0x03] = "ROT_THREE";
    Opcode[Opcode["DUP_TOP"] = 0x04] = "DUP_TOP";
    Opcode[Opcode["UNARY_POSITIVE"] = 0x0A] = "UNARY_POSITIVE";

    Opcode[Opcode["BINARY_ADD"] = 0x17] = "BINARY_ADD";
    Opcode[Opcode["BINARY_DIVIDE"] = 0x15] = "BINARY_DIVIDE";
    Opcode[Opcode["BINARY_SUBSCR"] = 0x19] = "BINARY_SUBSCR";
    Opcode[Opcode["INPLACE_FLOOR_DIVIDE"] = 0x1C] = "INPLACE_FLOOR_DIVIDE";

    Opcode[Opcode["STORE_SLICE"] = 0x28] = "STORE_SLICE";

    Opcode[Opcode["STORE_MAP"] = 0x36] = "STORE_MAP";
    Opcode[Opcode["INPLACE_ADD"] = 0x37] = "INPLACE_ADD";
    Opcode[Opcode["STORE_SUBSCR"] = 0x3C] = "STORE_SUBSCR";
    Opcode[Opcode["BINARY_LSHIFT"] = 0x3E] = "BINARY_LSHIFT";

    Opcode[Opcode["BINARY_AND"] = 0x40] = "BINARY_AND";
    Opcode[Opcode["GET_ITER"] = 0x44] = "GET_ITER";
    Opcode[Opcode["PRINT_ITEM"] = 0x47] = "PRINT_ITEM";
    Opcode[Opcode["INPLACE_XOR"] = 0x4E] = "INPLACE_XOR";

    Opcode[Opcode["RETURN_VALUE"] = 0x53] = "RETURN_VALUE";
    Opcode[Opcode["POP_BLOCK"] = 0x57] = "POP_BLOCK";
    Opcode[Opcode["STORE_NAME"] = 0x5A] = "STORE_NAME";

    Opcode[Opcode["STORE_GLOBAL"] = 0x61] = "STORE_GLOBAL";
    Opcode[Opcode["DUP_TOPX"] = 0x63] = "DUP_TOPX";

    /* 	0x64 : ['LOAD_CONST', 2, 'Pushes "co_consts[/consti/]" onto the stack.'], */
    Opcode[Opcode["LOAD_CONST"] = 0x64] = "LOAD_CONST";

    Opcode[Opcode["LOAD_NAME"] = 0x65] = "LOAD_NAME";

    /*0x66 : ['BUILD_TUPLE', 2, 'Creates a tuple consuming /count/ items from the stack, and pushes the resulting
    tuple onto the stack.'], */
    Opcode[Opcode["BUILD_TUPLE"] = 0x66] = "BUILD_TUPLE";

    /* 0x67 : ['BUILD_LIST', 2, 'Works as BUILD_TUPLE(/count/), but creates a list.'], */
    Opcode[Opcode["BUILD_LIST"] = 0x67] = "BUILD_LIST";

    /* 	0x69 : ['LOAD_ATTR', 2, 'Replaces TOS with getattr(TOS, co_names[/namei/]).'], */
    Opcode[Opcode["LOAD_ATTR"] = 0x69] = "LOAD_ATTR";

    Opcode[Opcode["COMPARE_OP"] = 0x6A] = "COMPARE_OP";
    Opcode[Opcode["IMPORT_NAME"] = 0x6B] = "IMPORT_NAME";
    Opcode[Opcode["IMPORT_FROM"] = 0x6C] = "IMPORT_FROM";
    Opcode[Opcode["JUMP_FORWARD"] = 0x6E] = "JUMP_FORWARD";
    Opcode[Opcode["JUMP_IF_FALSE"] = 0x6F] = "JUMP_IF_FALSE";

    Opcode[Opcode["JUMP_IF_TRUE"] = 0x70] = "JUMP_IF_TRUE";
    Opcode[Opcode["JUMP_ABSOLUTE"] = 0x71] = "JUMP_ABSOLUTE";
    Opcode[Opcode["LOAD_GLOBAL"] = 0x74] = "LOAD_GLOBAL";
    Opcode[Opcode["SETUP_LOOP"] = 0x78] = "SETUP_LOOP";
    Opcode[Opcode["SETUP_EXCEPT"] = 0x79] = "SETUP_EXCEPT";
    Opcode[Opcode["LOAD_FAST"] = 0x7C] = "LOAD_FAST";
    Opcode[Opcode["STORE_FAST"] = 0x7D] = "STORE_FAST";

    //	0x83 : ['CALL_FUNCTION', 2, 'Calls a function. The low byte of /argc/ indicates the number of positional
    // parameters, the high byte the number of keyword parameters. On the stack, the opcode finds the keyword parameters
    // first. For each keyword argument, the value is on top of the key. Below the keyword parameters, the positional
    // parameters are on the stack, with the right-most parameter on top. Below the parameters, the function object to
    // call is on the stack. '],
    Opcode[Opcode["CALL_FUNCTION"] = 0x83] = "CALL_FUNCTION";
    Opcode[Opcode["MAKE_FUNCTION"] = 0x84] = "MAKE_FUNCTION";
})(exports.Opcode || (exports.Opcode = {}));
var Opcode = exports.Opcode;

(function (TypeMap) {
    TypeMap[TypeMap["NULL"] = 79] = "NULL";
    TypeMap[TypeMap["NONE"] = 78] = "NONE";
    TypeMap[TypeMap["FALSE"] = 70] = "FALSE";
    TypeMap[TypeMap["TRUE"] = 84] = "TRUE";
    TypeMap[TypeMap["STOPITER"] = 83] = "STOPITER";
    TypeMap[TypeMap["ELLIPSIS"] = 46] = "ELLIPSIS";
    TypeMap[TypeMap["INT"] = 105] = "INT";
    TypeMap[TypeMap["INT64"] = 73] = "INT64";
    TypeMap[TypeMap["FLOAT"] = 102] = "FLOAT";
    TypeMap[TypeMap["BINARY_FLOAT"] = 103] = "BINARY_FLOAT";
    TypeMap[TypeMap["COMPLEX"] = 120] = "COMPLEX";
    TypeMap[TypeMap["BINARY_COMPLEX"] = 121] = "BINARY_COMPLEX";
    TypeMap[TypeMap["LONG"] = 108] = "LONG";
    TypeMap[TypeMap["STRING"] = 115] = "STRING";
    TypeMap[TypeMap["INTERNED"] = 116] = "INTERNED";
    TypeMap[TypeMap["STRINGREF"] = 82] = "STRINGREF";
    TypeMap[TypeMap["UNICODE"] = 117] = "UNICODE";
    TypeMap[TypeMap["TUPLE"] = 40] = "TUPLE";
    TypeMap[TypeMap["LIST"] = 91] = "LIST";
    TypeMap[TypeMap["DICT"] = 123] = "DICT";
    TypeMap[TypeMap["FROZENSET"] = 62] = "FROZENSET";
    TypeMap[TypeMap["CODE"] = 99] = "CODE";
})(exports.TypeMap || (exports.TypeMap = {}));
var TypeMap = exports.TypeMap;
;
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
