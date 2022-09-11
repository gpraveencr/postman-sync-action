"use strict";
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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
exports.__esModule = true;
var core = require("@actions/core");
var glob = require("@actions/glob");
var fs_1 = require("fs");
var axios_1 = require("axios");
var localPostmanCollections = [];
var localPostmanCollectionFileMap = new Map();
var remotePostmanCollectionsMap = new Map();
var restClient = axios_1["default"].create({
    baseURL: 'https://api.getpostman.com',
    timeout: Number(core.getInput('postmanTimeout')) || 15000,
    headers: {
        'X-Api-Key': 'PMAK-631409b508515e302283b6db-a2c639ad86ff751396fce876972744d357'
    }
});
var postmanWorkspaceId = '87bf7eea-3c86-4e3c-8888-0e7901d31727';
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, Promise.all([
                            loadLocalPostmanCollections(),
                            loadRemotePostmanCollections()
                        ])];
                case 1:
                    _a.sent();
                    if (localPostmanCollections.length === 0) {
                        // No local postman collections found so exit early
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, Promise.all(localPostmanCollections.map(function (localCollection) { return __awaiter(_this, void 0, void 0, function () {
                            var remoteCollection, response, createURi, oldId, localPath, error_2;
                            var _a, _b, _c, _d, _e, _f, _g, _h;
                            return __generator(this, function (_j) {
                                switch (_j.label) {
                                    case 0:
                                        _j.trys.push([0, 7, , 8]);
                                        remoteCollection = remotePostmanCollectionsMap.get(localCollection.info.name);
                                        response = void 0;
                                        if (!!remoteCollection) return [3 /*break*/, 4];
                                        createURi = postmanWorkspaceId
                                            ? "/collections?workspace=".concat(postmanWorkspaceId)
                                            : "/collections";
                                        return [4 /*yield*/, restClient.post(createURi, {
                                                collection: localCollection
                                            })];
                                    case 1:
                                        response = _j.sent();
                                        if (!(localCollection.info._postman_id !== response.data.collection.id)) return [3 /*break*/, 3];
                                        oldId = localCollection.info._postman_id;
                                        localPath = localPostmanCollectionFileMap.get(oldId);
                                        if (!localPath) return [3 /*break*/, 3];
                                        localCollection.info._postman_id = response.data.collection.id;
                                        return [4 /*yield*/, fs_1.promises.writeFile(localPath, JSON.stringify(localCollection, null, '\t'))];
                                    case 2:
                                        _j.sent();
                                        _j.label = 3;
                                    case 3:
                                        localCollection.info._postman_id = response.data.collection.id;
                                        return [3 /*break*/, 6];
                                    case 4: return [4 /*yield*/, restClient.put("/collections/".concat(remoteCollection.uid), {
                                            collection: localCollection
                                        })];
                                    case 5:
                                        // This is the tricky bit, I don't want to compare if collections are different so always trigger the PUT Request
                                        // Consider using the GitHub Action trigger filters to only execute this action when json files change
                                        response = _j.sent();
                                        _j.label = 6;
                                    case 6:
                                        core.info("Successfully ".concat(remoteCollection ? 'updated' : 'created', " collection ").concat((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.collection) === null || _b === void 0 ? void 0 : _b.name, " with Postman ID ").concat((_d = (_c = response.data) === null || _c === void 0 ? void 0 : _c.collection) === null || _d === void 0 ? void 0 : _d.id));
                                        return [3 /*break*/, 8];
                                    case 7:
                                        error_2 = _j.sent();
                                        core.error("Status ".concat((_e = error_2.response) === null || _e === void 0 ? void 0 : _e.status, " - Unable to process collection ").concat(localCollection.info.name, " with Postman ID ").concat(localCollection.info._postman_id, " due to: ").concat((_h = (_g = (_f = error_2.response) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g.error) === null || _h === void 0 ? void 0 : _h.message));
                                        core.setFailed("Errors processing Postman Collection(s) - Please see the output above");
                                        return [3 /*break*/, 8];
                                    case 8: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    core.setFailed(error_1.message);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function loadRemotePostmanCollections() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var data, _i, _c, remoteCollection, error_3;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, restClient.get("/collections?workspace=".concat(postmanWorkspaceId))];
                case 1:
                    data = (_d.sent()).data;
                    for (_i = 0, _c = data.collections; _i < _c.length; _i++) {
                        remoteCollection = _c[_i];
                        remotePostmanCollectionsMap.set(remoteCollection.name, remoteCollection);
                    }
                    core.info("".concat(remotePostmanCollectionsMap.size, " Collection(s) found for the given API Key in Remote Postman"));
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _d.sent();
                    core.setFailed("Status ".concat((_a = error_3.response) === null || _a === void 0 ? void 0 : _a.status, " - Response: ").concat((_b = error_3.response) === null || _b === void 0 ? void 0 : _b.data));
                    throw new Error("Unable to fetch Remote Collections from Postman Workspace");
                case 3: return [2 /*return*/];
            }
        });
    });
}
function loadLocalPostmanCollections() {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function () {
        var jsonPattern, globber, files, _b, _c, file, e_1_1;
        var _this = this;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    jsonPattern = "**/*.json";
                    return [4 /*yield*/, glob.create(jsonPattern)];
                case 1:
                    globber = _d.sent();
                    files = [];
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, 7, 8, 13]);
                    _b = __asyncValues(globber.globGenerator());
                    _d.label = 3;
                case 3: return [4 /*yield*/, _b.next()];
                case 4:
                    if (!(_c = _d.sent(), !_c.done)) return [3 /*break*/, 6];
                    file = _c.value;
                    // Store the file name(s)
                    files.push(file);
                    _d.label = 5;
                case 5: return [3 /*break*/, 3];
                case 6: return [3 /*break*/, 13];
                case 7:
                    e_1_1 = _d.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 13];
                case 8:
                    _d.trys.push([8, , 11, 12]);
                    if (!(_c && !_c.done && (_a = _b["return"]))) return [3 /*break*/, 10];
                    return [4 /*yield*/, _a.call(_b)];
                case 9:
                    _d.sent();
                    _d.label = 10;
                case 10: return [3 /*break*/, 12];
                case 11:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 12: return [7 /*endfinally*/];
                case 13:
                    core.info("".concat(files.length, " JSON File(s) Found"));
                    if (files.length === 0) {
                        return [2 /*return*/];
                    }
                    // Wait for all files to be processed before progressing
                    return [4 /*yield*/, Promise.all(files.map(function (file) { return __awaiter(_this, void 0, void 0, function () {
                            var jsonContent, _a, _b, e_2;
                            var _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        _d.trys.push([0, 2, , 3]);
                                        _b = (_a = JSON).parse;
                                        return [4 /*yield*/, fs_1.promises.readFile(file)];
                                    case 1:
                                        jsonContent = _b.apply(_a, [(_d.sent()).toString()]);
                                        // Check if the JSON file is a "valid" Postman v2.1 Collection, when true store in array
                                        if (((_c = jsonContent === null || jsonContent === void 0 ? void 0 : jsonContent.info) === null || _c === void 0 ? void 0 : _c.schema) ===
                                            "https://schema.getpostman.com/json/collection/v2.1.0/collection.json") {
                                            localPostmanCollections.push(jsonContent);
                                            localPostmanCollectionFileMap.set(jsonContent.info.name, file);
                                        }
                                        return [3 /*break*/, 3];
                                    case 2:
                                        e_2 = _d.sent();
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 14:
                    // Wait for all files to be processed before progressing
                    _d.sent();
                    core.info("".concat(localPostmanCollections.length, " JSON Postman Collection(s) found"));
                    return [2 /*return*/];
            }
        });
    });
}
run();
