import { db } from './db';

async function main() {
    console.log('🌱 开始创建首页模板...');

    // 创建现代化首页模板
    const homeTemplate = await db.pageTemplate.create({
        data: {
            name: '现代企业首页',
            description: '专业现代的企业首页模板，包含Hero区域、特色展示、服务介绍等模块',
            moduleType: 'HOME_PAGE',
            type: 'CUSTOM',
            isActive: true,
            version: 1,
            content: `
<!-- Hero Section -->
<section class="hero-section">
    <div class="container">
        <div class="hero-content">
            <h1 class="hero-title">企业官网</h1>
            <h2 class="hero-subtitle">企业级内容管理系统</h2>
            <p class="hero-description">
                强大、灵活、易用的CMS解决方案<br>
                助力企业数字化转型，提升内容管理效率
            </p>
            <div class="hero-actions">
                <a href="/contact" class="btn btn-primary">免费试用</a>
                <a href="/about" class="btn btn-secondary">了解更多</a>
            </div>
        </div>
    </div>
</section>

<!-- Features Section -->
<section class="features-section">
    <div class="container">
        <div class="section-header">
            <h2 class="section-title">核心特性</h2>
            <p class="section-subtitle">为企业量身打造的专业功能</p>
        </div>
        <div class="features-grid">
            <div class="feature-card">
                <div class="feature-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                        <path d="M2 17l10 5 10-5"/>
                        <path d="M2 12l10 5 10-5"/>
                    </svg>
                </div>
                <h3 class="feature-title">模块化设计</h3>
                <p class="feature-description">灵活的模板系统，支持页面自由组合，满足不同场景需求</p>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                        <line x1="12" y1="22.08" x2="12" y2="12"/>
                    </svg>
                </div>
                <h3 class="feature-title">AI 智能创作</h3>
                <p class="feature-description">集成AI助手，智能生成内容，提升创作效率</p>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                    </svg>
                </div>
                <h3 class="feature-title">SEO 优化</h3>
                <p class="feature-description">内置SEO工具，自动推送搜索引擎，提升网站曝光率</p>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                </div>
                <h3 class="feature-title">安全可靠</h3>
                <p class="feature-description">企业级安全防护，数据加密存储，保障信息安全</p>
            </div>
        </div>
    </div>
</section>

<!-- Services Section -->
<section class="services-section">
    <div class="container">
        <div class="section-header">
            <h2 class="section-title">我们的服务</h2>
            <p class="section-subtitle">全方位的企业数字化解决方案</p>
        </div>
        <div class="services-grid">
            <div class="service-item">
                <div class="service-number">01</div>
                <h3 class="service-title">网站建设</h3>
                <p class="service-description">专业的网站设计与开发服务，打造符合企业形象的官方网站</p>
            </div>
            
            <div class="service-item">
                <div class="service-number">02</div>
                <h3 class="service-title">内容管理</h3>
                <p class="service-description">高效的内容发布与管理平台，支持多渠道内容分发</p>
            </div>
            
            <div class="service-item">
                <div class="service-number">03</div>
                <h3 class="service-title">数据分析</h3>
                <p class="service-description">深度数据分析服务，洞察用户行为，优化运营策略</p>
            </div>
        </div>
    </div>
</section>

<!-- CTA Section -->
<section class="cta-section">
    <div class="container">
        <div class="cta-content">
            <h2 class="cta-title">准备好开始了吗？</h2>
            <p class="cta-description">立即体验企业官网，开启您的数字化之旅</p>
            <a href="/contact" class="btn btn-primary btn-large">免费试用</a>
        </div>
    </div>
</section>
            `,
            style: `
/* Hero Section */
.hero-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 120px 0;
    text-align: center;
}

.hero-content {
    max-width: 800px;
    margin: 0 auto;
}

.hero-title {
    font-size: 4rem;
    font-weight: 800;
    margin-bottom: 1rem;
    letter-spacing: -0.02em;
}

.hero-subtitle {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    opacity: 0.95;
}

.hero-description {
    font-size: 1.25rem;
    line-height: 1.8;
    margin-bottom: 2.5rem;
    opacity: 0.9;
}

.hero-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

/* Buttons */
.btn {
    display: inline-block;
    padding: 1rem 2.5rem;
    border-radius: 50px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
    font-size: 1.1rem;
}

.btn-primary {
    background: white;
    color: #667eea;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

.btn-secondary {
    background: rgba(255,255,255,0.2);
    color: white;
    border: 2px solid white;
}

.btn-secondary:hover {
    background: white;
    color: #667eea;
}

.btn-large {
    padding: 1.25rem 3rem;
    font-size: 1.2rem;
}

/* Features Section */
.features-section {
    padding: 100px 0;
    background: #f8f9fa;
}

.section-header {
    text-align: center;
    margin-bottom: 4rem;
}

.section-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #2d3748;
    margin-bottom: 1rem;
}

.section-subtitle {
    font-size: 1.25rem;
    color: #718096;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
}

.feature-card {
    background: white;
    padding: 2.5rem;
    border-radius: 16px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    transition: all 0.3s ease;
}

.feature-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.feature-icon {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
}

.feature-icon svg {
    width: 32px;
    height: 32px;
    color: white;
}

.feature-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 1rem;
}

.feature-description {
    font-size: 1rem;
    line-height: 1.7;
    color: #718096;
}

/* Services Section */
.services-section {
    padding: 100px 0;
    background: white;
}

.services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 3rem;
    margin-top: 3rem;
}

.service-item {
    position: relative;
    padding: 2rem;
    border-left: 4px solid #667eea;
    transition: all 0.3s ease;
}

.service-item:hover {
    background: #f8f9fa;
    padding-left: 2.5rem;
}

.service-number {
    font-size: 3rem;
    font-weight: 800;
    color: #e2e8f0;
    margin-bottom: 1rem;
}

.service-title {
    font-size: 1.75rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 1rem;
}

.service-description {
    font-size: 1.1rem;
    line-height: 1.7;
    color: #718096;
}

/* CTA Section */
.cta-section {
    padding: 100px 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-align: center;
}

.cta-content {
    max-width: 700px;
    margin: 0 auto;
}

.cta-title {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
}

.cta-description {
    font-size: 1.25rem;
    margin-bottom: 2.5rem;
    opacity: 0.9;
}

/* Container */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

/* Responsive */
@media (max-width: 768px) {
    .hero-title {
        font-size: 2.5rem;
    }
    
    .hero-subtitle {
        font-size: 1.5rem;
    }
    
    .section-title {
        font-size: 2rem;
    }
    
    .cta-title {
        font-size: 2rem;
    }
    
    .features-grid,
    .services-grid {
        grid-template-columns: 1fr;
    }
}
            `,
        },
    });

    console.log('✅ 首页模板创建成功！');
    console.log('模板ID:', homeTemplate.id);
    console.log('模板名称:', homeTemplate.name);
}

main()
    .catch((e) => {
        console.error('❌ 创建失败:', e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });
