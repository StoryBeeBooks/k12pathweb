/**
 * Category Merge Script
 * 
 * This script merges 54 categories into ~15 consolidated categories
 * by updating category names in page.tsx
 */

const fs = require('fs');
const path = require('path');

// Define category mapping (old -> new)
const categoryMapping = {
  // === 保持不变的主要类别 ===
  '西方教育': '西方教育',
  '本地课程': '西方教育',  // 合并到西方教育
  '学校系统': '西方教育',  // 合并到西方教育
  
  '升学准备': '升学规划',
  '大学申请': '升学规划',
  '标化考试': '升学规划',
  '幼小衔接': '升学规划',
  '小升初准备': '升学规划',
  '小升初专项': '升学规划',
  '初中衔接': '升学规划',
  
  '家长指南': '家长指南',
  '移民指南': '家长指南',  // 合并到家长指南
  
  'ESL英语': '英语学习',
  '英语学习': '英语学习',
  '英语冲刺': '英语学习',
  
  '中文传承': '中文传承',
  '语文学习': '中文传承',  // 合并到中文传承
  '语文冲刺': '中文传承',
  
  // === 心理社交 ===
  '心理健康': '心理社交',
  '心理成长': '心理社交',
  '情绪管理': '心理社交',
  '社交技能': '心理社交',
  '社交情感': '心理社交',
  '社交发展': '心理社交',
  '情商发展': '心理社交',
  '社交能力': '心理社交',
  '青春期教育': '心理社交',
  '成长教育': '心理社交',
  
  // === 习惯品格 ===
  '习惯与品格': '习惯品格',
  '习惯养成': '习惯品格',
  '独立性培养': '习惯品格',
  '自理能力': '习惯品格',
  '生活技能': '习惯品格',
  '卫生习惯': '习惯品格',
  '如厕训练': '习惯品格',
  
  // === 早期发育 (0-3岁) ===
  '语言发展': '早期发育',
  '精细动作': '早期发育',
  '大动作发展': '早期发育',
  '感官刺激': '早期发育',
  '感官发展': '早期发育',
  '认知发展': '早期发育',
  '发育追踪': '早期发育',
  '运动发展': '早期发育',
  '亲子互动': '早期发育',
  
  // === 婴幼护理 ===
  '喂养营养': '婴幼护理',
  '健康护理': '婴幼护理',
  '睡眠安抚': '婴幼护理',
  '睡眠管理': '婴幼护理',
  '安全防护': '婴幼护理',
  
  // === 学习启蒙 ===
  '学习启蒙': '学习启蒙',
  '益智游戏': '学习启蒙',
  '认知游戏': '学习启蒙',
  '早期学习': '学习启蒙',
  '入园适应': '学习启蒙',
  '语言启蒙': '学习启蒙',
  
  // === 阅读培养 ===
  '阅读能力': '阅读培养',
  '语言阅读': '阅读培养',
  '阅读故事': '阅读培养',
  '阅读启蒙': '阅读培养',
  '阅读培养': '阅读培养',
  '阅读拓展': '阅读培养',
  '阅读提升': '阅读培养',
  
  // === 艺术音乐 ===
  '艺术培养': '艺术音乐',
  '艺术创意': '艺术音乐',
  '艺术创作': '艺术音乐',
  '艺术启蒙': '艺术音乐',
  '艺术素养': '艺术音乐',
  '音乐舞蹈': '艺术音乐',
  '音乐素养': '艺术音乐',
  '音乐学习': '艺术音乐',
  '才艺发展': '艺术音乐',
  '才艺特长': '艺术音乐',
  
  // === 体育运动 ===
  '体育运动': '体育运动',
  '运动体能': '体育运动',
  '体育健康': '体育运动',
  
  // === 数学科学 ===
  '数学学习': '数学科学',
  '数学冲刺': '数学科学',
  '科学探索': '数学科学',
  '科学学习': '数学科学',
  '科学素养': '数学科学',
  '思维拓展': '数学科学',
  '理科学习': '数学科学',
  
  // === 学习能力 ===
  '学习方法': '学习能力',
  '学习策略': '学习能力',
  '学习能力': '学习能力',
  '综合能力': '学习能力',
  '文科学习': '学习能力',
  '信息技术': '学习能力',
  '信息与编程': '学习能力',
  '文化适应': '学习能力',
  
  // 默认
  '其他资源': '其他资源'
};

// Read the file
const filePath = path.join(__dirname, '..', 'src', 'app', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Count replacements
let replacementCount = 0;

// Replace all category strings in the file
for (const [oldCategory, newCategory] of Object.entries(categoryMapping)) {
  if (oldCategory !== newCategory) {
    // Match category: 'xxx' patterns
    const regex = new RegExp(`category:\\s*['"]${oldCategory}['"]`, 'g');
    const matches = content.match(regex);
    if (matches) {
      replacementCount += matches.length;
      content = content.replace(regex, `category: '${newCategory}'`);
      console.log(`Replaced "${oldCategory}" -> "${newCategory}" (${matches.length} times)`);
    }
  }
}

console.log(`\nTotal replacements: ${replacementCount}`);

// Write the updated file
fs.writeFileSync(filePath, content, 'utf8');
console.log('\n✅ Category merge complete! File updated.');

// Now let's also generate a new categoryColors object
const newCategoryColors = `const categoryColors: { [key: string]: { bg: string; border: string; text: string } } = {
  // === 主要类别（合并后）===
  '西方教育': { bg: 'bg-indigo-100', border: 'border-indigo-300', text: 'text-indigo-700' },
  '升学规划': { bg: 'bg-rose-100', border: 'border-rose-300', text: 'text-rose-700' },
  '家长指南': { bg: 'bg-slate-100', border: 'border-slate-300', text: 'text-slate-600' },
  '英语学习': { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-700' },
  '中文传承': { bg: 'bg-amber-100', border: 'border-amber-300', text: 'text-amber-700' },
  '心理社交': { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-600' },
  '习惯品格': { bg: 'bg-lime-50', border: 'border-lime-200', text: 'text-lime-600' },
  '早期发育': { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-600' },
  '婴幼护理': { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600' },
  '学习启蒙': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600' },
  '阅读培养': { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600' },
  '艺术音乐': { bg: 'bg-fuchsia-50', border: 'border-fuchsia-200', text: 'text-fuchsia-600' },
  '体育运动': { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600' },
  '数学科学': { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-700' },
  '学习能力': { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-600' },
  '其他资源': { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600' },
};`;

console.log('\n--- New categoryColors to replace the old one ---\n');
console.log(newCategoryColors);
