/*
Basically stolen from https://github.com/basarat/typescript-collections (because I haven't been able to get the module to work with Node)

TODO if we're actually gonna use any of these, need to catch errors, test, etc.
 */

//interface IDict {
//    add(key: string, value: any): void;
//    remove(key: string): void;
//    contains(key: string): boolean;
//    keys(): string[];
//    values(): any[];
//    get(key: string): any;
//    size(): number;
//}

export class Dict<V> {
    _keys: Array<string>;
    _values: Array<V>;

    constructor() {
        this._keys = new Array<string>();
        this._values = new Array<V>();
    }

    // FIXME should throw exception if we try to add a key that's already in the dict
    add(key: string, value: V): void {
        this._keys.push(key);
        this._values.push(value);
    }

    remove(key: string): void {
        var idx = this._keys.indexOf(key, 0);
        this._keys.splice(idx, 1);
        this._values.splice(idx, 1);
    }

    /* FIXME better implementation for this? Why doesn't "in" work? */
    contains(key: string): boolean {
        var result = false;
        if (this._keys.indexOf(key) >= 0) result = true;
        return result;
    }

    keys(): Array<string> { return this._keys; }
    values(): Array<V> { return this._values; }

    get(key: string): V {
        if (this.contains(key)) {
            var idx = this._keys.indexOf(key, 0);
            return this._values[idx];
        }
        return undefined;
    }

    size(): number { return this._keys.length; }

    update(d:Dict<V>): void {
        var k = d.keys();
        var v = d.values();
        for (var i = 0; i < k.length; i++) {
            this.add(k[i], v[i]);
        }
    }
}


//interface IMap {
//    add(key: string, value: any): void;
//    remove(key: string): void;
//    contains(key: string): boolean;
//    keys(): string[];
//    values(): any[];
//    get(key: string): any;
//    size(): number;
//}

export class Map<K, V> {
    _keys: Array<K>;
    _values: Array<V>;

    constructor() {
        this._keys = new Array<K>();
        this._values = new Array<V>();
    }

    add(key: K, value: V): void {
        if (this.contains(key)) { console.log("invalid: duplicate key"); return; }
        this._keys.push(key);
        this._values.push(value);
    }

    // TODO I have no idea if this actually works
    remove(key: K): void {
        var idx = this._keys.indexOf(key, 0);
        this._keys.splice(idx, 1);
        this._values.splice(idx, 1);
    }

    contains(key: K): boolean {
        var result = false;
        if (this._keys.indexOf(key) >= 0) result = true;
        return result;
    }

    keys(): Array<K> { return this._keys; }
    values(): Array<V> { return this._values; }

    get(key: K): V {
        if (this.contains(key)) {
            var idx = this._keys.indexOf(key, 0);
            return this._values[idx];
        }
        return undefined;
    }

    size(): number { return this._keys.length; }
}

export class Stack<T> {
    private list: Array<T>;
    private idx: number;
    constructor(){
        this.list = new Array<T>();
        this.idx = 0;
    }
    push(elem: T): void {
        this.list[this.idx] = elem;
        this.idx += 1;
    }
    pop(): T {
        if (this.idx <= 0) return undefined;
        var result = this.list[this.idx];
        this.list[this.idx] = undefined;
        this.idx = this.idx - 1;
        return result;
    }
    toString(): string {
        var s = "";
        for (var i = 0; i < this.idx; i++) {
            s = s + this.list[i].toString() + " ";
        }
        return s;
    }
}

///* some helper functions stolen from doppio and StackOverflow */
//function bytestr_to_array(bytecode_string: string): number[] {
//    var rv : number[] = [];
//    for (var i = 0; i < bytecode_string.length; i++) {
//        rv.push(bytecode_string.charCodeAt(i) & 0xFF);
//        rv.push(bytecode_string.charCodeAt(i));
//    }
//    return rv;
//}

//export function byte2str(byte: number): string {
//    var s = byte <= 0x7f ? byte === 0x25 ? "%25" : String.fromCharCode(byte) : "%" + byte.toString(16).toUpperCase();
//    return decodeURIComponent(s);
//}
//
//export function byteArrayToUTF8(byteArray): string {
//    var str = '';
//    for (var i = 0; i < byteArray.length; i++)
//        str +=  byteArray[i] <= 0x7F?
//                byteArray[i] === 0x25 ? "%25" : // %
//            String.fromCharCode(byteArray[i]) :
//            "%" + byteArray[i].toString(16).toUpperCase();
//    return decodeURIComponent(str);
//};
//
//export function utf8toByteArray(str): number[] {
//    var byteArray = [];
//    for (var i = 0; i < str.length; i++)
//        if (str.charCodeAt(i) <= 0x7F)
//            byteArray.push(str.charCodeAt(i));
//        else {
//            var h = encodeURIComponent(str.charAt(i)).substr(1).split('%');
//            for (var j = 0; j < h.length; j++)
//                byteArray.push(parseInt(h[j], 16));
//        }
//    return byteArray;
//};
//
//export function bytes2str(bytes: number[], null_terminate?: boolean): string {
//    var y : number;
//    var z : number;
//    var idx = 0;
//    var rv = '';
//    while (idx < bytes.length) {
//        var x = bytes[idx++] & 0xff;
////            if (null_terminate && x == 0) {
////                break;
////            }
//        rv += String.fromCharCode(x <= 0x7f ? x : x <= 0xdf ? (y = bytes[idx++], ((x & 0x1f) << 6) + (y & 0x3f)) : (y = bytes[idx++], z = bytes[idx++], ((x & 0xf) << 12) + ((y & 0x3f) << 6) + (z & 0x3f)));
//    }
//    return rv;
//}
//
//export function byteArray2Buffer(bytes: number[], offset: number = 0, len: number = bytes.length): NodeBuffer {
//    var buff = new Buffer(len), i: number;
//    for (i = 0; i < len; i++) {
//        buff.writeInt32LE(bytes[offset + i], i);
//    }
//    return buff;
//}



