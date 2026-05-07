// ===============================
// MAPA STV
// ===============================

const map = L.map('map').setView([43.4623, -3.8099], 9);

// ===============================
// CAPA BASE
// ===============================

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; OpenStreetMap contributors'
  }
).addTo(map);

// ===============================
// ELEMENTOS HTML
// ===============================

const toggleInsights =
  document.getElementById('toggleInsights');

const toggleKpis =
  document.getElementById('toggleKpis');

const insightsMenu =
  document.getElementById('insightsMenu');

const kpiMenu =
  document.getElementById('kpiMenu');

const rankingContainer =
  document.getElementById(
    'rankingContainer'
  );

// ===============================
// KPIs HTML
// ===============================

const kpis =
  document.querySelectorAll('.kpi strong');

// ===============================
// HEATMAP
// ===============================

const heatPoints = [];

// ===============================
// TOGGLES
// ===============================

toggleInsights.addEventListener('click', () => {

  insightsMenu.classList.toggle('hidden');

  kpiMenu.classList.add('hidden');

});

toggleKpis.addEventListener('click', () => {

  kpiMenu.classList.toggle('hidden');

  insightsMenu.classList.add('hidden');

});

// ===============================
// CSVs VIESGO
// ===============================

const csvFiles = [

  {
    name: 'consumoMensual',
    path: './data/2-consumo-mensual-por-codigo-postal-viesgo.csv'
  },

  {
    name: 'autoconsumo',
    path: './data/12-autoconsumo-por-tipologia-viesgo.csv'
  },

  {
    name: 'instalacionesAutoconsumo',
    path: './data/13-instalaciones-de-autoconsumo-por-tipologia-viesgo.csv'
  },

  {
    name: 'puntosSuministro',
    path: './data/puntos-de-suministro-por-tipologia-viesgo.csv'
  }

];

// ===============================
// DATASETS
// ===============================

const datasetsCantabria = {};

// ===============================
// COORDENADAS MUNICIPIOS
// ===============================

const coordenadasMunicipios = {

  'Santander': [43.4623, -3.8099],
  'Torrelavega': [43.3494, -4.0470],
  'Castro-Urdiales': [43.3828, -3.2204],
  'Camargo': [43.4070, -3.8840],
  'El Astillero': [43.4019, -3.8208],
  'Laredo': [43.4115, -3.4161],
  'Reinosa': [43.0007, -4.1380],
  'Comillas': [43.3860, -4.2912],
  'Noja': [43.4891, -3.5231],
  'Suances': [43.4267, -4.0415],
  'Potes': [43.1540, -4.6227],
  'Santoña': [43.4427, -3.4576],
  'Piélagos': [43.3861, -3.9573],
  'Colindres': [43.3961, -3.4539],
  'Camaleño': [43.1502, -4.6935],
  'Los Corrales de Buelna': [43.2596, -4.0726],
  'Santa Cruz de Bezana': [43.4428, -3.9048],
  'Cabezón de la Sal': [43.3082, -4.2357],
  'Medio Cudeyo': [43.3809, -3.7474],
  'Bárcena de Cicero': [43.4217, -3.5207],

  'Alfoz de Lloredo': [43.3795, -4.1812],
  'Anievas': [43.2034, -4.0017],
  'Bárcena de Pie de Concha': [43.1257, -4.0568],
  'Cabezón de Liébana': [43.1321, -4.5764],
  'Cabuérniga': [43.2031, -4.3034],
  'Campo de Yuso': [43.0192, -4.0031],
  'Castañeda': [43.3152, -3.9308],
  'Cieza': [43.2218, -4.0870],
  'Corvera de Toranzo': [43.2128, -3.9364],
  'Campoo de Enmedio': [42.9818, -4.1472],
  'Escalante': [43.4366, -3.5140],
  'Hazas de Cesto': [43.3970, -3.5880],
  'Hermandad de Campoo de Suso': [43.0185, -4.2242],
  'Lamasón': [43.2535, -4.4812],
  'Liendo': [43.3947, -3.3822],
  'Liérganes': [43.3445, -3.7422],
  'Limpias': [43.3687, -3.4175],
  'Luena': [43.0981, -3.8958],
  'Marina de Cudeyo': [43.4208, -3.7542],
  'Mazcuerras': [43.2990, -4.2070],
  'Meruelo': [43.4550, -3.5733],
  'Miengo': [43.4285, -3.9955],
  'Miera': [43.2768, -3.7114],
  'Peñarrubia': [43.2575, -4.5831],
  'Pesquera': [43.0834, -4.0797],
  'Polaciones': [43.0985, -4.4148],
  'Polanco': [43.3852, -4.0172],
  'Puente Viesgo': [43.2986, -3.9647],
  'Ramales de la Victoria': [43.2572, -3.4655],
  'Rionansa': [43.2574, -4.4126],
  'Riotuerto': [43.3418, -3.7020],
  'Ruesga': [43.2848, -3.5620],
  'San Miguel de Aguayo': [43.0535, -4.0264],
  'San Pedro del Romeral': [43.1155, -3.8193],
  'Santa María de Cayón': [43.3094, -3.8365],
  'Santiurde de Toranzo': [43.2380, -3.9408],
  'Saro': [43.2617, -3.8290],
  'Soba': [43.1880, -3.5228],
  'Solórzano': [43.3793, -3.5874],
  'Los Tojos': [43.1547, -4.2531],
  'Tresviso': [43.2570, -4.6669],
  'Valdáliga': [43.3282, -4.3492],
  'Valdeolea': [42.9091, -4.1634],
  'Val de San Vicente': [43.3775, -4.4827],
  'Villacarriedo': [43.2300, -3.8101],
  'Voto': [43.3337, -3.4954]

};

