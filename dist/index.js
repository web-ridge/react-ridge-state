"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newRidgeState = void 0;
const react_1 = require("react");
const useIsomorphicLayoutEffect = typeof window !== "undefined" || typeof document !== "undefined"
    ? react_1.useLayoutEffect
    : react_1.useEffect;
const equ = (a, b) => a === b;
const FR = {};
function useComparator(v, c = equ) {
    const f = (0, react_1.useRef)(FR);
    let nv = f.current;
    useIsomorphicLayoutEffect(() => {
        f.current = nv;
    });
    if (f.current === FR || !c(v, f.current)) {
        nv = v;
    }
    return nv;
}
function newRidgeState(initialValue, options) {
    let sb = [];
    let v = initialValue;
    function set(newValue, callback) {
        const pv = v;
        v = newValue instanceof Function ? newValue(v) : newValue;
        setTimeout(() => {
            var _a;
            sb.forEach((c) => c(v, pv));
            callback === null || callback === void 0 ? void 0 : callback(v, pv);
            (_a = options === null || options === void 0 ? void 0 : options.onSet) === null || _a === void 0 ? void 0 : _a.call(options, v, pv);
        });
    }
    function subscribe(subscriber) {
        sb.push(subscriber);
        return () => {
            sb = sb.filter((f) => f !== subscriber);
        };
    }
    function useSubscription(subscriber) {
        useIsomorphicLayoutEffect(() => subscribe(subscriber), [subscriber]);
    }
    function use() {
        const [l, s] = (0, react_1.useState)(v);
        useSubscription(s);
        return [l, set];
    }
    function useSelector(selector, comparator = equ) {
        const [rv] = use();
        return useComparator(selector(rv), comparator);
    }
    return {
        use,
        useSelector,
        useValue: () => use()[0],
        get: () => v,
        set,
        reset: () => set(initialValue),
        subscribe,
    };
}
exports.newRidgeState = newRidgeState;
