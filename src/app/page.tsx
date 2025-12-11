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
    subtitle: '新生儿期 (0-12个月)',
    description: '宝宝开始感知世界，学会抬头、翻身、坐立。通过声音、触觉和视觉探索周围的一切。这是建立安全感和亲子关系的关键时期。',
    milestone: '距离上幼儿园还有3年',
    emoji: '👶',
    color: 'from-pink-400 to-rose-300',
    resources: [
      // 睡眠相关
      { id: 'r0-1', name: '睡眠训练', icon: '😴', description: '新生儿睡眠规律建立指南，帮助宝宝养成健康作息', link: '#', type: 'free' },
      { id: 'r0-2', name: '白噪音', icon: '🎵', description: '模拟子宫环境的白噪音，帮助宝宝安睡', link: '#', type: 'free' },
      // 喂养相关
      { id: 'r0-3', name: '母乳指南', icon: '🤱', description: '母乳喂养姿势、频率、常见问题解答', link: '#', type: 'free' },
      { id: 'r0-4', name: '配方奶选择', icon: '🍼', description: '如何选择适合宝宝的配方奶粉', link: '#', type: 'free' },
      { id: 'r0-5', name: '辅食添加', icon: '🥣', description: '6个月后辅食添加时间表和食谱（4-6个月开始准备）', link: '#', type: 'free' },
      // 健康护理
      { id: 'r0-6', name: '新生儿护理', icon: '🛁', description: '脐带护理、洗澡、换尿布等日常护理技巧', link: '#', type: 'free' },
      { id: 'r0-7', name: '疫苗接种', icon: '💉', description: '0-1岁疫苗接种时间表和注意事项', link: '#', type: 'free' },
      { id: 'r0-8', name: '儿科急救', icon: '🏥', description: '发烧、呛奶、湿疹等常见问题处理', link: '#', type: 'free' },
      // 发育追踪
      { id: 'r0-9', name: '发育里程碑', icon: '📊', description: '追踪抬头、翻身、坐立等大动作发育', link: '#', type: 'free' },
      { id: 'r0-10', name: '成长记录', icon: '📸', description: '记录身高体重和珍贵瞬间', link: '#', type: 'paid' },
      // 早期刺激
      { id: 'r0-11', name: '黑白卡片', icon: '🎴', description: '0-3个月视觉刺激训练卡片', link: '#', type: 'free' },
      { id: 'r0-12', name: '婴儿按摩', icon: '👐', description: '促进亲子关系和身体发育的抚触按摩', link: '#', type: 'free' },
      { id: 'r0-13', name: '早教音乐', icon: '🎹', description: '莫扎特效应：促进大脑发育的古典音乐', link: '#', type: 'free' },
      // 父母支持
      { id: 'r0-14', name: '产后恢复', icon: '🧘‍♀️', description: '妈妈产后身体恢复和心理调适', link: '#', type: 'free' },
      { id: 'r0-15', name: '新手爸爸', icon: '👨', description: '爸爸如何参与育儿和支持妈妈', link: '#', type: 'free' },
    ]
  },
  {
    age: '1岁',
    title: '宝宝一岁啦！',
    subtitle: '学步期 (12-24个月)',
    description: '宝宝开始站立和行走，说出第一个词语。对周围一切充满好奇，喜欢模仿大人。这是语言和运动能力快速发展的阶段。',
    milestone: '距离上幼儿园还有2年',
    emoji: '🚶',
    color: 'from-orange-400 to-amber-300',
    resources: [
      // 语言发展
      { id: 'r1-1', name: '学说话', icon: '🗣️', description: '第一批词汇学习：爸爸、妈妈、水、球等', link: '#', type: 'free' },
      { id: 'r1-2', name: '指物命名', icon: '👆', description: '指着物品说名称，扩展词汇量', link: '#', type: 'free' },
      { id: 'r1-3', name: '儿歌童谣', icon: '🎤', description: '简单重复的儿歌促进语言发展', link: '#', type: 'free' },
      // 大动作发展
      { id: 'r1-4', name: '学步辅助', icon: '🚶', description: '安全学步技巧，何时用/不用学步车', link: '#', type: 'free' },
      { id: 'r1-5', name: '户外探索', icon: '🌳', description: '公园玩耍安全指南，促进大动作发展', link: '#', type: 'free' },
      // 精细动作
      { id: 'r1-6', name: '手指游戏', icon: '✋', description: '促进手眼协调的手指操', link: '#', type: 'free' },
      { id: 'r1-7', name: '堆叠玩具', icon: '🧱', description: '叠积木、套杯训练精细动作', link: '#', type: 'free' },
      // 认知发展
      { id: 'r1-8', name: '认知卡片', icon: '🃏', description: '认识动物、水果、颜色、形状', link: '#', type: 'free' },
      { id: 'r1-9', name: '藏猫猫', icon: '🙈', description: '物体恒存概念游戏', link: '#', type: 'free' },
      // 自理能力
      { id: 'r1-10', name: '自主进食', icon: '🥄', description: '从手抓到用勺子，培养独立吃饭', link: '#', type: 'free' },
      { id: 'r1-11', name: '喝水杯', icon: '🥛', description: '从奶瓶过渡到吸管杯、敞口杯', link: '#', type: 'free' },
      // 睡眠
      { id: 'r1-12', name: '睡眠调整', icon: '😴', description: '1岁后午睡和夜间睡眠调整', link: '#', type: 'free' },
      { id: 'r1-13', name: '睡前仪式', icon: '🌙', description: '建立固定睡前程序', link: '#', type: 'free' },
      // 安全
      { id: 'r1-14', name: '家居安全', icon: '🏠', description: '学步期家居防护清单', link: '#', type: 'free' },
      { id: 'r1-15', name: '急救知识', icon: '🩹', description: '跌倒、烫伤、误食等紧急处理', link: '#', type: 'free' },
    ]
  },
  {
    age: '2岁',
    title: '宝宝两岁啦！',
    subtitle: '语言爆发期 / Terrible Twos',
    description: '宝宝开始说简单句子，表达想法和需求。喜欢说"不"，有了自我意识。这是培养良好习惯、开始如厕训练的重要时期。',
    milestone: '距离上幼儿园还有1年',
    emoji: '💬',
    color: 'from-yellow-400 to-orange-300',
    resources: [
      // 如厕训练（重点！）
      { id: 'r2-1', name: '如厕准备', icon: '🚽', description: '判断宝宝是否准备好如厕训练的信号', link: '#', type: 'free' },
      { id: 'r2-2', name: '如厕训练', icon: '🧻', description: '循序渐进的如厕训练方法和技巧', link: '#', type: 'free' },
      { id: 'r2-3', name: '小马桶', icon: '🪑', description: '如何选择和使用儿童马桶', link: '#', type: 'free' },
      // 刷牙（重点！）
      { id: 'r2-4', name: '刷牙入门', icon: '🪥', description: '让2岁宝宝爱上刷牙的趣味方法', link: '#', type: 'free' },
      { id: 'r2-5', name: '牙齿护理', icon: '🦷', description: '幼儿牙齿保健和第一次看牙医', link: '#', type: 'free' },
      // 语言发展
      { id: 'r2-6', name: '句子表达', icon: '💬', description: '从单词到2-3词句子的过渡', link: '#', type: 'free' },
      { id: 'r2-7', name: '绘本阅读', icon: '📚', description: '适合2岁的中英文绘本推荐', link: '#', type: 'free' },
      { id: 'r2-8', name: '儿歌大全', icon: '🎵', description: '促进语言和记忆的经典儿歌', link: '#', type: 'free' },
      // 情绪管理
      { id: 'r2-9', name: '情绪引导', icon: '😤', description: '应对Terrible Twos的发脾气', link: '#', type: 'free' },
      { id: 'r2-10', name: '情绪绘本', icon: '📖', description: '帮助孩子认识和表达情绪的绘本', link: '#', type: 'free' },
      // 社交
      { id: 'r2-11', name: '分享概念', icon: '🤝', description: '教导分享和轮流的技巧', link: '#', type: 'free' },
      { id: 'r2-12', name: '同龄互动', icon: '👫', description: '安排playdate促进社交发展', link: '#', type: 'free' },
      // 认知游戏
      { id: 'r2-13', name: '涂色绘画', icon: '🎨', description: '简单涂色培养创造力', link: '#', type: 'free' },
      { id: 'r2-14', name: '形状配对', icon: '🔷', description: '认识形状和颜色的益智游戏', link: '#', type: 'free' },
      { id: 'r2-15', name: '动物认知', icon: '🦁', description: '认识动物及其叫声', link: '#', type: 'free' },
      // 独立性
      { id: 'r2-16', name: '自己穿衣', icon: '👕', description: '简单衣物的穿脱练习', link: '#', type: 'free' },
      { id: 'r2-17', name: '收拾玩具', icon: '🧸', description: '培养整理物品的习惯', link: '#', type: 'free' },
    ]
  },
  {
    age: '3岁',
    title: '幼儿园小班',
    subtitle: 'Pre-K / Preschool',
    description: '宝宝第一次进入集体生活，学习与小朋友相处。巩固如厕和自理能力，开始接触数字和字母概念。',
    milestone: '幼儿园第一年',
    emoji: '🎒',
    color: 'from-green-400 to-emerald-300',
    resources: [
      // 入园准备
      { id: 'r3-1', name: '入园准备', icon: '🏫', description: '幼儿园适应期指南，缓解分离焦虑', link: '#', type: 'free' },
      { id: 'r3-2', name: '择园攻略', icon: '🔍', description: '如何选择适合的幼儿园', link: '#', type: 'free' },
      // 自理能力（巩固）
      { id: 'r3-3', name: '独立如厕', icon: '🚽', description: '在幼儿园独立上厕所', link: '#', type: 'free' },
      { id: 'r3-4', name: '刷牙习惯', icon: '🪥', description: '早晚刷牙习惯的巩固', link: '#', type: 'free' },
      { id: 'r3-5', name: '独立吃饭', icon: '🍽️', description: '使用筷子和勺子独立进餐', link: '#', type: 'free' },
      { id: 'r3-6', name: '穿衣穿鞋', icon: '👟', description: '自己穿脱衣服和鞋子', link: '#', type: 'free' },
      // 社交技能
      { id: 'r3-7', name: '社交故事', icon: '👫', description: '理解分享、轮流、排队等规则', link: '#', type: 'free' },
      { id: 'r3-8', name: '交朋友', icon: '🤗', description: '如何在幼儿园交到朋友', link: '#', type: 'free' },
      { id: 'r3-9', name: '冲突解决', icon: '🤝', description: '教孩子用语言解决小冲突', link: '#', type: 'free' },
      // 早期学习
      { id: 'r3-10', name: '数字启蒙', icon: '🔢', description: '认识1-10，简单点数', link: '#', type: 'free' },
      { id: 'r3-11', name: '字母认知', icon: '🔤', description: 'ABC字母歌和字母认识', link: '#', type: 'free' },
      { id: 'r3-12', name: '颜色形状', icon: '🔵', description: '认识基本颜色和形状', link: '#', type: 'free' },
      // 精细动作
      { id: 'r3-13', name: '握笔练习', icon: '✏️', description: '正确握笔姿势启蒙', link: '#', type: 'free' },
      { id: 'r3-14', name: '剪纸手工', icon: '✂️', description: '安全剪刀使用和简单手工', link: '#', type: 'free' },
      { id: 'r3-15', name: '益智拼图', icon: '🧩', description: '锻炼观察力和专注力', link: '#', type: 'free' },
      // 语言发展
      { id: 'r3-16', name: '讲故事', icon: '📖', description: '鼓励孩子复述简单故事', link: '#', type: 'free' },
      { id: 'r3-17', name: '双语启蒙', icon: '🌐', description: '中英双语环境建立', link: '#', type: 'free' },
    ]
  },
  {
    age: '4岁',
    title: '幼儿园中班',
    subtitle: 'Pre-K (Senior)',
    description: '孩子开始展现个性和兴趣爱好，想象力丰富，喜欢问"为什么"。可以进行更复杂的对话，开始理解简单的规则和因果关系。',
    milestone: '幼儿园第二年',
    emoji: '🌟',
    color: 'from-teal-400 to-cyan-300',
    resources: [
      { id: 'r17', name: '科学小实验', icon: '🔬', description: '安全有趣的家庭科学实验指南', link: '#', type: 'free' },
      { id: 'r18', name: '英文字母', icon: '🔤', description: 'ABC字母认知和发音学习', link: '#', type: 'free' },
      { id: 'r19', name: '逻辑思维', icon: '🧠', description: '培养逻辑推理能力的益智游戏', link: '#', type: 'paid' },
      { id: 'r20', name: '音乐启蒙', icon: '🎼', description: '认识乐器和基础乐理知识', link: '#', type: 'free' },
    ]
  },
  {
    age: '5岁',
    title: '幼儿园大班',
    subtitle: 'Kindergarten Prep',
    description: '为进入小学做准备，学习更多的汉字和数学概念。能够独立完成简单任务，有较强的自我表达能力。开始学习团队合作。',
    milestone: '明年就要上小学啦！',
    emoji: '📚',
    color: 'from-blue-400 to-indigo-300',
    resources: [
      { id: 'r21', name: '幼小衔接', icon: '🎯', description: '系统的幼小衔接课程，包含语数英三科', link: '#', type: 'paid' },
      { id: 'r22', name: '加减法入门', icon: '➕', description: '10以内加减法的趣味学习', link: '#', type: 'free' },
      { id: 'r23', name: '拼音学习', icon: '🅰️', description: '汉语拼音的系统学习课程', link: '#', type: 'paid' },
      { id: 'r24', name: '专注力训练', icon: '🎯', description: '提高注意力集中时间的训练游戏', link: '#', type: 'free' },
    ]
  },
  {
    age: '6岁',
    title: '小学一年级',
    subtitle: 'Grade 1',
    description: '正式开始小学生活！学习正规的读写和算术，建立学习习惯和时间管理意识。适应新的学校环境和作息时间。',
    milestone: '小学生活开始！',
    emoji: '✏️',
    color: 'from-violet-400 to-purple-300',
    resources: [
      { id: 'r25', name: '语文同步', icon: '📝', description: '与课本同步的语文学习和练习', link: '#', type: 'paid' },
      { id: 'r26', name: '数学思维', icon: '🔢', description: '一年级数学思维训练题库', link: '#', type: 'free' },
      { id: 'r27', name: '写字练习', icon: '✍️', description: '规范汉字书写的练习应用', link: '#', type: 'free' },
      { id: 'r28', name: '英语单词', icon: '🇬🇧', description: '基础英语单词和简单对话学习', link: '#', type: 'paid' },
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
      { id: 'r36b', name: 'SSAT词汇', icon: '📚', description: 'SSAT Elementary词汇学习，适合3-4年级备考', link: '/word-quest/', type: 'paid' },
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

  return (
    <div 
      ref={cardRef}
      className="relative group"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* App Icon - Clean minimal style */}
      <div className="flex flex-col items-center cursor-pointer transition-all duration-200 hover:scale-105">
        <div className={`w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-2xl md:text-3xl border ${
          resource.type === 'free' 
            ? 'bg-slate-50 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50' 
            : 'bg-slate-50 border-slate-200 hover:border-amber-300 hover:bg-amber-50'
        } ${isExpanded ? (resource.type === 'free' ? 'border-emerald-400 bg-emerald-50' : 'border-amber-400 bg-amber-50') : ''}`}>
          {resource.icon}
        </div>
        <span className="mt-1.5 text-xs font-medium text-slate-600 text-center max-w-[70px] line-clamp-2">
          {resource.name}
        </span>
        {resource.type === 'paid' && (
          <span className="text-[10px] text-amber-500 font-medium">付费</span>
        )}
      </div>

      {/* Expanded Card - Fixed positioning to avoid overflow */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20" onClick={(e) => { if (e.target === e.currentTarget) setIsExpanded(false); }}>
          <div className="w-72 max-w-[90vw] p-4 bg-white rounded-xl shadow-xl border border-slate-200 animate-fadeIn" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-3 mb-3">
              <span className="text-3xl">{resource.icon}</span>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-800 text-base">{resource.name}</h4>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  resource.type === 'free' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {resource.type === 'free' ? '免费' : '付费'}
                </span>
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
              className={`block w-full text-center py-2.5 rounded-lg text-sm font-medium transition-colors ${
                resource.type === 'free'
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
            >
              {resource.type === 'free' ? '免费使用' : '了解更多'}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// Age Section Component - Clean Minimal Design
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

        {/* Resources Grid */}
        <div className="p-5 md:p-6">
          <div className="flex flex-wrap gap-5 md:gap-6">
            {stage.resources.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </div>
      </div>
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
