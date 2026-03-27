// script.js - 升級後的介面與環境模型控制

// 1. 初始化地圖
const map = L.map('map', {
  center: [15, 140],
  zoom: 3,
  zoomControl: false // 手動放置到右側
});
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);
L.control.zoom({ position: 'topright' }).addTo(map);

let heatLayer = null; // 用來存儲細緻亮點分布圖層
let envLayers = []; // 用來存儲模擬環境層 (例如，鋒面線)

// 2. 初始化魚種選擇清單
const speciesList = document.getElementById('speciesList');
Object.keys(tunaData).forEach((species, index) => {
  const button = document.createElement('button');
  button.type = "button";
  button.className = "list-group-item list-group-item-action";
  if (index === 0) button.classList.add('active'); // 默認選擇第一個
  button.innerText = species;
  button.onclick = () => selectSpecies(species);
  speciesList.appendChild(button);
});

// 3. 核心更新函數
function updateMap() {
  const month = parseInt(document.getElementById('monthSlider').value);
  const speciesName = document.querySelector('.list-group-item.active').innerText;
  const envMode = document.getElementById('envForecastSwitch').checked;
  const envFactor = document.getElementById('envFactorSelect').value;

  // 清除舊圖層
  if (heatLayer) map.removeLayer(heatLayer);
  envLayers.forEach(layer => map.removeLayer(layer));
  envLayers = [];

  // --- 模式 1: 基礎產季監測 (細緻亮點/熱力圖) ---
  if (!envMode) {
    const data = tunaData[speciesName];
    if (data.months.includes(month)) {
      heatLayer = L.heatLayer(data.points, {
        radius: 20, // 細緻度核心參數：半徑
        blur: 15,
        max: 0.8,
        gradient: { 0.4: '#1e90ff', 0.65: '#ffdd00', 1: '#ff4d4d' }
      }).addTo(map);
    }
  } 

  // --- 模式 2: 科學推估模式 (模擬環境連動) ---
  else {
    const monthName = Object.keys(environmentalForecastData[envFactor])[month-1]; // 簡單對應到對應月份的數據集

    // A. 顯示模擬環境層
    if (envFactor === "SST_FRONTS" && month === 5) {
      // 模擬：在 5月顯示東西向 SST 鋒面
      map.setView([35, 160], 4);
      environmentalForecastData["SST_FRONTS"]["May"].forEach(linePoints => {
        const line = L.polyline(linePoints, { color: 'blue', weight: 2, dashArray: '5, 10' }).addTo(map);
        envLayers.push(line);
      });
      // 模擬：在鋒面附近生成亮點漁場
      map.removeLayer(heatLayer); // 清除舊熱力圖
      heatLayer = L.heatLayer(tunaData["北太平洋長鰭鮪 (索餌)"].points, {radius: 15}).addTo(map);
    } 
    else if (envFactor === "CHL_NPTZ" && month === 1) {
        // 模擬: 1月赤道太平洋葉綠素高值區
        const chlRect = L.rectangle([[31, 140], [45, -175]], {color: "green", fillOpacity: 0.1}).addTo(map);
        envLayers.push(chlRect);
    }
    else {
        // 沒有對應的模擬數據
        alert("目前模式僅提供 SST 5月與葉綠素 1月的北太平洋模擬數據展示。");
    }
  }
}

// 4. 事件監聽器設定
function selectSpecies(species) {
  // 更新魚種清單狀態
  document.querySelectorAll('.list-group-item').forEach(item => item.classList.remove('active'));
  document.querySelector(`.list-group-item[innerText="${species}"]`).classList.add('active');
  updateMap();
}

document.getElementById('monthSlider').addEventListener('input', (e) => {
  document.getElementById('monthDisplay').innerText = e.target.value;
  updateMap();
});

document.getElementById('envForecastSwitch').addEventListener('change', (e) => {
  // 啟用或禁用選擇器
  document.getElementById('envFactorSelect').disabled = !e.target.checked;
  updateMap();
});

document.getElementById('envFactorSelect').addEventListener('change', updateMap);

// --- 初始化顯示 (5月太平洋黑鮪) ---
document.getElementById('monthSlider').value = 5;
document.getElementById('monthDisplay').innerText = 5;
selectSpecies("太平洋黑鮪 (產卵期)");
