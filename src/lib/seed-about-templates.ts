import { PrismaClient, ModuleType, PageType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('开始生成关于我们模版...');

    const templates = [
        // 1. 现代企业风格 (Modern Corporate)
        {
            name: '关于我们 - 现代企业风格',
            description: '包含公司简介、使命愿景和核心数据的专业企业展示模版',
            moduleType: ModuleType.ABOUT_PAGE,
            type: PageType.ABOUT,
            content: `
<div class="bg-white">
    <!-- Hero Section -->
    <div class="relative bg-gray-900 py-24 sm:py-32">
        <div class="absolute inset-0 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2830&q=80&blend=111827&sat=-100&exp=15&blend-mode=multiply" alt="" class="h-full w-full object-cover object-center">
        </div>
        <div class="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div class="mx-auto max-w-2xl lg:mx-0">
                <h2 class="text-4xl font-bold tracking-tight text-white sm:text-6xl">我们是 GeoCMS</h2>
                <p class="mt-6 text-lg leading-8 text-gray-300">
                    致力于为企业提供最先进的内容管理解决方案。我们相信技术的力量可以改变信息的传播方式，让每一个声音都能被世界听见。
                </p>
            </div>
            <div class="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
                <div class="grid grid-cols-1 gap-x-8 gap-y-6 text-base font-semibold leading-7 text-white sm:grid-cols-2 md:flex lg:gap-x-10">
                    <a href="#">加入我们 <span aria-hidden="true">&rarr;</span></a>
                    <a href="#">实习计划 <span aria-hidden="true">&rarr;</span></a>
                    <a href="#">我们的价值观 <span aria-hidden="true">&rarr;</span></a>
                    <a href="#">领导团队 <span aria-hidden="true">&rarr;</span></a>
                </div>
                <dl class="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
                    <div class="flex flex-col-reverse">
                        <dt class="text-base leading-7 text-gray-300">全球办公室</dt>
                        <dd class="text-2xl font-bold leading-9 tracking-tight text-white">12</dd>
                    </div>
                    <div class="flex flex-col-reverse">
                        <dt class="text-base leading-7 text-gray-300">全职员工</dt>
                        <dd class="text-2xl font-bold leading-9 tracking-tight text-white">300+</dd>
                    </div>
                    <div class="flex flex-col-reverse">
                        <dt class="text-base leading-7 text-gray-300">每周工作时长</dt>
                        <dd class="text-2xl font-bold leading-9 tracking-tight text-white">40</dd>
                    </div>
                    <div class="flex flex-col-reverse">
                        <dt class="text-base leading-7 text-gray-300">带薪休假</dt>
                        <dd class="text-2xl font-bold leading-9 tracking-tight text-white">无限制</dd>
                    </div>
                </dl>
            </div>
        </div>
    </div>

    <!-- Mission Section -->
    <div class="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div class="mx-auto max-w-2xl lg:text-center">
            <h2 class="text-base font-semibold leading-7 text-blue-600">我们的使命</h2>
            <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">赋能内容创造者</p>
            <p class="mt-6 text-lg leading-8 text-gray-600">
                在这个信息爆炸的时代，我们希望通过 AI 技术简化内容创作流程，让企业能够专注于核心价值的传递，而不是被繁琐的技术细节所困扰。
            </p>
        </div>
    </div>
</div>
            `,
            style: '',
            isActive: true,
            isDefault: false
        },

        // 2. 创意团队风格 (Creative Team)
        {
            name: '关于我们 - 创意团队风格',
            description: '侧重展示团队成员和公司文化的活力风格模版',
            moduleType: ModuleType.ABOUT_PAGE,
            type: PageType.ABOUT,
            content: `
<div class="bg-white py-24 sm:py-32">
    <div class="mx-auto grid max-w-7xl gap-x-8 gap-y-20 px-6 lg:px-8 xl:grid-cols-3">
        <div class="max-w-2xl">
            <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">认识我们的团队</h2>
            <p class="mt-6 text-lg leading-8 text-gray-600">
                我们是一群充满激情的设计师、开发者和梦想家。我们来自世界各地，为了同一个目标聚集在一起：打造世界上最好的 CMS。
            </p>
        </div>
        <ul role="list" class="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2">
            <li>
                <div class="flex items-center gap-x-6">
                    <img class="h-16 w-16 rounded-full" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="">
                    <div>
                        <h3 class="text-base font-semibold leading-7 tracking-tight text-gray-900">Leslie Alexander</h3>
                        <p class="text-sm font-semibold leading-6 text-blue-600">联合创始人 / CEO</p>
                    </div>
                </div>
            </li>
            <li>
                <div class="flex items-center gap-x-6">
                    <img class="h-16 w-16 rounded-full" src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="">
                    <div>
                        <h3 class="text-base font-semibold leading-7 tracking-tight text-gray-900">Michael Foster</h3>
                        <p class="text-sm font-semibold leading-6 text-blue-600">联合创始人 / CTO</p>
                    </div>
                </div>
            </li>
            <li>
                <div class="flex items-center gap-x-6">
                    <img class="h-16 w-16 rounded-full" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="">
                    <div>
                        <h3 class="text-base font-semibold leading-7 tracking-tight text-gray-900">Dries Vincent</h3>
                        <p class="text-sm font-semibold leading-6 text-blue-600">业务关系主管</p>
                    </div>
                </div>
            </li>
            <li>
                <div class="flex items-center gap-x-6">
                    <img class="h-16 w-16 rounded-full" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="">
                    <div>
                        <h3 class="text-base font-semibold leading-7 tracking-tight text-gray-900">Lindsay Walton</h3>
                        <p class="text-sm font-semibold leading-6 text-blue-600">前端开发主管</p>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</div>
            `,
            style: '',
            isActive: true,
            isDefault: false
        },

        // 3. 发展历程风格 (Timeline History)
        {
            name: '关于我们 - 发展历程风格',
            description: '以时间轴形式展示公司发展历史和里程碑的模版',
            moduleType: ModuleType.ABOUT_PAGE,
            type: PageType.ABOUT,
            content: `
<div class="bg-white py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl lg:mx-0">
            <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">我们的旅程</h2>
            <p class="mt-6 text-lg leading-8 text-gray-600">
                从一个简单的想法，到服务全球数千家企业。这是我们的成长故事。
            </p>
        </div>
        <div class="mx-auto mt-16 max-w-2xl lg:mx-0 lg:max-w-none">
            <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <!-- 2023 -->
                <div class="relative pl-16">
                    <div class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
                        <div class="h-4 w-4 rounded-full bg-white"></div>
                    </div>
                    <div class="text-xl font-bold text-gray-900">2023</div>
                    <h3 class="mt-2 text-lg font-semibold text-gray-900">全球化扩张</h3>
                    <p class="mt-2 text-base leading-7 text-gray-600">
                        GeoCMS 正式推出多语言版本，并在新加坡设立亚太区总部，开始服务全球客户。
                    </p>
                </div>

                <!-- 2022 -->
                <div class="relative pl-16">
                    <div class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                        <div class="h-4 w-4 rounded-full bg-blue-600"></div>
                    </div>
                    <div class="text-xl font-bold text-gray-900">2022</div>
                    <h3 class="mt-2 text-lg font-semibold text-gray-900">引入 AI 引擎</h3>
                    <p class="mt-2 text-base leading-7 text-gray-600">
                        集成 DeepSeek 和 GPT-4 模型，彻底改变了内容生产方式，效率提升 500%。
                    </p>
                </div>

                <!-- 2021 -->
                <div class="relative pl-16">
                    <div class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                        <div class="h-4 w-4 rounded-full bg-blue-600"></div>
                    </div>
                    <div class="text-xl font-bold text-gray-900">2021</div>
                    <h3 class="mt-2 text-lg font-semibold text-gray-900">公司成立</h3>
                    <p class="mt-2 text-base leading-7 text-gray-600">
                        三位创始人在上海的一间车库里写下了 GeoCMS 的第一行代码。
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>
            `,
            style: '',
            isActive: true,
            isDefault: false
        }
    ];

    for (const template of templates) {
        await prisma.pageTemplate.create({
            data: template as any,
        });
        console.log(`已创建模版: ${template.name}`);
    }

    console.log('关于我们模版生成完成！');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
