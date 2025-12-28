import { PrismaClient, ModuleType, PageType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('开始填充扩展内容模版...');

    const templates = [
        {
            name: '现代企业首页',
            description: '包含Hero区域、特征介绍、服务列表和CTA的现代首页模版',
            moduleType: ModuleType.HOME_PAGE,
            type: PageType.HOME,
            content: `
<div class="bg-white">
  <!-- Hero Section -->
  <div class="relative isolate px-6 pt-14 lg:px-8">
    <div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
      <div class="text-center">
        <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">构建您的数字未来</h1>
        <p class="mt-6 text-lg leading-8 text-gray-600">我们提供最先进的技术解决方案，帮助您的企业在数字时代蓬勃发展。从云服务到人工智能，我们是您值得信赖的合作伙伴。</p>
        <div class="mt-10 flex items-center justify-center gap-x-6">
          <a href="/contact" class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">开始使用</a>
          <a href="/about" class="text-sm font-semibold leading-6 text-gray-900">了解更多 <span aria-hidden="true">→</span></a>
        </div>
      </div>
    </div>
  </div>

  <!-- Feature Section -->
  <div class="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32 bg-gray-50 rounded-3xl">
    <div class="mx-auto max-w-2xl lg:text-center">
      <h2 class="text-base font-semibold leading-7 text-indigo-600">核心优势</h2>
      <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">为什么选择我们？</p>
      <p class="mt-6 text-lg leading-8 text-gray-600">我们拥有多年的行业经验和顶尖的技术团队，致力于为您提供最优质的服务。</p>
    </div>
    <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
      <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
        <div class="relative pl-16">
          <dt class="text-base font-semibold leading-7 text-gray-900">
            <div class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
              <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3.75m-3-3.75l-3 3.75M12 9.75V4.5m0 12.75l-3 3.75m3-3.75l3 3.75M12 4.5L3.75 12.75" />
              </svg>
            </div>
            极速部署
          </dt>
          <dd class="mt-2 text-base leading-7 text-gray-600">我们的自动化工具确保您的项目在几分钟内上线，无需漫长的等待。</dd>
        </div>
        <div class="relative pl-16">
          <dt class="text-base font-semibold leading-7 text-gray-900">
            <div class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
              <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            安全可靠
          </dt>
          <dd class="mt-2 text-base leading-7 text-gray-600">企业级安全标准，全天候监控，确保您的数据安全无忧。</dd>
        </div>
      </dl>
    </div>
  </div>
</div>
            `,
            style: '',
            isActive: true,
            isDefault: true
        },
        {
            name: '服务列表页',
            description: '展示公司提供的各项服务',
            moduleType: ModuleType.SERVICE_PAGE,
            type: PageType.CUSTOM,
            content: `
<div class="bg-white py-24 sm:py-32">
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <div class="mx-auto max-w-2xl lg:text-center">
      <h2 class="text-base font-semibold leading-7 text-indigo-600">我们的服务</h2>
      <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">全方位的数字化解决方案</p>
      <p class="mt-6 text-lg leading-8 text-gray-600">无论您的需求是什么，我们都有专业的团队为您提供定制化服务。</p>
    </div>
    <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
      <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
        <div class="flex flex-col">
          <dt class="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
            <svg class="h-5 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M5.5 17a4.5 4.5 0 01-1.44-8.765 4.5 4.5 0 018.302-3.046 3.5 3.5 0 014.504 4.272A4 4 0 0115 17H5.5zm3.75-2.75a.75.75 0 001.5 0V9.66l1.95 2.1a.75.75 0 101.1-1.02l-3.25-3.5a.75.75 0 00-1.1 0l-3.25 3.5a.75.75 0 101.1 1.02l1.95-2.1v4.59z" clip-rule="evenodd" />
            </svg>
            云服务迁移
          </dt>
          <dd class="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
            <p class="flex-auto">帮助企业将传统架构无缝迁移至云端，降低成本，提升效率。</p>
            <p class="mt-6">
              <a href="#" class="text-sm font-semibold leading-6 text-indigo-600">了解详情 <span aria-hidden="true">→</span></a>
            </p>
          </dd>
        </div>
        <div class="flex flex-col">
          <dt class="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
            <svg class="h-5 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clip-rule="evenodd" />
            </svg>
            网络安全咨询
          </dt>
          <dd class="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
            <p class="flex-auto">提供全方位的网络安全评估和防护方案，保护您的核心资产。</p>
            <p class="mt-6">
              <a href="#" class="text-sm font-semibold leading-6 text-indigo-600">了解详情 <span aria-hidden="true">→</span></a>
            </p>
          </dd>
        </div>
        <div class="flex flex-col">
          <dt class="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
            <svg class="h-5 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M4.632 3.533A2 2 0 016.577 2h6.846a2 2 0 011.945 1.533l1.976 8.234A3.489 3.489 0 0016 11.5H4c-.476 0-.93.095-1.344.267l1.976-8.234z" />
              <path fill-rule="evenodd" d="M4 13a2 2 0 100 4h12a2 2 0 100-4H4zm11.24 2a.75.75 0 01.75-.75H16a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75h-.01a.75.75 0 01-.75-.75V15zm-2.25-.75a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V15a.75.75 0 00-.75-.75h-.01zM12 15a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H12.75a.75.75 0 01-.75-.75V15z" clip-rule="evenodd" />
              <path d="M6 15a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V15z" />
            </svg>
            定制软件开发
          </dt>
          <dd class="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
            <p class="flex-auto">根据您的业务需求，量身定制高效、稳定的软件系统。</p>
            <p class="mt-6">
              <a href="#" class="text-sm font-semibold leading-6 text-indigo-600">了解详情 <span aria-hidden="true">→</span></a>
            </p>
          </dd>
        </div>
      </dl>
    </div>
  </div>
</div>
            `,
            style: '',
            isActive: true,
            isDefault: true
        },
        {
            name: '常见问题 (FAQ)',
            description: '折叠式常见问题解答页面',
            moduleType: ModuleType.FAQ_PAGE,
            type: PageType.CUSTOM,
            content: `
<div class="bg-white py-24 sm:py-32">
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <div class="mx-auto max-w-4xl divide-y divide-gray-900/10">
      <h2 class="text-2xl font-bold leading-10 tracking-tight text-gray-900">常见问题</h2>
      <dl class="mt-10 space-y-6 divide-y divide-gray-900/10">
        <div class="pt-6">
          <dt>
            <button type="button" class="flex w-full items-start justify-between text-left text-gray-900" aria-controls="faq-0" aria-expanded="false">
              <span class="text-base font-semibold leading-7">你们提供退款服务吗？</span>
              <span class="ml-6 flex h-7 items-center">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
                </svg>
              </span>
            </button>
          </dt>
          <dd class="mt-2 pr-12" id="faq-0">
            <p class="text-base leading-7 text-gray-600">是的，如果您在购买后的30天内不满意，我们提供全额退款保证。</p>
          </dd>
        </div>
        <div class="pt-6">
          <dt>
            <button type="button" class="flex w-full items-start justify-between text-left text-gray-900" aria-controls="faq-1" aria-expanded="false">
              <span class="text-base font-semibold leading-7">技术支持是全天候的吗？</span>
              <span class="ml-6 flex h-7 items-center">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
                </svg>
              </span>
            </button>
          </dt>
          <dd class="mt-2 pr-12" id="faq-1">
            <p class="text-base leading-7 text-gray-600">对于企业版用户，我们提供7x24小时的专属技术支持服务。</p>
          </dd>
        </div>
      </dl>
    </div>
  </div>
</div>
            `,
            style: '',
            isActive: true,
            isDefault: true
        }
    ];

    for (const template of templates) {
        await prisma.pageTemplate.create({
            data: template as any,
        });
        console.log(`已创建模版: ${template.name}`);
    }

    console.log('填充完成！');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