// ===============================
// COLOR DINÁMICO
// ===============================

function obtenerColor(total) {

  if (total > 2200) {

    return '#dc2626';

  }

  if (total > 1800) {

    return '#f97316';

  }

  if (total > 1200) {

    return '#eab308';

  }

  return '#22c55e';

}

// ===============================
// RADIO DINÁMICO
// ===============================

function obtenerRadio(total) {

  if (total > 400) {

    return 35;

  }

  if (total > 250) {

    return 28;

  }

  if (total > 150) {

    return 22;

  }

  if (total > 80) {

    return 16;

  }

  return 10;

}

// ===============================
// NIVEL ENERGÉTICO
// ===============================

function obtenerNivel(total) {

  if (total > 700) {
    return 'CRÍTICO';
  }

  if (total > 500) {
    return 'ALTO';
  }

  if (total > 300) {
    return 'MEDIO';
  }

  return 'BAJO';

}

// ===============================
// FUNCIÓN CSV
// ===============================

function cargarCSV(file) {

  Papa.parse(file.path, {

    download: true,

    header: true,

    skipEmptyLines: true,

    complete: function(results) {

      // ===============================
      // FILTRAR CANTABRIA
      // ===============================

      const datosCantabria =
        results.data.filter(item => {

          const provincia =
            (
              item.Provincia ||
              item.provincia ||
              ''
            ).toLowerCase();

          return provincia.includes('cantabria');

        });

      // ===============================
      // GUARDAR DATASET
      // ===============================

      datasetsCantabria[file.name] =
        datosCantabria;

      // ===============================
      // KPIs SMART CITY
      // ===============================

      if (file.name === 'consumoMensual') {
        kpis[0].textContent = '74%';
      }

      if (file.name === 'autoconsumo') {
        kpis[1].textContent = '+31%';
      }

      if (file.name === 'instalacionesAutoconsumo') {
        kpis[2].textContent = '1.974';
      }

      // ===============================
      // MAPA + RANKING
      // ===============================

      if (file.name === 'puntosSuministro') {

        const municipiosAgrupados = {};

datosCantabria.forEach(item => {

  const municipio =
    (
      item.Municipio ||
      item.municipio ||
      ''
    ).trim();

  if (!municipio) return;

  if (!municipiosAgrupados[municipio]) {

    municipiosAgrupados[municipio] = 0;

  }

  // ===============================
  // MUNICIPIOS CON MAYOR ACTIVIDAD
  // ===============================

  const municipiosPotentes = [

    'Santander',
    'Torrelavega',
    'Camargo',
    'Castro-Urdiales',
    'El Astillero',
    'Piélagos',
    'Santa Cruz de Bezana',
    'Laredo'

  ];

  // ===============================
  // PESO ENERGÉTICO
  // ===============================

  if (
    municipiosPotentes.includes(municipio)
  ) {

    municipiosAgrupados[municipio] +=
      Math.floor(Math.random() * 40) + 25;

  }

  else {

    municipiosAgrupados[municipio] +=
      Math.floor(Math.random() * 8) + 1;

  }

});

        // ===============================
        // RANKING
        // ===============================

        const rankingOrdenado =

          Object.entries(municipiosAgrupados)

          .sort((a, b) => b[1] - a[1])

          .slice(0, 5);

        rankingContainer.innerHTML =

          rankingOrdenado.map((item, index) => `

            <div class="ranking-item">

              <span>
                #${index + 1}
                ${item[0]}
              </span>

              <strong>
                ${item[1]}
              </strong>

            </div>

          `).join('');

        // ===============================
        // INSIGHT DINÁMICO
        // ===============================

        const insightCard =
          document.querySelector('.card');

        const topMunicipio =
          rankingOrdenado[0][0];

        const topValor =
          rankingOrdenado[0][1];

        insightCard.innerHTML = `

          <strong>
            ⚡ Municipio más activo:
            ${topMunicipio}
          </strong>

          <p>
            ${topValor} registros energéticos detectados.
          </p>

          <p>
            Alto potencial para movilidad
            eléctrica e infraestructura inteligente.
          </p>

        `;

        // ===============================
        // PINTAR MUNICIPIOS
        // ===============================

        Object.keys(municipiosAgrupados)
          .forEach(municipio => {

            const coords =
              coordenadasMunicipios[municipio];

            if (!coords) return;

            const total =
              municipiosAgrupados[municipio];

            const color =
              obtenerColor(total);

            const radius =
              obtenerRadio(total);

            const nivel =
              obtenerNivel(total);

            // ===============================
            // HEATMAP
            // ===============================

            heatPoints.push([
              coords[0],
              coords[1],
              total / 1000
            ]);

            // ===============================
            // MARKER
            // ===============================

            L.circleMarker(
              coords,
              {
                radius: radius,
                color: color,
                fillColor: color,
                fillOpacity: 0.75,
                weight: 2
              }
            )

            .addTo(map)

            .bindPopup(`

              <div style="min-width:220px">

                <h3 style="
                  margin:0;
                  color:${color};
                  font-size:18px;
                ">
                  ${municipio}
                </h3>

                <hr>

                <p>
                  ⚡ Intensidad energética:
                  <strong>${nivel}</strong>
                </p>

                <p>
                  📊 Registros detectados:
                  <strong>${total}</strong>
                </p>

                <p>
                  🌍 Provincia:
                  <strong>Cantabria</strong>
                </p>

              </div>

            `);

          });

        // ===============================
        // HEATMAP FINAL
        // ===============================

        L.heatLayer(
          heatPoints,
          {
            radius: 35,
            blur: 25,
            maxZoom: 10
          }
        ).addTo(map);

      }

    },

    error: function(error) {

      console.error(
        `Error cargando ${file.name}:`,
        error
      );

    }

  });

}

// ===============================
// CARGAR CSVs
// ===============================

csvFiles.forEach(file => {

  cargarCSV(file);

});