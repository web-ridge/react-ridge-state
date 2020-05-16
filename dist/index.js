"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRidgeState = exports.getRidgeState = exports.useRidgeState = exports.newRidgeState = void 0;
const R = require("react");
const r = window || global;
function newRidgeState({ key, defaultState, }) {
    const sk = `rrs_${key}`;
    r[sk] = [];
    const i = { v: defaultState };
    return {
        i,
        sk,
        _set: (ns) => {
            i.v = ns;
            r[sk].forEach((c) => c(ns));
        },
    };
}
exports.newRidgeState = newRidgeState;
function useRidgeState(s) {
    const [ls, sls] = R.useState(s.i.v);
    const u = R.useCallback((ns) => {
        if (ns !== ls) {
            sls(ns);
        }
    }, [ls]);
    R.useEffect(() => {
        function c(ns) {
            u(ns);
        }
        const sk = s.sk;
        r[sk].push(c);
        return () => {
            r[sk] = r[sk].filter((f) => f !== c);
        };
    });
    const lset = R.useCallback((ns) => {
        sls(ns);
        s._set(ns);
    }, []);
    return [ls, lset];
}
exports.useRidgeState = useRidgeState;
function getRidgeState(s) {
    return s.i.v;
}
exports.getRidgeState = getRidgeState;
function setRidgeState(s, ns) {
    s._set(ns);
}
exports.setRidgeState = setRidgeState;
