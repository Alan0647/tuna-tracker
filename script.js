// script.js - 實戰化數據整合
const map = L.map('map', { center: [10, 160], zoom: 3, zoomControl: false });

// 基礎海圖：使用暗色系便於觀察漁場
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

let currentLayers = {};

// 1. 初始化衛星數據源 (WMS)
const satelliteLayers = {
    sst: L.tileLayer.wms('https://nowcoast.noaa.gov/arcgis/services/nowcoast/analysis_ocean_sfc_sst_time/MapServer/WMSServer', {
        layers: '1', format: 'image/png', transparent: true, opacity: 0.6
    }),
    chl: L.tileLayer('https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Aqua_Chlorophyll_A/default/{time}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png', {
        time: new Date().toISOString().split('T')[0], opacity: 0.5
    })
};

// 2. 生成魚種開關與地圖渲染
function initSpeciesToggles() {
    const container = document.getElementById('speciesToggles');
    Object.keys(tunaData).forEach(name => {
        const div = document.createElement('div');
        div.className = "form-check small";
        div.innerHTML = `
            <input class="form-check-input sp-check" type="checkbox" value="${name}" id="chk_${name}">
            <label class="form-check-label"><span class="legend-dot" style="background:${tunaData[name].color}"></span>${name}</label>
        `;
        container.appendChild(div);
    });
}

function updateFisheryLayers() {
    const month = parseInt(document.getElementById('monthSlider').value);
    
    // 清除舊的矩形層
    Object.values(currentLayers).forEach(l => map.removeLayer(l));
    currentLayers = {};

    document.querySelectorAll('.sp-check:checked').forEach(input => {
        const name = input.value;
        const fish = tunaData[name];
        if (fish.months.includes(month)) {
            const rect = L.rectangle(fish.bounds, {
                color: fish.color, weight: 1, fillOpacity: 0.3
            }).bindPopup(`<b>${name}</b><br>門檻：${fish.env_trigger}<br>${fish.info}`);
            rect.addTo(map);
            currentLayers[name] = rect;
        }
    });
}

// 3. 船隊位置渲染
myFleet.forEach(ship => {
    L.circleMarker(ship.pos, { radius: 6, color: 'yellow', fillOpacity: 0.8 })
     .addTo(map).bindTooltip(`${ship.name} (${ship.status})`, { permanent: true, direction: 'right' });
    
    const fleetDiv = document.getElementById('fleetStatus');
    fleetDiv.innerHTML += `<div>🚢 ${ship.name} - ${ship.status}</div>`;
});

// 4. 事件監聽
document.getElementById('monthSlider').addEventListener('input', (e) => {
    document.getElementById('monthVal').innerText = e.target.value;
    updateFisheryLayers();
});

document.addEventListener('change', (e) => {
    if (e.target.classList.contains('sp-check')) updateFisheryLayers();
    if (e.target.id === 'sstWms') e.target.checked ? satelliteLayers.sst.addTo(map) : map.removeLayer(satelliteLayers.sst);
    if (e.target.id === 'chlWms') e.target.checked ? satelliteLayers.chl.addTo(map) : map.removeLayer(satelliteLayers.chl);
});

initSpeciesToggles();
