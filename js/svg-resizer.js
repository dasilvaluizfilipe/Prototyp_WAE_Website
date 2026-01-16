// js/svg-resizer.js
export function initSVGResizer() {
    const mapObject = document.getElementById('mapObject');
    const mapWrapper = document.querySelector('.map-wrapper');
    
    if (!mapObject) return;
    
    function resizeAndPositionSVG() {
        if (!mapObject.contentDocument) return;
        
        const svgElement = mapObject.contentDocument.querySelector('svg');
        if (!svgElement) return;
        
        const wrapperWidth = mapWrapper.clientWidth;
        const wrapperHeight = mapWrapper.clientHeight;
        
        // SVG ViewBox extrahieren
        const viewBox = svgElement.getAttribute('viewBox');
        let [minX, minY, width, height] = viewBox ? 
            viewBox.split(' ').map(Number) : [0, 0, 800, 600];
        
        // Skalierungsfaktor berechnen
        const scaleX = wrapperWidth / width;
        const scaleY = wrapperHeight / height;
        const scale = Math.min(scaleX, scaleY);
        
        // Neue Dimensionen berechnen
        const newWidth = width * scale;
        const newHeight = height * scale;
        
        // SVG-Eigenschaften setzen
        svgElement.setAttribute('width', newWidth);
        svgElement.setAttribute('height', newHeight);
        svgElement.style.transformOrigin = '0 0'; // Links oben als Ursprung
        
        // SVG im Container links ausrichten
        svgElement.style.display = 'block';
        svgElement.style.marginRight = 'auto';
        svgElement.style.marginLeft = '0';
    }
    
    // Event-Handler für geladene SVG
    mapObject.addEventListener('load', function() {
        resizeAndPositionSVG();
        
        // Event-Listener für Window-Resize
        window.addEventListener('resize', resizeAndPositionSVG);
    });
    
    // Initial aufrufen für Fallback
    setTimeout(resizeAndPositionSVG, 100);
}
