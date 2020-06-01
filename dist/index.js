"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newRidgeState = void 0;
const R = require("react");
function newRidgeState(iv, o) {
    let sb = [];
    let v = iv;
    let set = (ns, ac, ca) => {
        v = (v instanceof Function ? ns(v) : ns);
        ca(v);
        setTimeout(() => {
            sb.forEach((c) => c !== ca && c(v));
            ac && ac(v);
            o.onSet && o.onSet(v);
        });
    };
    let use = () => {
        let [l, sl] = R.useState(v);
        let u = R.createRef((ns) => sl(ns));
        R.useEffect(() => {
            sb.push(u.current);
            return () => {
                sb = sb.filter((f) => f !== u.current);
            };
        });
        let c = R.useCallback((ns) => set(ns, null, u.current), [u]);
        return [l, c];
    };
    return {
        use,
        useValue: () => {
            let [uv] = use();
            return uv;
        },
        get: () => v,
        set,
    };
}
exports.newRidgeState = newRidgeState;
