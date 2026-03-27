// script.js - 2026 校正版
const map = L.map('map', { center: [15, 150], zoom: 2.5, zoomControl: false });

// 使用暗色地圖底圖
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);
L.control.zoom({ position: 'bottomright' }).addTo(map);

let fisheryLayers = {};

// 衛星圖層定義
const satLayers = {
    sst: L.tileLayer.wms('https://nowcoast.noaa.gov/arcgis/services/nowcoast/analysis_ocean_sfc_sst_time/MapServer/WMSServer', {
        layers: '1', format: 'image/png', transparent: true, opacity: 0.5
    }),
    chl: L.tileLayer('https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Aqua_Chlorophyll_A/default/{time}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png', {
        time: new Date().toISOString().split('T')[0], opacity: 0.4
    })
};

// 初始化選單切換器
function initUI() {
    const container = document.getElementById('speciesToggles');
    container.innerHTML = ''; // 清空載入中文字樣

    Object.keys(tunaData).forEach((name, index) => {
        const div = document.createElement('div');
        div.className = "form-check mb-2";
        // 預設選中第一個魚種
        const checked = index === 0 ? 'checked' : '';
        div.innerHTML = `
            <input class="form-check-input sp-toggle" type="checkbox" value="${name}" id="sp_${index}" ${checked}>
            <label class="form-check-label small" for="sp_${index}">
                <span class="legend-dot" style="background:${tunaData[name].color}"></span>${name}
            </label>
        `;
        container.appendChild(div);
    });
    updateMap(); // 立即執行一次渲染
}

// 渲染漁場範圍
function updateMap() {
    const month = parseInt(document.getElementById('monthSlider').value);
    
    // 清除舊圖層
    Object.values(fisheryLayers).forEach(layer => map.removeLayer(layer));
    fisheryLayers = {};

    document.querySelectorAll('.sp-toggle:checked').forEach(input => {
        const name = input.value;
        const fish = tunaData[name];
        
        // 如果該月份在活躍季節內
        if (fish.months.includes(month)) {
            const layer = L.rectangle(fish.bounds, {
                color: fish.color, weight: 1, fillOpacity: 0.35, dashArray: '5, 5'
            }).bindPopup(`<b>${name}</b><br>活躍月份：${fish.months.join(', ')}月<br>${fish.info}`);
            layer.addTo(map);
            fisheryLayers[name] = layer;
        }
    });
}

// 事件綁定
document.getElementById('monthSlider').addEventListener('input', (e) => {
    document.getElementById('monthVal').innerText = e.target.value;
    updateMap();
});

document.addEventListener('change', (e) => {
    if (e.target.classList.contains('sp-toggle')) updateMap();
    if (e.target.id === 'sstWms') e.target.checked ? satLayers.sst.addTo(map) : map.removeLayer(satLayers.sst);
    if (e.target.id === 'chlWms') e.target.checked ? satLayers.chl.addTo(map) : map.removeLayer(satLayers.chl);
});

// 啟動系統
window.onload = initUI;
