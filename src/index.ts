import * as CryptoJS from 'crypto-js'
import fetch from 'node-fetch';
import * as https from 'https'
import { hostname } from 'os';
import { resolve } from 'path';
import { rejects } from 'assert';
type Response = {
    payUrlWeb: string
    payUrlMobile: string
}
export class MomoPayment {
    private partnerCode: string;
    private accessKey: string;
    private secretKey: string;
    private endpoint: string;
    constructor({ partnerCode, accessKey, secretKey, endpoint }) {
        this.partnerCode = partnerCode;
        this.accessKey = accessKey;
        this.secretKey = secretKey;
        this.endpoint = endpoint;
    }

    async createPayment({ requestId, orderId, amount, orderInfo, redirectUrl, ipnUrl, extraData = '' }): Promise<Response>{
        try {
            if (!orderId || !amount || !orderInfo || !redirectUrl || !ipnUrl) {
                throw new Error('Invalid input');
            }

            const requestType = 'captureWallet';
            const rawSignature =
                'accessKey=' +
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
            const createHmacString = (privateKey, ts) => {
                    const hmac = CryptoJS.HmacSHA256(ts, privateKey).toString(CryptoJS.enc.Hex)
                    return hmac;
                }
            const signature = createHmacString(this.secretKey, rawSignature)
            
      
        const requestBody = JSON.stringify({
            partnerCode : this.partnerCode,
            accessKey : this.accessKey,
            requestId : requestId,
            amount : amount,
            orderId : orderId,
            orderInfo : orderInfo,
            redirectUrl : redirectUrl,
            ipnUrl : ipnUrl,
            extraData : extraData,
            requestType : requestType,
            signature : signature,
            lang: 'vi'
        });

        var option = {
            hostname: 'test-payment.momo.vn',
            port: 443,
            path: '/v2/gateway/api/create',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Content-Length': Buffer.byteLength(requestBody) }
        }
        return new Promise((resolve, reject) => {
            const req = https.request(option, res => {
                let responseData = '';

                res.setEncoding('utf8');
                res.on('data', (chunk) => {
                    responseData += chunk;
                    console.log(responseData)
                });
                res.on('end', () => {
                    const response: Response = {
                        payUrlWeb: JSON.parse(responseData).payUrl,
                        payUrlMobile: JSON.parse(responseData).deepLink
                    };
                    resolve(response);
                });
            })
            req.write(requestBody)
            req.end()
        })
        
        
        
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    

    async refundPayment({ requestId, orderId, amount, transId }) {
        if (!orderId || !amount || !transId || !requestId) {
            throw new Error('Invalid input');
        }

        const signatureRaw = `accessKey=${this.accessKey}&amount=${amount}&description=&orderId=${orderId}&partnerCode=${this.partnerCode}&requestId=${requestId}&transId=${transId}`;
        const createHmacString = (privateKey, ts) => {
            const hmac = CryptoJS.HmacSHA256(ts, privateKey).toString(CryptoJS.enc.Hex)
            return hmac;
        }
        const signature = createHmacString(this.secretKey, signatureRaw)

        const res = await fetch(`${this.endpoint}/v2/gateway/api/refund`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                requestId,
                partnerCode: this.partnerCode,
                orderId,
                amount,
                transId,
                lang: 'en',
                signature,
            }),
        });

        return await res.json();
    }

    verifySignature({
        signature,
        requestId,
        orderId,
        amount,
        orderInfo,
        orderType,
        transId,
        message,
        responseTime,
        resultCode,
        payType,
        extraData = '',
    }) {
        if (
            !requestId ||
            !amount ||
            !orderId ||
            !orderInfo ||
            !orderType ||
            !transId ||
            !message ||
            !responseTime
        ) {
            throw new Error('invalid input');
        }
        const signatureRaw = `accessKey=${this.accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${this.partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
        const createHmacString = (privateKey, ts) => {
            const hmac = CryptoJS.HmacSHA256(ts, privateKey).toString(CryptoJS.enc.Hex)
            return hmac;
        }
        const genSignature = createHmacString(this.secretKey, signatureRaw)

        return genSignature === signature;
    }

    async verifyPayment({
        partnerCode,
        orderId,
        requestId,
        amount,
        orderInfo,
        orderType,
        transId,
        resultCode,
        message,
        payType,
        responseTime,
        extraData,
        signature,
    }) {
        orderInfo = decodeURI(orderInfo);
        message = decodeURI(message);
        const signatureRaw = `accessKey=${this.accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

        const createHmacString = (privateKey, ts) => {
            const hmac = CryptoJS.HmacSHA256(ts, privateKey).toString(CryptoJS.enc.Hex)
            return hmac;
        }
        const signatureValue = createHmacString(this.secretKey, signatureRaw)
        if (resultCode.toString() !== '0') {
            throw new Error('The transaction was not completed.');
        }
        if (signatureValue !== signature) {
            throw new Error('The transaction was not completed.');
        }
        return {
            type: 'momo',
            orderId,
            requestId,
            amount,
            orderInfo,
            orderType,
            transId,
            resultCode,
            message,
            payType,
            responseTime,
            extraData,
        };

    }
}
