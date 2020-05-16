"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRidgeState = exports.getRidgeState = exports.useRidgeState = exports.newRidgeState = void 0;
const R = require("react");
function newRidgeState(defaultState) {
    const i = { v: defaultState, sbs: [] };
    return {
        i,
        _set: (ns) => {
            i.v = ns;
            i.sbs.forEach((c) => c(ns));
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
        s.i.sbs.push(c);
        return () => {
            s.i.sbs = s.i.sbs.filter((f) => f !== c);
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
