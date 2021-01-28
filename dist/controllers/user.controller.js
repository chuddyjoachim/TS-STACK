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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.loginUser = exports.createUsers = exports.getUsers = void 0;
var typeorm_1 = require("typeorm");
var User_1 = require("../entity/User");
var jwt = __importStar(require("jsonwebtoken"));
var dotenv = __importStar(require("dotenv"));
var bcrypt = __importStar(require("bcrypt"));
dotenv.config();
// get all users
var getUsers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, typeorm_1.getRepository(User_1.User)
                    .find()
                    .catch(function (err) {
                    console.log(err);
                })];
            case 1:
                users = _a.sent();
                return [2 /*return*/, res.json(users)];
        }
    });
}); };
exports.getUsers = getUsers;
// create a user
var createUsers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var saltRounds, salt, hash, users, newUser, createUser, results, username;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                saltRounds = 10;
                salt = bcrypt.genSaltSync(saltRounds);
                hash = bcrypt.hashSync(req.body.password, salt);
                return [4 /*yield*/, typeorm_1.getRepository(User_1.User)
                        .findOne({ email: req.body.email })
                        .catch(function (err) {
                        console.log(err);
                    })];
            case 1:
                users = _a.sent();
                if (!!users) return [3 /*break*/, 4];
                createUser = typeorm_1.getRepository(User_1.User).create({
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    username: req.body.username,
                    password: hash
                });
                return [4 /*yield*/, typeorm_1.getRepository(User_1.User)
                        .save(createUser)
                        .catch(function (err) {
                        console.log(err);
                    })];
            case 2:
                results = _a.sent();
                console.log(results);
                return [4 /*yield*/, typeorm_1.getRepository(User_1.User)
                        .findOne({ email: req.body.email })
                        .catch(function (err) {
                        console.log(err);
                    })];
            case 3:
                newUser = _a.sent();
                _a.label = 4;
            case 4:
                if (users) {
                    return [2 /*return*/, res.status(400).json({ msg: "user already exist" })];
                }
                username = req.body.username;
                if (!username) {
                    username = req.body.email;
                }
                return [2 /*return*/, res.json([
                        {
                            msg: "user " + username + " created successfully"
                        }
                    ])];
        }
    });
}); };
exports.createUsers = createUsers;
// login
var loginUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, username, password, users, isMatch, token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = req.body.email;
                username = req.body.username;
                password = req.body.password;
                if (!email || !password)
                    return [2 /*return*/, res.status(400).json({ msg: "Not All Fields Have Been Entered" })];
                return [4 /*yield*/, typeorm_1.getRepository(User_1.User)
                        .findOne({ email: email })
                        .catch(function (err) {
                        console.log(err);
                    })];
            case 1:
                users = _a.sent();
                if (!users) {
                    return [2 /*return*/, res.status(400).json({ msg: "user does not exist" })];
                }
                if (!users) return [3 /*break*/, 3];
                return [4 /*yield*/, bcrypt.compare(password, users.password)];
            case 2:
                isMatch = _a.sent();
                if (!isMatch) {
                    return [2 /*return*/, res.status(400).json({ msg: "user credentials is incorrect" })];
                }
                token = jwt.sign({ id: users.id }, process.env.JWT_SECRET ? process.env.JWT_SECRET : "");
                return [2 /*return*/, res.json({
                        token: token,
                        email: users.email,
                        username: users.username
                    })];
            case 3: return [2 /*return*/, res.json(users)];
        }
    });
}); };
exports.loginUser = loginUser;
// delete users
var deleteUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, deletedUser, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, typeorm_1.getRepository(User_1.User)
                        .findOne({ id: req.user.id })
                        .catch(function (err) {
                        console.log(err);
                    })];
            case 1:
                user = _a.sent();
                return [4 /*yield*/, typeorm_1.getRepository(User_1.User)
                        .delete({ id: req.user.id })
                        .catch(function (err) {
                        console.log(err);
                    })];
            case 2:
                deletedUser = _a.sent();
                if (user)
                    return [2 /*return*/, res.send({ msg: "user " + user.username + " deleted" })];
                if (!user)
                    return [2 /*return*/, res.status(400).json({ msg: "user not found" })];
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                res.status(500).json({ error: err_1.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteUser = deleteUser;
