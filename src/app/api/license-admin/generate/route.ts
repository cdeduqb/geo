import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient as LicenseClient } from '@prisma/client-license';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const licenseDb = new LicenseClient();

/**
 * POST /api/license-admin/generate
 * 生成授权码
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { customerId, plan, domains, maxActivations, validityDays, features } = body;

        if (!customerId || !plan) {
            return NextResponse.json(
                { error: '客户和套餐不能为空' },
                { status: 400 }
            );
        }

        // 生成授权码
        const licenseCode = generateLicenseCode();

        // 计算有效期
        const issuedAt = new Date();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + (validityDays || 365));

        // 处理域名
        const domainArray = domains ? domains.split(',').map((d: string) => d.trim()).filter(Boolean) : [];

        // 准备授权数据
        const licenseData = {
            licenseCode,
            customerId,
            plan,
            features: features || {},
            domains: domainArray,
            maxActivations: maxActivations || 1,
            currentActivations: 0,
            issuedAt,
            expiresAt,
            status: 'active',
            version: '1.0'
        };

        // 生成RSA签名
        const signature = await signLicense(licenseData);

        // 保存到数据库
        const license = await licenseDb.license.create({
            data: {
                ...licenseData,
                signature
            }
        });

        return NextResponse.json({
            success: true,
            license: {
                ...license,
                licenseCode: license.licenseCode
            }
        });

    } catch (error) {
        console.error('Generate license error:', error);
        return NextResponse.json(
            { error: '生成授权失败' },
            { status: 500 }
        );
    }
}

/**
 * 生成授权码
 */
function generateLicenseCode(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `LIC-2024-${timestamp}-${random}`;
}

/**
 * 签名授权数据
 */
async function signLicense(data: any): Promise<string> {
    try {
        const keysDir = path.join(process.cwd(), '.keys');
        const privateKeyPath = path.join(keysDir, 'private.pem');

        if (!fs.existsSync(privateKeyPath)) {
            console.warn('RSA私钥不存在，返回临时签名');
            return 'TEMP-SIGNATURE-' + crypto.randomBytes(32).toString('hex');
        }

        const privateKey = fs.readFileSync(privateKeyPath, 'utf-8');
        const { signature, ...dataWithoutSignature } = data;
        const dataString = JSON.stringify(dataWithoutSignature);

        const NodeRSA = require('node-rsa');
        const key = new NodeRSA(privateKey);
        return key.sign(dataString, 'base64');

    } catch (error) {
        console.error('Sign error:', error);
        return 'ERROR-SIGNATURE-' + crypto.randomBytes(32).toString('hex');
    }
}
