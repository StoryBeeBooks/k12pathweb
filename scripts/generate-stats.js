/**
 * K12Path Resource Statistics Generator
 * 
 * This script extracts all resources from page.tsx and generates
 * a comprehensive statistics report in multiple formats.
 * 
 * Run: node scripts/generate-stats.js
 * Auto-runs during: npm run build
 */

const fs = require('fs');
const path = require('path');

// Read the page.tsx file
const pagePath = path.join(__dirname, '../src/app/page.tsx');
const pageContent = fs.readFileSync(pagePath, 'utf-8');

// Extract lifeJourneyData array
const dataMatch = pageContent.match(/const lifeJourneyData: AgeStage\[\] = \[([\s\S]*?)\n\];/);
if (!dataMatch) {
  console.error('Could not find lifeJourneyData in page.tsx');
  process.exit(1);
}

// Parse resources using regex (simpler approach for static data)
const resourceRegex = /\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*icon:\s*'([^']+)',\s*description:\s*'([^']+)',\s*link:\s*'([^']+)',\s*type:\s*'([^']+)'(?:,\s*category:\s*'([^']+)')?(?:,\s*userType:\s*'([^']+)')?\s*\}/g;

const ageRegex = /\{\s*age:\s*'([^']+)',\s*title:\s*'([^']+)',/g;

// Collect all resources
const resources = [];
const stages = [];
let match;

// Get stages
const stageMatches = pageContent.matchAll(/\{\s*age:\s*'([^']+)',\s*title:\s*'([^']+)',\s*subtitle:\s*'([^']+)',/g);
for (const m of stageMatches) {
  stages.push({
    age: m[1],
    title: m[2],
    subtitle: m[3]
  });
}

// Get resources
while ((match = resourceRegex.exec(pageContent)) !== null) {
  resources.push({
    id: match[1],
    name: match[2],
    icon: match[3],
    description: match[4],
    link: match[5],
    type: match[6],
    category: match[7] || '未分类',
    userType: match[8] || 'both'
  });
}

// Calculate statistics
const stats = {
  generatedAt: new Date().toISOString(),
  totalResources: resources.length,
  totalStages: stages.length,
  
  // By category
  categories: {},
  
  // By userType
  userTypes: {
    parent: 0,
    child: 0,
    both: 0
  },
  
  // By type (free/paid)
  resourceTypes: {
    free: 0,
    paid: 0
  },
  
  // By stage
  byStage: {}
};

// Count by category
resources.forEach(r => {
  // Category count
  if (!stats.categories[r.category]) {
    stats.categories[r.category] = {
      count: 0,
      resources: []
    };
  }
  stats.categories[r.category].count++;
  stats.categories[r.category].resources.push({
    id: r.id,
    name: r.name,
    icon: r.icon,
    userType: r.userType
  });
  
  // UserType count
  if (r.userType === 'parent') stats.userTypes.parent++;
  else if (r.userType === 'child') stats.userTypes.child++;
  else stats.userTypes.both++;
  
  // Type count
  if (r.type === 'paid') stats.resourceTypes.paid++;
  else stats.resourceTypes.free++;
});

// Sort categories by count
const sortedCategories = Object.entries(stats.categories)
  .sort((a, b) => b[1].count - a[1].count);

// Generate Markdown report
let markdown = `# K12Path 资源统计报告

> 自动生成时间: ${new Date().toLocaleString('zh-CN', { timeZone: 'America/Toronto' })}

## 📊 总览

| 指标 | 数量 |
|------|------|
| 成长阶段 | ${stats.totalStages} |
| 总资源数 | ${stats.totalResources} |
| 资源类别 | ${Object.keys(stats.categories).length} |
| 免费资源 | ${stats.resourceTypes.free} |
| 付费资源 | ${stats.resourceTypes.paid} |

## 👥 用户类型分布

| 类型 | 数量 | 占比 |
|------|------|------|
| 👨‍👩‍👧 家长专用 (P) | ${stats.userTypes.parent} | ${(stats.userTypes.parent / stats.totalResources * 100).toFixed(1)}% |
| 👦 学生专用 (S) | ${stats.userTypes.child} | ${(stats.userTypes.child / stats.totalResources * 100).toFixed(1)}% |
| ♥ 亲子共用 | ${stats.userTypes.both} | ${(stats.userTypes.both / stats.totalResources * 100).toFixed(1)}% |

## 📁 所有类别 (${Object.keys(stats.categories).length}个，按资源数量排序)

| 排名 | 类别 | 资源数 | 占比 |
|------|------|--------|------|
${sortedCategories.map(([name, data], i) => 
  `| ${i + 1} | ${name} | ${data.count} | ${(data.count / stats.totalResources * 100).toFixed(1)}% |`
).join('\n')}

## 📋 各类别资源详情

${sortedCategories.map(([name, data]) => `
### ${name} (${data.count}个资源)

| 图标 | 名称 | 用户类型 |
|------|------|----------|
${data.resources.map(r => `| ${r.icon} | ${r.name} | ${r.userType === 'parent' ? '👨‍👩‍👧家长' : r.userType === 'child' ? '👦学生' : '♥亲子'} |`).join('\n')}
`).join('\n')}

## 🎯 成长阶段 (${stages.length}个)

| 年龄 | 阶段名称 | 英文 |
|------|----------|------|
${stages.map(s => `| ${s.age} | ${s.title} | ${s.subtitle} |`).join('\n')}

---

*此报告由 \`scripts/generate-stats.js\` 自动生成*
*每次运行 \`npm run build\` 时自动更新*
`;

// Generate JSON report
const jsonReport = {
  generatedAt: stats.generatedAt,
  summary: {
    totalResources: stats.totalResources,
    totalStages: stats.totalStages,
    totalCategories: Object.keys(stats.categories).length,
    freeResources: stats.resourceTypes.free,
    paidResources: stats.resourceTypes.paid
  },
  userTypes: stats.userTypes,
  categories: sortedCategories.map(([name, data]) => ({
    name,
    count: data.count,
    percentage: (data.count / stats.totalResources * 100).toFixed(1) + '%',
    resources: data.resources
  })),
  stages: stages,
  allResources: resources
};

// Write files
const outputDir = path.join(__dirname, '../public/stats');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(path.join(outputDir, 'report.md'), markdown);
fs.writeFileSync(path.join(outputDir, 'report.json'), JSON.stringify(jsonReport, null, 2));

// Also write to project root for easy access
fs.writeFileSync(path.join(__dirname, '../RESOURCE_STATS.md'), markdown);

console.log('✅ Resource statistics generated successfully!');
console.log(`   📊 Total Resources: ${stats.totalResources}`);
console.log(`   📁 Total Categories: ${Object.keys(stats.categories).length}`);
console.log(`   🎯 Total Stages: ${stats.totalStages}`);
console.log('');
console.log('   Files created:');
console.log('   - RESOURCE_STATS.md (project root)');
console.log('   - public/stats/report.md');
console.log('   - public/stats/report.json');
