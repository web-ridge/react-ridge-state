"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRidgeState = exports.getRidgeState = exports.useRidgeState = exports.newRidgeState = void 0;
const R = require("react");
function newRidgeState(v) {
  let i = { v, sbs: [] };
  return {
    i,
    _set: (ns) => {
      i.v = ns;
      setTimeout(() => {
        i.sbs.forEach((c) => c(ns));
      });
    },
  };
}
exports.newRidgeState = newRidgeState;
function useRidgeState(s) {
  let [l, sl] = R.useState(s.i.v);
  let u = R.useCallback(
    (ns) => {
      if (ns !== l) {
        sl(ns);
      }
    },
    [l]
  );
  R.useEffect(() => {
    function c(ns) {
      u(ns);
    }
    s.i.sbs.push(c);
    return () => {
      s.i.sbs = s.i.sbs.filter((f) => f !== c);
    };
  });
  let c = R.useCallback((ns) => {
    sl(ns);
    s._set(ns);
  }, []);
  return [l, c];
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
