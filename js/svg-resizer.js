// js/svg-resizer.js - mit Debugging
export function initSVGResizer() {
    console.log("🔧 SVG-Resizer startet...");
    
    const mapObject = document.getElementById('mapObject');
    const mapWrapper = document.querySelector('.map-wrapper');
    
    if (!mapObject) {
        console.error("❌ mapObject nicht gefunden!");
        return;
    }
    
    if (!mapWrapper) {
        console.error("❌ mapWrapper nicht gefunden!");
        return;
    }
    
    console.log("✅ mapObject und mapWrapper gefunden");
    
    function resizeAndPositionSVG() {
        console.log("🔄 resizeAndPositionSVG aufgerufen");
        
        // Prüfe ob SVG geladen ist
        if (!mapObject.contentDocument) {
            console.log("⏳ SVG noch nicht geladen...");
            return;
        }
        
        const svgElement = mapObject.contentDocument.querySelector('svg');
        if (!svgElement) {
            console.error("❌ SVG Element in contentDocument nicht gefunden!");
            return;
        }
        
        console.log("✅ SVG Element gefunden:", svgElement);
        
        const wrapperWidth = mapWrapper.clientWidth;
        const wrapperHeight = mapWrapper.clientHeight;
        
        console.log(`📏 Wrapper: ${wrapperWidth}x${wrapperHeight}`);
        
        // ViewBox auslesen
        const viewBox = svgElement.getAttribute('viewBox');
        console.log(`📦 viewBox: "${viewBox}"`);
        
        let [minX, minY, width, height] = viewBox ? 
            viewBox.split(' ').map(Number) : [0, 0, 800, 600];
        
        console.log(`📐 SVG Dimensionen: ${width}x${height}`);
        
        // Skalierungsfaktor berechnen
        const scaleX = wrapperWidth / width;
        const scaleY = wrapperHeight / height;
        const scale = Math.min(scaleX, scaleY);
        
        console.log(`⚖️ Skalierung: X=${scaleX}, Y=${scaleY}, Min=${scale}`);
        
        // Neue Dimensionen
        const newWidth = width * scale;
        const newHeight = height * scale;
        
        console.log(`🆕 Neue Dimensionen: ${newWidth}x${newHeight}`);
        
        // Änderungen anwenden
        svgElement.setAttribute('width', newWidth);
        svgElement.setAttribute('height', newHeight);
        svgElement.style.transformOrigin = '0 0';
        svgElement.style.display = 'block';
        svgElement.style.marginRight = 'auto';
        svgElement.style.marginLeft = '0';
        svgElement.style.maxWidth = 'none'; // Wichtig!
        
        console.log("🎨 CSS Stile angewendet");
        
        // Optional: Container auch anpassen
        mapObject.style.width = newWidth + 'px';
        mapObject.style.height = newHeight + 'px';
        mapObject.style.display = 'block';
    }
    
    // Warte bis SVG geladen ist
    if (mapObject.contentDocument) {
        console.log("⚡ SVG bereits geladen, sofort resize");
        resizeAndPositionSVG();
    } else {
        console.log("⏳ Warte auf SVG load event...");
        mapObject.addEventListener('load', function() {
            console.log("🎉 SVG load event ausgelöst!");
            resizeAndPositionSVG();
        });
    }
    
    // Auch bei Fenster-Resize
    window.addEventListener('resize', function() {
        console.log("📱 Window resize");
        resizeAndPositionSVG();
    });
    
    // Timeout für langsames Laden
    setTimeout(function() {
        console.log("⏰ Timeout für SVG-Laden");
        resizeAndPositionSVG();
    }, 1000);
}

// Automatisch starten
document.addEventListener('DOMContentLoaded', initSVGResizer);
