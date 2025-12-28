declare module 'ali-oss' {
    interface OSSOptions {
        region: string;
        accessKeyId: string;
        accessKeySecret: string;
        bucket: string;
        endpoint?: string;
        secure?: boolean;
        timeout?: number;
    }

    interface PutResult {
        name: string;
        url: string;
        res: any;
    }

    interface DeleteResult {
        res: any;
    }

    class OSS {
        options: OSSOptions;
        constructor(options: OSSOptions);
        put(name: string, file: Buffer | string, options?: any): Promise<PutResult>;
        delete(name: string, options?: any): Promise<DeleteResult>;
        head(name: string, options?: any): Promise<any>;
        signatureUrl(name: string, options?: any): string;
    }

    export = OSS;
}

