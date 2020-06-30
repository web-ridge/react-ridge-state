"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newRidgeState = void 0;
const R = require("react");
function newRidgeState(iv, o) {
    let sb = [];
    let v = iv;
    function set(ns, ac) {
        v = (ns instanceof Function ? ns(v) : ns);
        setTimeout(() => {
            sb.forEach((c) => c(v));
            ac && ac(v);
            o && o.onSet && o.onSet(v);
        });
    }
    function sub(ca) {
        R.useEffect(() => {
            sb.push(ca);
            return () => {
                sb = sb.filter((f) => f !== ca);
            };
        }, [ca]);
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
            !eq(l, n) && s(n);
        }, [l]);
        sub(c);
        return l;
    }
    return {
        use,
        useSelector,
        useValue: () => use()[0],
        get: () => v,
        set,
    };
}
exports.newRidgeState = newRidgeState;
