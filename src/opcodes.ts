/**
 * Created by kate on 9/25/14.
 */

import utils = require('./utils');


/* based on doppio */
export class Opcode {
    public name: string;
//    public bytes: string;
    public code: string;
    public byteCount: number;
    public args: number[];

    constructor(name: string, code: number, byteCount: number) {
        this.name = name;
//        this.bytes = bytes;
        this.byteCount = byteCount;
    }

    toString(): string { return this.name; }
}

/* based on bytecodehacks/ops.py */
var opc = new utils.Map<number, Opcode>();
//var opc = new utils.Dict<Opcode>();

opc.add(0, new Opcode("STOP_CODE", 0x00, -1));
opc.add(1, new Opcode("POP_TOP", 0x01, -1));
opc.add(2, new Opcode("ROT_TWO", 0x02, -1));
opc.add(6, new Opcode("???", 0x06, -1));
opc.add(8, new Opcode("???", 0x08, -1));
opc.add(10, new Opcode("UNARY_POSITIVE", 0x0A, -1));

opc.add(40, new Opcode("STORE_SLICE", 0x28, -1));
opc.add(46, new Opcode("??", 0x2E, -1));

opc.add(60, new Opcode("STORE_SUBSCR", 0x3C, -1));
opc.add(62, new Opcode("BINARY_LSHIFT", 0x3E, -1));
opc.add(64, new Opcode("BINARY_AND", 0x40, -1));
opc.add(78, new Opcode("INPLACE_XOR", 0x4E, -1));
opc.add(83, new Opcode("RETURN_VALUE", 0x53, -1));
opc.add(90, new Opcode("STORE_NAME", 0x5A, -1));
opc.add(97, new Opcode("STORE_GLOBAL", 0x61, -1));
opc.add(99, new Opcode("DUP_TOPX", 0x63, -1));

opc.add(100, new Opcode("LOAD_CONST", 0x64, -1));
opc.add(101, new Opcode("LOAD_NAME", 0x65, -1));
opc.add(105, new Opcode("LOAD_ATTR", 0x69, -1));
opc.add(108, new Opcode("IMPORT_FROM", 0x6C, -1));
opc.add(109, new Opcode("???", 0x6D, -1));

opc.add(111, new Opcode("JUMP_IF_FALSE", 0x6F, -1));
opc.add(112, new Opcode("JUMP_IF_TRUE", 0x70, -1));
opc.add(115, new Opcode("???", 0x73, -1));
opc.add(116, new Opcode("LOAD_GLOBAL", 0x74, -1));
opc.add(117, new Opcode("???", 0x75, -1));

opc.add(121, new Opcode("SETUP_EXCEPT", 0x79, -1));


export var opcodes = opc;







