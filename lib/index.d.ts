declare type Response = {
    payUrlWeb: string;
    deepLink: string;
    qrPay: string;
};
export declare class MomoPayment {
    private partnerCode;
    private accessKey;
    private secretKey;
    private endpoint;
    constructor({ partnerCode, accessKey, secretKey, endpoint }: {
        partnerCode: any;
        accessKey: any;
        secretKey: any;
        endpoint: any;
    });
    createPayment({ requestId, orderId, amount, orderInfo, redirectUrl, ipnUrl, extraData }: {
        requestId: any;
        orderId: any;
        amount: any;
        orderInfo: any;
        redirectUrl: any;
        ipnUrl: any;
        extraData?: string | undefined;
    }): Promise<Response>;
    refundPayment({ requestId, orderId, amount, transId }: {
        requestId: any;
        orderId: any;
        amount: any;
        transId: any;
    }): Promise<any>;
    verifySignature({ signature, requestId, orderId, amount, orderInfo, orderType, transId, message, responseTime, resultCode, payType, extraData, }: {
        signature: any;
        requestId: any;
        orderId: any;
        amount: any;
        orderInfo: any;
        orderType: any;
        transId: any;
        message: any;
        responseTime: any;
        resultCode: any;
        payType: any;
        extraData?: string | undefined;
    }): boolean;
    verifyPayment({ partnerCode, orderId, requestId, amount, orderInfo, orderType, transId, resultCode, message, payType, responseTime, extraData, signature, }: {
        partnerCode: any;
        orderId: any;
        requestId: any;
        amount: any;
        orderInfo: any;
        orderType: any;
        transId: any;
        resultCode: any;
        message: any;
        payType: any;
        responseTime: any;
        extraData: any;
        signature: any;
    }): Promise<{
        type: string;
        orderId: any;
        requestId: any;
        amount: any;
        orderInfo: any;
        orderType: any;
        transId: any;
        resultCode: any;
        message: any;
        payType: any;
        responseTime: any;
        extraData: any;
    }>;
}
export {};
