'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';
import { useState } from 'react';

// 团队介绍12：弹窗详情
export const Team12Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, members = [] } = data;
    const { backgroundColor = '#ffffff', textColor = '#111827', accentColor = '#3b82f6', modalOverlayColor = 'rgba(0,0,0,0.5)' } = style;

    const [selectedMember, setSelectedMember] = useState<any>(null);

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    {title && <h2 className="text-3xl font-bold mb-4" style={{ color: textColor }}>{title}</h2>}
                    {subtitle && <p className="text-lg opacity-70 max-w-2xl mx-auto" style={{ color: textColor }}>{subtitle}</p>}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12" itemScope itemType="http://schema.org/ItemList">
                    {members.map((member: any, index: number) => (
                        <div
                            key={index}
                            className="text-center group cursor-pointer"
                            onClick={() => setSelectedMember(member)}
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/Person"
                        >
                            <div className="relative inline-block mb-4">
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-transparent group-hover:border-blue-100 transition-all duration-300">
                                    <img
                                        src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}&background=random`}
                                        alt={member.name}
                                        itemProp="image"
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 group-hover:text-blue-500 group-hover:scale-110 transition-all">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-1 transition-colors group-hover:text-blue-600" style={{ color: textColor }} itemProp="name">{member.name}</h3>
                            <p className="text-sm font-medium opacity-60 uppercase tracking-wider" style={{ color: textColor }} itemProp="jobTitle">{member.role}</p>
                        </div>
                    ))}
                </div>

                {/* Modal */}
                {selectedMember && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: modalOverlayColor }}>
                        <div
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in duration-300"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedMember(null)}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
                            >
                                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>

                            <div className="flex flex-col md:flex-row">
                                <div className="w-full md:w-1/3 aspect-[3/4] md:aspect-auto relative">
                                    <img
                                        src={selectedMember.avatar || `https://ui-avatars.com/api/?name=${selectedMember.name}&background=random`}
                                        alt={selectedMember.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="w-full md:w-2/3 p-8 md:p-12">
                                    <div className="mb-8">
                                        <h3 className="text-3xl font-bold mb-2 text-gray-900">{selectedMember.name}</h3>
                                        <p className="text-xl font-medium" style={{ color: accentColor }}>{selectedMember.role}</p>
                                    </div>

                                    <div className="prose max-w-none text-gray-600 mb-8">
                                        <h4 className="text-lg font-bold text-gray-900 mb-2">{t('team.bio')}</h4>
                                        <p className="whitespace-pre-line leading-relaxed">{selectedMember.fullBio || selectedMember.bio || t('team.noDesc')}</p>
                                    </div>

                                    {selectedMember.projects && (
                                        <div className="mb-8">
                                            <h4 className="text-lg font-bold text-gray-900 mb-2">{t('team.achievements')}</h4>
                                            <ul className="list-disc list-inside text-gray-600 space-y-1">
                                                {selectedMember.projects.split('\n').map((project: string, idx: number) => (
                                                    <li key={idx}>{project}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div className="pt-6 border-t border-gray-100 flex gap-4">
                                        {['LinkedIn', 'Twitter', 'Email'].map((social, idx) => (
                                            <a key={idx} href="#" className="text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors">
                                                {social}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Backdrop click to close */}
                        <div className="absolute inset-0 -z-10" onClick={() => setSelectedMember(null)} />
                    </div>
                )}
            </div>
        </section>
    );
};
