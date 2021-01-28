"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
var jwt = __importStar(require("jsonwebtoken"));
var auth = function (req, res, next) {
    try {
        var token = req.header("x-auth-token");
        if (!token)
            return res
                .status(401)
                .json({ msg: "no authentication token, authorization denied" });
        var vpd = process.env.JWT_SECRET ? process.env.JWT_SECRET : "";
        if (token) {
            var verifiedToken = jwt.verify(token, vpd);
            if (!verifiedToken) {
                return res
                    .status(401)
                    .json({ msg: "token verification failed, authorization denied" });
            }
            if (verifiedToken) {
                req.user = verifiedToken;
            }
        }
        next();
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.auth = auth;
