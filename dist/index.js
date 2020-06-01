"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newRidgeState = void 0;
const R = require("react");
function newRidgeState(v) {
    let i = { v, subs: [] };
    let set = (ns, ac) => {
        i.v = ns;
        setTimeout(() => {
            i.subs.forEach((c) => c(ns));
            ac && ac(ns);
        });
    };
    let use = () => {
        let [l, sl] = R.useState(i.v);
        let u = (ns) => ns !== l && sl(ns);
        R.useEffect(() => {
            let f = (ns) => u(ns);
            i.subs.push(f);
            return () => {
                i.subs = i.subs.filter((f) => f !== f);
            };
        });
        let c = R.useCallback((ns) => {
            sl(ns);
            set(ns);
        }, []);
        return [l, c];
    };
    return {
        i,
        use,
        useValue: () => {
            let [v] = use();
            return v;
        },
        get: () => i.v,
        set,
    };
}
exports.newRidgeState = newRidgeState;
