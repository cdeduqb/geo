import { db } from './db';

/**
 * 创建默认页面模板
 * 运行: npx tsx src/lib/seed-templates.ts
 */

async function main() {
    console.log('🌱 开始创建示例模板...');

    // 创建"关于我们"模板
    const aboutTemplate = await db.pageTemplate.create({
        data: {
            name: '现代化关于我们页面',
            description: '现代化设计的关于我们页面，包含公司介绍、使命愿景、团队展示',
            moduleType: 'ABOUT_PAGE',
            type: 'ABOUT',
            isActive: true,
            version: 1,
            content: `
<div class="about-page">
    <!-- Hero Section -->
    <section class="hero-section">
        <div class="container">
            <h1 class="hero-title">关于我们</h1>
            <p class="hero-subtitle">致力于为客户提供最优质的产品和服务</p>
        </div>
    </section>

    <!-- Company Introduction -->
    <section class="section">
        <div class="container">
            <div class="grid-2">
                <div class="content-block">
                    <h2 class="section-title">公司简介</h2>
                    <p class="text-content">
                        我们是一家专注于创新和卓越的企业。自成立以来，我们始终秉持"以客户为中心"的理念，
                        为全球客户提供高质量的产品和专业的服务。我们的团队由经验丰富的专业人士组成，
                        致力于通过创新技术和优质服务，帮助客户实现业务目标。
                    </p>
                    <p class="text-content">
                        经过多年的发展，我们已经成为行业内的领先企业，获得了众多客户的信赖和认可。
                        我们将继续秉承工匠精神，为客户创造更大的价值。
                    </p>
                </div>
                <div class="image-placeholder">
                    <div class="placeholder-box">
                        <p>公司形象图片</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Mission & Vision -->
    <section class="section bg-light">
        <div class="container">
            <h2 class="section-title text-center">使命与愿景</h2>
            <div class="grid-3">
                <div class="card">
                    <div class="card-icon">🎯</div>
                    <h3 class="card-title">我们的使命</h3>
                    <p class="card-text">
                        通过创新技术和卓越服务，为客户创造价值，推动行业发展
                    </p>
                </div>
                <div class="card">
                    <div class="card-icon">🚀</div>
                    <h3 class="card-title">我们的愿景</h3>
                    <p class="card-text">
                        成为全球领先的行业标杆企业，引领行业创新发展
                    </p>
                </div>
                <div class="card">
                    <div class="card-icon">💎</div>
                    <h3 class="card-title">核心价值观</h3>
                    <p class="card-text">
                        诚信、创新、卓越、共赢 - 这是我们不变的追求
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Team Section -->
    <section class="section">
        <div class="container">
            <h2 class="section-title text-center">我们的团队</h2>
            <p class="section-subtitle text-center">
                一群充满激情和专业素养的团队成员
            </p>
            <div class="grid-4">
                <div class="team-member">
                    <div class="member-avatar">👨‍💼</div>
                    <h4 class="member-name">张三</h4>
                    <p class="member-role">首席执行官</p>
                </div>
                <div class="team-member">
                    <div class="member-avatar">👩‍💼</div>
                    <h4 class="member-name">李四</h4>
                    <p class="member-role">技术总监</p>
                </div>
                <div class="team-member">
                    <div class="member-avatar">👨‍💻</div>
                    <h4 class="member-name">王五</h4>
                    <p class="member-role">产品经理</p>
                </div>
                <div class="team-member">
                    <div class="member-avatar">👩‍🎨</div>
                    <h4 class="member-name">赵六</h4>
                    <p class="member-role">设计总监</p>
                </div>
            </div>
        </div>
    </section>
</div>
            `,
            style: `
.about-page {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
}

.hero-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 6rem 0;
    text-align: center;
}

.hero-title {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
}

.hero-subtitle {
    font-size: 1.25rem;
    opacity: 0.9;
}

.section {
    padding: 4rem 0;
}

.section-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: #1a202c;
}

.section-subtitle {
    font-size: 1.125rem;
    color: #718096;
    margin-bottom: 3rem;
}

.text-center {
    text-align: center;
}

.bg-light {
    background-color: #f7fafc;
}

.grid-2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 3rem;
    align-items: center;
}

.grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
}

.grid-4 {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
}

.text-content {
    font-size: 1.125rem;
    line-height: 1.8;
    color: #4a5568;
    margin-bottom: 1rem;
}

.card {
    background: white;
    padding: 2rem;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
    transition: transform 0.3s;
}

.card:hover {
    transform: translateY(-5px);
}

.card-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.card-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: #2d3748;
}

.card-text {
    font-size: 1rem;
    color: #718096;
    line-height: 1.6;
}

.image-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
}

.placeholder-box {
    width: 100%;
    height: 300px;
    background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%);
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #4a5568;
    font-size: 1.125rem;
}

.team-member {
    background: white;
    padding: 2rem;
    border-radius: 0.75rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
    transition: transform 0.3s;
}

.team-member:hover {
    transform: translateY(-5px);
}

.member-avatar {
    font-size: 4rem;
    margin-bottom: 1rem;
}

.member-name {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #2d3748;
}

.member-role {
    font-size: 0.875rem;
    color: #718096;
}

@media (max-width: 768px) {
    .grid-2, .grid-3, .grid-4 {
        grid-template-columns: 1fr;
    }

    .hero-title {
        font-size: 2.5rem;
    }

    .section-title {
        font-size: 2rem;
    }
}
            `,
        },
    });

    console.log('✅ 创建关于我们模板:', aboutTemplate.name);

    // 创建"联系我们"模板
    const contactTemplate = await db.pageTemplate.create({
        data: {
            name: '现代化联系我们页面',
            description: '包含联系信息、地图和联系表单的联系我们页面',
            moduleType: 'CONTACT_PAGE',
            type: 'CONTACT',
            isActive: true,
            version: 1,
            content: `
<div class="contact-page">
    <!-- Hero Section -->
    <section class="hero-section">
        <div class="container">
            <h1 class="hero-title">联系我们</h1>
            <p class="hero-subtitle">我们随时准备倾听您的需求</p>
        </div>
    </section>

    <!-- Contact Information -->
    <section class="section">
        <div class="container">
            <div class="grid-3">
                <div class="info-card">
                    <div class="info-icon">📍</div>
                    <h3 class="info-title">公司地址</h3>
                    <p class="info-text">
                        中国上海市浦东新区<br>
                        世纪大道 1000 号<br>
                        邮编: 200120
                    </p>
                </div>
                <div class="info-card">
                    <div class="info-icon">📞</div>
                    <h3 class="info-title">联系电话</h3>
                    <p class="info-text">
                        总机: +86 21 1234 5678<br>
                        传真: +86 21 8765 4321<br>
                        客服: 400-123-4567
                    </p>
                </div>
                <div class="info-card">
                    <div class="info-icon">✉️</div>
                    <h3 class="info-title">电子邮箱</h3>
                    <p class="info-text">
                        商务合作: business@example.com<br>
                        客户服务: service@example.com<br>
                        人力资源: hr@example.com
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Form Section -->
    <section class="section bg-light">
        <div class="container">
            <div class="form-container">
                <h2 class="section-title">给我们留言</h2>
                <p class="section-subtitle">
                    请填写以下表单，我们会尽快与您联系
                </p>
                <form class="contact-form" id="contactForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">姓名 *</label>
                            <input type="text" class="form-input" placeholder="请输入您的姓名" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">电话 *</label>
                            <input type="tel" class="form-input" placeholder="请输入您的电话" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">邮箱 *</label>
                        <input type="email" class="form-input" placeholder="请输入您的邮箱" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">主题</label>
                        <input type="text" class="form-input" placeholder="请输入主题">
                    </div>
                    <div class="form-group">
                        <label class="form-label">留言内容 *</label>
                        <textarea class="form-textarea" rows="6" placeholder="请输入您的留言" required></textarea>
                    </div>
                    <button type="submit" class="submit-button">
                        提交留言
                    </button>
                </form>
            </div>
        </div>
    </section>

    <!-- Map Section -->
    <section class="section">
        <div class="container">
            <h2 class="section-title text-center">我们的位置</h2>
            <div class="map-placeholder">
                <p>地图占位符 - 可以集成百度地图或高德地图</p>
            </div>
        </div>
    </section>

    <!-- Business Hours -->
    <section class="section bg-dark">
        <div class="container">
            <h2 class="section-title-light text-center">营业时间</h2>
            <div class="hours-grid">
                <div class="hours-item">
                    <span class="hours-day">周一至周五</span>
                    <span class="hours-time">9:00 - 18:00</span>
                </div>
                <div class="hours-item">
                    <span class="hours-day">周六</span>
                    <span class="hours-time">10:00 - 17:00</span>
                </div>
                <div class="hours-item">
                    <span class="hours-day">周日</span>
                    <span class="hours-time">休息</span>
                </div>
            </div>
        </div>
    </section>
</div>

<script>
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('感谢您的留言！我们会尽快与您联系。');
    this.reset();
});
</script>
            `,
            style: `
.contact-page {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
}

.hero-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 6rem 0;
    text-align: center;
}

.hero-title {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
}

.hero-subtitle {
    font-size: 1.25rem;
    opacity: 0.9;
}

.section {
    padding: 4rem 0;
}

.section-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: #1a202c;
    text-align: center;
}

.section-title-light {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 2rem;
    color: white;
}

.section-subtitle {
    font-size: 1.125rem;
    color: #718096;
    margin-bottom: 2rem;
    text-align: center;
}

.text-center {
    text-align: center;
}

.bg-light {
    background-color: #f7fafc;
}

.bg-dark {
    background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
    color: white;
}

.grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
}

.info-card {
    background: white;
    padding: 2.5rem;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
    transition: transform 0.3s;
}

.info-card:hover {
    transform: translateY(-5px);
}

.info-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.info-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #2d3748;
}

.info-text {
    font-size: 1rem;
    color: #718096;
    line-height: 1.8;
}

.form-container {
    max-width: 700px;
    margin: 0 auto;
}

.contact-form {
    background: white;
    padding: 3rem;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin-bottom: 1.5rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 0.5rem;
}

.form-input,
.form-textarea {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: border-color 0.3s;
}

.form-input:focus,
.form-textarea:focus {
    outline: none;
    border-color: #667eea;
}

.form-textarea {
    resize: vertical;
}

.submit-button {
    width: 100%;
    padding: 1rem 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 1.125rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.3s;
}

.submit-button:hover {
    transform: translateY(-2px);
}

.map-placeholder {
    width: 100%;
    height: 400px;
    background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%);
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #4a5568;
    font-size: 1.125rem;
    margin-top: 2rem;
}

.hours-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    max-width: 800px;
    margin: 0 auto;
}

.hours-item {
    background: rgba(255, 255, 255, 0.1);
    padding: 2rem;
    border-radius: 0.75rem;
    text-align: center;
}

.hours-day {
    display: block;
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.hours-time {
    display: block;
    font-size: 1rem;
    opacity: 0.9;
}

@media (max-width: 768px) {
    .grid-3,
    .form-row,
    .hours-grid {
        grid-template-columns: 1fr;
    }

    .hero-title {
        font-size: 2.5rem;
    }

    .section-title,
    .section-title-light {
        font-size: 2rem;
    }

    .contact-form {
        padding: 2rem 1.5rem;
    }
}
            `,
        },
    });

    console.log('✅ 创建联系我们模板:', contactTemplate.name);

    console.log('\n🎉 所有示例模板创建完成！');
    console.log('\n访问以下页面查看效果:');
    console.log('- 关于我们: http://localhost:3000/about');
    console.log('- 联系我们: http://localhost:3000/contact');
    console.log('\n在管理后台可以编辑这些模板:');
    console.log('- 模板管理: http://localhost:3000/admin/templates');
}

main()
    .catch((e) => {
        console.error('❌ 创建模板失败:', e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });
