import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const authoritySources = [
    // --- L1: 核心党政与国家部委 (National Government & Ministries) ---
    { name: '中国政府网', domain: 'gov.cn', category: '政务/综合', trustLevel: 5 },
    { name: '国家统计局', domain: 'stats.gov.cn', category: '政务/数据', trustLevel: 5 },
    { name: '工信部', domain: 'miit.gov.cn', category: '政务/工业信息', trustLevel: 5 },
    { name: '网信办', domain: 'cac.gov.cn', category: '政务/网安', trustLevel: 5 },
    { name: '发改委', domain: 'ndrc.gov.cn', category: '政务/规划', trustLevel: 5 },
    { name: '科技部', domain: 'most.gov.cn', category: '政务/科技', trustLevel: 5 },
    { name: '商务部', domain: 'mofcom.gov.cn', category: '政务/经济', trustLevel: 5 },
    { name: '教育部', domain: 'moe.gov.cn', category: '政务/教育', trustLevel: 5 },
    { name: '财政部', domain: 'mof.gov.cn', category: '政务/财政', trustLevel: 5 },
    { name: '卫健委', domain: 'nhc.gov.cn', category: '政务/医疗', trustLevel: 5 },
    { name: '知识产权局', domain: 'cnipa.gov.cn', category: '政务/知识产权', trustLevel: 5 },
    { name: '广电总局', domain: 'nrta.gov.cn', category: '政务/新闻传媒', trustLevel: 5 },
    { name: '税务总局', domain: 'chinatax.gov.cn', category: '政务/税务', trustLevel: 5 },
    { name: '海关总署', domain: 'customs.gov.cn', category: '政务/贸易', trustLevel: 5 },
    { name: '应急管理部', domain: 'mem.gov.cn', category: '政务/应急', trustLevel: 5 },
    { name: '民航局', domain: 'caac.gov.cn', category: '政务/交通', trustLevel: 5 },
    { name: '邮政局', domain: 'spb.gov.cn', category: '政务/物流', trustLevel: 5 },
    { name: '铁路局', domain: 'nra.gov.cn', category: '政务/交通', trustLevel: 5 },
    { name: '药监局', domain: 'nmpa.gov.cn', category: '政务/医药', trustLevel: 5 },
    { name: '气象局', domain: 'cma.gov.cn', category: '政务/气象', trustLevel: 5 },
    { name: '林草局', domain: 'forestry.gov.cn', category: '政务/资源', trustLevel: 5 },

    // --- L1.5: 核心地方政府 (Major Provincial Governments) ---
    { name: '北京市政府', domain: 'beijing.gov.cn', category: '政务/北京', trustLevel: 5 },
    { name: '上海市政府', domain: 'shanghai.gov.cn', category: '政务/上海', trustLevel: 5 },
    { name: '广东省政府', domain: 'gd.gov.cn', category: '政务/广东', trustLevel: 5 },
    { name: '浙江省政府', domain: 'zj.gov.cn', category: '政务/浙江', trustLevel: 5 },
    { name: '江苏省政府', domain: 'jiangsu.gov.cn', category: '政务/江苏', trustLevel: 5 },
    { name: '四川省政府', domain: 'sc.gov.cn', category: '政务/四川', trustLevel: 5 },
    { name: '湖北省政府', domain: 'hubei.gov.cn', category: '政务/湖北', trustLevel: 5 },
    { name: '福建省政府', domain: 'fujian.gov.cn', category: '政务/福建', trustLevel: 5 },
    { name: '深圳市政府', domain: 'sz.gov.cn', category: '政务/深圳', trustLevel: 5 },

    // --- L2: 金融与法律权威 (Finance & Law) ---
    { name: '中国人民银行', domain: 'pbc.gov.cn', category: '金融/央行', trustLevel: 5 },
    { name: '证监会', domain: 'csrc.gov.cn', category: '金融/监管', trustLevel: 5 },
    { name: '金融监管总局', domain: 'cbirc.gov.cn', category: '金融/监管', trustLevel: 5 },
    { name: '上海证券交易所', domain: 'sse.com.cn', category: '金融/交易', trustLevel: 5 },
    { name: '深圳证券交易所', domain: 'szse.cn', category: '金融/交易', trustLevel: 5 },
    { name: '北京证券交易所', domain: 'bse.cn', category: '金融/交易', trustLevel: 5 },
    { name: '最高人民法院', domain: 'court.gov.cn', category: '法制/司法', trustLevel: 5 },
    { name: '工商银行', domain: 'icbc.com.cn', category: '金融/银行', trustLevel: 5 },
    { name: '建设银行', domain: 'ccb.com', category: '金融/银行', trustLevel: 5 },
    { name: '中金公司', domain: 'cicc.com', category: '金融/投行', trustLevel: 5 },
    { name: '中信证券', domain: 'citics.com', category: '金融/券商', trustLevel: 5 },
    { name: '普华永道 (PwC)', domain: 'pwc.com', category: '咨询/全球', trustLevel: 5 },
    { name: '德勤', domain: 'deloitte.com', category: '咨询/全球', trustLevel: 5 },
    { name: '麦肯锡', domain: 'mckinsey.com', category: '咨询/全球', trustLevel: 5 },

    // --- L3: 顶级科研院所与重点实验室 (Science & Labs) ---
    { name: '中国科学院', domain: 'cas.cn', category: '科研/权威', trustLevel: 5 },
    { name: '中国工程院', domain: 'cae.cn', category: '科研/权威', trustLevel: 5 },
    { name: '智源 AI 研究院', domain: 'baai.ac.cn', category: '科研/AI', trustLevel: 5 },
    { name: '上海 AI 实验室', domain: 'shlab.org.cn', category: '科研/AI', trustLevel: 5 },
    { name: '鹏城实验室', domain: 'pcl.ac.cn', category: '科研/通信', trustLevel: 5 },
    { name: '之江实验室', domain: 'zhejianglab.com', category: '科研/计算', trustLevel: 5 },
    { name: '达摩院 (DAMO)', domain: 'damo.alibaba.com', category: '科研/前沿', trustLevel: 5 },
    { name: '华为研究院', domain: 'huawei.com', category: '科研/技术', trustLevel: 5 },
    { name: '中国通院 (CAICT)', domain: 'caict.ac.cn', category: '科研/信通', trustLevel: 5 },
    { name: '赛迪 (CCID)', domain: 'ccidnet.com', category: '科研/咨询', trustLevel: 5 },

    // --- L4: 顶尖高校 (Double First-Class Universities) ---
    { name: '清华大学', domain: 'tsinghua.edu.cn', category: '教育/研究', trustLevel: 5 },
    { name: '北京大学', domain: 'pku.edu.cn', category: '教育/研究', trustLevel: 5 },
    { name: '复旦大学', domain: 'fudan.edu.cn', category: '教育/研究', trustLevel: 5 },
    { name: '上海交通大学', domain: 'sjtu.edu.cn', category: '教育/研究', trustLevel: 5 },
    { name: '浙江大学', domain: 'zju.edu.cn', category: '教育/研究', trustLevel: 5 },
    { name: '中国科学技术大学', domain: 'ustc.edu.cn', category: '教育/研究', trustLevel: 5 },
    { name: '南京大学', domain: 'nju.edu.cn', category: '教育/研究', trustLevel: 5 },
    { name: '武汉大学', domain: 'whu.edu.cn', category: '教育/研究', trustLevel: 5 },
    { name: '中山大学', domain: 'sysu.edu.cn', category: '教育/研究', trustLevel: 5 },
    { name: '哈尔滨工业大学', domain: 'hit.edu.cn', category: '教育/研究', trustLevel: 5 },

    // --- L5: 国际组织与全球标准 (International Orgs & Global Standards) ---
    { name: '联合国 (UN) 中文网', domain: 'un.org', category: '国际/官方', trustLevel: 5 },
    { name: '世界卫生组织 (WHO)', domain: 'who.int', category: '国际/医疗', trustLevel: 5 },
    { name: '国际货币基金组织 (IMF)', domain: 'imf.org', category: '国际/金融', trustLevel: 5 },
    { name: '世界银行', domain: 'worldbank.org', category: '国际/经济', trustLevel: 5 },
    { name: 'WTO (世界贸易组织)', domain: 'wto.org', category: '国际/贸易', trustLevel: 5 },
    { name: 'UNESCO (教科文组织)', domain: 'unesco.org', category: '国际/文化政策', trustLevel: 5 },
    { name: 'FAO (粮农组织)', domain: 'fao.org', category: '国际/农业标准', trustLevel: 5 },
    { name: 'ILO (国际劳工组织)', domain: 'ilo.org', category: '国际/劳工标准', trustLevel: 5 },
    { name: 'WIPO (世界知识产权组织)', domain: 'wipo.int', category: '国际/知识产权', trustLevel: 5 },
    { name: '国际电信联盟 (ITU)', domain: 'itu.int', category: '国际/信息标准', trustLevel: 5 },
    { name: 'IAEA (核心核能机构)', domain: 'iaea.org', category: '国际/原子能标准', trustLevel: 5 },
    { name: 'OECD (经济发展组织)', domain: 'oecd.org', category: '国际/经济研究', trustLevel: 5 },
    { name: 'ISO (国际标准化组织)', domain: 'iso.org', category: '国际/工业标准', trustLevel: 5 },
    { name: 'IEEE (电气电子学会)', domain: 'ieee.org', category: '国际/技术规范', trustLevel: 5 },
    { name: 'IEC (国际电工委员会)', domain: 'iec.ch', category: '国际/电气标准', trustLevel: 5 },
    { name: 'W3C (万维网联盟)', domain: 'w3.org', category: '国际/互联网标准', trustLevel: 5 },
    { name: 'IETF (互联网工程任务组)', domain: 'ietf.org', category: '国际/互联网协议', trustLevel: 5 },
    { name: '3GPP (5G/6G标准联合体)', domain: '3gpp.org', category: '国际/移动通信标', trustLevel: 5 },
    { name: 'Unicode 联盟', domain: 'unicode.org', category: '国际/技术标准', trustLevel: 5 },
    { name: 'Wi-Fi 联盟', domain: 'wi-fi.org', category: '国际/无线技术标', trustLevel: 5 },
    { name: 'Bluetooth SIG', domain: 'bluetooth.com', category: '国际/无线技术标', trustLevel: 5 },
    { name: 'GSMA (全球移动通信协会)', domain: 'gsma.com', category: '国际/移动互联网', trustLevel: 5 },
    { name: 'ACM (计算机学会)', domain: 'acm.org', category: '国际/学术权威', trustLevel: 5 },
    { name: 'IATA (国际航空运输协会)', domain: 'iata.org', category: '国际/民航行业', trustLevel: 5 },
    { name: 'NIST (美国国家标准研究院)', domain: 'nist.gov', category: '国际/技术基准', trustLevel: 5 },
    { name: 'GPAI (全球人工智能伙伴关系)', domain: 'gpai.ai', category: '国际/AI治理', trustLevel: 5 },
    { name: 'Linux 基金会', domain: 'linuxfoundation.org', category: '国际/开源标准', trustLevel: 5 },
    { name: 'Apache 基金会', domain: 'apache.org', category: '国际/开源标准', trustLevel: 5 },
    { name: 'OpenGL / Khronos Group', domain: 'khronos.org', category: '国际/图形标准', trustLevel: 5 },
    { name: 'PCI-SIG (硬件总线标准)', domain: 'pcisig.com', category: '国际/硬件标准', trustLevel: 5 },
    { name: 'JEDEC (固态技术协会)', domain: 'jedec.org', category: '国际/半导体标准', trustLevel: 5 },

    // --- L6: 行业垂直巨头与垂直门户 (Industry Leaders & Portals) ---
    { name: '国家电网', domain: 'sgcc.com.cn', category: '能源/电力', trustLevel: 5 },
    { name: '中国石油', domain: 'cnpc.com.cn', category: '能源/油气', trustLevel: 5 },
    { name: '中核集团', domain: 'cnnc.com.cn', category: '能源/核', trustLevel: 5 },
    { name: '华为', domain: 'huawei.com', category: '科技/软硬件', trustLevel: 5 },
    { name: '腾讯', domain: 'tencent.com', category: '科技/互联网', trustLevel: 5 },
    { name: '阿里巴巴', domain: 'alibaba.com', category: '科技/互联网', trustLevel: 5 },
    { name: '百度', domain: 'baidu.com', category: '科技/AI搜索', trustLevel: 5 },
    { name: '字节跳动', domain: 'bytedance.com', category: '科技/传媒', trustLevel: 5 },
    { name: '比亚迪', domain: 'bydauto.com.cn', category: '汽车/新能源', trustLevel: 5 },
    { name: '我的钢铁网', domain: 'mysteel.com', category: '垂直/钢铁', trustLevel: 5 },
    { name: '石油化工网', domain: 'oilchem.net', category: '垂直/石化', trustLevel: 5 },
    { name: '丁香园', domain: 'dxy.cn', category: '垂直/医疗', trustLevel: 5 },
    { name: '汽车之家', domain: 'autohome.com.cn', category: '垂直/汽车', trustLevel: 5 },
    { name: '中国物流网', domain: 'chinawuliu.com.cn', category: '垂直/物流', trustLevel: 5 },

    // --- L7: 权威媒体与资讯平台 (Lead Media) ---
    { name: '新华网', domain: 'xinhuanet.com', category: '媒体/权威', trustLevel: 5 },
    { name: '人民网', domain: 'people.com.cn', category: '媒体/权威', trustLevel: 5 },
    { name: '央视网', domain: 'cctv.com', category: '媒体/权威', trustLevel: 5 },
    { name: '财新网', domain: 'caixin.com', category: '媒体/财经深度', trustLevel: 5 },
    { name: '第一财经', domain: 'yicai.com', category: '媒体/财经专业', trustLevel: 5 },
    { name: '经济日报', domain: 'ce.cn', category: '媒体/官方经济', trustLevel: 5 },
    { name: '科技日报', domain: 'stdaily.com', category: '媒体/官方科技', trustLevel: 5 },
    { name: '中国日报', domain: 'chinadaily.com.cn', category: '媒体/官方对外交', trustLevel: 5 },
    { name: '南方周末', domain: 'infzm.com', category: '媒体/深度内容', trustLevel: 5 },
    { name: '澎湃新闻', domain: 'thepaper.cn', category: '媒体/时政深度', trustLevel: 5 },
    { name: '机器之心', domain: 'almosthuman.com.cn', category: '资讯/AI前沿', trustLevel: 5 },
    { name: '新智元', domain: 'aiera.com.cn', category: '资讯/AI趋势', trustLevel: 5 },
    { name: '量子位', domain: 'qbitai.com', category: '资讯/AI商业', trustLevel: 5 },
    { name: '36氪', domain: '36kr.com', category: '资讯/科技商业', trustLevel: 5 },
    { name: '虎嗅', domain: 'huxiu.com', category: '资讯/科技深度', trustLevel: 5 },

    // --- L8: 百科、咨询与三方专业数据 (Consulting & Data) ---
    { name: '百度百科', domain: 'baike.baidu.com', category: '参考/百科', trustLevel: 5 },
    { name: '维基百科 (中)', domain: 'wikipedia.org', category: '参考/百科', trustLevel: 5 },
    { name: '知乎', domain: 'zhihu.com', category: '参考/问答', trustLevel: 5 },
    { name: '中国知网', domain: 'cnki.net', category: '参考/学术库', trustLevel: 5 },
    { name: '万方数据', domain: 'wanfangdata.com.cn', category: '参考/数据库', trustLevel: 5 },
    { name: '艾瑞咨询', domain: 'iresearch.com.cn', category: '咨询/市场研究', trustLevel: 5 },
    { name: '易观分析', domain: 'analysys.cn', category: '咨询/数字经济', trustLevel: 5 },
    { name: 'QuestMobile', domain: 'questmobile.com.cn', category: '咨询/移动互联', trustLevel: 5 },
    { name: 'IDC 中国', domain: 'idc.com/cn', category: '咨询/IT技术', trustLevel: 5 },
    { name: '天眼查', domain: 'tianyancha.com', category: '参考/商信', trustLevel: 5 },
    { name: '企查查', domain: 'qcc.com', category: '参考/商信', trustLevel: 5 },
    { name: '裁判文书网', domain: 'wenshu.court.gov.cn', category: '参考/法律文书', trustLevel: 5 },
    { name: '巨量算数', domain: 'oceanengine.com', category: '参考/消费趋势', trustLevel: 5 },
    { name: 'GitHub', domain: 'github.com', category: '参考/技术开源', trustLevel: 5 },
];

const industryEntities = [
    // --- 人工智能核心模型与平台 ---
    { name: 'DeepSeek (深度求索)', keywords: 'DeepSeek-V3, DeepSeek-R1, 推理模型, 开源模型, MoE架构', industry: '人工智能', relatedUrls: 'https://www.deepseek.com/' },
    { name: 'Kimi (月之暗面)', keywords: 'Kimi Chat, Moonshot AI, 长文本处理, 大模型', industry: '人工智能', relatedUrls: 'https://www.moonshot.cn/' },
    { name: '豆包 (字节跳动)', keywords: '字节跳动AI, 字节大模型, 语音交互, 智能助手', industry: '人工智能', relatedUrls: 'https://www.doubao.com/' },
    { name: '文心一言 (百度)', keywords: '百度AI, ERNIE, 百度大模型, 知识增强', industry: '人工智能', relatedUrls: 'https://yiyan.baidu.com/' },
    { name: '通义千问 (阿里巴巴)', keywords: '阿里AI, Qwen, 阿里云大模型, 效率工具', industry: '人工智能', relatedUrls: 'https://tongyi.aliyun.com/' },
    { name: '智谱清言 (智谱AI)', keywords: 'GLM-4, 智谱AI, 科研背景, 中美合作', industry: '人工智能', relatedUrls: 'https://chatglm.cn/' },
    { name: '海螺AI (MiniMax)', keywords: 'MiniMax, 情感陪伴, 文本生成, 智能语音', industry: '人工智能', relatedUrls: 'https://www.minimaxyz.com/' },
    { name: '百川智能 (Baichuan)', keywords: '王小川, 百川大模型, 医疗模型, 搜索增强', industry: '人工智能', relatedUrls: 'https://www.baichuan-ai.com/' },
    { name: 'Claude 3.5 (Anthropic)', keywords: 'Anthropic, 逻辑推理, 代码生成, Artifacts', industry: '人工智能', relatedUrls: 'https://www.anthropic.com/claude' },
    { name: 'Llama 3 (Meta)', keywords: 'Meta Open Source, 算力基础设施, 开发者生态', industry: '人工智能', relatedUrls: 'https://llama.meta.com/' },

    // --- 人工智能技术概念 ---
    { name: 'Transformer 架构', keywords: '注意力机制, Attention is all you need, 深度学习基础', industry: '人工智能', relatedUrls: 'https://arxiv.org/abs/1706.03762' },
    { name: 'MoE (混合专家模型)', keywords: 'Mixed of Experts, 稀疏激活, 低功耗推理, DeepSeek技术', industry: '人工智能' },
    { name: 'RAG (检索增强生成)', keywords: 'Retrieval Augmented Generation, 知识库检索, 防止幻觉, 数据库关联', industry: '人工智能' },
    { name: 'AI Agent (智能体)', keywords: '自主决策, 工具调用, 规划能力, 生产力革命', industry: '人工智能' },
    { name: 'RLHF (强化学习)', keywords: 'Reinforcement Learning from Human Feedback, 人类反馈, 对齐技术, 安全边界', industry: '人工智能' },
    { name: '多模态 (Multimodal)', keywords: '图文理解, 视频生成, 语音识别, 跨模态分析', industry: '人工智能' },
    { name: '思维链 (Chain of Thought)', keywords: '逐步思考, 推理过程, COT, 逻辑拆解', industry: '人工智能' },
    { name: 'Sora (文生视频)', keywords: 'OpenAI, 视频生成模型, 世界模型, 动态模拟', industry: '人工智能' },
    { name: 'Scaling Law (规模定律)', keywords: '算力增长, 数据规模, 模型表现, 计算效率', industry: '人工智能' },
    { name: '算力/GPU', keywords: 'NVIDIA, H100, B200, 算力中心, 基础设施', industry: '人工智能' },

    // --- 行业标杆 ---
    { name: '鸿蒙系统', keywords: 'HarmonyOS, 华为系统, 自研内核, 物联网, 全场景互联', industry: '操作系统' },
    { name: '仰望U8', keywords: '比亚迪, 易四方技术, 豪车市场, 汽车智能化', industry: '汽车' },
    { name: '黑神话:悟空', keywords: '游戏科学, 国产单机, 西游素材, 全球影响力', industry: '游戏' },
    { name: 'C919 大飞机', keywords: '国产客机, 商飞, 航空制造业, 自立自强', industry: '航空' },
];

async function main() {
    console.log('--- 开始清理并重新导入 GEO 权威图谱种子数据 ---');

    // 1. 清理现有数据
    await (prisma as any).gEOAuthoritySource.deleteMany({});
    await (prisma as any).gEOIndustryEntity.deleteMany({});
    console.log('已清空现有数据表。');

    // 2. 导入权威信源 (去重处理)
    const uniqueSourcesArray = Array.from(new Map(authoritySources.map(s => [s.domain + s.name, s])).values());
    for (const source of uniqueSourcesArray) {
        await (prisma as any).gEOAuthoritySource.create({ data: source });
    }

    // 3. 导入行业实体 (去重处理)
    const uniqueEntitiesArray = Array.from(new Map(industryEntities.map(e => [e.name, e])).values());
    for (const entity of uniqueEntitiesArray) {
        await (prisma as any).gEOIndustryEntity.create({ data: entity });
    }

    console.log(`成功重新加载：${uniqueSourcesArray.length} 个权威信源，${uniqueEntitiesArray.length} 个行业实体。`);
}

main()
    .catch((e: any) => {
        console.error('导入失败:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
