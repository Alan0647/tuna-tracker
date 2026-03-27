// data.js - 整合報告經緯度與環境門檻
const tunaData = {
  "太平洋黑鮪 (產卵熱點)": {
    months: [4, 5, 6],
    color: "#ff4d4d",
    bounds: [[20, 122], [27, 130]], // [cite: 31]
    env_trigger: "SST > 24°C", // [cite: 31]
    info: "核心產卵場：台灣東部至琉球群島黑潮水域。"
  },
  "南方黑鮪 (西部索餌區)": {
    months: [3, 4, 5, 6, 7, 8, 9, 10],
    color: "#1e90ff",
    bounds: [[-50, -10], [-35, 50]], // [cite: 41]
    env_trigger: "南極繞極流鋒面", // [cite: 41]
    info: "南非以南、西南印度洋 (CCSBT區9)。"
  },
  "大目鮪 (印度洋熱點)": {
    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    color: "#ffa500",
    bounds: [[5, 63], [10, 69]], // [cite: 49]
    env_trigger: "ST200 溶氧壓縮帶", // [cite: 49, 97]
    info: "西北印度洋高 CPUE 區域，淺水層需 > 28°C [cite: 48]。"
  },
  "北太平洋長鰭鮪 (索餌)": {
    months: [5, 6, 7, 8, 9, 10, 11],
    color: "#32cd32",
    bounds: [[30, 130], [45, -130]], // [cite: 71]
    env_trigger: "NPTZ 葉綠素鋒面", // [cite: 70, 80]
    info: "北太平洋過渡帶，追隨葉綠素與溫度梯度移動。"
  },
  "劍旗魚 (西南太平洋)": {
    months: [11, 12, 1, 2, 3],
    color: "#9370db",
    bounds: [[-24, 150], [-11, 165]], // 珊瑚海產卵區 [cite: 88, 92]
    env_trigger: "SST 23-27°C", // [cite: 88]
    info: "由塔斯曼海南下索餌後，北上珊瑚海產卵。"
  }
};

// 您的公司船隊初始座標 (範例)
const myFleet = [
  { name: "昱友 668", pos: [-38.5, 25.2], status: "作業中" },
  { name: "信隆 168", pos: [22.1, 123.5], status: "航行中" }
];
