/**
 * 手动激活测试授权码
 * 直接调用API激活
 */

async function activateLicense() {
    const licenseCode = 'LIC-2024-MJIMR9PA-AVZI7H'; // 测试脚本生成的授权码

    console.log('🔑 开始激活授权...\n');
    console.log('授权码:', licenseCode);
    console.log('域名: localhost\n');

    try {
        const response = await fetch('http://localhost:3000/api/license/activate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                licenseCode,
                domain: 'localhost'
            })
        });

        const result = await response.json();

        console.log('响应状态:', response.status);
        console.log('响应数据:', JSON.stringify(result, null, 2));

        if (response.ok && result.success) {
            console.log('\n✅ 激活成功！');
            console.log('\n现在刷新页面: http://localhost:3000/admin/license');
        } else {
            console.log('\n❌ 激活失败');
            console.log('错误:', result.error || result);
        }

        // 验证缓存
        console.log('\n检查授权信息...');
        const infoResponse = await fetch('http://localhost:3000/api/license/info');
        const infoData = await infoResponse.json();

        console.log('授权状态:', infoData.licensed ? '✅ 已激活' : '❌ 未激活');
        if (infoData.licensed) {
            console.log('套餐:', infoData.license.plan);
            console.log('功能:', infoData.license.features);
        }

    } catch (error) {
        console.error('❌ 请求失败:', error);
    }
}

activateLicense();
