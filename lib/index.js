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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MomoPayment = void 0;
var CryptoJS = require("crypto-js");
var node_fetch_1 = require("node-fetch");
var https = require("https");
var MomoPayment = /** @class */ (function () {
    function MomoPayment(_a) {
        var partnerCode = _a.partnerCode, accessKey = _a.accessKey, secretKey = _a.secretKey, endpoint = _a.endpoint;
        this.partnerCode = partnerCode;
        this.accessKey = accessKey;
        this.secretKey = secretKey;
        this.endpoint = endpoint;
    }
    MomoPayment.prototype.createPayment = function (_a) {
        var requestId = _a.requestId, orderId = _a.orderId, amount = _a.amount, orderInfo = _a.orderInfo, redirectUrl = _a.redirectUrl, ipnUrl = _a.ipnUrl, _b = _a.extraData, extraData = _b === void 0 ? '' : _b;
        return __awaiter(this, void 0, void 0, function () {
            var requestType, rawSignature, createHmacString, signature, requestBody_1, option;
            return __generator(this, function (_c) {
                try {
                    if (!orderId || !amount || !orderInfo || !redirectUrl || !ipnUrl) {
                        throw new Error('Invalid input');
                    }
                    requestType = 'captureWallet';
                    rawSignature = 'accessKey=' +
                        this.accessKey +
                        '&amount=' +
                        amount +
                        '&extraData=' +
                        extraData +
                        '&ipnUrl=' +
                        ipnUrl +
                        '&orderId=' +
                        orderId +
                        '&orderInfo=' +
                        orderInfo +
                        '&partnerCode=' +
                        this.partnerCode +
                        '&redirectUrl=' +
                        redirectUrl +
                        '&requestId=' +
                        requestId +
                        '&requestType=' +
                        requestType;
                    createHmacString = function (privateKey, ts) {
                        var hmac = CryptoJS.HmacSHA256(ts, privateKey).toString(CryptoJS.enc.Hex);
                        return hmac;
                    };
                    signature = createHmacString(this.secretKey, rawSignature);
                    requestBody_1 = JSON.stringify({
                        partnerCode: this.partnerCode,
                        accessKey: this.accessKey,
                        requestId: requestId,
                        amount: amount,
                        orderId: orderId,
                        orderInfo: orderInfo,
                        redirectUrl: redirectUrl,
                        ipnUrl: ipnUrl,
                        extraData: extraData,
                        requestType: requestType,
                        signature: signature,
                        lang: 'vi'
                    });
                    option = {
                        hostname: 'test-payment.momo.vn',
                        port: 443,
                        path: '/v2/gateway/api/create',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json; charset=UTF-8',
                            'Content-Length': Buffer.byteLength(requestBody_1)
                        }
                    };
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            var req = https.request(option, function (res) {
                                var responseData = '';
                                res.setEncoding('utf8');
                                res.on('data', function (chunk) {
                                    responseData += chunk;
                                });
                                res.on('end', function () {
                                    var response = {
                                        payUrl: JSON.parse(responseData).payUrl
                                    };
                                    resolve(response);
                                });
                            });
                            req.write(requestBody_1);
                            req.end();
                        })];
                }
                catch (error) {
                    console.log(error);
                    throw error;
                }
                return [2 /*return*/];
            });
        });
    };
    MomoPayment.prototype.refundPayment = function (_a) {
        var requestId = _a.requestId, orderId = _a.orderId, amount = _a.amount, transId = _a.transId;
        return __awaiter(this, void 0, void 0, function () {
            var signatureRaw, createHmacString, signature, res;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!orderId || !amount || !transId || !requestId) {
                            throw new Error('Invalid input');
                        }
                        signatureRaw = "accessKey=".concat(this.accessKey, "&amount=").concat(amount, "&description=&orderId=").concat(orderId, "&partnerCode=").concat(this.partnerCode, "&requestId=").concat(requestId, "&transId=").concat(transId);
                        createHmacString = function (privateKey, ts) {
                            var hmac = CryptoJS.HmacSHA256(ts, privateKey).toString(CryptoJS.enc.Hex);
                            return hmac;
                        };
                        signature = createHmacString(this.secretKey, signatureRaw);
                        return [4 /*yield*/, (0, node_fetch_1.default)("".concat(this.endpoint, "/v2/gateway/api/refund"), {
                                method: 'POST',
                                headers: { 'content-type': 'application/json' },
                                body: JSON.stringify({
                                    requestId: requestId,
                                    partnerCode: this.partnerCode,
                                    orderId: orderId,
                                    amount: amount,
                                    transId: transId,
                                    lang: 'en',
                                    signature: signature,
                                }),
                            })];
                    case 1:
                        res = _b.sent();
                        return [4 /*yield*/, res.json()];
                    case 2: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    MomoPayment.prototype.verifySignature = function (_a) {
        var signature = _a.signature, requestId = _a.requestId, orderId = _a.orderId, amount = _a.amount, orderInfo = _a.orderInfo, orderType = _a.orderType, transId = _a.transId, message = _a.message, responseTime = _a.responseTime, resultCode = _a.resultCode, payType = _a.payType, _b = _a.extraData, extraData = _b === void 0 ? '' : _b;
        if (!requestId ||
            !amount ||
            !orderId ||
            !orderInfo ||
            !orderType ||
            !transId ||
            !message ||
            !responseTime) {
            throw new Error('invalid input');
        }
        var signatureRaw = "accessKey=".concat(this.accessKey, "&amount=").concat(amount, "&extraData=").concat(extraData, "&message=").concat(message, "&orderId=").concat(orderId, "&orderInfo=").concat(orderInfo, "&orderType=").concat(orderType, "&partnerCode=").concat(this.partnerCode, "&payType=").concat(payType, "&requestId=").concat(requestId, "&responseTime=").concat(responseTime, "&resultCode=").concat(resultCode, "&transId=").concat(transId);
        var createHmacString = function (privateKey, ts) {
            var hmac = CryptoJS.HmacSHA256(ts, privateKey).toString(CryptoJS.enc.Hex);
            return hmac;
        };
        var genSignature = createHmacString(this.secretKey, signatureRaw);
        return genSignature === signature;
    };
    MomoPayment.prototype.verifyPayment = function (_a) {
        var partnerCode = _a.partnerCode, orderId = _a.orderId, requestId = _a.requestId, amount = _a.amount, orderInfo = _a.orderInfo, orderType = _a.orderType, transId = _a.transId, resultCode = _a.resultCode, message = _a.message, payType = _a.payType, responseTime = _a.responseTime, extraData = _a.extraData, signature = _a.signature;
        return __awaiter(this, void 0, void 0, function () {
            var signatureRaw, createHmacString, signatureValue;
            return __generator(this, function (_b) {
                orderInfo = decodeURI(orderInfo);
                message = decodeURI(message);
                signatureRaw = "accessKey=".concat(this.accessKey, "&amount=").concat(amount, "&extraData=").concat(extraData, "&message=").concat(message, "&orderId=").concat(orderId, "&orderInfo=").concat(orderInfo, "&orderType=").concat(orderType, "&partnerCode=").concat(partnerCode, "&payType=").concat(payType, "&requestId=").concat(requestId, "&responseTime=").concat(responseTime, "&resultCode=").concat(resultCode, "&transId=").concat(transId);
                createHmacString = function (privateKey, ts) {
                    var hmac = CryptoJS.HmacSHA256(ts, privateKey).toString(CryptoJS.enc.Hex);
                    return hmac;
                };
                signatureValue = createHmacString(this.secretKey, signatureRaw);
                if (resultCode.toString() !== '0') {
                    throw new Error('The transaction was not completed.');
                }
                if (signatureValue !== signature) {
                    throw new Error('The transaction was not completed.');
                }
                return [2 /*return*/, {
                        type: 'momo',
                        orderId: orderId,
                        requestId: requestId,
                        amount: amount,
                        orderInfo: orderInfo,
                        orderType: orderType,
                        transId: transId,
                        resultCode: resultCode,
                        message: message,
                        payType: payType,
                        responseTime: responseTime,
                        extraData: extraData,
                    }];
            });
        });
    };
    return MomoPayment;
}());
exports.MomoPayment = MomoPayment;
