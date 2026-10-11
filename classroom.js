/* ============================================================
   classroom.js —— 非遗课堂
   · 历史沿革时间轴
   · 全国流派地图（剪纸风简笔地图 + 发光点位）
   · 制作八道工序
   ============================================================ */
window.Classroom = (() => {
  /* ---------- 历史沿革 ---------- */
  const ERAS = [
    { when: '汉代 · 传统叙述', name: '萌芽 —— 灯烛幻影', text: '后世常以汉武帝思念李夫人的灯影传说追溯影戏源头；这一说法具有文化象征意义，但并非皮影戏成形年代的唯一学术结论。' },
    { when: '唐代 · 618—907', name: '孕育 —— 说唱与影画', text: '有研究将寺院俗讲、说唱与影画传统视为影戏发展的文化土壤。现有材料更适合说明孕育过程，不宜断言此时已形成今天所见的完整皮影戏。' },
    { when: '宋代 · 960—1279', name: '兴盛 —— 瓦舍勾栏', text: '宋代城市娱乐繁荣，文献中已出现关于影戏和影戏艺人的较明确记录，通常被视为皮影戏成熟发展的重要阶段。' },
    { when: '元明时期', name: '传播 —— 跨地域交流', text: '随着商贸、人口迁徙与中外文化交流，影戏在更广地域流传。其海外传播路径和具体年代存在多种研究观点。' },
    { when: '明代 · 1368—1644', name: '流派渐成', text: '各地影班与地方声腔结合，人物造型、雕刻工艺和表演程式逐步形成鲜明地域差异。' },
    { when: '清代 · 1636—1912', name: '鼎盛 —— 百花齐放', text: '皮影戏在宫廷与民间均有演出，不同地区形成各具唱腔、造型与操演方式的流派；欧洲也出现以“中国影灯”为名的相关表演和讨论。' },
    { when: '近现代 · 20世纪', name: '式微 —— 人亡艺绝之危', text: '战乱频仍、电影兴起，皮影演出市场萎缩。老艺人年事渐高，部分流派面临失传风险。' },
    { when: '当代 · 2006 至今', name: '新生 —— 非遗保护', text: '2006年列入首批国家级非物质文化遗产名录；2011年入选联合国教科文组织"人类非物质文化遗产代表作名录"。数字化活态传承正当其时。' },
  ];

  function renderTimeline() {
    const box = document.getElementById('cls-timeline');
    box.innerHTML = ERAS.map(e => `
      <div class="cls-era">
        <h4>${e.name}</h4>
        <span class="era-when">${e.when}</span>
        <p>${e.text}</p>
      </div>`).join('');
  }

  /* ---------- 流派地图（剪纸风简笔中国地图） ---------- */
  /* 轮廓：以经纬度等距投影手绘简化边界（剪纸风格，示意而非精确政区图） */
  const OUTLINE = '798.8,20 852.4,83.1 944.4,164.2 906,209.3 812.5,263.4 769.5,285 711.4,294 752.8,306.7 786.5,315.7 734.4,359 775.8,416.6 760.5,452.7 737.5,515.8 696.1,564.5 645.6,587.9 591.9,618.6 568.9,597 541.3,569.9 461.7,587.9 415.7,488.8 354.4,461.7 308.5,483.4 238,479.8 109.3,416.6 48,344.5 48,272.3 136.9,182.3 224.2,119.2 175.2,137.2 285.5,155.2 438.7,218.3 621,196.7 714.5,137.2 705.3,90.3 745.2,29 798.8,20';

  const SCHOOLS = [
    { key: 'luanzhou', name: '冀东皮影', place: '河北 · 滦州、唐山', x: 717, y: 272,
      text: '以"驴皮影"闻名，唱腔高亢婉转，雕刻繁丽，"一口叙说千古事，双手舞动百万兵"即源于此。' },
    { key: 'huazhou', name: '华县皮影', place: '陕西 · 华州', x: 589, y: 362,
      text: '陕西东路皮影代表，刀工精细、造型古朴夸张，2006年随中国皮影戏整体列入首批国家级非遗。' },
    { key: 'huanxian', name: '环县道情皮影', place: '甘肃 · 环县', x: 551, y: 325,
      text: '陇东道情与皮影结合的"道情皮影"，黄土高原上的悲腔高调，粗犷苍凉，堪称"东方戏剧活化石"。' },
    { key: 'tengchong', name: '腾冲皮影', place: '云南 · 腾冲', x: 416, y: 534,
      text: '西南边陲的刘家寨皮影，兼收中原技法与滇西风情，是云南"活态皮影"的代表。' },
    { key: 'tongbai', name: '桐柏皮影', place: '河南 · 桐柏', x: 644, y: 400,
      text: '中原皮影重镇，唱腔为"西路罗圈腔"，艺人身兼"签手、唱、念"数职，乡土气息浓厚。' },
    { key: 'taishan', name: '泰山皮影', place: '山东 · 泰安', x: 701, y: 332,
      text: '"十不闲"绝技独步天下：一人演一台戏，唱念做打、敲锣打鼓全凭一双手，非遗传承人范正安。' },
    { key: 'beijing', name: '北京皮影', place: '北京', x: 690, y: 265,
      text: '清代宫廷影班遗风，造型华贵、刻工细腻，曾随清宫大戏走向顶峰。' },
    { key: 'haining', name: '海宁皮影', place: '浙江 · 海宁', x: 765, y: 435,
      text: '江南皮影代表，唱腔为"皮影腔"，婉约柔美，水乡风情别具一格。' },
  ];

  function renderMap() {
    const box = document.getElementById('cls-map');
    const pins = SCHOOLS.map(s => `
      <g class="pin" data-key="${s.key}" transform="translate(${s.x},${s.y})" tabindex="0" role="button" aria-label="查看${s.name}" style="cursor:pointer">
        <circle r="13" fill="rgba(176,48,42,.18)"><animate attributeName="r" values="8;15;8" dur="2.2s" repeatCount="indefinite"/></circle>
        <circle r="5" fill="#b0302a" stroke="#ffd27d" stroke-width="2"/>
        <text x="12" y="-10" font-size="14" fill="#6b3a10" font-family="KaiTi, serif">${s.name}</text>
      </g>`).join('');
    box.innerHTML = `
      <svg viewBox="0 0 1000 660" preserveAspectRatio="xMidYMid meet">
        <!-- 纸底 -->
        <rect width="1000" height="660" fill="#fdf6e3"/>
        <g opacity="0.5">
          <circle cx="120" cy="90" r="30" fill="none" stroke="#d9b96a" stroke-width="1.5"/>
          <circle cx="880" cy="560" r="40" fill="none" stroke="#d9b96a" stroke-width="1.5"/>
        </g>
        <!-- 大陆轮廓 -->
        <path d="M${OUTLINE} Z" fill="#f3e3bd" stroke="#8a6448" stroke-width="3"
              stroke-linejoin="round" filter="url(#soft)"/>
        <!-- 台湾 -->
        <path d="M760,560 Q774,550 768,576 Q758,584 752,572 Z" fill="#f3e3bd" stroke="#8a6448" stroke-width="2.5"/>
        <!-- 海南 -->
        <ellipse cx="584" cy="638" rx="26" ry="14" fill="#f3e3bd" stroke="#8a6448" stroke-width="2.5"/>
        <!-- 南海诸岛示意 -->
        <circle cx="660" cy="648" r="3" fill="#8a6448"/>
        <circle cx="700" cy="652" r="3" fill="#8a6448"/>
        <circle cx="740" cy="648" r="3" fill="#8a6448"/>
        <!-- 黄河长江（示意） -->
        <path d="M340,300 Q480,330 620,310 T760,330" fill="none" stroke="#b08a56" stroke-width="2" stroke-dasharray="6 5" opacity=".7"/>
        <path d="M300,410 Q500,430 680,415 T780,420" fill="none" stroke="#b08a56" stroke-width="2" stroke-dasharray="6 5" opacity=".7"/>
        <defs>
          <filter id="soft" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="3" dy="4" stdDeviation="4" flood-color="#8a6448" flood-opacity=".3"/>
          </filter>
        </defs>
        ${pins}
      </svg>
      <div class="cls-map-info" id="cls-map-info">${mapInfoHTML(SCHOOLS[0])}</div>`;
    box.querySelectorAll('.pin').forEach(g => {
      const activate = () => {
        const s = SCHOOLS.find(x => x.key === g.dataset.key);
        document.getElementById('cls-map-info').innerHTML = mapInfoHTML(s);
      };
      g.addEventListener('click', activate);
      g.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
      });
    });
  }
  function mapInfoHTML(s) {
    return `<h4>${s.name}</h4><p><b>${s.place}</b></p><p>${s.text}</p>`;
  }

  /* ---------- 八道工序 ---------- */
  const STEPS = [
    { ico: '皮', name: '选皮', text: '选用适合雕刻、透光和长期保存的牛皮或驴皮，材料会影响成品的韧性与光影效果。' },
    { ico: '制', name: '制皮', text: '经刮毛、去脂、浸泡、绷晾等步骤，将原皮处理为半透明而柔韧的皮板。' },
    { ico: '稿', name: '画稿', text: '依图谱勾画人物部件，包括头茬、身段与四肢，不同地区具有不同程式和纹样。' },
    { ico: '描', name: '过稿', text: '将画稿誊描到处理好的皮面，并沿线留下便于下刀的清晰痕迹。' },
    { ico: '刻', name: '镂刻', text: '运用推、拉、转、刻等刀法镂出纹样，是形成皮影造型与透光层次的关键工序。' },
    { ico: '彩', name: '敷彩', text: '依据地域传统和人物身份进行着色，使皮影在灯下呈现鲜明、通透的色彩。' },
    { ico: '熨', name: '发汗熨平', text: '通过适当温度与压力帮助颜色稳定并使皮片平整定型。' },
    { ico: '缀', name: '缀结合成', text: '在关节处缀连部件并安装操纵杆，完成可供登台操演的影人。' },
  ];

  function renderSteps() {
    const box = document.getElementById('cls-steps');
    box.innerHTML = STEPS.map((s, i) => `
      <div class="cls-step">
        <span class="st-no">第 ${i + 1} 道</span>
        <span class="st-ico" aria-hidden="true">${s.ico}</span>
        <h4>${s.name}</h4>
        <p>${s.text}</p>
      </div>`).join('');
  }

  function init() {
    renderTimeline();
    renderMap();
    renderSteps();
  }

  return { init };
})();
