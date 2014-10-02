/**
* Created by kate on 9/25/14.
*/
// TODO finish these
(function (Opcode) {
    Opcode[Opcode["STOP_CODE"] = 0x00] = "STOP_CODE";
    Opcode[Opcode["POP_TOP"] = 0x01] = "POP_TOP";
    Opcode[Opcode["ROT_TWO"] = 0x02] = "ROT_TWO";
    Opcode[Opcode["UNARY_POSITIVE"] = 0x0A] = "UNARY_POSITIVE";

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

    Opcode[Opcode["SETUP_EXCEPT"] = 0x79] = "SETUP_EXCEPT";

    Opcode[Opcode["MAKE_FUNCTION"] = 0x84] = "MAKE_FUNCTION";
})(exports.Opcode || (exports.Opcode = {}));
var Opcode = exports.Opcode;

//TODO is there a typechar for a plain old Set?
exports.type_map = {
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
