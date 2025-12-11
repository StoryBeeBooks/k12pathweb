'use client';

import React, { useEffect, useRef, useState } from 'react';

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
    ]
  },
  {
    age: '6岁',
    title: '小学一年级',
    subtitle: 'Grade 1 / 正式学习元年',
    description: '正式开始小学生活！学习正规读写和算术，建立学习习惯和时间管理。适应新环境、结交新朋友，孩子开始更独立地学习和社交。',
    milestone: '小学生活开始！',
    emoji: '✏️',
    color: 'from-violet-400 to-purple-300',
    resources: [
      // ========== 📚 语文学习 ==========
      { id: 'r6-1', name: '拼音巩固', icon: '🅰️', description: '拼音复习和拼读练习', link: '#', type: 'free', category: '语文学习', userType: 'child' },
      { id: 'r6-2', name: '生字学习', icon: '字', description: '一年级课本生字认读和书写', link: '#', type: 'free', category: '语文学习', userType: 'child' },
      { id: 'r6-3', name: '笔顺练习', icon: '✍️', description: '正确笔顺，规范书写', link: '#', type: 'free', category: '语文学习', userType: 'child' },
      { id: 'r6-4', name: '古诗背诵', icon: '📜', description: '一年级必背古诗', link: '#', type: 'free', category: '语文学习', userType: 'child' },
      { id: 'r6-5', name: '课文朗读', icon: '🔊', description: '课文朗读和复述练习', link: '#', type: 'free', category: '语文学习', userType: 'child' },
      { id: 'r6-6', name: '语文同步课', icon: '📖', description: '与课本同步的语文辅导', link: '#', type: 'paid', category: '语文学习', userType: 'child' },
      { id: 'r6-7', name: '写作入门', icon: '✏️', description: '看图写话、日记入门', link: '#', type: 'paid', category: '语文学习', userType: 'child' },
      
      // ========== 🔢 数学学习 ==========
      { id: 'r6-8', name: '100以内加减', icon: '➕', description: '100以内加减法计算', link: '#', type: 'free', category: '数学学习', userType: 'child' },
      { id: 'r6-9', name: '口算练习', icon: '💯', description: '每日口算训练，提高速度', link: '#', type: 'free', category: '数学学习', userType: 'child' },
      { id: 'r6-10', name: '认识钟表', icon: '🕐', description: '整点和半点的认识', link: '#', type: 'free', category: '数学学习', userType: 'child' },
      { id: 'r6-11', name: '图形认识', icon: '📐', description: '平面图形和立体图形', link: '#', type: 'free', category: '数学学习', userType: 'child' },
      { id: 'r6-12', name: '应用题入门', icon: '📝', description: '简单应用题理解和解答', link: '#', type: 'free', category: '数学学习', userType: 'child' },
      { id: 'r6-13', name: '数学思维课', icon: '🧠', description: '一年级数学思维拓展', link: '#', type: 'paid', category: '数学学习', userType: 'child' },
      
      // ========== 🔤 英语学习 ==========
      { id: 'r6-14', name: '字母书写', icon: '✏️', description: '26个字母大小写规范书写', link: '#', type: 'free', category: '英语学习', userType: 'child' },
      { id: 'r6-15', name: '基础单词', icon: '📚', description: '一年级核心词汇学习', link: '#', type: 'free', category: '英语学习', userType: 'child' },
      { id: 'r6-16', name: '英语儿歌', icon: '🎵', description: '通过儿歌学英语', link: '#', type: 'free', category: '英语学习', userType: 'child' },
      { id: 'r6-17', name: '自然拼读', icon: '🔤', description: 'Phonics系统学习', link: '#', type: 'paid', category: '英语学习', userType: 'child' },
      { id: 'r6-18', name: '英语口语', icon: '🗣️', description: '简单日常对话练习', link: '#', type: 'paid', category: '英语学习', userType: 'child' },
      
      // ========== 🎨 艺术培养 ==========
      { id: 'r6-19', name: '绘画技法', icon: '🎨', description: '儿童画技法学习', link: '#', type: 'free', category: '艺术培养', userType: 'child' },
      { id: 'r6-20', name: '书法入门', icon: '🖌️', description: '硬笔书法基础', link: '#', type: 'free', category: '艺术培养', userType: 'child' },
      { id: 'r6-21', name: '手工创意', icon: '✂️', description: '综合材料手工制作', link: '#', type: 'free', category: '艺术培养', userType: 'child' },
      { id: 'r6-22', name: '素描课程', icon: '✏️', description: '系统素描学习', link: '#', type: 'paid', category: '艺术培养', userType: 'child' },
      { id: 'r6-23', name: '国画入门', icon: '🎋', description: '中国画基础', link: '#', type: 'paid', category: '艺术培养', userType: 'child' },
      
      // ========== 🎵 音乐学习 ==========
      { id: 'r6-24', name: '乐理基础', icon: '🎼', description: '音符、节拍等基础乐理', link: '#', type: 'free', category: '音乐学习', userType: 'child' },
      { id: 'r6-25', name: '唱歌训练', icon: '🎤', description: '儿童声乐基础', link: '#', type: 'free', category: '音乐学习', userType: 'child' },
      { id: 'r6-26', name: '钢琴课程', icon: '🎹', description: '钢琴系统学习', link: '#', type: 'paid', category: '音乐学习', userType: 'child' },
      { id: 'r6-27', name: '小提琴', icon: '🎻', description: '小提琴入门', link: '#', type: 'paid', category: '音乐学习', userType: 'child' },
      { id: 'r6-28', name: '架子鼓', icon: '🥁', description: '架子鼓入门', link: '#', type: 'paid', category: '音乐学习', userType: 'child' },
      
      // ========== ⚽ 体育运动 ==========
      { id: 'r6-29', name: '跳绳达标', icon: '🏃', description: '跳绳技巧和训练计划', link: '#', type: 'free', category: '体育运动', userType: 'child' },
      { id: 'r6-30', name: '跑步训练', icon: '🏃‍♂️', description: '短跑和耐力训练', link: '#', type: 'free', category: '体育运动', userType: 'child' },
      { id: 'r6-31', name: '足球技术', icon: '⚽', description: '足球技术进阶', link: '#', type: 'free', category: '体育运动', userType: 'child' },
      { id: 'r6-32', name: '篮球训练', icon: '🏀', description: '篮球基本功训练', link: '#', type: 'free', category: '体育运动', userType: 'child' },
      { id: 'r6-33', name: '乒乓球', icon: '🏓', description: '乒乓球入门', link: '#', type: 'free', category: '体育运动', userType: 'child' },
      { id: 'r6-34', name: '羽毛球', icon: '🏸', description: '羽毛球入门', link: '#', type: 'free', category: '体育运动', userType: 'child' },
      { id: 'r6-35', name: '游泳进阶', icon: '🏊', description: '游泳技术提升', link: '#', type: 'paid', category: '体育运动', userType: 'child' },
      { id: 'r6-36', name: '武术/跆拳道', icon: '🥋', description: '武术或跆拳道课程', link: '#', type: 'paid', category: '体育运动', userType: 'child' },
      
      // ========== 🧩 思维拓展 ==========
      { id: 'r6-37', name: '象棋入门', icon: '♟️', description: '中国象棋或国际象棋', link: '#', type: 'free', category: '思维拓展', userType: 'child' },
      { id: 'r6-38', name: '围棋基础', icon: '⚫', description: '围棋进阶学习', link: '#', type: 'free', category: '思维拓展', userType: 'child' },
      { id: 'r6-39', name: '数独入门', icon: '🔢', description: '简单数独游戏', link: '#', type: 'free', category: '思维拓展', userType: 'child' },
      { id: 'r6-40', name: '编程基础', icon: '💻', description: 'Scratch图形化编程', link: '#', type: 'paid', category: '思维拓展', userType: 'child' },
      { id: 'r6-41', name: '机器人课', icon: '🤖', description: '乐高机器人入门', link: '#', type: 'paid', category: '思维拓展', userType: 'child' },
      
      // ========== 🌱 习惯与品格 ==========
      { id: 'r6-42', name: '作业管理', icon: '📋', description: '如何高效完成作业', link: '#', type: 'free', category: '习惯与品格', userType: 'both' },
      { id: 'r6-43', name: '时间管理', icon: '⏰', description: '学习时间规划', link: '#', type: 'free', category: '习惯与品格', userType: 'both' },
      { id: 'r6-44', name: '整理书包', icon: '🎒', description: '物品整理和管理', link: '#', type: 'free', category: '习惯与品格', userType: 'child' },
      { id: 'r6-45', name: '预习复习', icon: '📖', description: '如何预习和复习', link: '#', type: 'free', category: '习惯与品格', userType: 'both' },
      
      // ========== 💚 心理健康 ==========
      { id: 'r6-46', name: '适应新环境', icon: '🏫', description: '帮助孩子适应小学生活', link: '#', type: 'free', category: '心理健康', userType: 'parent' },
      { id: 'r6-47', name: '交友指南', icon: '👫', description: '如何在学校交朋友', link: '#', type: 'free', category: '心理健康', userType: 'both' },
      { id: 'r6-48', name: '考试心态', icon: '📝', description: '面对测验的正确心态', link: '#', type: 'free', category: '心理健康', userType: 'both' },
      { id: 'r6-49', name: '自信表达', icon: '🎤', description: '鼓励课堂发言和表达', link: '#', type: 'free', category: '心理健康', userType: 'both' },
      
      // ========== 👨‍👩‍👧 家长指南 ==========
      { id: 'r6-50', name: '家校沟通', icon: '💬', description: '如何与老师有效沟通', link: '#', type: 'free', category: '家长指南', userType: 'parent' },
      { id: 'r6-51', name: '作业辅导', icon: '📚', description: '如何辅导孩子写作业', link: '#', type: 'free', category: '家长指南', userType: 'parent' },
      { id: 'r6-52', name: '学业规划', icon: '🗓️', description: '小学六年学习规划', link: '#', type: 'free', category: '家长指南', userType: 'parent' },
      { id: 'r6-53', name: '兴趣班选择', icon: '🎯', description: '如何选择合适的兴趣班', link: '#', type: 'free', category: '家长指南', userType: 'parent' },
      { id: 'r6-54', name: '阅读计划', icon: '📖', description: '一年级阅读书单和计划', link: '#', type: 'free', category: '家长指南', userType: 'parent' },
    ]
  },
  {
    age: '7岁',
    title: '小学二年级',
    subtitle: 'Grade 2',
    description: '阅读能力快速提升，开始独立阅读简单的书籍。数学学习乘法口诀，培养计算能力。开始形成自己的学习方法。',
    milestone: '小学低年级',
    emoji: '📖',
    color: 'from-fuchsia-400 to-pink-300',
    resources: [
      { id: 'r29', name: '乘法口诀', icon: '✖️', description: '趣味乘法口诀学习和练习', link: '#', type: 'free' },
      { id: 'r30', name: '分级阅读', icon: '📚', description: '适合年龄的分级中文读物', link: '#', type: 'paid' },
      { id: 'r31', name: '看图写话', icon: '🖼️', description: '培养写作能力的看图说话练习', link: '#', type: 'free' },
      { id: 'r32', name: '口算练习', icon: '💯', description: '提高计算速度的口算训练', link: '#', type: 'free' },
    ]
  },
  {
    age: '8岁',
    title: '小学三年级',
    subtitle: 'Grade 3',
    description: '开始学习作文写作，英语课程增加。数学引入分数和小数概念。这是学习习惯养成的关键期，需要培养自主学习能力。',
    milestone: '小学中年级开始',
    emoji: '🎓',
    color: 'from-rose-400 to-red-300',
    resources: [
      { id: 'r33', name: '作文指导', icon: '📝', description: '系统的作文写作技巧和范文', link: '#', type: 'paid' },
      { id: 'r34', name: '英语语法', icon: '📖', description: '基础英语语法学习', link: '#', type: 'free' },
      { id: 'r35', name: '奥数入门', icon: '🏆', description: '数学思维拓展和竞赛入门', link: '#', type: 'paid' },
      { id: 'r36', name: '科学探索', icon: '🔭', description: '趣味科学知识和小实验', link: '#', type: 'free' },
      { id: 'wq1', name: 'Word Quest', icon: '🎮', description: 'K12Path原创SSAT词汇游戏！通过闯关游戏趣味学习SSAT Elementary词汇，适合3-4年级备考', link: '/word-quest/', type: 'free', category: '英语学习', userType: 'child' },
    ]
  },
  {
    age: '9岁',
    title: '小学四年级',
    subtitle: 'Grade 4',
    description: '学习内容难度增加，开始接触更抽象的概念。阅读理解和数学应用题成为重点。需要培养独立思考和解决问题的能力。',
    milestone: '小学中年级',
    emoji: '💡',
    color: 'from-amber-400 to-yellow-300',
    resources: [
      { id: 'r37', name: '阅读理解', icon: '📰', description: '阅读理解专项训练和技巧', link: '#', type: 'paid' },
      { id: 'r38', name: '应用题训练', icon: '📊', description: '数学应用题解题方法和练习', link: '#', type: 'free' },
      { id: 'r39', name: '英语听说', icon: '🎧', description: '英语听力和口语练习', link: '#', type: 'paid' },
      { id: 'r40', name: '历史故事', icon: '🏛️', description: '有趣的中国历史故事', link: '#', type: 'free' },
    ]
  },
  {
    age: '10岁',
    title: '小学五年级',
    subtitle: 'Grade 5',
    description: '为小升初做准备，学习压力增加。开始有更多的课外活动选择，培养兴趣爱好。社交关系变得更加复杂。',
    milestone: '明年小学毕业',
    emoji: '🚀',
    color: 'from-lime-400 to-green-300',
    resources: [
      { id: 'r41', name: '小升初备考', icon: '🎯', description: '小升初考试真题和模拟练习', link: '#', type: 'paid' },
      { id: 'r42', name: '古诗文', icon: '📜', description: '必背古诗词学习和赏析', link: '#', type: 'free' },
      { id: 'r43', name: '几何入门', icon: '📐', description: '平面几何基础知识', link: '#', type: 'free' },
      { id: 'r44', name: '演讲口才', icon: '🎤', description: '培养公众演讲能力', link: '#', type: 'paid' },
    ]
  },
  {
    age: '11岁',
    title: '小学六年级',
    subtitle: 'Grade 6',
    description: '小学最后一年，准备升入初中。系统复习小学知识，参加各类升学考试。开始青春期的身心变化。',
    milestone: '小学毕业年',
    emoji: '🎊',
    color: 'from-cyan-400 to-blue-300',
    resources: [
      { id: 'r45', name: '升学指南', icon: '🗺️', description: '初中择校和升学政策解读', link: '#', type: 'free' },
      { id: 'r46', name: '总复习', icon: '📋', description: '小学六年知识点系统复习', link: '#', type: 'paid' },
      { id: 'r47', name: '青春期教育', icon: '💪', description: '青春期身心健康知识', link: '#', type: 'free' },
      { id: 'r48', name: '小升初面试', icon: '🎤', description: '初中入学面试准备和技巧', link: '#', type: 'paid' },
    ]
  },
  {
    age: '12岁',
    title: '初中一年级',
    subtitle: 'Grade 7',
    description: '进入初中，科目增加，学习节奏加快。开始接触物理、化学等科学课程。社交圈扩大，同伴影响增加。',
    milestone: '中学生活开始',
    emoji: '🔬',
    color: 'from-indigo-400 to-violet-300',
    resources: [
      { id: 'r49', name: '初中数学', icon: '📐', description: '代数和几何系统学习', link: '#', type: 'paid' },
      { id: 'r50', name: '物理入门', icon: '⚡', description: '物理学基础概念和实验', link: '#', type: 'free' },
      { id: 'r51', name: '英语阅读', icon: '📖', description: '中级英语阅读材料', link: '#', type: 'free' },
      { id: 'r52', name: '学习方法', icon: '💡', description: '初中学习方法和时间管理', link: '#', type: 'free' },
    ]
  },
  {
    age: '13岁',
    title: '初中二年级',
    subtitle: 'Grade 8',
    description: '初中关键年，各科难度加大。需要平衡学业和兴趣发展，开始思考未来方向。青春期情绪波动明显。',
    milestone: '初中关键年',
    emoji: '📈',
    color: 'from-purple-400 to-fuchsia-300',
    resources: [
      { id: 'r53', name: '化学启蒙', icon: '🧪', description: '化学基础知识和实验', link: '#', type: 'free' },
      { id: 'r54', name: '写作进阶', icon: '✍️', description: '议论文和记叙文写作技巧', link: '#', type: 'paid' },
      { id: 'r55', name: '英语语法', icon: '📝', description: '中级英语语法系统学习', link: '#', type: 'paid' },
      { id: 'r56', name: '心理健康', icon: '🧘', description: '青少年心理健康指导', link: '#', type: 'free' },
    ]
  },
  {
    age: '14岁',
    title: '初中三年级',
    subtitle: 'Grade 9',
    description: '中考备战年，学习压力最大的一年。需要系统复习三年所学，准备升入高中。开始考虑未来的学业规划。',
    milestone: '中考年',
    emoji: '🎯',
    color: 'from-red-400 to-rose-300',
    resources: [
      { id: 'r57', name: '中考真题', icon: '📋', description: '历年中考真题和解析', link: '#', type: 'paid' },
      { id: 'r58', name: '志愿填报', icon: '🎓', description: '高中择校和志愿填报指南', link: '#', type: 'free' },
      { id: 'r59', name: '冲刺复习', icon: '🏃', description: '中考各科冲刺复习资料', link: '#', type: 'paid' },
      { id: 'r60', name: '压力管理', icon: '🌈', description: '考试压力管理和放松技巧', link: '#', type: 'free' },
    ]
  },
  {
    age: '15岁',
    title: '高中一年级',
    subtitle: 'Grade 10',
    description: '高中新起点，课程难度显著提升。开始思考大学专业方向，参加各类学科竞赛和课外活动丰富简历。',
    milestone: '高中生活开始',
    emoji: '🌟',
    color: 'from-emerald-400 to-teal-300',
    resources: [
      { id: 'r61', name: '高中数学', icon: '📊', description: '高中数学系统课程', link: '#', type: 'paid' },
      { id: 'r62', name: '学科竞赛', icon: '🏆', description: '数理化生竞赛入门', link: '#', type: 'paid' },
      { id: 'r63', name: 'SAT准备', icon: '📝', description: 'SAT考试入门准备', link: '#', type: 'free' },
      { id: 'r64', name: '课外活动', icon: '🎭', description: '课外活动规划指导', link: '#', type: 'free' },
    ]
  },
  {
    age: '16岁',
    title: '高中二年级',
    subtitle: 'Grade 11',
    description: '高中最关键的一年，各类标准化考试集中。开始准备大学申请材料，研究目标学校。需要平衡学业和申请准备。',
    milestone: '大学申请准备年',
    emoji: '📋',
    color: 'from-sky-400 to-blue-300',
    resources: [
      { id: 'r65', name: 'AP课程', icon: '🎓', description: 'AP各科学习资源', link: '#', type: 'paid' },
      { id: 'r66', name: 'SAT/ACT', icon: '📝', description: '标准化考试备考', link: '#', type: 'paid' },
      { id: 'r67', name: '大学调研', icon: '🏫', description: '美国大学信息和排名', link: '#', type: 'free' },
      { id: 'r68', name: '文书准备', icon: '✍️', description: '大学申请文书指导', link: '#', type: 'paid' },
    ]
  },
  {
    age: '17岁',
    title: '高中三年级',
    subtitle: 'Grade 12',
    description: '高中最后一年，大学申请季。提交申请、等待录取、做出最终选择。即将开启人生新篇章！',
    milestone: '大学申请年！🎓',
    emoji: '🎓',
    color: 'from-amber-500 to-yellow-400',
    resources: [
      { id: 'r69', name: '申请系统', icon: '💻', description: 'Common App申请指导', link: '#', type: 'free' },
      { id: 'r70', name: '面试准备', icon: '🎤', description: '大学面试技巧和模拟', link: '#', type: 'paid' },
      { id: 'r71', name: '选校决策', icon: '🎯', description: '如何选择最适合的大学', link: '#', type: 'free' },
      { id: 'r72', name: '奖学金', icon: '💰', description: '奖学金申请和资源', link: '#', type: 'free' },
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
          <span className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[10px] shadow-sm ${
            resource.userType === 'parent' ? 'bg-red-200' :
            resource.userType === 'child' ? 'bg-blue-200' : 'bg-purple-200'
          }`}>
            {resource.userType === 'parent' ? '🧑‍🏫' : resource.userType === 'child' ? '📚' : '👨‍👩‍👧‍👦'}
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
  '其他资源': { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600' },
};

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
                <span className="w-6 h-6 rounded-full bg-red-200 flex items-center justify-center text-sm">🧑‍🏫</span>
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
                <span className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-sm">📚</span>
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
                <span className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center text-sm">👨‍👩‍👧‍👦</span>
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
          <span className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[10px] shadow-sm ${
            resource.userType === 'parent' ? 'bg-red-200' :
            resource.userType === 'child' ? 'bg-blue-200' : 'bg-purple-200'
          }`}>
            {resource.userType === 'parent' ? '🧑‍🏫' : resource.userType === 'child' ? '📚' : '👨‍👩‍👧‍👦'}
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

      {/* Interactive Stats Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-slate-800">K12Path</span>
            </div>
            
            {/* Stats - Clickable/Interactive */}
            <div className="flex items-center gap-6 md:gap-10">
              <button className="group flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors">
                <span className="text-lg font-bold text-slate-800">18</span>
                <span className="text-sm text-slate-500 group-hover:text-slate-700">成长阶段</span>
              </button>
              <button className="group flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors">
                <span className="text-lg font-bold text-emerald-600">120+</span>
                <span className="text-sm text-slate-500 group-hover:text-slate-700">精选资源</span>
              </button>
              <button className="group flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors hidden sm:flex">
                <span className="text-lg font-bold text-slate-800">0-17</span>
                <span className="text-sm text-slate-500 group-hover:text-slate-700">岁全覆盖</span>
              </button>
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
