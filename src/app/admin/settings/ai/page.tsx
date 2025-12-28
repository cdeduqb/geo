import { db } from '@/lib/db';
import AIConfigContainer from './_components/AIConfigContainer';

export const metadata = {
    title: 'AI 配置 - GeoCMS 管理后台',
};

export default async function AISettingsPage() {
    const configs = await db.aIConfig.findMany({
        orderBy: { priority: 'desc' },
    });

    // Mask API keys and Secret keys
    const maskedConfigs = configs.map(config => ({
        ...config,
        apiKey: config.apiKey ? `${config.apiKey.substring(0, 3)}...${config.apiKey.substring(config.apiKey.length - 4)}` : '',
        secretKey: (config as any).secretKey ? `${(config as any).secretKey.substring(0, 3)}...${(config as any).secretKey.substring((config as any).secretKey.length - 4)}` : undefined,
    }));

    return <AIConfigContainer configs={maskedConfigs} />;
}
