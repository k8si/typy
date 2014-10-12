/**
* Created by kate on 9/25/14.
*/
// TODO finish these
(function (Opcode) {
    Opcode[Opcode["STOP_CODE"] = 0x00] = "STOP_CODE";
    Opcode[Opcode["POP_TOP"] = 0x01] = "POP_TOP";
    Opcode[Opcode["ROT_TWO"] = 0x02] = "ROT_TWO";
    Opcode[Opcode["UNARY_POSITIVE"] = 0x0A] = "UNARY_POSITIVE";

    Opcode[Opcode["BINARY_ADD"] = 0x17] = "BINARY_ADD";

    Opcode[Opcode["STORE_SLICE"] = 0x28] = "STORE_SLICE";

    Opcode[Opcode["STORE_SUBSCR"] = 0x3C] = "STORE_SUBSCR";
    Opcode[Opcode["BINARY_LSHIFT"] = 0x3E] = "BINARY_LSHIFT";

    Opcode[Opcode["BINARY_AND"] = 0x40] = "BINARY_AND";
    Opcode[Opcode["INPLACE_XOR"] = 0x4E] = "INPLACE_XOR";

    Opcode[Opcode["RETURN_VALUE"] = 0x53] = "RETURN_VALUE";
    Opcode[Opcode["STORE_NAME"] = 0x5A] = "STORE_NAME";

    Opcode[Opcode["STORE_GLOBAL"] = 0x61] = "STORE_GLOBAL";
    Opcode[Opcode["DUP_TOPX"] = 0x63] = "DUP_TOPX";
    Opcode[Opcode["LOAD_CONST"] = 0x64] = "LOAD_CONST";
    Opcode[Opcode["LOAD_NAME"] = 0x65] = "LOAD_NAME";
    Opcode[Opcode["LOAD_ATTR"] = 0x69] = "LOAD_ATTR";
    Opcode[Opcode["IMPORT_FROM"] = 0x6C] = "IMPORT_FROM";
    Opcode[Opcode["JUMP_IF_FALSE"] = 0x6F] = "JUMP_IF_FALSE";

    Opcode[Opcode["JUMP_IF_TRUE"] = 0x70] = "JUMP_IF_TRUE";
    Opcode[Opcode["LOAD_GLOBAL"] = 0x74] = "LOAD_GLOBAL";
    Opcode[Opcode["LOAD_FAST"] = 0x7C] = "LOAD_FAST";

    Opcode[Opcode["SETUP_EXCEPT"] = 0x79] = "SETUP_EXCEPT";

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
