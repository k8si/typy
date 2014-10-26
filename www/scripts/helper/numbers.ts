/** Stolen from Google's Closure Library (math.Integer) -- would have just used it directly but coulnd't figure
 * out how to make it work with TypeScript */
export class Integer {
    private bits: number[];
    private sign: number;
    public constructor(bits: number[], sign: number) {
        this.sign = sign;
        var bits_ = [];
        // Copy the 32-bit signed integer values passed in.  We prune out those at the
        // top that equal the sign since they are redundant.
        var top = true;
        for (var i = bits.length - 1; i >= 0; i--) {
            var val = bits[i] | 0;
            if (!top || val != sign) {
                bits_[i] = val;
                top = false;
            }
        }
        this.bits = bits_;
    }
}