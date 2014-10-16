/**
 * Created by kate on 9/25/14.
 */
define(["require", "exports"], function (require, exports) {
    //TODO finish filling in these lists
    /** arg = index in name list (codeobject.names) **/
    exports.hasArgInNames = [
        90 /* STORE_NAME */,
        91 /* DELETE_NAME */,
        95 /* STORE_ATTR */,
        96 /* DELETE_ATTR */,
        97 /* STORE_GLOBAL */,
        98 /* DELETE_GLOBAL */,
        101 /* LOAD_NAME */,
        106 /* LOAD_ATTR */,
        108 /* IMPORT_NAME */,
        109 /* IMPORT_FROM */
    ];
    /** arg = index in consts list (codeobject.consts) **/
    exports.hasArgInConsts = [
        100 /* LOAD_CONST */
    ];
    /** arg = local variable number **/
    exports.hasArgInLocals = [
        124 /* LOAD_FAST */,
        125 /* STORE_FAST */,
        126 /* DELETE_FAST */
    ];
    /** arg = target byte offset from beginning of code **/
    exports.hasJabs = [
        111 /* JUMP_IF_FALSE_OR_POP */,
        112 /* JUMP_IF_TRUE_OR_POP */,
        113 /* JUMP_ABSOLUTE */,
        114 /* POP_JUMP_IF_FALSE */,
        115 /* POP_JUMP_IF_TRUE */
    ];
    exports.hasJrel = [
        110 /* JUMP_FORWARD */
    ];
    /** arg = int corresponding to comparison operator (see interpet.ts COMPARE_OP) **/
    exports.hasCompare = [107 /* COMPARE_OP */];
    exports.hasFree = [
        134 /* MAKE_CLOSURE */
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
    exports.HAVE_ARGUMENT = 90; //any opcode >= 90 has an argument
    //list taken from CPython: https://hg.python.org/cpython/file/7ba47bbfe38d/Include/opcode.h
    (function (Opcode) {
        Opcode[Opcode["STOP_CODE"] = 0] = "STOP_CODE";
        Opcode[Opcode["POP_TOP"] = 1] = "POP_TOP";
        Opcode[Opcode["ROT_TWO"] = 2] = "ROT_TWO";
        Opcode[Opcode["ROT_THREE"] = 3] = "ROT_THREE";
        Opcode[Opcode["DUP_TOP"] = 4] = "DUP_TOP";
        Opcode[Opcode["ROT_FOUR"] = 5] = "ROT_FOUR";
        Opcode[Opcode["NOP"] = 9] = "NOP";
        Opcode[Opcode["UNARY_POSITIVE"] = 10] = "UNARY_POSITIVE";
        Opcode[Opcode["UNARY_NEGATIVE"] = 11] = "UNARY_NEGATIVE";
        Opcode[Opcode["UNARY_NOT"] = 12] = "UNARY_NOT";
        Opcode[Opcode["UNARY_CONVERT"] = 13] = "UNARY_CONVERT";
        Opcode[Opcode["UNARY_INVERT"] = 15] = "UNARY_INVERT";
        Opcode[Opcode["BINARY_POWER"] = 19] = "BINARY_POWER";
        Opcode[Opcode["BINARY_MULTIPLY"] = 20] = "BINARY_MULTIPLY";
        Opcode[Opcode["BINARY_DIVIDE"] = 21] = "BINARY_DIVIDE";
        Opcode[Opcode["BINARY_MODULO"] = 22] = "BINARY_MODULO";
        Opcode[Opcode["BINARY_ADD"] = 23] = "BINARY_ADD";
        Opcode[Opcode["BINARY_SUBTRACT"] = 24] = "BINARY_SUBTRACT";
        Opcode[Opcode["BINARY_SUBSCR"] = 25] = "BINARY_SUBSCR";
        Opcode[Opcode["BINARY_FLOOR_DIVIDE"] = 26] = "BINARY_FLOOR_DIVIDE";
        Opcode[Opcode["BINARY_TRUE_DIVIDE"] = 27] = "BINARY_TRUE_DIVIDE";
        Opcode[Opcode["INPLACE_FLOOR_DIVIDE"] = 28] = "INPLACE_FLOOR_DIVIDE";
        Opcode[Opcode["INPLACE_TRUE_DIVIDE"] = 29] = "INPLACE_TRUE_DIVIDE";
        Opcode[Opcode["SLICE"] = 30] = "SLICE";
        Opcode[Opcode["STORE_SLICE"] = 40] = "STORE_SLICE";
        Opcode[Opcode["DELETE_SLICE"] = 50] = "DELETE_SLICE";
        Opcode[Opcode["STORE_MAP"] = 54] = "STORE_MAP";
        Opcode[Opcode["INPLACE_ADD"] = 55] = "INPLACE_ADD";
        Opcode[Opcode["INPLACE_SUBTRACT"] = 56] = "INPLACE_SUBTRACT";
        Opcode[Opcode["INPLACE_MULTIPLY"] = 57] = "INPLACE_MULTIPLY";
        Opcode[Opcode["INPLACE_DIVIDE"] = 58] = "INPLACE_DIVIDE";
        Opcode[Opcode["INPLACE_MODULO"] = 59] = "INPLACE_MODULO";
        Opcode[Opcode["STORE_SUBSCR"] = 60] = "STORE_SUBSCR";
        Opcode[Opcode["DELETE_SUBSCR"] = 61] = "DELETE_SUBSCR";
        Opcode[Opcode["BINARY_LSHIFT"] = 62] = "BINARY_LSHIFT";
        Opcode[Opcode["BINARY_RSHIFT"] = 63] = "BINARY_RSHIFT";
        Opcode[Opcode["BINARY_AND"] = 64] = "BINARY_AND";
        Opcode[Opcode["BINARY_XOR"] = 65] = "BINARY_XOR";
        Opcode[Opcode["BINARY_OR"] = 66] = "BINARY_OR";
        Opcode[Opcode["INPLACE_POWER"] = 67] = "INPLACE_POWER";
        Opcode[Opcode["GET_ITER"] = 68] = "GET_ITER";
        Opcode[Opcode["PRINT_EXPR"] = 70] = "PRINT_EXPR";
        Opcode[Opcode["PRINT_ITEM"] = 71] = "PRINT_ITEM";
        Opcode[Opcode["PRINT_NEWLINE"] = 72] = "PRINT_NEWLINE";
        Opcode[Opcode["PRINT_ITEM_TO"] = 73] = "PRINT_ITEM_TO";
        Opcode[Opcode["PRINT_NEWLINE_TO"] = 74] = "PRINT_NEWLINE_TO";
        Opcode[Opcode["INPLACE_LSHIFT"] = 75] = "INPLACE_LSHIFT";
        Opcode[Opcode["INPLACE_RSHIFT"] = 76] = "INPLACE_RSHIFT";
        Opcode[Opcode["INPLACE_AND"] = 77] = "INPLACE_AND";
        Opcode[Opcode["INPLACE_XOR"] = 78] = "INPLACE_XOR";
        Opcode[Opcode["INPLACE_OR"] = 79] = "INPLACE_OR";
        Opcode[Opcode["BREAK_LOOP"] = 80] = "BREAK_LOOP";
        Opcode[Opcode["WITH_CLEANUP"] = 81] = "WITH_CLEANUP";
        Opcode[Opcode["LOAD_LOCALS"] = 82] = "LOAD_LOCALS";
        Opcode[Opcode["RETURN_VALUE"] = 83] = "RETURN_VALUE";
        Opcode[Opcode["IMPORT_STAR"] = 84] = "IMPORT_STAR";
        Opcode[Opcode["EXEC_STMT"] = 85] = "EXEC_STMT";
        Opcode[Opcode["YIELD_VALUE"] = 86] = "YIELD_VALUE";
        Opcode[Opcode["POP_BLOCK"] = 87] = "POP_BLOCK";
        Opcode[Opcode["END_FINALLY"] = 88] = "END_FINALLY";
        Opcode[Opcode["BUILD_CLASS"] = 89] = "BUILD_CLASS";
        //opcodes from here have an argument
        Opcode[Opcode["STORE_NAME"] = 90] = "STORE_NAME";
        Opcode[Opcode["DELETE_NAME"] = 91] = "DELETE_NAME";
        Opcode[Opcode["UNPACK_SEQUENCE"] = 92] = "UNPACK_SEQUENCE";
        Opcode[Opcode["FOR_ITER"] = 93] = "FOR_ITER";
        Opcode[Opcode["LIST_APPEND"] = 94] = "LIST_APPEND";
        Opcode[Opcode["STORE_ATTR"] = 95] = "STORE_ATTR";
        Opcode[Opcode["DELETE_ATTR"] = 96] = "DELETE_ATTR";
        Opcode[Opcode["STORE_GLOBAL"] = 97] = "STORE_GLOBAL";
        Opcode[Opcode["DELETE_GLOBAL"] = 98] = "DELETE_GLOBAL";
        Opcode[Opcode["DUP_TOPX"] = 99] = "DUP_TOPX";
        Opcode[Opcode["LOAD_CONST"] = 100] = "LOAD_CONST";
        Opcode[Opcode["LOAD_NAME"] = 101] = "LOAD_NAME";
        Opcode[Opcode["BUILD_TUPLE"] = 102] = "BUILD_TUPLE";
        Opcode[Opcode["BUILD_LIST"] = 103] = "BUILD_LIST";
        Opcode[Opcode["BUILD_SET"] = 104] = "BUILD_SET";
        Opcode[Opcode["BUILD_MAP"] = 105] = "BUILD_MAP";
        Opcode[Opcode["LOAD_ATTR"] = 106] = "LOAD_ATTR";
        Opcode[Opcode["COMPARE_OP"] = 107] = "COMPARE_OP";
        Opcode[Opcode["IMPORT_NAME"] = 108] = "IMPORT_NAME";
        Opcode[Opcode["IMPORT_FROM"] = 109] = "IMPORT_FROM";
        Opcode[Opcode["JUMP_FORWARD"] = 110] = "JUMP_FORWARD";
        Opcode[Opcode["JUMP_IF_FALSE_OR_POP"] = 111] = "JUMP_IF_FALSE_OR_POP";
        Opcode[Opcode["JUMP_IF_TRUE_OR_POP"] = 112] = "JUMP_IF_TRUE_OR_POP";
        Opcode[Opcode["JUMP_ABSOLUTE"] = 113] = "JUMP_ABSOLUTE";
        Opcode[Opcode["POP_JUMP_IF_FALSE"] = 114] = "POP_JUMP_IF_FALSE";
        Opcode[Opcode["POP_JUMP_IF_TRUE"] = 115] = "POP_JUMP_IF_TRUE";
        Opcode[Opcode["LOAD_GLOBAL"] = 116] = "LOAD_GLOBAL";
        Opcode[Opcode["CONTINUE_LOOP"] = 119] = "CONTINUE_LOOP";
        Opcode[Opcode["SETUP_LOOP"] = 120] = "SETUP_LOOP";
        Opcode[Opcode["SETUP_EXCEPT"] = 121] = "SETUP_EXCEPT";
        Opcode[Opcode["SETUP_FINALLY"] = 122] = "SETUP_FINALLY";
        Opcode[Opcode["LOAD_FAST"] = 124] = "LOAD_FAST";
        Opcode[Opcode["STORE_FAST"] = 125] = "STORE_FAST";
        Opcode[Opcode["DELETE_FAST"] = 126] = "DELETE_FAST";
        Opcode[Opcode["RAISE_VARARGS"] = 130] = "RAISE_VARARGS";
        Opcode[Opcode["CALL_FUNCTION"] = 131] = "CALL_FUNCTION";
        Opcode[Opcode["MAKE_FUNCTION"] = 132] = "MAKE_FUNCTION";
        Opcode[Opcode["BUILD_SLICE"] = 133] = "BUILD_SLICE";
        Opcode[Opcode["MAKE_CLOSURE"] = 134] = "MAKE_CLOSURE";
        Opcode[Opcode["LOAD_CLOSURE"] = 135] = "LOAD_CLOSURE";
        Opcode[Opcode["LOAD_DEREF"] = 136] = "LOAD_DEREF";
        Opcode[Opcode["STORE_DEREF"] = 137] = "STORE_DEREF";
        Opcode[Opcode["CALL_FUNCTION_VAR"] = 140] = "CALL_FUNCTION_VAR";
        Opcode[Opcode["CALL_FUNCTION_KW"] = 141] = "CALL_FUNCTION_KW";
        Opcode[Opcode["CALL_FUNCTION_VAR_KW"] = 142] = "CALL_FUNCTION_VAR_KW";
        Opcode[Opcode["SETUP_WITH"] = 143] = "SETUP_WITH";
        Opcode[Opcode["EXTENDED_ARG"] = 145] = "EXTENDED_ARG";
        Opcode[Opcode["SET_ADD"] = 146] = "SET_ADD";
        Opcode[Opcode["MAP_ADD"] = 147] = "MAP_ADD";
    })(exports.Opcode || (exports.Opcode = {}));
    var Opcode = exports.Opcode;
    //TODO what about regular Sets (not Frozensets)?
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
        TypeMap[TypeMap["CODE"] = 99] = "CODE"; // 'c'
    })(exports.TypeMap || (exports.TypeMap = {}));
    var TypeMap = exports.TypeMap;
    ;
});
