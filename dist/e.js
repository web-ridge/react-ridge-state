"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const R = require("react");
exports.default = typeof window !== 'undefined' &&
    typeof window.document !== 'undefined' &&
    typeof window.document.createElement !== 'undefined'
    ? R.useLayoutEffect
    : R.useEffect;
