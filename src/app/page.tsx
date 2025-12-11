'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';

// Types
interface Resource {
  id: string;
  name: string;
  icon: string;
  description: string;
  link: string;
  type: 'free' | 'paid';
  category?: string;  // Category for grouping
  userType?: 'parent' | 'child' | 'both';  // Who uses this app
}

interface AgeStage {
  age: string;
  title: string;
  subtitle: string;
  description: string;
  milestone: string;
  emoji: string;
  color: string;
  resources: Resource[];
}

// Resource Statistics Helper - Automatically calculates all stats from data
interface ResourceStats {
  totalResources: number;
  totalStages: number;
  ageRange: string;
  categoryCounts: { [key: string]: number };
  userTypeCounts: { parent: number; child: number; both: number };
  typeCounts: { free: number; paid: number };
  topCategories: { name: string; count: number; color: { bg: string; border: string } }[];
}

// Life journey data - from birth to grade 12
const lifeJourneyData: AgeStage[] = [
  {
    age: '0岁',
    title: '欢迎来到这个世界！',
    subtitle: 'Newborn / 新生儿期 (0-12个月)',
    description: '宝宝开始感知世界，学会抬头、翻身、坐立。通过声音、触觉和视觉探索周围的一切。这是建立安全感和亲子关系的关键时期。',
    milestone: '距离上幼儿园还有3年',
    emoji: '👶',
    color: 'from-pink-400 to-rose-300',
    resources: [
      // ========== 😴 睡眠安抚 ==========
      { id: 'r0-1', name: '睡眠训练', icon: '😴', description: '新生儿睡眠规律建立指南，帮助宝宝养成健康作息', link: '#', type: 'free', category: '睡眠安抚', userType: 'parent' },
      { id: 'r0-2', name: '白噪音', icon: '🎵', description: '模拟子宫环境的白噪音，帮助宝宝安睡', link: '#', type: 'free', category: '睡眠安抚', userType: 'both' },
      { id: 'r0-3', name: '睡前音乐', icon: '🎶', description: '舒缓的摇篮曲和轻音乐', link: '#', type: 'free', category: '睡眠安抚', userType: 'both' },
      { id: 'r0-4', name: '睡眠追踪', icon: '📊', description: '记录宝宝睡眠时间和规律', link: '#', type: 'paid', category: '睡眠安抚', userType: 'parent' },
      
      // ========== 🍼 喂养营养 ==========
      { id: 'r0-5', name: '母乳指南', icon: '🤱', description: '母乳喂养姿势、频率、常见问题解答', link: '#', type: 'free', category: '喂养营养', userType: 'parent' },
      { id: 'r0-6', name: '配方奶选择', icon: '🍼', description: '如何选择适合宝宝的配方奶粉', link: '#', type: 'free', category: '喂养营养', userType: 'parent' },
      { id: 'r0-7', name: '辅食添加', icon: '🥣', description: '6个月后辅食添加时间表和食谱', link: '#', type: 'free', category: '喂养营养', userType: 'parent' },
      { id: 'r0-8', name: '喂养记录', icon: '📝', description: '记录喂奶时间、奶量、辅食', link: '#', type: 'free', category: '喂养营养', userType: 'parent' },
      { id: 'r0-9', name: '过敏防护', icon: '⚠️', description: '常见食物过敏识别和预防', link: '#', type: 'free', category: '喂养营养', userType: 'parent' },
      
      // ========== 🏥 健康护理 ==========
      { id: 'r0-10', name: '新生儿护理', icon: '🛁', description: '脐带护理、洗澡、换尿布等日常护理', link: '#', type: 'free', category: '健康护理', userType: 'parent' },
      { id: 'r0-11', name: '疫苗接种', icon: '💉', description: '0-1岁疫苗接种时间表和注意事项', link: '#', type: 'free', category: '健康护理', userType: 'parent' },
      { id: 'r0-12', name: '儿科急救', icon: '🏥', description: '发烧、呛奶、湿疹等常见问题处理', link: '#', type: 'free', category: '健康护理', userType: 'parent' },
      { id: 'r0-13', name: '黄疸护理', icon: '🌡️', description: '新生儿黄疸的观察和护理', link: '#', type: 'free', category: '健康护理', userType: 'parent' },
      { id: 'r0-14', name: '皮肤护理', icon: '🧴', description: '湿疹、尿布疹、痱子的预防和处理', link: '#', type: 'free', category: '健康护理', userType: 'parent' },
      
      // ========== 📊 发育追踪 ==========
      { id: 'r0-15', name: '发育里程碑', icon: '📈', description: '追踪抬头、翻身、坐立等大动作发育', link: '#', type: 'free', category: '发育追踪', userType: 'parent' },
      { id: 'r0-16', name: '身高体重', icon: '📏', description: '生长曲线对照和记录', link: '#', type: 'free', category: '发育追踪', userType: 'parent' },
      { id: 'r0-17', name: '成长记录', icon: '📸', description: '记录宝宝珍贵瞬间和第一次', link: '#', type: 'paid', category: '发育追踪', userType: 'parent' },
      
      // ========== 👁️ 感官刺激 ==========
      { id: 'r0-18', name: '黑白卡片', icon: '🎴', description: '0-3个月视觉刺激训练卡片', link: '#', type: 'free', category: '感官刺激', userType: 'both' },
      { id: 'r0-19', name: '彩色卡片', icon: '🌈', description: '3个月后彩色视觉刺激卡', link: '#', type: 'free', category: '感官刺激', userType: 'both' },
      { id: 'r0-20', name: '婴儿按摩', icon: '👐', description: '促进亲子关系和身体发育的抚触', link: '#', type: 'free', category: '感官刺激', userType: 'both' },
      { id: 'r0-21', name: '早教音乐', icon: '🎹', description: '促进大脑发育的古典音乐', link: '#', type: 'free', category: '感官刺激', userType: 'both' },
      { id: 'r0-22', name: '触觉玩具', icon: '🧸', description: '不同材质的触觉探索玩具推荐', link: '#', type: 'free', category: '感官刺激', userType: 'both' },
      { id: 'r0-23', name: '追视训练', icon: '👀', description: '用玩具训练宝宝追视能力', link: '#', type: 'free', category: '感官刺激', userType: 'both' },
      
      // ========== 👨‍👩‍👧 家长指南 ==========
      { id: 'r0-24', name: '产后恢复', icon: '🧘‍♀️', description: '妈妈产后身体恢复和心理调适', link: '#', type: 'free', category: '家长指南', userType: 'parent' },
      { id: 'r0-25', name: '新手爸爸', icon: '👨', description: '爸爸如何参与育儿和支持妈妈', link: '#', type: 'free', category: '家长指南', userType: 'parent' },
      { id: 'r0-26', name: '产后抑郁', icon: '💚', description: '识别和应对产后情绪问题', link: '#', type: 'free', category: '家长指南', userType: 'parent' },
      { id: 'r0-27', name: '育儿日程', icon: '📅', description: '新生儿作息时间表参考', link: '#', type: 'free', category: '家长指南', userType: 'parent' },
      { id: 'r0-28', name: '用品清单', icon: '🛒', description: '0-1岁必备用品购物清单', link: '#', type: 'free', category: '家长指南', userType: 'parent' },
      
      // ========== 🌏 移民指南 (新增) ==========
      { id: 'r0-29', name: '儿科就医指南', icon: '🏥', description: '如何在西方国家带宝宝看医生、疫苗接种流程', link: '#', type: 'free', category: '移民指南', userType: 'parent' },
      { id: 'r0-30', name: '出生登记', icon: '📋', description: '出生证明、护照、社保号办理流程', link: '#', type: 'free', category: '移民指南', userType: 'parent' },
      { id: 'r0-31', name: '育儿福利', icon: '💰', description: '各国儿童福利金、产假政策介绍', link: '#', type: 'free', category: '移民指南', userType: 'parent' },
      { id: 'r0-32', name: '婴儿用品', icon: '🍼', description: '西方常见婴儿品牌和购物渠道推荐', link: '#', type: 'free', category: '移民指南', userType: 'parent' },
    ]
  },
  {
    age: '1岁',
    title: '宝宝一岁啦！',
    subtitle: 'Toddler / 学步期 (12-24个月)',
    description: '宝宝开始站立和行走，说出第一个词语。对周围一切充满好奇，喜欢模仿大人。这是语言和运动能力快速发展的阶段。',
    milestone: '距离上幼儿园还有2年',
    emoji: '🚶',
    color: 'from-orange-400 to-amber-300',
    resources: [
      // ========== 🗣️ 语言发展 ==========
      { id: 'r1-1', name: '学说话', icon: '🗣️', description: '第一批词汇：爸爸、妈妈、水、球等', link: '#', type: 'free', category: '语言发展', userType: 'both' },
      { id: 'r1-2', name: '指物命名', icon: '👆', description: '指着物品说名称，扩展词汇量', link: '#', type: 'free', category: '语言发展', userType: 'both' },
      { id: 'r1-3', name: '儿歌童谣', icon: '🎤', description: '简单重复的儿歌促进语言发展', link: '#', type: 'free', category: '语言发展', userType: 'both' },
      { id: 'r1-4', name: '身体部位', icon: '👃', description: '认识眼睛、鼻子、耳朵等', link: '#', type: 'free', category: '语言发展', userType: 'both' },
      { id: 'r1-5', name: '动物叫声', icon: '🐶', description: '模仿小狗汪汪、小猫喵喵', link: '#', type: 'free', category: '语言发展', userType: 'both' },
      
      // ========== 🏃 大动作发展 ==========
      { id: 'r1-6', name: '学步辅助', icon: '🚶', description: '安全学步技巧，学步车使用建议', link: '#', type: 'free', category: '大动作发展', userType: 'parent' },
      { id: 'r1-7', name: '户外探索', icon: '🌳', description: '公园玩耍安全指南', link: '#', type: 'free', category: '大动作发展', userType: 'both' },
      { id: 'r1-8', name: '爬楼梯', icon: '🪜', description: '安全爬上爬下楼梯的训练', link: '#', type: 'free', category: '大动作发展', userType: 'both' },
      { id: 'r1-9', name: '踢球游戏', icon: '⚽', description: '简单的踢球和扔球游戏', link: '#', type: 'free', category: '大动作发展', userType: 'both' },
      
      // ========== ✋ 精细动作 ==========
      { id: 'r1-10', name: '手指游戏', icon: '✋', description: '促进手眼协调的手指操', link: '#', type: 'free', category: '精细动作', userType: 'both' },
      { id: 'r1-11', name: '堆叠玩具', icon: '🧱', description: '叠积木、套杯训练精细动作', link: '#', type: 'free', category: '精细动作', userType: 'child' },
      { id: 'r1-12', name: '翻书训练', icon: '📖', description: '一页一页翻书的练习', link: '#', type: 'free', category: '精细动作', userType: 'both' },
      { id: 'r1-13', name: '涂鸦启蒙', icon: '🖍️', description: '大蜡笔随意涂鸦', link: '#', type: 'free', category: '精细动作', userType: 'child' },
      
      // ========== 🧠 认知发展 ==========
      { id: 'r1-14', name: '认知卡片', icon: '🃏', description: '认识动物、水果、颜色', link: '#', type: 'free', category: '认知发展', userType: 'both' },
      { id: 'r1-15', name: '藏猫猫', icon: '🙈', description: '物体恒存概念游戏', link: '#', type: 'free', category: '认知发展', userType: 'both' },
      { id: 'r1-16', name: '配对游戏', icon: '🎯', description: '简单的形状和颜色配对', link: '#', type: 'free', category: '认知发展', userType: 'child' },
      { id: 'r1-17', name: '因果玩具', icon: '🔘', description: '按按钮有反应的因果关系玩具', link: '#', type: 'free', category: '认知发展', userType: 'child' },
      
      // ========== 🥄 自理能力 ==========
      { id: 'r1-18', name: '自主进食', icon: '🥄', description: '从手抓到用勺子，培养独立吃饭', link: '#', type: 'free', category: '自理能力', userType: 'both' },
      { id: 'r1-19', name: '喝水杯', icon: '🥛', description: '从奶瓶过渡到吸管杯、敞口杯', link: '#', type: 'free', category: '自理能力', userType: 'both' },
      { id: 'r1-20', name: '洗手习惯', icon: '🧼', description: '饭前便后洗手的习惯建立', link: '#', type: 'free', category: '自理能力', userType: 'both' },
      
      // ========== 😴 睡眠管理 ==========
      { id: 'r1-21', name: '睡眠调整', icon: '😴', description: '1岁后午睡和夜间睡眠调整', link: '#', type: 'free', category: '睡眠管理', userType: 'parent' },
      { id: 'r1-22', name: '睡前仪式', icon: '🌙', description: '建立固定睡前程序', link: '#', type: 'free', category: '睡眠管理', userType: 'both' },
      { id: 'r1-23', name: '戒夜奶', icon: '🍼', description: '科学戒夜奶的方法', link: '#', type: 'free', category: '睡眠管理', userType: 'parent' },
      
      // ========== 🏠 安全防护 ==========
      { id: 'r1-24', name: '家居安全', icon: '🏠', description: '学步期家居防护清单', link: '#', type: 'free', category: '安全防护', userType: 'parent' },
      { id: 'r1-25', name: '急救知识', icon: '🩹', description: '跌倒、烫伤、误食等紧急处理', link: '#', type: 'free', category: '安全防护', userType: 'parent' },
      { id: 'r1-26', name: '出行安全', icon: '🚗', description: '安全座椅使用和外出安全', link: '#', type: 'free', category: '安全防护', userType: 'parent' },
      
      // ========== 👨‍👩‍👧 家长指南 ==========
      { id: 'r1-27', name: '1岁发育指南', icon: '📋', description: '12-24个月发育里程碑', link: '#', type: 'free', category: '家长指南', userType: 'parent' },
      { id: 'r1-28', name: '断奶指南', icon: '🤱', description: '科学断奶的时机和方法', link: '#', type: 'free', category: '家长指南', userType: 'parent' },
      { id: 'r1-29', name: '玩具推荐', icon: '🧸', description: '1岁适龄玩具选购指南', link: '#', type: 'free', category: '家长指南', userType: 'parent' },
      
      // ========== 🌏 移民指南 (新增) ==========
      { id: 'r1-30', name: 'Daycare指南', icon: '🏠', description: '如何选择和申请西方托儿所、费用补贴', link: '#', type: 'free', category: '移民指南', userType: 'parent' },
      { id: 'r1-31', name: '双语环境', icon: '🌐', description: '海外如何建立中英双语环境', link: '#', type: 'free', category: '移民指南', userType: 'parent' },
      { id: 'r1-32', name: '亲子活动', icon: '👶', description: '本地图书馆、社区中心免费亲子活动', link: '#', type: 'free', category: '移民指南', userType: 'parent' },
    ]
  },
  {
    age: '2岁',
    title: '宝宝两岁啦！',
    subtitle: 'Terrible Twos / 语言爆发期',
    description: '宝宝开始说简单句子，表达想法和需求。喜欢说"不"，有了自我意识。这是培养良好习惯、开始如厕训练的重要时期。',
    milestone: '距离上幼儿园还有1年',
    emoji: '💬',
    color: 'from-yellow-400 to-orange-300',
    resources: [
      // ========== 🚽 如厕训练 ==========
      { id: 'r2-1', name: '如厕准备', icon: '🚽', description: '判断宝宝是否准备好如厕训练的信号', link: '#', type: 'free', category: '如厕训练', userType: 'parent' },
      { id: 'r2-2', name: '如厕方法', icon: '📖', description: '循序渐进的如厕训练方法和技巧', link: '#', type: 'free', category: '如厕训练', userType: 'both' },
      { id: 'r2-3', name: '小马桶', icon: '🪑', description: '如何选择和使用儿童马桶', link: '#', type: 'free', category: '如厕训练', userType: 'parent' },
      { id: 'r2-4', name: '如厕绘本', icon: '📚', description: '帮助理解如厕的趣味绘本', link: '#', type: 'free', category: '如厕训练', userType: 'both' },
      { id: 'r2-5', name: '夜间训练', icon: '🌙', description: '夜间不穿尿布的过渡', link: '#', type: 'free', category: '如厕训练', userType: 'parent' },
      
      // ========== 🪥 卫生习惯 ==========
      { id: 'r2-6', name: '刷牙入门', icon: '🪥', description: '让2岁宝宝爱上刷牙的趣味方法', link: '#', type: 'free', category: '卫生习惯', userType: 'both' },
      { id: 'r2-7', name: '牙齿护理', icon: '🦷', description: '幼儿牙齿保健和第一次看牙医', link: '#', type: 'free', category: '卫生习惯', userType: 'parent' },
      { id: 'r2-8', name: '洗手歌', icon: '🧼', description: '边唱歌边洗手的好习惯', link: '#', type: 'free', category: '卫生习惯', userType: 'both' },
      { id: 'r2-9', name: '洗澡时间', icon: '🛁', description: '让洗澡变有趣的方法', link: '#', type: 'free', category: '卫生习惯', userType: 'both' },
      
      // ========== 🗣️ 语言发展 ==========
      { id: 'r2-10', name: '句子表达', icon: '💬', description: '从单词到2-3词句子的过渡', link: '#', type: 'free', category: '语言发展', userType: 'both' },
      { id: 'r2-11', name: '绘本阅读', icon: '📚', description: '适合2岁的中英文绘本推荐', link: '#', type: 'free', category: '语言发展', userType: 'both' },
      { id: 'r2-12', name: '儿歌大全', icon: '🎵', description: '促进语言和记忆的经典儿歌', link: '#', type: 'free', category: '语言发展', userType: 'child' },
      { id: 'r2-13', name: '词汇扩展', icon: '📝', description: '日常对话中扩展词汇量', link: '#', type: 'free', category: '语言发展', userType: 'parent' },
      { id: 'r2-14', name: '双语启蒙', icon: '🌐', description: '2岁开始双语环境建立', link: '#', type: 'free', category: '语言发展', userType: 'both' },
      
      // ========== 😤 情绪管理 ==========
      { id: 'r2-15', name: '情绪引导', icon: '😤', description: '应对Terrible Twos的发脾气', link: '#', type: 'free', category: '情绪管理', userType: 'parent' },
      { id: 'r2-16', name: '情绪绘本', icon: '📖', description: '帮助孩子认识和表达情绪', link: '#', type: 'free', category: '情绪管理', userType: 'both' },
      { id: 'r2-17', name: '冷静角', icon: '🧘', description: '建立冷静角帮助情绪调节', link: '#', type: 'free', category: '情绪管理', userType: 'both' },
      { id: 'r2-18', name: '正面管教', icon: '💡', description: '不吼不叫的育儿方法', link: '#', type: 'free', category: '情绪管理', userType: 'parent' },
      
      // ========== 🤝 社交发展 ==========
      { id: 'r2-19', name: '分享概念', icon: '🤝', description: '教导分享和轮流的技巧', link: '#', type: 'free', category: '社交发展', userType: 'both' },
      { id: 'r2-20', name: '同龄互动', icon: '👫', description: '安排playdate促进社交发展', link: '#', type: 'free', category: '社交发展', userType: 'parent' },
      { id: 'r2-21', name: '礼貌用语', icon: '🙏', description: '请、谢谢、对不起的学习', link: '#', type: 'free', category: '社交发展', userType: 'both' },
      
      // ========== 🎨 认知游戏 ==========
      { id: 'r2-22', name: '涂色绘画', icon: '🎨', description: '简单涂色培养创造力', link: '#', type: 'free', category: '认知游戏', userType: 'child' },
      { id: 'r2-23', name: '形状配对', icon: '🔷', description: '认识形状和颜色的益智游戏', link: '#', type: 'free', category: '认知游戏', userType: 'child' },
      { id: 'r2-24', name: '动物认知', icon: '🦁', description: '认识动物及其叫声和特征', link: '#', type: 'free', category: '认知游戏', userType: 'child' },
      { id: 'r2-25', name: '数数启蒙', icon: '🔢', description: '从1数到5的入门', link: '#', type: 'free', category: '认知游戏', userType: 'both' },
      { id: 'r2-26', name: '拼图入门', icon: '🧩', description: '2-4片简单拼图', link: '#', type: 'free', category: '认知游戏', userType: 'child' },
      
      // ========== 👕 独立性培养 ==========
      { id: 'r2-27', name: '自己穿衣', icon: '👕', description: '简单衣物的穿脱练习', link: '#', type: 'free', category: '独立性培养', userType: 'both' },
      { id: 'r2-28', name: '收拾玩具', icon: '🧸', description: '培养整理物品的习惯', link: '#', type: 'free', category: '独立性培养', userType: 'both' },
      { id: 'r2-29', name: '帮忙做事', icon: '🧹', description: '简单家务参与（擦桌子、扔垃圾）', link: '#', type: 'free', category: '独立性培养', userType: 'both' },
      
      // ========== 🏃 运动发展 ==========
      { id: 'r2-30', name: '跑跳游戏', icon: '🏃', description: '跑步、跳跃等大动作游戏', link: '#', type: 'free', category: '运动发展', userType: 'child' },
      { id: 'r2-31', name: '平衡训练', icon: '🤸', description: '走平衡木、单脚站等', link: '#', type: 'free', category: '运动发展', userType: 'child' },
      { id: 'r2-32', name: '球类游戏', icon: '⚽', description: '踢球、扔接球游戏', link: '#', type: 'free', category: '运动发展', userType: 'both' },
      
      // ========== 👨‍👩‍👧 家长指南 ==========
      { id: 'r2-33', name: '2岁发育指南', icon: '📋', description: '24-36个月发育里程碑', link: '#', type: 'free', category: '家长指南', userType: 'parent' },
      { id: 'r2-34', name: '入园准备', icon: '🏫', description: '提前了解幼儿园准备事项', link: '#', type: 'free', category: '家长指南', userType: 'parent' },
      { id: 'r2-35', name: '屏幕时间', icon: '📱', description: '2岁屏幕时间控制建议', link: '#', type: 'free', category: '家长指南', userType: 'parent' },
      
      // ========== 🌏 移民指南 (新增) ==========
      { id: 'r2-36', name: 'Preschool申请', icon: '🏫', description: '西方幼儿园类型、申请流程和时间线', link: '#', type: 'free', category: '移民指南', userType: 'parent' },
      { id: 'r2-37', name: '双语发展', icon: '🗣️', description: '2岁双语儿童语言发展特点和支持', link: '#', type: 'free', category: '移民指南', userType: 'parent' },
      { id: 'r2-38', name: 'Playdate文化', icon: '👫', description: '如何融入本地社区、安排playdate', link: '#', type: 'free', category: '移民指南', userType: 'parent' },
      
      // ========== 📚 英语启蒙资源 (技能型) ==========
      { id: 'r2-39', name: '英语启蒙节目', icon: '📺', description: '适合2岁的英语启蒙动画类型和选择建议', link: '#', type: 'free', category: '本地课程', userType: 'parent' },
      { id: 'r2-40', name: '英语儿歌', icon: '🎵', description: '通过儿歌启蒙英语：Nursery Rhymes的作用', link: '#', type: 'free', category: '本地课程', userType: 'both' },
    ]
  },
  {
    age: '3岁',
    title: '幼儿园小班',
    subtitle: 'Preschool / 集体生活开始',
    description: '宝宝第一次进入集体生活，学习与小朋友相处。巩固如厕和自理能力，开始接触数字和字母概念。这是社交能力快速发展的时期。',
    milestone: '幼儿园第一年',
    emoji: '🎒',
    color: 'from-green-400 to-emerald-300',
    resources: [
      // ========== 🏫 入园适应 ==========
      { id: 'r3-1', name: '入园准备', icon: '🏫', description: '幼儿园适应期指南，缓解分离焦虑', link: '#', type: 'free', category: '入园适应', userType: 'parent' },
      { id: 'r3-2', name: '择园攻略', icon: '🔍', description: '如何选择适合的幼儿园', link: '#', type: 'free', category: '入园适应', userType: 'parent' },
      { id: 'r3-3', name: '分离焦虑', icon: '🤗', description: '帮助孩子克服分离焦虑', link: '#', type: 'free', category: '入园适应', userType: 'both' },
      { id: 'r3-4', name: '入园物品', icon: '🎒', description: '幼儿园必备物品清单', link: '#', type: 'free', category: '入园适应', userType: 'parent' },
      
      // ========== 🚽 自理能力 ==========
      { id: 'r3-5', name: '独立如厕', icon: '🚽', description: '在幼儿园独立上厕所', link: '#', type: 'free', category: '自理能力', userType: 'both' },
      { id: 'r3-6', name: '刷牙习惯', icon: '🪥', description: '早晚刷牙习惯的巩固', link: '#', type: 'free', category: '自理能力', userType: 'both' },
      { id: 'r3-7', name: '独立吃饭', icon: '🍽️', description: '使用筷子和勺子独立进餐', link: '#', type: 'free', category: '自理能力', userType: 'both' },
      { id: 'r3-8', name: '穿衣穿鞋', icon: '👟', description: '自己穿脱衣服和鞋子', link: '#', type: 'free', category: '自理能力', userType: 'both' },
      { id: 'r3-9', name: '整理物品', icon: '🧹', description: '整理自己的书包和物品', link: '#', type: 'free', category: '自理能力', userType: 'both' },
      
      // ========== 👫 社交技能 ==========
      { id: 'r3-10', name: '社交故事', icon: '👫', description: '理解分享、轮流、排队等规则', link: '#', type: 'free', category: '社交技能', userType: 'both' },
      { id: 'r3-11', name: '交朋友', icon: '🤗', description: '如何在幼儿园交到朋友', link: '#', type: 'free', category: '社交技能', userType: 'both' },
      { id: 'r3-12', name: '冲突解决', icon: '🤝', description: '教孩子用语言解决小冲突', link: '#', type: 'free', category: '社交技能', userType: 'both' },
      { id: 'r3-13', name: '合作游戏', icon: '🎮', description: '需要合作完成的小游戏', link: '#', type: 'free', category: '社交技能', userType: 'child' },
      
      // ========== 🔢 早期学习 ==========
      { id: 'r3-14', name: '数字启蒙', icon: '🔢', description: '认识1-10，简单点数', link: '#', type: 'free', category: '早期学习', userType: 'child' },
      { id: 'r3-15', name: '字母认知', icon: '🔤', description: 'ABC字母歌和字母认识', link: '#', type: 'free', category: '早期学习', userType: 'child' },
      { id: 'r3-16', name: '颜色形状', icon: '🔵', description: '认识基本颜色和形状', link: '#', type: 'free', category: '早期学习', userType: 'child' },
      { id: 'r3-17', name: '中文识字', icon: '字', description: '简单汉字认读启蒙', link: '#', type: 'free', category: '早期学习', userType: 'child' },
      { id: 'r3-18', name: '英语儿歌', icon: '🎵', description: '英语启蒙儿歌', link: '#', type: 'free', category: '早期学习', userType: 'child' },
      
      // ========== ✏️ 精细动作 ==========
      { id: 'r3-19', name: '握笔练习', icon: '✏️', description: '正确握笔姿势启蒙', link: '#', type: 'free', category: '精细动作', userType: 'both' },
      { id: 'r3-20', name: '剪纸手工', icon: '✂️', description: '安全剪刀使用和简单手工', link: '#', type: 'free', category: '精细动作', userType: 'child' },
      { id: 'r3-21', name: '涂色练习', icon: '🖍️', description: '在线条内涂色', link: '#', type: 'free', category: '精细动作', userType: 'child' },
      { id: 'r3-22', name: '折纸入门', icon: '📄', description: '简单折纸教程', link: '#', type: 'free', category: '精细动作', userType: 'both' },
      
      // ========== 🧩 益智游戏 ==========
      { id: 'r3-23', name: '益智拼图', icon: '🧩', description: '锻炼观察力和专注力', link: '#', type: 'free', category: '益智游戏', userType: 'child' },
      { id: 'r3-24', name: '记忆游戏', icon: '🎴', description: '翻卡片配对记忆游戏', link: '#', type: 'free', category: '益智游戏', userType: 'child' },
      { id: 'r3-25', name: '逻辑排序', icon: '📊', description: '按大小、颜色排序', link: '#', type: 'free', category: '益智游戏', userType: 'child' },
      { id: 'r3-26', name: '迷宫游戏', icon: '🌀', description: '简单迷宫训练思维', link: '#', type: 'free', category: '益智游戏', userType: 'child' },
      
      // ========== 📖 语言阅读 ==========
      { id: 'r3-27', name: '讲故事', icon: '📖', description: '鼓励孩子复述简单故事', link: '#', type: 'free', category: '语言阅读', userType: 'both' },
      { id: 'r3-28', name: '绘本推荐', icon: '📚', description: '3岁适龄绘本书单', link: '#', type: 'free', category: '语言阅读', userType: 'parent' },
      { id: 'r3-29', name: '有声故事', icon: '🎧', description: '睡前有声故事', link: '#', type: 'free', category: '语言阅读', userType: 'child' },
      { id: 'r3-30', name: '双语阅读', icon: '🌐', description: '中英双语绘本', link: '#', type: 'paid', category: '语言阅读', userType: 'both' },
      
      // ========== 🎨 艺术启蒙 ==========
      { id: 'r3-31', name: '自由绘画', icon: '🎨', description: '鼓励创意表达的绘画', link: '#', type: 'free', category: '艺术启蒙', userType: 'child' },
      { id: 'r3-32', name: '黏土玩耍', icon: '🎭', description: '黏土/橡皮泥创意游戏', link: '#', type: 'free', category: '艺术启蒙', userType: 'child' },
      { id: 'r3-33', name: '音乐律动', icon: '🎵', description: '跟着音乐做动作', link: '#', type: 'free', category: '艺术启蒙', userType: 'child' },
      
      // ========== ⚽ 运动体能 ==========
      { id: 'r3-34', name: '跑跳训练', icon: '🏃', description: '跑步、跳跃、攀爬', link: '#', type: 'free', category: '运动体能', userType: 'child' },
      { id: 'r3-35', name: '球类游戏', icon: '⚽', description: '踢球、投球、接球', link: '#', type: 'free', category: '运动体能', userType: 'child' },
      { id: 'r3-36', name: '骑车入门', icon: '🚲', description: '平衡车/三轮车', link: '#', type: 'free', category: '运动体能', userType: 'child' },
      
      // ========== 👨‍👩‍👧 家长指南 ==========
      { id: 'r3-37', name: '3岁发育指南', icon: '📋', description: '36-48个月发育里程碑', link: '#', type: 'free', category: '家长指南', userType: 'parent' },
      { id: 'r3-38', name: '家园沟通', icon: '💬', description: '如何与幼儿园老师沟通', link: '#', type: 'free', category: '家长指南', userType: 'parent' },
      { id: 'r3-39', name: '作息安排', icon: '⏰', description: '幼儿园作息与家庭作息衔接', link: '#', type: 'free', category: '家长指南', userType: 'parent' },
      { id: 'r3-40', name: '兴趣发现', icon: '🔍', description: '观察和发现孩子的兴趣', link: '#', type: 'free', category: '家长指南', userType: 'parent' },
      
      // ========== 🌏 西方教育适应 (技能型) ==========
      { id: 'r3-41', name: '英语阅读启蒙', icon: '⭐', description: '学龄前英语阅读启蒙的方法和资源类型', link: '#', type: 'free', category: '本地课程', userType: 'parent' },
      { id: 'r3-42', name: '在线学习平台', icon: '💻', description: '适合3岁的在线学习平台类型和选择建议', link: '#', type: 'free', category: '本地课程', userType: 'parent' },
      { id: 'r3-43', name: '西方幼儿园指南', icon: '🏫', description: '理解西方幼儿园教育理念（玩中学）', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      { id: 'r3-44', name: '家长志愿者', icon: '🤝', description: '如何参与西方学校的家长志愿服务', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      { id: 'r3-45', name: '英语社交', icon: '👋', description: '帮助孩子用英语交朋友的常用句型', link: '#', type: 'free', category: 'ESL英语', userType: 'both' },
    ]
  },
  {
    age: '4岁',
    title: '幼儿园中班',
    subtitle: 'Pre-K / 好奇心爆发期',
    description: '孩子开始展现个性和兴趣爱好，想象力丰富，喜欢问"为什么"。可以进行更复杂的对话，理解规则和因果关系。这是发展兴趣爱好的黄金期。',
    milestone: '幼儿园第二年',
    emoji: '🌟',
    color: 'from-teal-400 to-cyan-300',
    resources: [
      // ========== 📚 学习启蒙 ==========
      { id: 'r4-1', name: '数字1-20', icon: '🔢', description: '认识数字1-20，学会点数和简单比较大小', link: '#', type: 'free', category: '学习启蒙', userType: 'child' },
      { id: 'r4-2', name: '字母发音', icon: '🔤', description: 'ABC字母认知、发音和简单单词', link: '#', type: 'free', category: '学习启蒙', userType: 'child' },
      { id: 'r4-3', name: '汉字认读', icon: '字', description: '常见汉字认读，约100个基础字', link: '#', type: 'free', category: '学习启蒙', userType: 'child' },
      { id: 'r4-4', name: '科学小实验', icon: '🔬', description: '家庭科学实验：颜色混合、浮沉、磁铁等', link: '#', type: 'free', category: '学习启蒙', userType: 'both' },
      { id: 'r4-5', name: '逻辑思维', icon: '🧠', description: '排序、分类、找规律等逻辑训练游戏', link: '#', type: 'paid', category: '学习启蒙', userType: 'child' },
      { id: 'r4-6', name: '记忆力游戏', icon: '🎴', description: '配对游戏、记忆卡片，提升记忆力', link: '#', type: 'paid', category: '学习启蒙', userType: 'child' },
      
      // ========== 🎨 艺术创意 ==========
      { id: 'r4-7', name: '自由绘画', icon: '🎨', description: '数字画板，自由涂鸦和创作', link: '#', type: 'free', category: '艺术创意', userType: 'child' },
      { id: 'r4-8', name: '简笔画教程', icon: '✏️', description: '一步步学画动物、植物、交通工具', link: '#', type: 'free', category: '艺术创意', userType: 'child' },
      { id: 'r4-9', name: '手工折纸', icon: '📄', description: '简单折纸教程：飞机、小船、动物', link: '#', type: 'free', category: '艺术创意', userType: 'both' },
      { id: 'r4-10', name: '黏土创作', icon: '🎭', description: '黏土/橡皮泥创意指南', link: '#', type: 'free', category: '艺术创意', userType: 'both' },
      { id: 'r4-11', name: '儿童美术课', icon: '🖼️', description: '系统美术启蒙课程', link: '#', type: 'paid', category: '艺术创意', userType: 'child' },
      
      // ========== 🎵 音乐舞蹈 ==========
      { id: 'r4-12', name: '儿歌跟唱', icon: '🎤', description: '经典中英文儿歌，培养乐感', link: '#', type: 'free', category: '音乐舞蹈', userType: 'child' },
      { id: 'r4-13', name: '节奏训练', icon: '🥁', description: '跟着节拍拍手、敲击，培养节奏感', link: '#', type: 'free', category: '音乐舞蹈', userType: 'child' },
      { id: 'r4-14', name: '乐器认知', icon: '🎹', description: '认识各种乐器的外形和声音', link: '#', type: 'free', category: '音乐舞蹈', userType: 'child' },
      { id: 'r4-15', name: '儿童舞蹈', icon: '💃', description: '简单舞蹈动作教学视频', link: '#', type: 'free', category: '音乐舞蹈', userType: 'child' },
      { id: 'r4-16', name: '钢琴启蒙', icon: '🎼', description: '钢琴/电子琴入门课程', link: '#', type: 'paid', category: '音乐舞蹈', userType: 'child' },
      
      // ========== ⚽ 运动体能 ==========
      { id: 'r4-17', name: '亲子运动', icon: '🏃', description: '家庭亲子运动游戏指南', link: '#', type: 'free', category: '运动体能', userType: 'both' },
      { id: 'r4-18', name: '平衡训练', icon: '🤸', description: '单脚站、走平衡木等平衡能力训练', link: '#', type: 'free', category: '运动体能', userType: 'child' },
      { id: 'r4-19', name: '球类入门', icon: '⚽', description: '踢球、投球、接球基础动作', link: '#', type: 'free', category: '运动体能', userType: 'child' },
      { id: 'r4-20', name: '游泳启蒙', icon: '🏊', description: '幼儿游泳准备和安全知识', link: '#', type: 'free', category: '运动体能', userType: 'parent' },
      { id: 'r4-21', name: '体操基础', icon: '🤸‍♀️', description: '儿童体操入门动作', link: '#', type: 'paid', category: '运动体能', userType: 'child' },
      
      // ========== 🌱 生活技能 ==========
      { id: 'r4-22', name: '独立穿衣', icon: '👕', description: '学会系扣子、拉拉链、穿袜子', link: '#', type: 'free', category: '生活技能', userType: 'both' },
      { id: 'r4-23', name: '整理房间', icon: '🧹', description: '收拾玩具、整理书包的习惯培养', link: '#', type: 'free', category: '生活技能', userType: 'both' },
      { id: 'r4-24', name: '餐桌礼仪', icon: '🍽️', description: '正确使用筷子、基本用餐礼仪', link: '#', type: 'free', category: '生活技能', userType: 'both' },
      { id: 'r4-25', name: '时间概念', icon: '⏰', description: '认识钟表，理解日程安排', link: '#', type: 'free', category: '生活技能', userType: 'child' },
      { id: 'r4-26', name: '安全教育', icon: '🚦', description: '交通安全、陌生人安全、居家安全', link: '#', type: 'free', category: '生活技能', userType: 'both' },
      
      // ========== 💚 社交情感 ==========
      { id: 'r4-27', name: '情绪认知', icon: '😊', description: '认识和表达不同情绪', link: '#', type: 'free', category: '社交情感', userType: 'child' },
      { id: 'r4-28', name: '同理心培养', icon: '💕', description: '理解他人感受的故事和游戏', link: '#', type: 'free', category: '社交情感', userType: 'both' },
      { id: 'r4-29', name: '合作游戏', icon: '🤝', description: '需要合作完成的团队游戏', link: '#', type: 'free', category: '社交情感', userType: 'child' },
      { id: 'r4-30', name: '社交故事', icon: '📚', description: '如何交朋友、如何道歉等社交情境', link: '#', type: 'free', category: '社交情感', userType: 'both' },
      
      // ========== 📖 阅读故事 ==========
      { id: 'r4-31', name: '绘本推荐', icon: '📚', description: '4岁适龄绘本精选书单', link: '#', type: 'free', category: '阅读故事', userType: 'parent' },
      { id: 'r4-32', name: '有声故事', icon: '🎧', description: '睡前故事、童话故事音频', link: '#', type: 'free', category: '阅读故事', userType: 'child' },
      { id: 'r4-33', name: '互动绘本', icon: '📱', description: '可点击互动的电子绘本', link: '#', type: 'paid', category: '阅读故事', userType: 'child' },
      
      // ========== 👨‍👩‍👧 家长指南 ==========
      { id: 'r4-34', name: '4岁发育指南', icon: '📋', description: '4岁儿童发育里程碑和评估', link: '#', type: 'free', category: '家长指南', userType: 'parent' },
      { id: 'r4-35', name: '兴趣发现', icon: '🔍', description: '如何发现和培养孩子的兴趣爱好', link: '#', type: 'free', category: '家长指南', userType: 'parent' },
      { id: 'r4-36', name: '正面管教', icon: '💡', description: '应对"为什么"阶段的沟通技巧', link: '#', type: 'free', category: '家长指南', userType: 'parent' },
      { id: 'r4-37', name: '屏幕时间', icon: '📵', description: '如何合理管理孩子的屏幕时间', link: '#', type: 'free', category: '家长指南', userType: 'parent' },
      { id: 'r4-38', name: '择校准备', icon: '🏫', description: '了解幼升小准备时间线', link: '#', type: 'free', category: '家长指南', userType: 'parent' },
    ]
  },
  {
    age: '5岁',
    title: '幼儿园大班',
    subtitle: 'Kindergarten / 幼小衔接年',
    description: '为小学做准备的关键一年！学习更多汉字和数学，能独立完成任务，有较强的自我表达能力。开始理解规则和学习团队合作。',
    milestone: '明年就要上小学啦！',
    emoji: '📚',
    color: 'from-blue-400 to-indigo-300',
    resources: [
      // ========== 📚 幼小衔接 ==========
      { id: 'r5-1', name: '拼音入门', icon: '🅰️', description: '声母、韵母、整体认读音节学习', link: '#', type: 'free', category: '幼小衔接', userType: 'child' },
      { id: 'r5-2', name: '汉字书写', icon: '✏️', description: '正确笔顺，学写50-100个常用字', link: '#', type: 'free', category: '幼小衔接', userType: 'child' },
      { id: 'r5-3', name: '20以内加减', icon: '➕', description: '20以内加减法，凑十法', link: '#', type: 'free', category: '幼小衔接', userType: 'child' },
      { id: 'r5-4', name: '英文拼读', icon: '🔤', description: 'Phonics自然拼读基础', link: '#', type: 'free', category: '幼小衔接', userType: 'child' },
      { id: 'r5-5', name: '看图说话', icon: '🖼️', description: '观察图片，组织语言描述', link: '#', type: 'free', category: '幼小衔接', userType: 'child' },
      { id: 'r5-6', name: '幼小衔接课', icon: '🎯', description: '系统幼小衔接课程（语数英）', link: '#', type: 'paid', category: '幼小衔接', userType: 'child' },
      { id: 'r5-7', name: '思维训练', icon: '🧠', description: '逻辑思维、空间想象专项训练', link: '#', type: 'paid', category: '幼小衔接', userType: 'child' },
      
      // ========== 📖 阅读能力 ==========
      { id: 'r5-8', name: '分级阅读', icon: '📚', description: '适合5岁的中文分级读物', link: '#', type: 'free', category: '阅读能力', userType: 'child' },
      { id: 'r5-9', name: '亲子共读', icon: '👨‍👩‍👧', description: '如何进行有效的亲子阅读', link: '#', type: 'free', category: '阅读能力', userType: 'parent' },
      { id: 'r5-10', name: '英文绘本', icon: '📕', description: '适合英语启蒙的简单绘本', link: '#', type: 'free', category: '阅读能力', userType: 'child' },
      { id: 'r5-11', name: '识字量测试', icon: '📊', description: '测试孩子的识字量和阅读水平', link: '#', type: 'free', category: '阅读能力', userType: 'parent' },
      { id: 'r5-12', name: '阅读理解', icon: '💭', description: '听故事回答问题，培养理解力', link: '#', type: 'paid', category: '阅读能力', userType: 'child' },
      
      // ========== 🎨 艺术创作 ==========
      { id: 'r5-13', name: '创意绘画', icon: '🎨', description: '引导式创意绘画，不再是涂色', link: '#', type: 'free', category: '艺术创作', userType: 'child' },
      { id: 'r5-14', name: '手工制作', icon: '✂️', description: '剪纸、折纸、拼贴等综合手工', link: '#', type: 'free', category: '艺术创作', userType: 'child' },
      { id: 'r5-15', name: '涂色本', icon: '🖍️', description: '精细涂色，练习手部控制', link: '#', type: 'free', category: '艺术创作', userType: 'child' },
      { id: 'r5-16', name: '素描基础', icon: '✏️', description: '简单素描入门：线条和形状', link: '#', type: 'paid', category: '艺术创作', userType: 'child' },
      
      // ========== 🎵 音乐素养 ==========
      { id: 'r5-17', name: '音乐欣赏', icon: '🎵', description: '古典音乐启蒙，认识音乐家', link: '#', type: 'free', category: '音乐素养', userType: 'child' },
      { id: 'r5-18', name: '唱歌技巧', icon: '🎤', description: '简单发声方法和儿歌演唱', link: '#', type: 'free', category: '音乐素养', userType: 'child' },
      { id: 'r5-19', name: '尤克里里', icon: '🎸', description: '尤克里里入门，简单弹唱', link: '#', type: 'paid', category: '音乐素养', userType: 'child' },
      { id: 'r5-20', name: '钢琴入门', icon: '🎹', description: '钢琴基础课程', link: '#', type: 'paid', category: '音乐素养', userType: 'child' },
      
      // ========== ⚽ 体育运动 ==========
      { id: 'r5-21', name: '跳绳教学', icon: '🏃', description: '从零开始学跳绳', link: '#', type: 'free', category: '体育运动', userType: 'child' },
      { id: 'r5-22', name: '足球基础', icon: '⚽', description: '足球基本动作和规则', link: '#', type: 'free', category: '体育运动', userType: 'child' },
      { id: 'r5-23', name: '篮球启蒙', icon: '🏀', description: '拍球、投篮基础', link: '#', type: 'free', category: '体育运动', userType: 'child' },
      { id: 'r5-24', name: '轮滑入门', icon: '⛸️', description: '轮滑装备选择和基础教学', link: '#', type: 'free', category: '体育运动', userType: 'both' },
      { id: 'r5-25', name: '游泳课程', icon: '🏊', description: '儿童游泳系统课程', link: '#', type: 'paid', category: '体育运动', userType: 'child' },
      { id: 'r5-26', name: '跆拳道', icon: '🥋', description: '跆拳道/武术入门', link: '#', type: 'paid', category: '体育运动', userType: 'child' },
      
      // ========== 🧩 益智游戏 ==========
      { id: 'r5-27', name: '国际象棋', icon: '♟️', description: '国际象棋入门规则和走法', link: '#', type: 'free', category: '益智游戏', userType: 'child' },
      { id: 'r5-28', name: '围棋启蒙', icon: '⚫', description: '围棋基础规则', link: '#', type: 'free', category: '益智游戏', userType: 'child' },
      { id: 'r5-29', name: '拼图挑战', icon: '🧩', description: '50-100片拼图', link: '#', type: 'free', category: '益智游戏', userType: 'child' },
      { id: 'r5-30', name: '迷宫游戏', icon: '🌀', description: '迷宫和路径规划游戏', link: '#', type: 'free', category: '益智游戏', userType: 'child' },
      { id: 'r5-31', name: '编程启蒙', icon: '🤖', description: 'Scratch Jr等图形化编程', link: '#', type: 'paid', category: '益智游戏', userType: 'child' },
      
      // ========== 🌱 习惯养成 ==========
      { id: 'r5-32', name: '作息规律', icon: '⏰', description: '建立固定的作息时间表', link: '#', type: 'free', category: '习惯养成', userType: 'both' },
      { id: 'r5-33', name: '专注力', icon: '🎯', description: '提高专注时间的训练方法', link: '#', type: 'free', category: '习惯养成', userType: 'both' },
      { id: 'r5-34', name: '独立完成', icon: '✅', description: '培养独立完成任务的能力', link: '#', type: 'free', category: '习惯养成', userType: 'parent' },
      { id: 'r5-35', name: '责任心', icon: '💪', description: '通过家务培养责任感', link: '#', type: 'free', category: '习惯养成', userType: 'both' },
      
      // ========== 💚 情商发展 ==========
      { id: 'r5-36', name: '情绪管理', icon: '😌', description: '识别情绪，学习自我调节', link: '#', type: 'free', category: '情商发展', userType: 'child' },
      { id: 'r5-37', name: '挫折教育', icon: '💪', description: '面对失败和挫折的正确态度', link: '#', type: 'free', category: '情商发展', userType: 'both' },
      { id: 'r5-38', name: '自信培养', icon: '⭐', description: '建立自信心的方法和活动', link: '#', type: 'free', category: '情商发展', userType: 'parent' },
      
      // ========== 👨‍👩‍👧 家长指南 ==========
      { id: 'r5-39', name: '幼升小攻略', icon: '🏫', description: '择校、面试、准备全攻略', link: '#', type: 'free', category: '家长指南', userType: 'parent' },
      { id: 'r5-40', name: '入学准备清单', icon: '📋', description: '小学入学物品和能力清单', link: '#', type: 'free', category: '家长指南', userType: 'parent' },
      { id: 'r5-41', name: '学习习惯', icon: '📚', description: '帮助孩子建立良好学习习惯', link: '#', type: 'free', category: '家长指南', userType: 'parent' },
      { id: 'r5-42', name: '分离焦虑', icon: '🤗', description: '应对入学分离焦虑的方法', link: '#', type: 'free', category: '家长指南', userType: 'parent' },
      
      // ========== 🌏 西方教育适应 (技能型) ==========
      { id: 'r5-43', name: '免费学习资源', icon: '🎓', description: '5岁儿童免费在线学习资源类型和推荐', link: '#', type: 'free', category: '本地课程', userType: 'parent' },
      { id: 'r5-44', name: '英文电子图书', icon: '📚', description: '培养英语阅读习惯：电子图书馆和阅读平台选择', link: '#', type: 'free', category: '本地课程', userType: 'parent' },
      { id: 'r5-45', name: 'Kindergarten入学', icon: '🏫', description: '北美Kindergarten入学要求和准备', link: '#', type: 'free', category: '学校系统', userType: 'parent' },
      { id: 'r5-46', name: 'IEP/504计划', icon: '📋', description: '了解特殊教育支持计划（如需要）', link: '#', type: 'free', category: '学校系统', userType: 'parent' },
      { id: 'r5-47', name: '英语日常会话', icon: '🗣️', description: '帮孩子适应英语课堂的常用表达', link: '#', type: 'free', category: 'ESL英语', userType: 'both' },
      { id: 'r5-48', name: '中文传承', icon: '🏮', description: '在西方保持中文能力的方法', link: '#', type: 'free', category: '中文传承', userType: 'parent' },
    ]
  },
  {
    age: '6岁',
    title: '小学一年级',
    subtitle: 'Grade 1 / 西方学校适应元年',
    description: '正式开始西方小学生活！这是华人家庭适应新教育体系的关键一年。建立良好的家校沟通、帮助孩子发展英语能力、了解西方教育理念，同时保持中文传承。',
    milestone: '西方学校适应！',
    emoji: '✏️',
    color: 'from-violet-400 to-purple-300',
    resources: [
      // ========== 🏫 西方学校适应 (家长必读) ==========
      { id: 'r6-1', name: '了解Report Card', icon: '📊', description: '如何读懂西方成绩单（字母等级vs百分制）', link: '#', type: 'free', category: '学校系统', userType: 'parent' },
      { id: 'r6-2', name: '家长会准备', icon: '👨‍👩‍👧', description: 'Parent-Teacher Conference应该问什么问题', link: '#', type: 'free', category: '学校系统', userType: 'parent' },
      { id: 'r6-3', name: '学校邮件沟通', icon: '📧', description: '如何用英文邮件与老师沟通（常用模板）', link: '#', type: 'free', category: '学校系统', userType: 'parent' },
      { id: 'r6-4', name: '志愿者机会', icon: '🙋', description: '了解学校志愿者项目，融入学校社区', link: '#', type: 'free', category: '学校系统', userType: 'parent' },
      { id: 'r6-5', name: '课外活动选择', icon: '🎯', description: '了解学校After-School Programs和社区活动', link: '#', type: 'free', category: '学校系统', userType: 'parent' },
      { id: 'r6-6', name: '学区资源', icon: '🏛️', description: '如何利用学区提供的免费资源和支持', link: '#', type: 'free', category: '学校系统', userType: 'parent' },
      
      // ========== 🗣️ ESL英语支持 ==========
      { id: 'r6-7', name: '了解ESL/ELL', icon: '🗣️', description: '学校ESL项目是什么？如何配合老师', link: '#', type: 'free', category: 'ESL英语', userType: 'parent' },
      { id: 'r6-8', name: 'Phonics基础', icon: '🔤', description: '自然拼读原理，帮助孩子解码英文', link: '#', type: 'free', category: 'ESL英语', userType: 'both' },
      { id: 'r6-9', name: 'Sight Words', icon: '👀', description: '高频词学习方法（Dolch/Fry词表）', link: '#', type: 'free', category: 'ESL英语', userType: 'both' },
      { id: 'r6-10', name: '英语阅读分级', icon: '📚', description: '了解Reading Level (A-Z/Lexile)系统', link: '#', type: 'free', category: 'ESL英语', userType: 'parent' },
      { id: 'r6-11', name: '家庭英语环境', icon: '🏠', description: '如何在家创造英语学习环境', link: '#', type: 'free', category: 'ESL英语', userType: 'parent' },
      { id: 'r6-12', name: '图书馆利用', icon: '📖', description: '如何使用公共图书馆资源（借书、活动）', link: '#', type: 'free', category: 'ESL英语', userType: 'parent' },
      
      // ========== 🔢 数学思维 ==========
      { id: 'r6-13', name: '西方数学教学', icon: '🧮', description: '理解西方数学教学方法（为什么不死记？）', link: '#', type: 'free', category: '本地课程', userType: 'parent' },
      { id: 'r6-14', name: '数学语言', icon: '📐', description: '数学题目中的英文表达和关键词', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      { id: 'r6-15', name: '数学思维方法', icon: '🧠', description: '如何培养数学思维而非死记硬背', link: '#', type: 'free', category: '本地课程', userType: 'parent' },
      { id: 'r6-16', name: '数学游戏', icon: '🎲', description: '通过家庭游戏培养数学兴趣', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      
      // ========== 🏮 中文传承 ==========
      { id: 'r6-17', name: '中文学校选择', icon: '🏫', description: '如何选择合适的周末中文学校', link: '#', type: 'free', category: '中文传承', userType: 'parent' },
      { id: 'r6-18', name: '家庭中文环境', icon: '🏠', description: '如何在家保持中文听说环境', link: '#', type: 'free', category: '中文传承', userType: 'parent' },
      { id: 'r6-19', name: '中文阅读习惯', icon: '📚', description: '培养孩子中文阅读兴趣的方法', link: '#', type: 'free', category: '中文传承', userType: 'parent' },
      { id: 'r6-20', name: '双语平衡', icon: '⚖️', description: '如何平衡中英文学习时间', link: '#', type: 'free', category: '中文传承', userType: 'parent' },
      
      // ========== 🌱 习惯养成 ==========
      { id: 'r6-21', name: '作业习惯', icon: '📋', description: '建立每日作业routine的方法', link: '#', type: 'free', category: '习惯与品格', userType: 'both' },
      { id: 'r6-22', name: '阅读习惯', icon: '📖', description: '每日阅读20分钟的习惯养成', link: '#', type: 'free', category: '习惯与品格', userType: 'both' },
      { id: 'r6-23', name: '自理能力', icon: '🎒', description: '整理书包、准备文具等自理能力', link: '#', type: 'free', category: '习惯与品格', userType: 'child' },
      { id: 'r6-24', name: '时间管理', icon: '⏰', description: '帮助孩子建立时间概念', link: '#', type: 'free', category: '习惯与品格', userType: 'both' },
      
      // ========== 💚 社交适应 ==========
      { id: 'r6-25', name: '交友技能', icon: '👫', description: '帮助孩子在新环境交朋友', link: '#', type: 'free', category: '心理健康', userType: 'both' },
      { id: 'r6-26', name: 'Playdate安排', icon: '🎮', description: '如何安排和参加Playdate', link: '#', type: 'free', category: '心理健康', userType: 'parent' },
      { id: 'r6-27', name: '生日派对', icon: '🎂', description: '西方儿童生日派对文化和礼仪', link: '#', type: 'free', category: '心理健康', userType: 'parent' },
      { id: 'r6-28', name: '处理冲突', icon: '🤝', description: '教孩子用英文表达和解决冲突', link: '#', type: 'free', category: '心理健康', userType: 'both' },
      
      // ========== 🎨 才艺发展 ==========
      { id: 'r6-29', name: '才艺选择', icon: '🎯', description: '一年级适合开始什么才艺？', link: '#', type: 'free', category: '艺术培养', userType: 'parent' },
      { id: 'r6-30', name: '音乐启蒙', icon: '🎵', description: '音乐学习的黄金年龄和选择', link: '#', type: 'free', category: '音乐学习', userType: 'parent' },
      { id: 'r6-31', name: '运动项目', icon: '⚽', description: '适合一年级的团队运动选择', link: '#', type: 'free', category: '体育运动', userType: 'parent' },
      { id: 'r6-32', name: '游泳安全', icon: '🏊', description: '游泳能力和水上安全教育', link: '#', type: 'free', category: '体育运动', userType: 'both' },
      
      // ========== 👨‍👩‍👧 长期规划视角 ==========
      { id: 'r6-33', name: '小学阶段规划', icon: '🗓️', description: '小学6年整体规划和关键节点', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      { id: 'r6-34', name: '阅读能力', icon: '📚', description: '为什么阅读能力是一切学习的基础', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      { id: 'r6-35', name: '数学基础', icon: '🔢', description: '一年级数学概念的重要性', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      { id: 'r6-36', name: '习惯vs成绩', icon: '💡', description: '为什么习惯比成绩更重要', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
    ]
  },
  {
    age: '7岁',
    title: '小学二年级',
    subtitle: 'Grade 2 / 阅读能力奠基年',
    description: '这是培养阅读能力的关键一年！孩子需要从"学习阅读"转变为"通过阅读学习"。英语阅读流利度和理解力直接影响未来所有学科的学习。',
    milestone: '阅读能力奠基！',
    emoji: '📖',
    color: 'from-fuchsia-400 to-pink-300',
    resources: [
      // ========== 📚 阅读能力 (最重要) ==========
      { id: 'r7-1', name: '阅读流利度', icon: '📖', description: '什么是Reading Fluency？为什么重要？', link: '#', type: 'free', category: 'ESL英语', userType: 'parent' },
      { id: 'r7-2', name: 'Reading Level追踪', icon: '📊', description: '如何追踪孩子的阅读水平进步', link: '#', type: 'free', category: 'ESL英语', userType: 'parent' },
      { id: 'r7-3', name: '选书技巧', icon: '📚', description: '"五指法则"选择合适难度的书', link: '#', type: 'free', category: 'ESL英语', userType: 'both' },
      { id: 'r7-4', name: '阅读理解', icon: '🧠', description: '培养阅读理解能力的提问技巧', link: '#', type: 'free', category: 'ESL英语', userType: 'parent' },
      { id: 'r7-5', name: '图书馆活动', icon: '📖', description: '利用图书馆Summer Reading Program', link: '#', type: 'free', category: 'ESL英语', userType: 'parent' },
      { id: 'r7-6', name: '阅读习惯', icon: '⏰', description: '建立每日30分钟阅读习惯', link: '#', type: 'free', category: '习惯与品格', userType: 'both' },
      
      // ========== 🏫 学校学习 ==========
      { id: 'r7-7', name: 'Grade 2课程', icon: '📋', description: '二年级学习内容和期望', link: '#', type: 'free', category: '学校系统', userType: 'parent' },
      { id: 'r7-8', name: '数学词汇', icon: '🔢', description: '二年级数学英文词汇（加减乘除、分数等）', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      { id: 'r7-9', name: '写作发展', icon: '✏️', description: '二年级写作发展阶段和期望', link: '#', type: 'free', category: '本地课程', userType: 'parent' },
      { id: 'r7-10', name: '拼写学习', icon: '🔤', description: '西方学校拼写学习方法（Spelling）', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      { id: 'r7-11', name: '标准化测试', icon: '📝', description: '了解学校的标准化测试（MAP等）', link: '#', type: 'free', category: '学校系统', userType: 'parent' },
      
      // ========== 🗣️ 英语提升 ==========
      { id: 'r7-12', name: 'ESL进展评估', icon: '📈', description: '如何评估ESL进展，何时退出ESL', link: '#', type: 'free', category: 'ESL英语', userType: 'parent' },
      { id: 'r7-13', name: '词汇积累', icon: '📚', description: '二年级核心词汇学习方法', link: '#', type: 'free', category: 'ESL英语', userType: 'both' },
      { id: 'r7-14', name: '口语表达', icon: '🗣️', description: '提升课堂口语表达能力', link: '#', type: 'free', category: 'ESL英语', userType: 'both' },
      { id: 'r7-15', name: '听力理解', icon: '👂', description: '提高英语听力理解能力', link: '#', type: 'free', category: 'ESL英语', userType: 'both' },
      
      // ========== 🏮 中文传承 ==========
      { id: 'r7-16', name: '中文阅读', icon: '📚', description: '适合7岁的中文读物推荐', link: '#', type: 'free', category: '中文传承', userType: 'parent' },
      { id: 'r7-17', name: '中文写作', icon: '✏️', description: '基础中文写作：日记、看图写话', link: '#', type: 'free', category: '中文传承', userType: 'both' },
      { id: 'r7-18', name: '中文口语', icon: '🗣️', description: '保持日常中文会话能力', link: '#', type: 'free', category: '中文传承', userType: 'parent' },
      { id: 'r7-19', name: '汉字书写', icon: '字', description: '基础汉字书写练习', link: '#', type: 'free', category: '中文传承', userType: 'child' },
      
      // ========== 💚 社交发展 ==========
      { id: 'r7-20', name: '团队合作', icon: '👥', description: '培养孩子的团队合作能力', link: '#', type: 'free', category: '心理健康', userType: 'both' },
      { id: 'r7-21', name: '冲突解决', icon: '🤝', description: '教孩子处理同学间的小冲突', link: '#', type: 'free', category: '心理健康', userType: 'both' },
      { id: 'r7-22', name: '课外活动', icon: '⚽', description: '选择课外活动帮助社交', link: '#', type: 'free', category: '心理健康', userType: 'parent' },
      { id: 'r7-23', name: '文化身份', icon: '🌏', description: '帮助孩子建立双文化身份认同', link: '#', type: 'free', category: '心理健康', userType: 'parent' },
      
      // ========== 🎨 才艺发展 ==========
      { id: 'r7-24', name: '乐器学习', icon: '🎹', description: '乐器学习进展和坚持策略', link: '#', type: 'free', category: '音乐学习', userType: 'parent' },
      { id: 'r7-25', name: '运动技能', icon: '⚽', description: '发展运动技能和团队运动', link: '#', type: 'free', category: '体育运动', userType: 'both' },
      { id: 'r7-26', name: '艺术培养', icon: '🎨', description: '绘画和手工创作发展', link: '#', type: 'free', category: '艺术培养', userType: 'both' },
      
      // ========== 🧠 学习习惯 ==========
      { id: 'r7-27', name: '作业独立性', icon: '📋', description: '培养独立完成作业的能力', link: '#', type: 'free', category: '习惯与品格', userType: 'both' },
      { id: 'r7-28', name: '时间管理', icon: '⏰', description: '教孩子基本的时间管理', link: '#', type: 'free', category: '习惯与品格', userType: 'both' },
      { id: 'r7-29', name: '专注力', icon: '🎯', description: '提高课堂和作业专注力', link: '#', type: 'free', category: '习惯与品格', userType: 'both' },
      
      // ========== 👨‍👩‍👧 长期规划视角 ==========
      { id: 'r7-30', name: '三年级过渡', icon: '📈', description: '"三年级滑坡"是什么？如何预防？', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      { id: 'r7-31', name: '阅读vs成绩', icon: '📚', description: '为什么二年级阅读习惯决定未来学业', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      { id: 'r7-32', name: '数学基础', icon: '🔢', description: '确保数学基础扎实（乘法表等）', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      { id: 'r7-33', name: 'Gifted筛查', icon: '⭐', description: '了解Gifted Program筛选和申请', link: '#', type: 'free', category: '学校系统', userType: 'parent' },
    ]
  },
  {
    age: '8岁',
    title: '小学三年级',
    subtitle: 'Grade 3 / 三年级滑坡预防',
    description: '"三年级滑坡"是西方教育中的关键转折点！学习从"学会阅读"转变为"通过阅读学习"。如果阅读能力不足，所有学科都会受影响。写作要求也显著增加。',
    milestone: '三年级转折点！',
    emoji: '🎓',
    color: 'from-rose-400 to-red-300',
    resources: [
      // ========== ⚠️ 三年级滑坡预防 (最重要) ==========
      { id: 'r8-1', name: '了解三年级滑坡', icon: '📉', description: '什么是"Third Grade Slump"？如何预防？', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      { id: 'r8-2', name: '阅读能力检测', icon: '📊', description: '如何判断孩子阅读能力是否达标', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      { id: 'r8-3', name: '补救措施', icon: '🛠️', description: '阅读落后怎么办？补救策略', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      { id: 'r8-4', name: '学校支持', icon: '🏫', description: '如何获取学校的额外支持（RTI等）', link: '#', type: 'free', category: '学校系统', userType: 'parent' },
      
      // ========== 📖 阅读提升 ==========
      { id: 'r8-5', name: '阅读理解策略', icon: '🧠', description: '教孩子阅读理解策略（预测、总结等）', link: '#', type: 'free', category: 'ESL英语', userType: 'both' },
      { id: 'r8-6', name: '非虚构阅读', icon: '📰', description: '培养非虚构类（Non-fiction）阅读能力', link: '#', type: 'free', category: 'ESL英语', userType: 'both' },
      { id: 'r8-7', name: '词汇发展', icon: '📚', description: '三年级词汇量要求和学习方法', link: '#', type: 'free', category: 'ESL英语', userType: 'both' },
      { id: 'r8-8', name: '阅读流利度', icon: '🎯', description: '提高阅读流利度的方法', link: '#', type: 'free', category: 'ESL英语', userType: 'both' },
      
      // ========== ✏️ 写作发展 ==========
      { id: 'r8-9', name: '写作过程', icon: '✏️', description: '了解西方写作过程（Planning, Drafting, Revising）', link: '#', type: 'free', category: '本地课程', userType: 'parent' },
      { id: 'r8-10', name: '段落写作', icon: '📝', description: '教孩子写完整的段落', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      { id: 'r8-11', name: '研究报告', icon: '📋', description: '简单的Research Report写作', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      { id: 'r8-12', name: '写作习惯', icon: '📓', description: '培养日常写作习惯', link: '#', type: 'free', category: '习惯与品格', userType: 'both' },
      
      // ========== 🔢 数学发展 ==========
      { id: 'r8-13', name: '数学词汇', icon: '🔢', description: '三年级数学英文词汇（乘除法、分数等）', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      { id: 'r8-14', name: '乘法掌握', icon: '✖️', description: '确保乘法表完全掌握', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      { id: 'r8-15', name: '分数概念', icon: '½', description: '分数概念理解（不只是计算）', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      { id: 'r8-16', name: '应用题', icon: '📊', description: '数学Word Problems理解和解题', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      
      // ========== 🏫 学校参与 ==========
      { id: 'r8-17', name: '标准化测试', icon: '📝', description: '了解州/省标准化测试（何时、如何准备）', link: '#', type: 'free', category: '学校系统', userType: 'parent' },
      { id: 'r8-18', name: '家长会深谈', icon: '👨‍👩‍👧', description: '三年级家长会应该重点关注什么', link: '#', type: 'free', category: '学校系统', userType: 'parent' },
      { id: 'r8-19', name: '特殊教育', icon: '💡', description: '了解IEP和504 Plan（如果孩子需要）', link: '#', type: 'free', category: '学校系统', userType: 'parent' },
      { id: 'r8-20', name: 'Gifted测试', icon: '⭐', description: 'Gifted Program筛选和申请', link: '#', type: 'free', category: '学校系统', userType: 'parent' },
      
      // ========== 🏮 中文传承 ==========
      { id: 'r8-21', name: '中文阅读', icon: '📚', description: '适合8岁的中文章节书', link: '#', type: 'free', category: '中文传承', userType: 'parent' },
      { id: 'r8-22', name: '中文写作', icon: '✏️', description: '基础中文写作练习', link: '#', type: 'free', category: '中文传承', userType: 'both' },
      { id: 'r8-23', name: '保持兴趣', icon: '❤️', description: '如何保持孩子对中文的兴趣', link: '#', type: 'free', category: '中文传承', userType: 'parent' },
      
      // ========== 💚 学习习惯 ==========
      { id: 'r8-24', name: '独立学习', icon: '📋', description: '培养独立完成作业的能力', link: '#', type: 'free', category: '习惯与品格', userType: 'both' },
      { id: 'r8-25', name: '组织能力', icon: '🗂️', description: '教孩子管理作业和材料', link: '#', type: 'free', category: '习惯与品格', userType: 'both' },
      { id: 'r8-26', name: '考试准备', icon: '📝', description: '如何帮助孩子准备测试', link: '#', type: 'free', category: '习惯与品格', userType: 'parent' },
      
      // ========== 🎨 才艺与活动 ==========
      { id: 'r8-27', name: '活动平衡', icon: '⚖️', description: '如何平衡学业和课外活动', link: '#', type: 'free', category: '心理健康', userType: 'parent' },
      { id: 'r8-28', name: '编程启蒙', icon: '💻', description: '图形化编程学习（Scratch概念）', link: '#', type: 'free', category: '艺术培养', userType: 'both' },
      { id: 'r8-29', name: '团队运动', icon: '⚽', description: '团队运动的价值和选择', link: '#', type: 'free', category: '体育运动', userType: 'parent' },
      
      // ========== 👨‍👩‍👧 长期规划视角 ==========
      { id: 'r8-30', name: '4-5年级预备', icon: '📈', description: '为高年级做准备应该关注什么', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      { id: 'r8-31', name: '学习自主性', icon: '🎯', description: '从三年级开始培养学习自主性', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      { id: 'r8-32', name: 'Word Quest', icon: '🎮', description: 'K12Path原创SSAT词汇游戏！通过闯关趣味学习SSAT Elementary词汇', link: '/word-quest/', type: 'free', category: 'ESL英语', userType: 'child' },
    ]
  },
  {
    age: '9岁',
    title: '小学四年级',
    subtitle: 'Grade 4 / 学术能力提升',
    description: '四年级是学业要求显著提升的一年。写作从段落过渡到Essay，数学概念更加抽象，Science和Social Studies开始有阅读和写作要求。这一年也是私校申请准备的起点。',
    milestone: '学术提升期！',
    emoji: '💡',
    color: 'from-amber-400 to-yellow-300',
    resources: [
      // ========== 📖 阅读与写作 ==========
      { id: 'r9-1', name: 'Essay写作', icon: '✏️', description: '从段落到Essay的写作过渡', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      { id: 'r9-2', name: '研究技能', icon: '🔍', description: '培养Research和Note-taking技能', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      { id: 'r9-3', name: '阅读深度', icon: '📚', description: '深度阅读和批判性思考', link: '#', type: 'free', category: 'ESL英语', userType: 'both' },
      { id: 'r9-4', name: '阅读量', icon: '📊', description: '四年级阅读量要求和书单', link: '#', type: 'free', category: 'ESL英语', userType: 'parent' },
      { id: 'r9-5', name: '写作技巧', icon: '📝', description: '论点、论据、结论的写作结构', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      
      // ========== 🔢 数学发展 ==========
      { id: 'r9-6', name: '分数理解', icon: '½', description: '分数概念的深入理解', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      { id: 'r9-7', name: '小数运算', icon: '🔢', description: '小数概念和运算', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      { id: 'r9-8', name: '数学思维', icon: '🧠', description: '数学问题解决思维', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      { id: 'r9-9', name: '数学竞赛', icon: '🏆', description: '了解数学竞赛（Math League, AMC 8等）', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      
      // ========== 🏫 学校参与 ==========
      { id: 'r9-10', name: '项目学习', icon: '📋', description: '如何帮助孩子完成Project', link: '#', type: 'free', category: '学校系统', userType: 'parent' },
      { id: 'r9-11', name: '小组合作', icon: '👥', description: 'Group Work技能培养', link: '#', type: 'free', category: '学校系统', userType: 'both' },
      { id: 'r9-12', name: '口头报告', icon: '🎤', description: 'Presentation技能培养', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      { id: 'r9-13', name: '测试准备', icon: '📝', description: '标准化测试策略和准备', link: '#', type: 'free', category: '学校系统', userType: 'parent' },
      
      // ========== 🎯 私校申请准备（如有需要）==========
      { id: 'r9-14', name: '私校了解', icon: '🏫', description: '西方私立学校概览和选择', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      { id: 'r9-15', name: 'SSAT了解', icon: '📝', description: '了解SSAT考试（如果考虑私校）', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      { id: 'r9-16', name: '活动规划', icon: '🎯', description: '课外活动的长期规划思路', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      { id: 'r9-17', name: 'Word Quest', icon: '🎮', description: 'K12Path原创SSAT词汇游戏！趣味学习SSAT Elementary词汇', link: '/word-quest/', type: 'free', category: 'ESL英语', userType: 'child' },
      
      // ========== 🏮 中文传承 ==========
      { id: 'r9-18', name: '中文阅读', icon: '📚', description: '适合9岁的中文章节书推荐', link: '#', type: 'free', category: '中文传承', userType: 'parent' },
      { id: 'r9-19', name: '中文写作', icon: '✏️', description: '中文写作能力发展', link: '#', type: 'free', category: '中文传承', userType: 'both' },
      { id: 'r9-20', name: '文化传承', icon: '🏮', description: '中国历史和文化学习', link: '#', type: 'free', category: '中文传承', userType: 'both' },
      
      // ========== 💻 数字技能 ==========
      { id: 'r9-21', name: '打字技能', icon: '⌨️', description: '键盘打字技能培养', link: '#', type: 'free', category: '本地课程', userType: 'child' },
      { id: 'r9-22', name: '编程思维', icon: '💻', description: '编程逻辑思维培养', link: '#', type: 'free', category: '艺术培养', userType: 'both' },
      { id: 'r9-23', name: '网络安全', icon: '🔒', description: '网络安全和数字素养', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      
      // ========== 💚 学习习惯 ==========
      { id: 'r9-24', name: '自主学习', icon: '📚', description: '培养独立学习能力', link: '#', type: 'free', category: '习惯与品格', userType: 'both' },
      { id: 'r9-25', name: '时间管理', icon: '⏰', description: '多任务时间管理', link: '#', type: 'free', category: '习惯与品格', userType: 'both' },
      { id: 'r9-26', name: '笔记技巧', icon: '📝', description: '有效的笔记方法', link: '#', type: 'free', category: '习惯与品格', userType: 'both' },
      
      // ========== 🎨 才艺与活动 ==========
      { id: 'r9-27', name: '活动深度', icon: '🎯', description: '从广度到深度：选择专注的活动', link: '#', type: 'free', category: '心理健康', userType: 'parent' },
      { id: 'r9-28', name: '运动发展', icon: '⚽', description: '竞技运动vs休闲运动的选择', link: '#', type: 'free', category: '体育运动', userType: 'parent' },
      { id: 'r9-29', name: '音乐进阶', icon: '🎹', description: '乐器学习的坚持和进阶', link: '#', type: 'free', category: '音乐学习', userType: 'parent' },
      
      // ========== 👨‍👩‍👧 长期规划视角 ==========
      { id: 'r9-30', name: '中学准备', icon: '📈', description: '从四年级开始的中学准备', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      { id: 'r9-31', name: '学习类型', icon: '🧠', description: '了解孩子的学习类型和优势', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      { id: 'r9-32', name: '青春期预备', icon: '💡', description: '为即将到来的青春期做准备', link: '#', type: 'free', category: '心理健康', userType: 'parent' },
    ]
  },
  {
    age: '10岁',
    title: '小学五年级',
    subtitle: 'Grade 5 / 中学准备起步',
    description: '小学高年级是为中学做准备的重要阶段。学业难度提升，开始接触更抽象的概念。这一年也是私校申请、Gifted测试、初中选课规划的关键时期。',
    milestone: '中学准备起步！',
    emoji: '🚀',
    color: 'from-lime-400 to-green-300',
    resources: [
      // ========== 🏫 中学准备 (重要) ==========
      { id: 'r10-1', name: '中学制度了解', icon: '🏫', description: '西方Middle School vs Junior High的区别', link: '#', type: 'free', category: '学校系统', userType: 'parent' },
      { id: 'r10-2', name: '选课概念', icon: '📋', description: '了解中学选课制度和Electives', link: '#', type: 'free', category: '学校系统', userType: 'parent' },
      { id: 'r10-3', name: '荣誉班了解', icon: '⭐', description: '了解Honors Classes和加速班', link: '#', type: 'free', category: '学校系统', userType: 'parent' },
      { id: 'r10-4', name: '入学评估', icon: '📝', description: '中学入学评估和分班测试', link: '#', type: 'free', category: '学校系统', userType: 'parent' },
      
      // ========== 📖 学术提升 ==========
      { id: 'r10-5', name: '写作深化', icon: '✏️', description: '5段式Essay写作结构', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      { id: 'r10-6', name: '研究论文', icon: '📝', description: 'Research Paper基础', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      { id: 'r10-7', name: '阅读分析', icon: '📚', description: '文学作品分析和批判性阅读', link: '#', type: 'free', category: 'ESL英语', userType: 'both' },
      { id: 'r10-8', name: '数学概念', icon: '🔢', description: '代数预备概念（Pre-Algebra思维）', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      { id: 'r10-9', name: '科学方法', icon: '🔬', description: '科学方法和实验设计', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      
      // ========== 🎯 私校申请（如有需要）==========
      { id: 'r10-10', name: 'SSAT准备', icon: '📝', description: 'SSAT考试结构和准备策略', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      { id: 'r10-11', name: 'SSAT词汇', icon: '📚', description: 'SSAT Middle Level词汇学习方法', link: '#', type: 'free', category: '西方教育', userType: 'both' },
      { id: 'r10-12', name: 'Word Quest', icon: '🎮', description: 'K12Path原创SSAT词汇游戏！趣味学习SSAT Middle词汇', link: '/word-quest/', type: 'free', category: 'ESL英语', userType: 'child' },
      { id: 'r10-13', name: '私校文书', icon: '✏️', description: '私校申请Essay写作指导', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      { id: 'r10-14', name: '面试准备', icon: '🎤', description: '私校面试准备和技巧', link: '#', type: 'free', category: '西方教育', userType: 'both' },
      { id: 'r10-15', name: '活动简历', icon: '📋', description: '如何整理和呈现课外活动', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      
      // ========== 🏆 学术竞赛 ==========
      { id: 'r10-16', name: '数学竞赛', icon: '🏆', description: 'AMC 8, Math League等数学竞赛了解', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      { id: 'r10-17', name: '拼写比赛', icon: '🔤', description: 'Spelling Bee参与和准备', link: '#', type: 'free', category: 'ESL英语', userType: 'both' },
      { id: 'r10-18', name: '科学竞赛', icon: '🔬', description: 'Science Fair项目和展示', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      
      // ========== 🏮 中文传承 ==========
      { id: 'r10-19', name: '中文阅读', icon: '📚', description: '适合10岁的中文青少年文学', link: '#', type: 'free', category: '中文传承', userType: 'parent' },
      { id: 'r10-20', name: '中文写作', icon: '✏️', description: '中文写作能力保持和提升', link: '#', type: 'free', category: '中文传承', userType: 'both' },
      { id: 'r10-21', name: 'HSK准备', icon: '📝', description: 'HSK/YCT中文水平考试了解', link: '#', type: 'free', category: '中文传承', userType: 'parent' },
      
      // ========== 💻 数字技能 ==========
      { id: 'r10-22', name: '编程进阶', icon: '💻', description: '从Scratch到Python的过渡', link: '#', type: 'free', category: '艺术培养', userType: 'both' },
      { id: 'r10-23', name: '演示技能', icon: '📊', description: 'Google Slides/PowerPoint演示技能', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      { id: 'r10-24', name: '数字素养', icon: '🔒', description: '网络安全和数字公民意识', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      
      // ========== 💚 青春期准备 ==========
      { id: 'r10-25', name: '青春期教育', icon: '🌱', description: '青春期身体和情绪变化', link: '#', type: 'free', category: '心理健康', userType: 'parent' },
      { id: 'r10-26', name: '社交技能', icon: '👫', description: '青春前期的社交挑战', link: '#', type: 'free', category: '心理健康', userType: 'both' },
      { id: 'r10-27', name: '压力管理', icon: '😌', description: '学业压力和情绪管理', link: '#', type: 'free', category: '心理健康', userType: 'both' },
      
      // ========== 🎨 才艺与活动 ==========
      { id: 'r10-28', name: '活动专注', icon: '🎯', description: '选择1-2个深入发展的活动', link: '#', type: 'free', category: '心理健康', userType: 'parent' },
      { id: 'r10-29', name: '领导力', icon: '👑', description: '培养领导力和团队合作', link: '#', type: 'free', category: '习惯与品格', userType: 'both' },
      { id: 'r10-30', name: '志愿服务', icon: '❤️', description: '社区服务和志愿活动的开始', link: '#', type: 'free', category: '习惯与品格', userType: 'parent' },
      
      // ========== 👨‍👩‍👧 长期规划视角 ==========
      { id: 'r10-31', name: '高中路径', icon: '🛤️', description: '了解高中不同路径（AP, IB, 普通）', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      { id: 'r10-32', name: '学习自主', icon: '📚', description: '培养中学所需的学习自主性', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      { id: 'r10-33', name: '沟通转变', icon: '💬', description: '从管理到指导的亲子沟通转变', link: '#', type: 'free', category: '心理健康', userType: 'parent' },
    ]
  },
  {
    age: '11岁',
    title: '小学六年级',
    subtitle: 'Grade 6 / 中学过渡关键年',
    description: '小学最后一年，也是为中学做最后准备的关键时期。在西方教育体系中，6年级可能是Elementary的最后一年或Middle School的第一年。无论哪种情况，这都是培养独立学习能力、适应更多课程和老师的重要过渡期。',
    milestone: '中学过渡年！',
    emoji: '🎊',
    color: 'from-cyan-400 to-blue-300',
    resources: [
      // ========== 🏫 中学过渡 (重要) ==========
      { id: 'r11-1', name: '中学适应', icon: '🏫', description: '中学生活的变化和准备', link: '#', type: 'free', category: '学校系统', userType: 'parent' },
      { id: 'r11-2', name: '换班制度', icon: '🔄', description: '适应不同科目不同老师的制度', link: '#', type: 'free', category: '学校系统', userType: 'both' },
      { id: 'r11-3', name: 'Locker技能', icon: '🔐', description: '储物柜使用和物品管理', link: '#', type: 'free', category: '学校系统', userType: 'child' },
      { id: 'r11-4', name: '选课入门', icon: '📋', description: '中学选课制度和Electives选择', link: '#', type: 'free', category: '学校系统', userType: 'parent' },
      { id: 'r11-5', name: '荣誉班准备', icon: '⭐', description: '了解和准备7年级Honors Classes', link: '#', type: 'free', category: '学校系统', userType: 'parent' },
      
      // ========== 📖 学术提升 ==========
      { id: 'r11-6', name: '写作成熟', icon: '✏️', description: '多段落Essay和论证写作', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      { id: 'r11-7', name: '研究技能', icon: '🔍', description: '深入Research Paper技能', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      { id: 'r11-8', name: '阅读深度', icon: '📚', description: '复杂文本分析和文学鉴赏', link: '#', type: 'free', category: 'ESL英语', userType: 'both' },
      { id: 'r11-9', name: 'Pre-Algebra', icon: '🔢', description: '代数预备概念掌握', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      { id: 'r11-10', name: '科学方法', icon: '🔬', description: '科学探究和实验报告', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      
      // ========== 🎯 私校申请冲刺（如有需要）==========
      { id: 'r11-11', name: 'SSAT冲刺', icon: '📝', description: 'SSAT考试最后准备', link: '#', type: 'free', category: '西方教育', userType: 'both' },
      { id: 'r11-12', name: 'Word Quest', icon: '🎮', description: 'K12Path原创SSAT词汇游戏！冲刺SSAT词汇', link: '/word-quest/', type: 'free', category: 'ESL英语', userType: 'child' },
      { id: 'r11-13', name: '申请材料', icon: '📋', description: '私校申请材料准备清单', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      { id: 'r11-14', name: '面试练习', icon: '🎤', description: '私校面试模拟和准备', link: '#', type: 'free', category: '西方教育', userType: 'both' },
      
      // ========== 🏆 竞赛与活动 ==========
      { id: 'r11-15', name: 'AMC 8备考', icon: '🏆', description: 'AMC 8数学竞赛准备', link: '#', type: 'free', category: '西方教育', userType: 'both' },
      { id: 'r11-16', name: 'Science Fair', icon: '🔬', description: '科学展览项目设计', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      { id: 'r11-17', name: '辩论演讲', icon: '🎤', description: '参与Debate/Speech活动', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      { id: 'r11-18', name: '活动简历', icon: '📋', description: '整理课外活动成就', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      
      // ========== 🏮 中文传承 ==========
      { id: 'r11-19', name: '中文阅读', icon: '📚', description: '适合11岁的中文青少年文学', link: '#', type: 'free', category: '中文传承', userType: 'parent' },
      { id: 'r11-20', name: 'HSK考试', icon: '📝', description: 'HSK中文水平考试准备', link: '#', type: 'free', category: '中文传承', userType: 'both' },
      { id: 'r11-21', name: '文化联系', icon: '🏮', description: '保持与中国文化的联系', link: '#', type: 'free', category: '中文传承', userType: 'parent' },
      
      // ========== 💻 数字技能 ==========
      { id: 'r11-22', name: '编程学习', icon: '💻', description: 'Python基础编程', link: '#', type: 'free', category: '艺术培养', userType: 'both' },
      { id: 'r11-23', name: '演示技能', icon: '📊', description: '高质量Presentation制作', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      { id: 'r11-24', name: '数字安全', icon: '🔒', description: '网络安全和社交媒体意识', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      
      // ========== 🌱 青春期发展 ==========
      { id: 'r11-25', name: '青春期教育', icon: '🌱', description: '青春期身心变化和应对', link: '#', type: 'free', category: '心理健康', userType: 'parent' },
      { id: 'r11-26', name: '社交技能', icon: '👫', description: '青春期社交变化和挑战', link: '#', type: 'free', category: '心理健康', userType: 'both' },
      { id: 'r11-27', name: '情绪管理', icon: '😊', description: '青春期情绪波动管理', link: '#', type: 'free', category: '心理健康', userType: 'both' },
      { id: 'r11-28', name: '自我认同', icon: '🌟', description: '帮助孩子建立自我认同', link: '#', type: 'free', category: '心理健康', userType: 'parent' },
      
      // ========== 💚 学习习惯 ==========
      { id: 'r11-29', name: '独立学习', icon: '📚', description: '培养独立学习能力', link: '#', type: 'free', category: '习惯与品格', userType: 'both' },
      { id: 'r11-30', name: '时间管理', icon: '⏰', description: '多科目时间管理', link: '#', type: 'free', category: '习惯与品格', userType: 'both' },
      { id: 'r11-31', name: '组织能力', icon: '🗂️', description: '管理作业、项目和活动', link: '#', type: 'free', category: '习惯与品格', userType: 'both' },
      { id: 'r11-32', name: '学习策略', icon: '🧠', description: '有效的学习和记忆策略', link: '#', type: 'free', category: '习惯与品格', userType: 'both' },
      
      // ========== 👨‍👩‍👧 长期规划视角 ==========
      { id: 'r11-33', name: '7-8年级规划', icon: '📈', description: '初中阶段整体规划', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      { id: 'r11-34', name: '高中预备', icon: '🛤️', description: '为高中选课和路径做准备', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      { id: 'r11-35', name: '亲子沟通', icon: '💬', description: '与青春期孩子的有效沟通', link: '#', type: 'free', category: '心理健康', userType: 'parent' },
    ]
  },
  {
    age: '12岁',
    title: '初中一年级',
    subtitle: 'Grade 7 / 高中规划启动年',
    description: '七年级是开始考虑高中路径的重要时期！这一年家长需要了解西方高中的不同路径（AP, IB, A-Level），为孩子8年级选课和高中申请做准备。学业难度提升，也是培养独立学习能力的关键期。',
    milestone: '高中规划启动！',
    emoji: '🔬',
    color: 'from-indigo-400 to-violet-300',
    resources: [
      // ========== 🎓 高中路径规划 (重要！) ==========
      { id: 'r12-1', name: 'AP课程详解', icon: '📚', description: '什么是AP？哪些AP课程最有价值？', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      { id: 'r12-2', name: 'IB课程详解', icon: '🌏', description: '什么是IB？IB适合什么样的孩子？', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      { id: 'r12-3', name: 'A-Level详解', icon: '🇬🇧', description: '英国A-Level体系介绍（英联邦国家）', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      { id: 'r12-4', name: 'AP vs IB', icon: '⚖️', description: 'AP和IB的区别和选择指南', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      { id: 'r12-5', name: '高中类型', icon: '🏫', description: '公立、私立、Magnet、Charter学校比较', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      { id: 'r12-6', name: '私立高中', icon: '🎓', description: '私立高中申请时间线和准备', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      
      // ========== 📖 学术提升 ==========
      { id: 'r12-7', name: 'Pre-Algebra掌握', icon: '🔢', description: '确保代数基础扎实', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      { id: 'r12-8', name: '写作提升', icon: '✏️', description: '学术写作和论证能力', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      { id: 'r12-9', name: '阅读深度', icon: '📚', description: '复杂文本分析和批判思维', link: '#', type: 'free', category: 'ESL英语', userType: 'both' },
      { id: 'r12-10', name: '科学方法', icon: '🔬', description: '科学探究和实验设计', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      { id: 'r12-11', name: 'Word Quest', icon: '🎮', description: 'K12Path原创SSAT/词汇游戏！', link: '/word-quest/', type: 'free', category: 'ESL英语', userType: 'child' },
      
      // ========== 🏫 8年级准备 ==========
      { id: 'r12-12', name: 'GPA重要性', icon: '📊', description: '理解GPA计算和长期影响', link: '#', type: 'free', category: '学校系统', userType: 'both' },
      { id: 'r12-13', name: '荣誉班选择', icon: '⭐', description: 'Honors vs Regular课程选择', link: '#', type: 'free', category: '学校系统', userType: 'parent' },
      { id: 'r12-14', name: '8年级选课', icon: '📋', description: '如何选择8年级课程影响高中', link: '#', type: 'free', category: '学校系统', userType: 'parent' },
      { id: 'r12-15', name: '加速数学', icon: '🔢', description: '是否应该加速数学课程', link: '#', type: 'free', category: '学校系统', userType: 'parent' },
      
      // ========== 🏆 竞赛与活动 ==========
      { id: 'r12-16', name: 'AMC 8', icon: '🏆', description: 'AMC 8数学竞赛准备', link: '#', type: 'free', category: '西方教育', userType: 'both' },
      { id: 'r12-17', name: '科学竞赛', icon: '🔬', description: 'Science Olympiad等科学竞赛', link: '#', type: 'free', category: '西方教育', userType: 'both' },
      { id: 'r12-18', name: '辩论演讲', icon: '🎤', description: 'Speech & Debate活动入门', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      { id: 'r12-19', name: '志愿服务', icon: '❤️', description: '志愿服务小时数积累', link: '#', type: 'free', category: '习惯与品格', userType: 'both' },
      { id: 'r12-20', name: '活动规划', icon: '🎯', description: '课外活动的深度vs广度', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      
      // ========== 🏮 中文传承 ==========
      { id: 'r12-21', name: '中文阅读', icon: '📚', description: '适合12岁的中文青少年文学', link: '#', type: 'free', category: '中文传承', userType: 'parent' },
      { id: 'r12-22', name: 'HSK/AP Chinese', icon: '📝', description: 'HSK或AP中文考试准备', link: '#', type: 'free', category: '中文传承', userType: 'parent' },
      { id: 'r12-23', name: '文化身份', icon: '🌏', description: '青春期双文化身份认同', link: '#', type: 'free', category: '中文传承', userType: 'parent' },
      
      // ========== 💻 数字技能 ==========
      { id: 'r12-24', name: '编程学习', icon: '💻', description: 'Python或Java入门', link: '#', type: 'free', category: '艺术培养', userType: 'both' },
      { id: 'r12-25', name: '研究技能', icon: '🔍', description: '学术研究和引用技能', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      { id: 'r12-26', name: '数字素养', icon: '🔒', description: '网络安全和数字公民', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      
      // ========== 🌱 青春期发展 ==========
      { id: 'r12-27', name: '青春期心理', icon: '💚', description: '青春期心理变化和支持', link: '#', type: 'free', category: '心理健康', userType: 'parent' },
      { id: 'r12-28', name: '社交技能', icon: '👫', description: '青春期社交挑战应对', link: '#', type: 'free', category: '心理健康', userType: 'both' },
      { id: 'r12-29', name: '压力管理', icon: '😌', description: '学业和社交压力管理', link: '#', type: 'free', category: '心理健康', userType: 'both' },
      { id: 'r12-30', name: '自我认同', icon: '🌟', description: '帮助孩子建立自我认同', link: '#', type: 'free', category: '心理健康', userType: 'parent' },
      
      // ========== 💚 学习习惯 ==========
      { id: 'r12-31', name: '独立学习', icon: '📚', description: '培养独立学习能力', link: '#', type: 'free', category: '习惯与品格', userType: 'both' },
      { id: 'r12-32', name: '时间管理', icon: '⏰', description: '管理作业、活动和社交', link: '#', type: 'free', category: '习惯与品格', userType: 'both' },
      { id: 'r12-33', name: '学习策略', icon: '🧠', description: '有效的学习和考试策略', link: '#', type: 'free', category: '习惯与品格', userType: 'both' },
      
      // ========== 👨‍👩‍👧 长期规划视角 ==========
      { id: 'r12-34', name: '大学准备', icon: '🎓', description: '从7年级开始的大学准备', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      { id: 'r12-35', name: '亲子沟通', icon: '💬', description: '与青春期孩子的有效沟通', link: '#', type: 'free', category: '心理健康', userType: 'parent' },
      { id: 'r12-36', name: '家长角色', icon: '👨‍👩‍👧', description: '从管理者到顾问的角色转变', link: '#', type: 'free', category: '心理健康', userType: 'parent' },
    ]
  },
  {
    age: '13岁',
    title: '初中二年级',
    subtitle: 'Grade 8 / 高中选课关键年',
    description: '八年级是高中选课的关键决策年！这一年的选课直接影响9年级能进入哪些班级。家长需要深入了解AP/IB/A-Level的具体要求，为孩子制定高中路径计划。同时也是私立高中申请的冲刺年。',
    milestone: '高中选课决策年！',
    emoji: '📈',
    color: 'from-purple-400 to-fuchsia-300',
    resources: [
      // ========== 🎓 高中选课规划 (最重要！) ==========
      { id: 'r13-1', name: '9年级选课', icon: '📋', description: '如何选择9年级课程（最重要决策！）', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      { id: 'r13-2', name: 'Honors资格', icon: '⭐', description: '如何确保进入Honors/Advanced班', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      { id: 'r13-3', name: '数学路径', icon: '🔢', description: '数学加速路径：如何在高中修更高数学', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      { id: 'r13-4', name: 'AP准备', icon: '📚', description: '什么时候可以开始修AP课程？', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      { id: 'r13-5', name: 'IB准备', icon: '🌏', description: 'IB学校申请和预备要求', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      { id: 'r13-6', name: 'A-Level准备', icon: '🇬🇧', description: 'A-Level路径的早期规划', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      
      // ========== 🏫 私立高中申请（如有需要）==========
      { id: 'r13-7', name: '私高申请', icon: '🏫', description: '私立高中申请时间线和流程', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      { id: 'r13-8', name: 'SSAT/ISEE', icon: '📝', description: 'SSAT/ISEE考试准备', link: '#', type: 'free', category: '西方教育', userType: 'both' },
      { id: 'r13-9', name: 'Word Quest', icon: '🎮', description: 'K12Path原创SSAT词汇游戏！Upper Level冲刺', link: '/word-quest/', type: 'free', category: 'ESL英语', userType: 'child' },
      { id: 'r13-10', name: '申请文书', icon: '✏️', description: '私高申请Essay写作指导', link: '#', type: 'free', category: '西方教育', userType: 'both' },
      { id: 'r13-11', name: '面试技巧', icon: '🎤', description: '私高面试准备和模拟', link: '#', type: 'free', category: '西方教育', userType: 'both' },
      { id: 'r13-12', name: '推荐信', icon: '📧', description: '如何获得有力的推荐信', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      
      // ========== 📖 学术提升 ==========
      { id: 'r13-13', name: 'Algebra掌握', icon: '🔢', description: '代数1/Algebra 1掌握', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      { id: 'r13-14', name: '写作能力', icon: '✏️', description: '高中级别Essay写作能力', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      { id: 'r13-15', name: '阅读水平', icon: '📚', description: '确保阅读达到高中水平', link: '#', type: 'free', category: 'ESL英语', userType: 'both' },
      { id: 'r13-16', name: '科学基础', icon: '🔬', description: '高中科学课程的预备', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      
      // ========== 🏆 竞赛与活动 ==========
      { id: 'r13-17', name: 'AMC 8/10', icon: '🏆', description: 'AMC 8或AMC 10数学竞赛', link: '#', type: 'free', category: '西方教育', userType: 'both' },
      { id: 'r13-18', name: '科学竞赛', icon: '🔬', description: 'Science Olympiad等竞赛', link: '#', type: 'free', category: '西方教育', userType: 'both' },
      { id: 'r13-19', name: '辩论演讲', icon: '🎤', description: '辩论和演讲活动深入', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      { id: 'r13-20', name: '活动深度', icon: '🎯', description: '发展有深度的课外活动', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      { id: 'r13-21', name: '领导力', icon: '👑', description: '在活动中展现领导力', link: '#', type: 'free', category: '习惯与品格', userType: 'both' },
      
      // ========== 🏮 中文传承 ==========
      { id: 'r13-22', name: 'AP中文', icon: '📝', description: 'AP Chinese Language准备', link: '#', type: 'free', category: '中文传承', userType: 'both' },
      { id: 'r13-23', name: 'HSK考试', icon: '📋', description: 'HSK 5级或6级准备', link: '#', type: 'free', category: '中文传承', userType: 'both' },
      { id: 'r13-24', name: '中文阅读', icon: '📚', description: '适合13岁的中文青少年读物', link: '#', type: 'free', category: '中文传承', userType: 'parent' },
      
      // ========== 💻 数字技能 ==========
      { id: 'r13-25', name: '编程进阶', icon: '💻', description: 'Python/Java更深入学习', link: '#', type: 'free', category: '艺术培养', userType: 'both' },
      { id: 'r13-26', name: '研究项目', icon: '🔍', description: '独立研究项目入门', link: '#', type: 'free', category: '本地课程', userType: 'both' },
      
      // ========== 🌱 青春期发展 ==========
      { id: 'r13-27', name: '压力管理', icon: '😌', description: '高中申请/选课压力管理', link: '#', type: 'free', category: '心理健康', userType: 'both' },
      { id: 'r13-28', name: '自我认知', icon: '🌟', description: '了解自己的兴趣和优势', link: '#', type: 'free', category: '心理健康', userType: 'both' },
      { id: 'r13-29', name: '社交技能', icon: '👫', description: '青春期社交关系处理', link: '#', type: 'free', category: '心理健康', userType: 'both' },
      
      // ========== 💚 学习习惯 ==========
      { id: 'r13-30', name: '学习自主', icon: '📚', description: '高中需要的自主学习能力', link: '#', type: 'free', category: '习惯与品格', userType: 'both' },
      { id: 'r13-31', name: '时间管理', icon: '⏰', description: '为高中更忙碌的生活做准备', link: '#', type: 'free', category: '习惯与品格', userType: 'both' },
      { id: 'r13-32', name: '学习策略', icon: '🧠', description: '高效学习和考试策略', link: '#', type: 'free', category: '习惯与品格', userType: 'both' },
      
      // ========== 👨‍👩‍👧 长期规划视角 ==========
      { id: 'r13-33', name: '大学准备', icon: '🎓', description: '从8年级开始的大学申请准备', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      { id: 'r13-34', name: '家长支持', icon: '👨‍👩‍👧', description: '高中阶段家长的角色', link: '#', type: 'free', category: '心理健康', userType: 'parent' },
      { id: 'r13-35', name: '沟通策略', icon: '💬', description: '与青春期孩子讨论未来规划', link: '#', type: 'free', category: '心理健康', userType: 'parent' },
    ]
  },
  {
    age: '14岁',
    title: '高中一年级',
    subtitle: 'Grade 9 / Freshman Year',
    description: '正式进入高中，这是GPA计算的开始！选课至关重要，开始参与课外活动。适应高中节奏，建立良好的学习习惯。',
    milestone: 'High School开始',
    emoji: '🏫',
    color: 'from-red-400 to-rose-300',
    resources: [
      // ========== 🎯 GPA与成绩：高中的第一门功课 ==========
      { id: 'r14-1', name: 'GPA是什么', icon: '📊', description: '了解GPA计算方式：4.0制 vs 加权GPA，以及对大学申请的重要性', link: '#', type: 'free', category: '西方教育', userType: 'both' },
      { id: 'r14-2', name: '成绩单解读', icon: '📋', description: '美国/加拿大高中成绩单（Transcript）的内容和重要性', link: '#', type: 'free', category: '学校系统', userType: 'parent' },
      { id: 'r14-3', name: '第一学期策略', icon: '🎯', description: '9年级第一学期是适应期，如何平衡适应与成绩', link: '#', type: 'free', category: '升学准备', userType: 'both' },
      
      // ========== 📚 高中选课：四年规划从现在开始 ==========
      { id: 'r14-4', name: '选课制度', icon: '📝', description: '北美高中选课自由度大，理解必修课与选修课的区别', link: '#', type: 'free', category: '学校系统', userType: 'both' },
      { id: 'r14-5', name: '课程级别', icon: '📈', description: 'Regular/Honors/AP/IB 不同级别的课程意味着什么', link: '#', type: 'free', category: '学校系统', userType: 'both' },
      { id: 'r14-6', name: '4年选课地图', icon: '🗺️', description: '高中四年的课程规划：从9年级开始的长期规划', link: '#', type: 'free', category: '升学准备', userType: 'parent' },
      { id: 'r14-7', name: 'Honors课程', icon: '⭐', description: '9年级是否选Honors？什么时候选、怎么选', link: '#', type: 'free', category: '学校系统', userType: 'both' },
      
      // ========== 🏆 课外活动：质量比数量重要 ==========
      { id: 'r14-8', name: '活动选择', icon: '🎭', description: '课外活动（Extracurriculars）的四种类型和选择策略', link: '#', type: 'free', category: '升学准备', userType: 'both' },
      { id: 'r14-9', name: 'Spike理论', icon: '🎯', description: '大学喜欢什么样的申请者？深度 vs 广度的取舍', link: '#', type: 'free', category: '升学准备', userType: 'parent' },
      { id: 'r14-10', name: '时间管理', icon: '⏰', description: '高中生如何平衡学习、活动和休息', link: '#', type: 'free', category: '习惯与品格', userType: 'both' },
      
      // ========== 🏫 学校资源：Counselor是关键 ==========
      { id: 'r14-11', name: 'Counselor', icon: '👨‍💼', description: '学校Counselor的作用：选课、升学、心理支持', link: '#', type: 'free', category: '学校系统', userType: 'parent' },
      { id: 'r14-12', name: '建立关系', icon: '🤝', description: '家长如何与学校建立良好沟通：Counselor、老师、教练', link: '#', type: 'free', category: '学校系统', userType: 'parent' },
      { id: 'r14-13', name: '请老师帮忙', icon: '✉️', description: '将来需要推荐信！从现在开始与老师建立关系', link: '#', type: 'free', category: '升学准备', userType: 'both' },
      
      // ========== 🌏 学习技能：高中不同于初中 ==========
      { id: 'r14-14', name: '笔记方法', icon: '📝', description: '高中学习需要的笔记技巧：Cornell笔记法等', link: '#', type: 'free', category: '习惯与品格', userType: 'child' },
      { id: 'r14-15', name: '考试策略', icon: '📋', description: '高中考试类型和应对策略：Quiz, Test, Final', link: '#', type: 'free', category: '习惯与品格', userType: 'child' },
      { id: 'r14-16', name: '图形计算器', icon: '📈', description: '高中数学必备工具：图形计算器的使用（如TI-84）', link: '#', type: 'free', category: '数学学习', userType: 'child' },
      
      // ========== 🎓 暑期规划：9升10是关键暑假 ==========
      { id: 'r14-17', name: '暑期选项', icon: '☀️', description: '暑假可以做什么：暑校、夏校、实习、志愿者', link: '#', type: 'free', category: '升学准备', userType: 'both' },
      { id: 'r14-18', name: '夏校了解', icon: '🏫', description: '名校夏校（Summer Programs）是什么？值得参加吗？', link: '#', type: 'free', category: '升学准备', userType: 'parent' },
      
      // ========== 👨‍👩‍👧 家长视角：过来人的经验 ==========
      { id: 'r14-19', name: '9年级陷阱', icon: '⚠️', description: '9年级常见错误：太放松、或太紧张都不对', link: '#', type: 'free', category: '家长指南', userType: 'parent' },
      { id: 'r14-20', name: '家长角色转变', icon: '👨‍👩‍👧', description: '高中阶段家长要学会放手，但要保持参与', link: '#', type: 'free', category: '家长指南', userType: 'parent' },
      { id: 'r14-21', name: '9年级检查清单', icon: '✅', description: '9年级结束前应该完成的事项清单', link: '#', type: 'free', category: '家长指南', userType: 'parent' },
    ]
  },
  {
    age: '15岁',
    title: '高中二年级',
    subtitle: 'Grade 10 / Sophomore Year',
    description: '高中节奏加快，可以开始选AP/IB课程。PSAT考试首考，了解自己水平。开始思考未来专业方向，积累课外活动深度。',
    milestone: '标化考试准备年',
    emoji: '📈',
    color: 'from-emerald-400 to-teal-300',
    resources: [
      // ========== 🎯 标化考试：了解游戏规则 ==========
      { id: 'r15-1', name: 'PSAT是什么', icon: '📝', description: 'PSAT考试介绍：National Merit奖学金的敲门砖', link: '#', type: 'free', category: '标化考试', userType: 'both' },
      { id: 'r15-2', name: 'SAT全面解读', icon: '📋', description: 'SAT考试结构、评分、和大学申请中的权重', link: '#', type: 'free', category: '标化考试', userType: 'both' },
      { id: 'r15-3', name: 'ACT vs SAT', icon: '🎯', description: '两种考试的区别，如何选择适合自己的', link: '#', type: 'free', category: '标化考试', userType: 'both' },
      { id: 'r15-4', name: '备考时间线', icon: '📅', description: '什么时候开始准备？10-11年级的标化考试时间规划', link: '#', type: 'free', category: '标化考试', userType: 'parent' },
      
      // ========== 📚 AP/IB课程：大学水平的挑战 ==========
      { id: 'r15-5', name: 'AP课程详解', icon: '🎓', description: '38门AP课程介绍：难度、工作量、大学学分', link: '#', type: 'free', category: '学校系统', userType: 'both' },
      { id: 'r15-6', name: 'AP选课策略', icon: '📊', description: '10年级选哪些AP？根据专业方向和能力选择', link: '#', type: 'free', category: '学校系统', userType: 'both' },
      { id: 'r15-7', name: 'AP考试准备', icon: '📝', description: 'AP考试5分策略：如何有效备考', link: '#', type: 'free', category: '标化考试', userType: 'child' },
      { id: 'r15-8', name: 'IB深入了解', icon: '🌍', description: 'IB Diploma的完整要求：HL/SL、EE、TOK、CAS', link: '#', type: 'free', category: '学校系统', userType: 'both' },
      
      // ========== 🏆 课外活动：深度发展 ==========
      { id: 'r15-9', name: '活动深度化', icon: '🎯', description: '从广度到深度：在1-2个领域建立真正影响力', link: '#', type: 'free', category: '升学准备', userType: 'both' },
      { id: 'r15-10', name: '领导力展示', icon: '👑', description: '在社团中担任领导：如何有意义地展示leadership', link: '#', type: 'free', category: '升学准备', userType: 'child' },
      { id: 'r15-11', name: '学术竞赛', icon: '🏆', description: '主要学术竞赛介绍：Math Olympiad、Science Olympiad等', link: '#', type: 'free', category: '升学准备', userType: 'both' },
      { id: 'r15-12', name: '志愿服务', icon: '🤝', description: '有意义的志愿者活动 vs 打卡式服务的区别', link: '#', type: 'free', category: '升学准备', userType: 'both' },
      
      // ========== 🏫 大学方向探索 ==========
      { id: 'r15-13', name: '大学类型', icon: '🏛️', description: '了解大学类型：Research University vs Liberal Arts College', link: '#', type: 'free', category: '西方教育', userType: 'both' },
      { id: 'r15-14', name: '专业探索', icon: '🔍', description: '美国大学专业选择：Undeclared的灵活性 vs 提前规划', link: '#', type: 'free', category: '西方教育', userType: 'both' },
      { id: 'r15-15', name: '探校参观', icon: '🚗', description: 'College Visit：什么时候去、怎么安排、看什么', link: '#', type: 'free', category: '升学准备', userType: 'parent' },
      
      // ========== ☀️ 暑期关键：10升11的暑假 ==========
      { id: 'r15-16', name: '暑期重要性', icon: '☀️', description: '10升11暑假是申请前最后完整暑假的重要性', link: '#', type: 'free', category: '升学准备', userType: 'both' },
      { id: 'r15-17', name: '竞争性项目', icon: '🌟', description: '名校夏校、研究项目、实习的申请和选择', link: '#', type: 'free', category: '升学准备', userType: 'both' },
      { id: 'r15-18', name: '个人项目', icon: '💡', description: '自主创建有意义的项目：passion project的重要性', link: '#', type: 'free', category: '升学准备', userType: 'child' },
      
      // ========== 👨‍👩‍👧 家长视角：过来人的经验 ==========
      { id: 'r15-19', name: '10年级重点', icon: '📋', description: '10年级家长应该关注什么：成绩、标化、活动的平衡', link: '#', type: 'free', category: '家长指南', userType: 'parent' },
      { id: 'r15-20', name: '大学费用初了解', icon: '💰', description: '美国大学费用：公立vs私立、州内vs州外、助学金', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      { id: 'r15-21', name: '升学顾问', icon: '🧭', description: '是否需要升学顾问？学校counselor vs 私人顾问', link: '#', type: 'free', category: '升学准备', userType: 'parent' },
      { id: 'r15-22', name: '10年级检查清单', icon: '✅', description: '10年级结束前应该完成的事项清单', link: '#', type: 'free', category: '家长指南', userType: 'parent' },
    ]
  },
  {
    age: '16岁',
    title: '高中三年级',
    subtitle: 'Grade 11 / Junior Year',
    description: '高中最关键的一年！SAT/ACT正式考试，AP考试，同时要保持GPA。开始大学选校研究，准备申请文书素材。',
    milestone: '最关键的一年！',
    emoji: '🔥',
    color: 'from-sky-400 to-blue-300',
    resources: [
      // ========== 🎯 标化考试：关键时刻 ==========
      { id: 'r16-1', name: 'SAT备考策略', icon: '📝', description: '11年级SAT备考时间线：何时考、考几次、目标分数', link: '#', type: 'free', category: '标化考试', userType: 'both' },
      { id: 'r16-2', name: 'SAT考试结构', icon: '📊', description: 'Digital SAT的最新变化：阅读、写作、数学各部分详解', link: '#', type: 'free', category: '标化考试', userType: 'child' },
      { id: 'r16-3', name: 'ACT备考策略', icon: '📋', description: 'ACT考试特点和备考方法：适合快节奏思考的学生', link: '#', type: 'free', category: '标化考试', userType: 'both' },
      { id: 'r16-4', name: 'AP考试冲刺', icon: '🎓', description: 'AP考试5分策略：考前2个月的高效准备', link: '#', type: 'free', category: '标化考试', userType: 'child' },
      
      // ========== 🏫 大学选校：建立名单 ==========
      { id: 'r16-5', name: '选校策略', icon: '🎯', description: '如何建立大学清单：Dream/Match/Safety学校的搭配', link: '#', type: 'free', category: '大学申请', userType: 'both' },
      { id: 'r16-6', name: '大学排名', icon: '📊', description: '美国大学排名解读：U.S. News、QS等排名的正确使用', link: '#', type: 'free', category: '西方教育', userType: 'both' },
      { id: 'r16-7', name: '学校调研', icon: '🔍', description: '如何深入了解一所大学：官网、论坛、社交媒体', link: '#', type: 'free', category: '大学申请', userType: 'both' },
      { id: 'r16-8', name: '申请系统', icon: '💻', description: '了解申请系统：Common App、Coalition、UC系统', link: '#', type: 'free', category: '大学申请', userType: 'both' },
      
      // ========== ✍️ 申请文书：开始准备 ==========
      { id: 'r16-9', name: '文书入门', icon: '✍️', description: 'Personal Statement写作入门：主题选择和故事讲述', link: '#', type: 'free', category: '大学申请', userType: 'child' },
      { id: 'r16-10', name: '文书类型', icon: '📝', description: '各种申请文书类型：主文书、补充文书、活动描述', link: '#', type: 'free', category: '大学申请', userType: 'both' },
      { id: 'r16-11', name: '推荐信', icon: '📧', description: '如何请老师写推荐信：时机、选择、沟通技巧', link: '#', type: 'free', category: '大学申请', userType: 'child' },
      
      // ========== 💰 大学费用：提前规划 ==========
      { id: 'r16-12', name: '大学费用详解', icon: '💰', description: '美国大学真实费用：学费、住宿、生活费、隐藏成本', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      { id: 'r16-13', name: '助学金体系', icon: '💵', description: '美国大学财务援助：Need-based vs Merit-based', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      { id: 'r16-14', name: 'FAFSA入门', icon: '📋', description: 'FAFSA是什么？何时开始准备、需要什么材料', link: '#', type: 'free', category: '大学申请', userType: 'parent' },
      { id: 'r16-15', name: 'CSS Profile', icon: '📊', description: 'CSS Profile详解：私立大学的助学金申请', link: '#', type: 'free', category: '大学申请', userType: 'parent' },
      
      // ========== 🌏 英美加比较 ==========
      { id: 'r16-16', name: '美国申请', icon: '🇺🇸', description: '美国大学申请全流程：EA/ED/RD时间线', link: '#', type: 'free', category: '西方教育', userType: 'both' },
      { id: 'r16-17', name: '加拿大申请', icon: '🇨🇦', description: '加拿大大学申请：OUAC、各省系统、截止日期', link: '#', type: 'free', category: '西方教育', userType: 'both' },
      { id: 'r16-18', name: '英国申请', icon: '🇬🇧', description: '英国大学UCAS申请：个人陈述、预测成绩、Oxbridge', link: '#', type: 'free', category: '西方教育', userType: 'both' },
      
      // ========== 📋 活动整理 ==========
      { id: 'r16-19', name: '活动清单', icon: '📋', description: '整理课外活动：如何在150字内描述每个活动', link: '#', type: 'free', category: '升学准备', userType: 'child' },
      { id: 'r16-20', name: '荣誉奖项', icon: '🏆', description: '整理荣誉奖项：如何呈现学术和非学术成就', link: '#', type: 'free', category: '升学准备', userType: 'child' },
      
      // ========== 👨‍👩‍👧 家长视角：关键年家长该做什么 ==========
      { id: 'r16-21', name: '11年级时间线', icon: '📅', description: '11年级全年时间线：每月应该做什么', link: '#', type: 'free', category: '家长指南', userType: 'parent' },
      { id: 'r16-22', name: '家长的角色', icon: '👨‍👩‍👧', description: '11年级家长应该做什么vs不应该做什么', link: '#', type: 'free', category: '家长指南', userType: 'parent' },
      { id: 'r16-23', name: '探校规划', icon: '🚗', description: '11年级暑假探校：如何安排高效的校园参观行程', link: '#', type: 'free', category: '升学准备', userType: 'parent' },
      { id: 'r16-24', name: '11年级检查清单', icon: '✅', description: '11年级结束前必须完成的事项清单', link: '#', type: 'free', category: '家长指南', userType: 'parent' },
    ]
  },
  {
    age: '17岁',
    title: '高中四年级',
    subtitle: 'Grade 12 / Senior Year',
    description: '申请季！提交大学申请，等待录取结果。保持成绩，完成高中学业。做出最终选择，开启人生新篇章！',
    milestone: '大学申请年！🎓',
    emoji: '🎓',
    color: 'from-amber-500 to-yellow-400',
    resources: [
      // ========== 📝 申请时间线：关键日期 ==========
      { id: 'r17-1', name: 'EA/ED策略', icon: '⏰', description: 'Early Action vs Early Decision：区别、策略、如何选择', link: '#', type: 'free', category: '大学申请', userType: 'both' },
      { id: 'r17-2', name: '申请截止日期', icon: '📅', description: '各类申请截止日期汇总：EA/ED/RD/Rolling', link: '#', type: 'free', category: '大学申请', userType: 'both' },
      { id: 'r17-3', name: '申请提交', icon: '💻', description: '申请提交前的检查清单：不要犯这些低级错误', link: '#', type: 'free', category: '大学申请', userType: 'both' },
      
      // ========== ✍️ 文书最终阶段 ==========
      { id: 'r17-4', name: '文书润色', icon: '✍️', description: '申请文书最终修改：如何polish而不over-edit', link: '#', type: 'free', category: '大学申请', userType: 'child' },
      { id: 'r17-5', name: '补充文书', icon: '📝', description: '各校Supplemental Essays写作技巧：Why Us、活动、社区等', link: '#', type: 'free', category: '大学申请', userType: 'child' },
      { id: 'r17-6', name: '活动描述', icon: '📋', description: '如何在150字内有效描述你的课外活动', link: '#', type: 'free', category: '大学申请', userType: 'child' },
      
      // ========== 🎤 面试准备 ==========
      { id: 'r17-7', name: '面试概述', icon: '🎤', description: '大学面试类型：Alumni面试、Admissions面试的区别', link: '#', type: 'free', category: '大学申请', userType: 'both' },
      { id: 'r17-8', name: '常见问题', icon: '❓', description: '大学面试最常见问题和回答策略', link: '#', type: 'free', category: '大学申请', userType: 'child' },
      { id: 'r17-9', name: '面试礼仪', icon: '👔', description: '面试着装、礼仪、后续Thank You Note', link: '#', type: 'free', category: '大学申请', userType: 'child' },
      
      // ========== 💰 财务规划：关键步骤 ==========
      { id: 'r17-10', name: 'FAFSA详解', icon: '📊', description: 'FAFSA填写指南：需要什么材料、常见错误避免', link: '#', type: 'free', category: '大学申请', userType: 'parent' },
      { id: 'r17-11', name: 'CSS详解', icon: '💰', description: 'CSS Profile填写：私立大学助学金申请的关键', link: '#', type: 'free', category: '大学申请', userType: 'parent' },
      { id: 'r17-12', name: '奖学金策略', icon: '🏆', description: '外部奖学金搜索和申请：不只是Need-based', link: '#', type: 'free', category: '大学申请', userType: 'both' },
      { id: 'r17-13', name: 'Aid Package', icon: '📋', description: '如何读懂大学的Financial Aid Package', link: '#', type: 'free', category: '西方教育', userType: 'parent' },
      
      // ========== 📬 录取结果处理 ==========
      { id: 'r17-14', name: '等待结果', icon: '⏳', description: '等待录取结果的心理调适：家长和学生都需要', link: '#', type: 'free', category: '心理健康', userType: 'both' },
      { id: 'r17-15', name: '比较Offer', icon: '⚖️', description: '如何比较不同大学的录取：学术、财务、文化', link: '#', type: 'free', category: '升学准备', userType: 'both' },
      { id: 'r17-16', name: 'Waitlist策略', icon: '📧', description: '候补名单怎么办？LOCI信怎么写', link: '#', type: 'free', category: '大学申请', userType: 'both' },
      { id: 'r17-17', name: '最终决定', icon: '🎯', description: '5月1日前做出最终决定：Decision Day策略', link: '#', type: 'free', category: '升学准备', userType: 'both' },
      
      // ========== 🎓 大学准备：入学前 ==========
      { id: 'r17-18', name: '入学押金', icon: '💵', description: 'Enrollment Deposit和Housing Deposit的截止日期', link: '#', type: 'free', category: '升学准备', userType: 'both' },
      { id: 'r17-19', name: '宿舍选择', icon: '🏠', description: '大学宿舍申请：类型、室友问卷、时间线', link: '#', type: 'free', category: '升学准备', userType: 'both' },
      { id: 'r17-20', name: 'Orientation', icon: '🎉', description: '新生Orientation介绍：注册、选课、活动', link: '#', type: 'free', category: '升学准备', userType: 'child' },
      { id: 'r17-21', name: 'AP成绩递送', icon: '📤', description: '如何递送AP成绩换大学学分', link: '#', type: 'free', category: '升学准备', userType: 'child' },
      
      // ========== 👨‍👩‍👧 家长视角：终点也是起点 ==========
      { id: 'r17-22', name: '12年级时间线', icon: '📅', description: '12年级全年时间线：每月应该做什么', link: '#', type: 'free', category: '家长指南', userType: 'parent' },
      { id: 'r17-23', name: '放手的艺术', icon: '🦋', description: '让孩子独立：从高中生到大学生的角色转变', link: '#', type: 'free', category: '家长指南', userType: 'parent' },
      { id: 'r17-24', name: 'Aid Appeal', icon: '💬', description: '如何与大学沟通争取更多财务援助', link: '#', type: 'free', category: '家长指南', userType: 'parent' },
      { id: 'r17-25', name: '回顾与祝福', icon: '🌟', description: 'K-12结束：回顾旅程，展望未来', link: '#', type: 'free', category: '家长指南', userType: 'parent' },
    ]
  },
];

// Resource Card Component - Minimal Design
function ResourceCard({ resource }: { resource: Resource }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };
    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded]);

  // User type label and color
  const getUserTypeLabel = (userType?: 'parent' | 'child' | 'both') => {
    switch (userType) {
      case 'parent': return { label: '家长', color: 'bg-blue-100 text-blue-600' };
      case 'child': return { label: '孩子', color: 'bg-pink-100 text-pink-600' };
      case 'both': return { label: '亲子', color: 'bg-purple-100 text-purple-600' };
      default: return null;
    }
  };

  const userTypeInfo = getUserTypeLabel(resource.userType);

  return (
    <div 
      ref={cardRef}
      className="relative group"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* App Icon - Clean minimal style */}
      <div className="flex flex-col items-center cursor-pointer transition-all duration-200 hover:scale-105">
        <div className={`relative w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-2xl md:text-3xl border bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100 ${isExpanded ? 'border-slate-400 bg-slate-100' : ''}`}>
          {resource.icon}
          {/* User type indicator */}
          <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center shadow-sm ${
            resource.userType === 'parent' ? 'bg-rose-400' :
            resource.userType === 'child' ? 'bg-sky-400' : 'bg-violet-400'
          }`}>
            <span className="text-[8px] text-white font-bold">
              {resource.userType === 'parent' ? 'P' : resource.userType === 'child' ? 'S' : '♥'}
            </span>
          </span>
        </div>
        <span className="mt-1.5 text-xs font-medium text-slate-600 text-center max-w-[70px] line-clamp-2">
          {resource.name}
        </span>
      </div>

      {/* Expanded Card - Fixed positioning to avoid overflow */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20" onClick={(e) => { if (e.target === e.currentTarget) setIsExpanded(false); }}>
          <div className="w-72 max-w-[90vw] p-4 bg-white rounded-xl shadow-xl border border-slate-200 animate-fadeIn" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-3 mb-3">
              <span className="text-3xl">{resource.icon}</span>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-800 text-base">{resource.name}</h4>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  {userTypeInfo && (
                    <span className={`text-xs px-2 py-0.5 rounded ${userTypeInfo.color}`}>
                      {userTypeInfo.label}用
                    </span>
                  )}
                </div>
              </div>
              <button onClick={() => setIsExpanded(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">{resource.description}</p>
            <a 
              href={resource.link}
              className="block w-full text-center py-2.5 rounded-lg text-sm font-medium transition-colors bg-slate-800 hover:bg-slate-900 text-white"
            >
              开始使用
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// Category colors mapping - pastel backgrounds
const categoryColors: { [key: string]: { bg: string; border: string; text: string } } = {
  // === Ages 0-3 Categories ===
  '睡眠安抚': { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-600' },
  '喂养营养': { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600' },
  '健康护理': { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600' },
  '发育追踪': { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-600' },
  '感官刺激': { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-600' },
  '家长指南': { bg: 'bg-slate-100', border: 'border-slate-300', text: 'text-slate-600' },
  '语言发展': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600' },
  '大动作发展': { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600' },
  '精细动作': { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600' },
  '认知发展': { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-600' },
  '自理能力': { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-600' },
  '睡眠管理': { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-600' },
  '安全防护': { bg: 'bg-red-100', border: 'border-red-300', text: 'text-red-700' },
  '如厕训练': { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' },
  '卫生习惯': { bg: 'bg-lime-50', border: 'border-lime-200', text: 'text-lime-600' },
  '情绪管理': { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-600' },
  '社交发展': { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600' },
  '认知游戏': { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600' },
  '独立性培养': { bg: 'bg-teal-100', border: 'border-teal-300', text: 'text-teal-700' },
  '运动发展': { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600' },
  '入园适应': { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-600' },
  '社交技能': { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600' },
  '早期学习': { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-700' },
  '益智游戏': { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600' },
  '语言阅读': { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600' },
  '艺术启蒙': { bg: 'bg-fuchsia-50', border: 'border-fuchsia-200', text: 'text-fuchsia-600' },
  '运动体能': { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600' },
  
  // === Ages 4-6 Categories ===
  '感官发展': { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-600' },
  '语言启蒙': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600' },
  '亲子互动': { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-600' },
  '社交能力': { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600' },
  '阅读启蒙': { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600' },
  '学习启蒙': { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-600' },
  '艺术创意': { bg: 'bg-fuchsia-50', border: 'border-fuchsia-200', text: 'text-fuchsia-600' },
  '音乐舞蹈': { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-600' },
  '生活技能': { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-600' },
  '社交情感': { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600' },
  '阅读故事': { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600' },
  '幼小衔接': { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-600' },
  '阅读能力': { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600' },
  '艺术创作': { bg: 'bg-fuchsia-50', border: 'border-fuchsia-200', text: 'text-fuchsia-600' },
  '音乐素养': { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-600' },
  '体育运动': { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600' },
  '习惯养成': { bg: 'bg-lime-50', border: 'border-lime-200', text: 'text-lime-600' },
  '情商发展': { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-600' },
  '语文学习': { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600' },
  '数学学习': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600' },
  '英语学习': { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600' },
  '艺术培养': { bg: 'bg-fuchsia-50', border: 'border-fuchsia-200', text: 'text-fuchsia-600' },
  '音乐学习': { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-600' },
  '思维拓展': { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-600' },
  '习惯与品格': { bg: 'bg-lime-50', border: 'border-lime-200', text: 'text-lime-600' },
  '心理健康': { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-600' },
  
  // === Grades 2-4 Categories ===
  '阅读培养': { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600' },
  '艺术素养': { bg: 'bg-fuchsia-50', border: 'border-fuchsia-200', text: 'text-fuchsia-600' },
  '体育健康': { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600' },
  '科学探索': { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-600' },
  '阅读拓展': { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600' },
  '才艺发展': { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600' },
  '学习方法': { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-600' },
  '科学学习': { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-600' },
  '阅读提升': { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600' },
  '信息技术': { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-600' },
  '学习能力': { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-600' },
  '心理成长': { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-600' },
  
  // === Grades 5-7 Categories ===
  '科学素养': { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-600' },
  '信息与编程': { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-600' },
  '小升初准备': { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-600' },
  '才艺特长': { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600' },
  '学习策略': { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-600' },
  '语文冲刺': { bg: 'bg-red-100', border: 'border-red-300', text: 'text-red-700' },
  '数学冲刺': { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-700' },
  '英语冲刺': { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-700' },
  '小升初专项': { bg: 'bg-rose-100', border: 'border-rose-300', text: 'text-rose-700' },
  '初中衔接': { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-600' },
  '青春期教育': { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-600' },
  '综合能力': { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-600' },
  '理科学习': { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-600' },
  '文科学习': { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600' },
  '成长教育': { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600' },
  
  // === 西方教育适应 Categories (For Immigrant Families) ===
  'ESL英语': { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-700' },
  '本地课程': { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-700' },
  '文化适应': { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-700' },
  '西方教育': { bg: 'bg-indigo-100', border: 'border-indigo-300', text: 'text-indigo-700' },
  '升学准备': { bg: 'bg-rose-100', border: 'border-rose-300', text: 'text-rose-700' },
  '标化考试': { bg: 'bg-red-100', border: 'border-red-300', text: 'text-red-700' },
  '大学申请': { bg: 'bg-violet-100', border: 'border-violet-300', text: 'text-violet-700' },
  '中文传承': { bg: 'bg-amber-100', border: 'border-amber-300', text: 'text-amber-700' },
  '移民指南': { bg: 'bg-slate-100', border: 'border-slate-300', text: 'text-slate-700' },
  '学校系统': { bg: 'bg-sky-100', border: 'border-sky-300', text: 'text-sky-700' },
  
  '其他资源': { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600' },
};

// ============================================
// Resource Statistics Calculator
// Automatically computes stats from lifeJourneyData
// ============================================
function calculateResourceStats(data: AgeStage[]): ResourceStats {
  const categoryCounts: { [key: string]: number } = {};
  const userTypeCounts = { parent: 0, child: 0, both: 0 };
  const typeCounts = { free: 0, paid: 0 };
  let totalResources = 0;

  // Count all resources and categorize
  data.forEach(stage => {
    stage.resources.forEach(resource => {
      totalResources++;
      
      // Count by category
      const category = resource.category || '其他资源';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      
      // Count by userType
      if (resource.userType === 'parent') userTypeCounts.parent++;
      else if (resource.userType === 'child') userTypeCounts.child++;
      else userTypeCounts.both++;
      
      // Count by type (free/paid)
      if (resource.type === 'paid') typeCounts.paid++;
      else typeCounts.free++;
    });
  });

  // Get top categories (sorted by count, with colors)
  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15) // Top 15 categories
    .map(([name, count]) => {
      const colorInfo = categoryColors[name] || categoryColors['其他资源'];
      return {
        name,
        count,
        color: { bg: colorInfo.bg, border: colorInfo.border }
      };
    });

  // Calculate age range
  const ages = data.map(stage => parseInt(stage.age) || 0);
  const minAge = Math.min(...ages);
  const maxAge = Math.max(...ages);

  return {
    totalResources,
    totalStages: data.length,
    ageRange: `${minAge}-${maxAge}`,
    categoryCounts,
    userTypeCounts,
    typeCounts,
    topCategories
  };
}

// Age Section Component - All icons visible with category colors
function AgeSection({ stage, index }: { stage: AgeStage; index: number }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Group resources by userType: parent, child, both
  const parentResources = stage.resources.filter(r => r.userType === 'parent');
  const childResources = stage.resources.filter(r => r.userType === 'child');
  const bothResources = stage.resources.filter(r => r.userType === 'both' || !r.userType);
  
  const hasParentResources = parentResources.length > 0;
  const hasChildResources = childResources.length > 0;
  const hasBothResources = bothResources.length > 0;

  return (
    <div 
      ref={sectionRef}
      className={`relative transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      {/* Timeline line */}
      {index > 0 && (
        <div className="absolute left-6 md:left-8 -top-12 w-px h-12 bg-slate-200"></div>
      )}

      {/* Main Card */}
      <div className="relative bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Header */}
        <div className="flex items-center gap-4 p-5 md:p-6 border-b border-slate-100 bg-slate-50/50">
          {/* Age indicator */}
          <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-slate-800 text-white flex items-center justify-center">
            <span className="text-lg md:text-xl font-bold">{stage.age.replace('岁', '')}</span>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-2xl">{stage.emoji}</span>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 truncate">
                {stage.title}
              </h2>
            </div>
            <p className="text-sm text-slate-500">{stage.subtitle}</p>
          </div>

          {/* Milestone badge */}
          <div className="hidden sm:block flex-shrink-0">
            <span className="text-xs px-3 py-1 bg-slate-100 text-slate-600 rounded-full">
              {stage.milestone}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="px-5 md:px-6 py-4 border-b border-slate-100">
          <p className="text-sm md:text-base text-slate-600 leading-relaxed">
            {stage.description}
          </p>
        </div>

        {/* Resources - Organized by user type: Parents first, then Students */}
        <div className="p-5 md:p-6 space-y-6">
          {/* Parent Resources Section */}
          {hasParentResources && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-5 h-5 rounded-full bg-rose-400 flex items-center justify-center text-[10px] text-white font-bold">P</span>
                <h3 className="text-sm font-semibold text-slate-700">家长专区</h3>
                <span className="text-xs text-slate-400">({parentResources.length})</span>
              </div>
              <div className="flex flex-wrap gap-3 md:gap-4">
                {parentResources.map(resource => (
                  <ResourceCardWithCategory 
                    key={resource.id} 
                    resource={resource} 
                    categoryColor={categoryColors[resource.category || '其他资源'] || categoryColors['其他资源']}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Child/Student Resources Section */}
          {hasChildResources && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-5 h-5 rounded-full bg-sky-400 flex items-center justify-center text-[10px] text-white font-bold">S</span>
                <h3 className="text-sm font-semibold text-slate-700">学生专区</h3>
                <span className="text-xs text-slate-400">({childResources.length})</span>
              </div>
              <div className="flex flex-wrap gap-3 md:gap-4">
                {childResources.map(resource => (
                  <ResourceCardWithCategory 
                    key={resource.id} 
                    resource={resource} 
                    categoryColor={categoryColors[resource.category || '其他资源'] || categoryColors['其他资源']}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Both/亲子 Resources Section */}
          {hasBothResources && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-5 h-5 rounded-full bg-violet-400 flex items-center justify-center text-[10px] text-white font-bold">♥</span>
                <h3 className="text-sm font-semibold text-slate-700">亲子共用</h3>
                <span className="text-xs text-slate-400">({bothResources.length})</span>
              </div>
              <div className="flex flex-wrap gap-3 md:gap-4">
                {bothResources.map(resource => (
                  <ResourceCardWithCategory 
                    key={resource.id} 
                    resource={resource} 
                    categoryColor={categoryColors[resource.category || '其他资源'] || categoryColors['其他资源']}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Resource Card with Category Color
function ResourceCardWithCategory({ resource, categoryColor }: { resource: Resource; categoryColor: { bg: string; border: string; text: string } }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded]);

  // User type label and color
  const getUserTypeLabel = (userType?: 'parent' | 'child' | 'both') => {
    switch (userType) {
      case 'parent': return { label: '家长', color: 'bg-blue-100 text-blue-600' };
      case 'child': return { label: '孩子', color: 'bg-pink-100 text-pink-600' };
      case 'both': return { label: '亲子', color: 'bg-purple-100 text-purple-600' };
      default: return null;
    }
  };

  const userTypeInfo = getUserTypeLabel(resource.userType);

  return (
    <div 
      ref={cardRef}
      className="relative group"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* App Icon with category-colored background */}
      <div className="flex flex-col items-center cursor-pointer transition-all duration-200 hover:scale-105">
        <div className={`relative w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-2xl md:text-3xl border-2 ${categoryColor.bg} ${categoryColor.border} hover:shadow-md transition-shadow`}>
          {resource.icon}
          {/* User type indicator */}
          <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center shadow-sm ${
            resource.userType === 'parent' ? 'bg-rose-400' :
            resource.userType === 'child' ? 'bg-sky-400' : 'bg-violet-400'
          }`}>
            <span className="text-[8px] text-white font-bold">
              {resource.userType === 'parent' ? 'P' : resource.userType === 'child' ? 'S' : '♥'}
            </span>
          </span>
        </div>
        <span className="mt-1.5 text-xs font-medium text-slate-600 text-center max-w-[70px] line-clamp-2">
          {resource.name}
        </span>
      </div>

      {/* Expanded Card Modal */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20" onClick={(e) => { if (e.target === e.currentTarget) setIsExpanded(false); }}>
          <div className="w-72 max-w-[90vw] p-4 bg-white rounded-xl shadow-xl border border-slate-200 animate-fadeIn" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-3 mb-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${categoryColor.bg} ${categoryColor.border} border`}>
                {resource.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-800 text-base">{resource.name}</h4>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  {userTypeInfo && (
                    <span className={`text-xs px-2 py-0.5 rounded ${userTypeInfo.color}`}>
                      {userTypeInfo.label}用
                    </span>
                  )}
                  {resource.category && (
                    <span className={`text-xs px-2 py-0.5 rounded ${categoryColor.bg} ${categoryColor.text}`}>
                      {resource.category}
                    </span>
                  )}
                </div>
              </div>
              <button onClick={() => setIsExpanded(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">{resource.description}</p>
            <a 
              href={resource.link}
              className="block w-full text-center py-2.5 rounded-lg text-sm font-medium transition-colors bg-slate-800 hover:bg-slate-900 text-white"
            >
              开始使用
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// Main Page Component
export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);

  // Calculate stats dynamically from data
  const stats = useMemo(() => calculateResourceStats(lifeJourneyData), []);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* Hero Section - Clean and Minimal */}
      <header className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Clean gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white mb-6 tracking-tight">
            K12Path
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 mb-4 font-light">
            陪伴孩子成长的每一步
          </p>
          
          <p className="text-base md:text-lg text-slate-400 max-w-xl mx-auto">
            从出生到高中毕业，精选各年龄段的优质教育资源
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center text-slate-500">
            <span className="text-xs mb-2 tracking-widest uppercase">向下滚动</span>
            <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </header>

      {/* Stats Bar - NOT sticky, scrolls with page */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-slate-800">K12Path</span>
            </div>
            
            {/* Stats - Dynamic from data */}
            <div className="flex items-center gap-4 md:gap-8">
              <div className="flex items-center gap-2 px-3 py-1.5">
                <span className="text-lg font-bold text-slate-800">{stats.totalStages}</span>
                <span className="text-sm text-slate-500">成长阶段</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5">
                <span className="text-lg font-bold text-emerald-600">{stats.totalResources}</span>
                <span className="text-sm text-slate-500">精选资源</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 hidden sm:flex">
                <span className="text-lg font-bold text-slate-800">{stats.ageRange}</span>
                <span className="text-sm text-slate-500">岁全覆盖</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 hidden md:flex">
                <span className="text-lg font-bold text-blue-600">{Object.keys(stats.categoryCounts).length}</span>
                <span className="text-sm text-slate-500">资源类别</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend Section - STICKY, stays at top when scrolling */}
      <div className="sticky top-1 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-100 py-3 px-4 shadow-sm">
        <div className="max-w-5xl mx-auto">
          {/* Target Audience Info */}
          <div className="text-center mb-3">
            <p className="text-sm text-slate-600">
              🌏 专为<span className="font-semibold text-slate-800">海外华人家庭</span>设计 · 适用于加拿大、美国、英国、澳洲等西方国家
            </p>
          </div>
          
          {/* UserType Legend */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5 mb-3">
            <span className="text-xs text-slate-500 font-medium">用户类型：</span>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-rose-400 flex items-center justify-center text-[9px] text-white font-bold">P</span>
              <span className="text-xs text-slate-600">家长 ({stats.userTypeCounts.parent})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-sky-400 flex items-center justify-center text-[9px] text-white font-bold">S</span>
              <span className="text-xs text-slate-600">学生 ({stats.userTypeCounts.child})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-violet-400 flex items-center justify-center text-[9px] text-white font-bold">♥</span>
              <span className="text-xs text-slate-600">亲子 ({stats.userTypeCounts.both})</span>
            </div>
          </div>

          {/* Category Colors Legend - Dynamic from data */}
          <div className="border-t border-slate-100 pt-3">
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-2.5">
              <span className="text-xs text-slate-500 font-medium mr-1">资源类别：</span>
              {stats.topCategories.map(cat => (
                <div key={cat.name} className="flex items-center gap-1">
                  <span className={`w-3 h-3 rounded ${cat.color.bg} border ${cat.color.border}`}></span>
                  <span className="text-[11px] text-slate-600">{cat.name} ({cat.count})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Journey Timeline */}
      <main id="journey" className="relative py-12 md:py-16 px-4 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          {/* Timeline */}
          <div className="space-y-8">
            {lifeJourneyData.map((stage, index) => (
              <AgeSection key={stage.age} stage={stage} index={index} />
            ))}
          </div>
        </div>
      </main>

      {/* Footer - Minimal */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg font-medium text-white mb-2">K12Path</p>
          <p className="text-sm mb-4">陪伴移民家庭的K-12教育之路</p>
          <p className="text-xs">© 2025 K12Path. All rights reserved.</p>
        </div>
      </footer>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
