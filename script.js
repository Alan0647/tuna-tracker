// script.js - 3.3 多重熱點渲染版
const map = L.map('map', { center: [15, 30], zoom: 2.5, zoomControl: false });

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);
L.control.zoom({ position: 'bottomright' }).addTo(map);

let activeLayers = [];

const satLayers = {
    sst: L.tileLayer.wms('https://nowcoast.noaa.gov/arcgis/services/nowcoast/analysis_ocean_sfc_sst_time/MapServer/WMSServer', {
        layers: '1', format: 'image/png', transparent: true, opacity: 0.5
    }),
    chl: L.tileLayer('https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Aqua_Chlorophyll_A/default/{time}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png', {
        time: new Date().toISOString().split('T')[0], opacity: 0.4
    })
};

function initUI() {
    const container = document.getElementById('speciesToggles');
    container.innerHTML = ''; 

    Object.keys(tunaData).forEach((name, index) => {
        const div = document.createElement('div');
        div.className = "form-check mb-2";
        // 預設開啟黑鮪與印度洋熱點
        const checked = (name.includes("黑鮪") || name.includes("印度洋")) ? 'checked' : '';
        div.innerHTML = `
            <input class="form-check-input sp-toggle" type="checkbox" value="${name}" id="sp_${index}" ${checked}>
            <label class="form-check-label small" for="sp_${index}">
                <span class="legend-dot" style="background:${tunaData[name].color}"></span>${name}
            </label>
        `;
        container.appendChild(div);
    });
    updateMap(); 
}

function updateMap() {
    const month = parseInt(document.getElementById('monthSlider').value);
    
    // 清除現有漁場圖層
    activeLayers.forEach(layer => map.removeLayer(layer));
    activeLayers = [];

    document.querySelectorAll('.sp-toggle:checked').forEach(input => {
        const name = input.value;
        const fish = tunaData[name];
        
        if (fish.months.includes(month)) {
            // 處理同一魚種的多個細緻矩形 [cite: 32]
            fish.rects.forEach(bounds => {
                const layer = L.rectangle(bounds, {
                    color: fish.color, weight: 1.5, fillOpacity: 0.4, dashArray: '3, 6'
                }).bindPopup(`<b>${name}</b><br>${fish.info}`);
                layer.addTo(map);
                activeLayers.push(layer);
            });
        }
    });
}

document.getElementById('monthSlider').addEventListener('input', (e) => {
    document.getElementById('monthVal').innerText = e.target.value;
    updateMap();
});

document.addEventListener('change', (e) => {
    if (e.target.classList.contains('sp-toggle')) updateMap();
    if (e.target.id === 'sstWms') e.target.checked ? satLayers.sst.addTo(map) : map.removeLayer(satLayers.sst);
    if (e.target.id === 'chlWms') e.target.checked ? satLayers.chl.addTo(map) : map.removeLayer(satLayers.chl);
});

window.onload = initUI;
