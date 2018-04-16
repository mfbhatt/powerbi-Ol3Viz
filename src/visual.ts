

module powerbi.extensibility.visual {
    "use strict";
    export class Visual implements IVisual {
        private target: HTMLElement;
        private updateCount: number;
        private settings: VisualSettings;
        private textNode: Text;
        private map :OL3Map;

        constructor(options: VisualConstructorOptions) {
            console.log('Visual constructor', options);
            this.target = options.element;
            const mapElement:HTMLElement = document.createElement("div");
            mapElement.id = "map";
            this.target.appendChild(mapElement);            
            this.map = new OL3Map(mapElement);
        }

        public update(options: VisualUpdateOptions) {            
            this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
            console.log(options.dataViews[0].table);       
            this.map.initialize(options.dataViews[0].table);
        }

        private static parseSettings(dataView: DataView): VisualSettings {
            return VisualSettings.parse(dataView) as VisualSettings;
        }

        /** 
         * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the 
         * objects and properties you want to expose to the users in the property pane.
         * 
         */
        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
            return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
        }
    }
}