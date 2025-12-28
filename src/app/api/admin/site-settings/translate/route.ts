import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { getAIServiceForUseCase } from '@/lib/ai/service';

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { headerSections, footerSections, siteName, logo, favicon, primaryColor } = body;

        // Construct the object to be translated
        const contentToTranslate = {
            siteName,
            headerSections,
            footerSections
        };

        const prompt = `
        You are a professional localization expert for an enterprise CMS.
        Translate the following JSON configuration from Chinese to English.
        
        Rules:
        1. Keep the exact same JSON structure. Do NOT add or remove keys.
        2. ONLY translate user-facing text values (values of keys like "label", "text", "title", "description", "copyright", "ctaButtonText", "logoText").
        3. Do NOT translate internal IDs, field names, CSS classes, URLs, or style values (colors, etc).
        4. "首页" should be translated to "Home".
        5. "关于我们" should be translated to "About Us".
        6. "产品" should be translated to "Products".
        7. "联系我们" should be translated to "Contact Us".
        8. Return ONLY the valid JSON string. No markdown formatting.

        Input JSON:
        ${JSON.stringify(contentToTranslate, null, 2)}
        `;

        const aiService = await getAIServiceForUseCase('GENERAL');

        // Use generateContent for free-text request (or JSON mode if supported)
        const responseText = await aiService.generateContent(prompt, {
            response_format: { type: 'json_object' }
        });

        // Parse the result
        let translatedData;
        try {
            // Clean up if markdown code blocks are present
            const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            translatedData = JSON.parse(cleanJson);
        } catch (e) {
            console.error('Failed to parse AI response as JSON:', responseText);
            return NextResponse.json({ error: 'AI Translation Failed: Invalid JSON response' }, { status: 500 });
        }

        // Merge un-translatable fields (logo, favicon, colors)
        const finalEnSettings = {
            ...translatedData,
            logo,
            favicon,
            primaryColor, // Inherit color
            phone: body.phone, // Phone/Email usually same, or could be translated but we keep same for now
            email: body.email,
            address: body.address
        };

        // Save to DB
        await db.systemSetting.upsert({
            where: { key: 'site_settings_en' },
            update: { value: JSON.stringify(finalEnSettings) },
            create: { key: 'site_settings_en', value: JSON.stringify(finalEnSettings) }
        });

        return NextResponse.json({ success: true, translatedData: finalEnSettings });

    } catch (error: any) {
        console.error('Translation error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
