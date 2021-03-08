"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newRidgeState = void 0;
const R = require("react");
const e_1 = require("./e");
function newRidgeState(iv, o) {
    let sb = [];
    let v = iv;
    function set(ns, ac) {
        let pv = v;
        v = (ns instanceof Function ? ns(v) : ns);
        setTimeout(() => {
            sb.forEach((c) => c(v));
            ac && ac(v);
            o && o.onSet && o.onSet(v, pv);
        });
    }
    function sub(c) {
        e_1.default(() => {
            sb.push(c);
            return () => {
                sb = sb.filter((f) => f !== c);
            };
        }, [c]);
    }
    function use() {
        let [l, s] = R.useState(v);
        sub(s);
        return [l, set];
    }
    function useSelector(se, eq = (a, b) => a === b) {
        let [l, s] = R.useState(se(v));
        let c = R.useCallback((ns) => {
            let n = se(ns);
            if (!eq(l, n)) {
                s(n);
            }
        }, [s, se]);
        e_1.default(() => {
            c(v);
        });
        sub(c);
        return l;
    }
    return {
        use,
        useSelector,
        useValue: () => use()[0],
        get: () => v,
        set,
        reset: () => set(iv)
    };
}
exports.newRidgeState = newRidgeState;
