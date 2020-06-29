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
    function subscribe(ca) {
        R.useEffect(() => {
            sb.push(ca);
            return () => {
                sb = sb.filter((f) => f !== ca);
            };
        }, []);
    }
    function use() {
        let [l, sl] = R.useState(v);
        subscribe(sl);
        let c = R.useCallback((ns, ca) => set(ns, ca), [sl]);
        return [l, c];
    }
    function useValue() {
        let [l, sl] = R.useState(v);
        subscribe(sl);
        return l;
    }
    function useSelect(selector, eq = (a, b) => a === b) {
        let [l, sl] = R.useState(selector(v));
        let c = R.useCallback((ns) => {
            let n = selector(ns);
            !eq(l, n) && sl(n);
        }, [sl]);
        subscribe(c);
        return l;
    }
    return {
        use,
        useSelect,
        useValue,
        get: () => v,
        set,
    };
}
exports.newRidgeState = newRidgeState;
