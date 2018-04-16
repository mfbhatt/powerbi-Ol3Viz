var colors = [];
module powerbi.extensibility.visual.powerbiOl3VizCD46B2BA4997410B9423D41CAF42E3AB  {
    "use strict";
    declare var ol;   
    
    export class OL3Map {       
        map;       
        constructor(target) {
            console.log("[Map Constructor]");
            this.map = new ol.Map({
                target: target,
                layers: [
                    new ol.layer.Tile({
                        source: new ol.source.XYZ({
                            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                        })
                    })
                ],
                view: new ol.View({
                    center:[ -40030988.957286224, 6808398.9834172195],
                    zoom: 10
                })

            });

            this.map.on("click", function(evt){
                console.log(evt);
            }); 
            
            this.loadTileLayers();
        }


        loadTileLayers(){
            var projection = ol.proj.get('EPSG:3857');
                        var projectionExtent = projection.getExtent();
                        var size = ol.extent.getWidth(projectionExtent) / 256;
                        var resolutions = new Array(25);
                        var matrixIds = new Array(25);
                        for (var z = 0; z < 25; ++z) {
                            resolutions[z] = size / Math.pow(2, z);
                            matrixIds[z] = 'EPSG:900913:' + z;
                        }
                        var loads = [];
                        for(var x=0; x< 25; ++x){
                            loads.push({"level" : matrixIds[x] , "resolution" : resolutions[x]});
                        }
                        var layers: any[] = [
                            {name:'grosight:STATUTORY_SEWAGE_CATCHMENT_AREA',label:'Catchment Poly'},                                
                            { name: 'grosight:PARISHES', label: 'Parish' },
                            { name: 'grosight:SEWER_PIPE', label: 'Sewer' },
                            { name: 'grosight:WATER_TREATMENT', label: 'Water Treatment' },
                            { name: 'grosight:SEWER_MANHOLE', label: 'Manhole' },
                            { name: 'grosight:ADDRESS', label: 'Address' }
                        ];

                        for(var x=0;x<layers.length;x++){
                            var layer = layers[x];
                            let layerSource = new ol.source.WMTS({
                                url: 'https://aws-gs-app-dev-01.azurewebsites.net/geoserver/gwc/service/wmts',
                                layer: layer.name,
                                matrixSet: 'EPSG:900913',
                                format: 'image/png',
                                projection: projection,
                                tileGrid: new ol.tilegrid.WMTS({
                                    origin: ol.extent.getTopLeft(projectionExtent),
                                    resolutions: resolutions,
                                    matrixIds: matrixIds
                                }),
                                style: '',
                                wrapX: true,
                                crossOrigin: 'anonymous',
                                t: Date.now(),
                            });
                            let WMSLayer = new ol.layer.Tile({
                                title: layer.label,
                                id: 'layer_'+x,
                                name: layer.label,
                                visible: true,
                                geometryColumn: 'G3E_GEOMETRY',
                                source: layerSource
                            });
                            //this.map.addLayer(WMSLayer);
                        }
        }

        initialize(data) {
            var features = [];     
            this.generateColors();
            data.rows.forEach(row => {  
                var coordinates = ol.proj.transform([row[0], row[1]], 'EPSG:4326', 'EPSG:3857');
                var f = new ol.Feature(new ol.geom.Point(coordinates));                
                features.push( f);             
             });

             var source = new ol.source.Vector({
                features: features
              });             
              
              var vectorLayer = new ol.layer.Vector({
                source: source,
                style: this.styleFunction              
              })

              this.map.addLayer(vectorLayer);

            console.log("added vector layer");
        }
      

        private generateColors(){
            for(var x=0; x< 3000; x++){
                var colorArr =  [Math.floor( Math.random() * 254) , Math.floor(Math.random() * 254),Math.floor(Math.random() * 254)];
                var color = 'rgba('+ colorArr.join(",") +')';
                colors.push(color);
            }
        }
        styleFunction( feature, resolution){                       
            return new ol.style.Style({
                image: new ol.style.Circle({
                  fill: new ol.style.Fill({
                    color: colors[Math.floor(Math.random() * 3000)]
                  }),
                  radius: 20,
                  stroke: new ol.style.Stroke({
                    color: '#000',
                    width: 1
                  })
                })
              });
        }
    }

}