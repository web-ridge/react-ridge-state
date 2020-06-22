"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newRidgeState = void 0;
const R = require("react");
function newRidgeState(iv, o) {
    let sb = [];
    let v = iv;
    let set = (ns, ac, ca) => {
        v = (ns instanceof Function ? ns(v) : ns);
        ca && ca(v);
        setTimeout(() => {
            sb.forEach((c) => c !== ca && c(v));
            ac && ac(v);
            o && o.onSet && o.onSet(v);
        });
    };
    let use = () => {
        let [l, sl] = R.useState(v);
        R.useEffect(() => {
            sb.push(sl);
            return () => {
                sb = sb.filter((f) => f !== sl);
            };
        });
        let c = R.useCallback((ns) => set(ns, null, sl), [sl]);
        return [l, c];
    };
    return {
        use,
        useValue: () => use()[0],
        get: () => v,
        set,
    };
}
exports.newRidgeState = newRidgeState;
