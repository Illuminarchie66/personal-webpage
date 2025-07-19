var waypoints = {
    area:[],
    location:[],
    landmark:[],
    vehicle:[],
    arrow:[]
};

var redIcon = L.icon({
    iconUrl: "assets/popups/icons/red-icon.png", 
    shadowUrl: "assets/popups/icons/marker-shadow.png",
    iconSize: [53.6, 86.4], 
    shadowSize:   [75, 80], 
    iconAnchor: [26.8, 86.4], 
    shadowAnchor: [22, 81],
    popupAnchor: [0, -90] 
});

var blueIcon = L.icon({
    iconUrl: 'assets/popups/icons/blue-icon.png', 
    shadowUrl: 'assets/popups/icons/marker-shadow.png',
    iconSize: [53.6, 86.4], 
    shadowSize:   [75, 80], 
    iconAnchor: [26.8, 86.4], 
    shadowAnchor: [22, 81],
    popupAnchor: [0, -90] 
});

var peachIcon = L.icon({
    iconUrl: 'assets/popups/icons/peach-icon.png', 
    shadowUrl: 'assets/popups/icons/marker-shadow.png',
    iconSize: [53.6, 86.4], 
    shadowSize:   [75, 80], 
    iconAnchor: [26.8, 86.4], 
    shadowAnchor: [22, 81],
    popupAnchor: [0, -90] 
});

var marioIcon = L.icon({
    iconUrl: 'assets/popups/icons/mario-icon.png', 
    shadowUrl: 'assets/popups/icons/marker-shadow.png',
    iconSize: [53.6, 86.4], 
    shadowSize:   [75, 80], 
    iconAnchor: [26.8, 86.4], 
    shadowAnchor: [22, 81],
    popupAnchor: [0, -90] 
});

var pipeIcon = L.icon({
    iconUrl: 'assets/popups/icons/pipe-icon.png', 
    shadowUrl: 'assets/popups/icons/marker-shadow.png',
    iconSize: [53.6, 86.4], 
    shadowSize:   [75, 80], 
    iconAnchor: [26.8, 86.4], 
    shadowAnchor: [22, 81],
    popupAnchor: [0, -90] 
});

var starIcon = L.icon({
    iconUrl: 'assets/popups/icons/star-icon.png', 
    shadowUrl: 'assets/popups/icons/marker-shadow.png',
    iconSize: [53.6, 86.4], 
    shadowSize:   [75, 80], 
    iconAnchor: [26.8, 86.4], 
    shadowAnchor: [22, 81],
    popupAnchor: [0, -90] 
});

var tennisIcon = L.icon({
    iconUrl: 'assets/popups/icons/tennis-icon.png', 
    shadowUrl: 'assets/popups/icons/marker-shadow.png',
    iconSize: [53.6, 86.4], 
    shadowSize:   [75, 80], 
    iconAnchor: [26.8, 86.4], 
    shadowAnchor: [22, 81],
    popupAnchor: [0, -90] 
});

var golfIcon = L.icon({
    iconUrl: 'assets/popups/icons/golf-icon.png', 
    shadowUrl: 'assets/popups/icons/marker-shadow.png',
    iconSize: [53.6, 86.4], 
    shadowSize:   [75, 80], 
    iconAnchor: [26.8, 86.4], 
    shadowAnchor: [22, 81],
    popupAnchor: [0, -90] 
});

var flowerIcon = L.icon({
    iconUrl: 'assets/popups/icons/flower-icon.png', 
    shadowUrl: 'assets/popups/icons/marker-shadow.png',
    iconSize: [53.6, 86.4], 
    shadowSize:   [75, 80], 
    iconAnchor: [26.8, 86.4], 
    shadowAnchor: [22, 81],
    popupAnchor: [0, -90] 
});

var vehicleIcon = L.icon({
    iconUrl: 'assets/popups/icons/vehicle-icon.png', 
    shadowUrl: 'assets/popups/icons/marker-shadow.png',
    iconSize: [53.6, 86.4], 
    shadowSize:   [75, 80], 
    iconAnchor: [26.8, 86.4], 
    shadowAnchor: [22, 81],
    popupAnchor: [0, -90] 
});

var rotatedIcon = L.icon({
    iconUrl: 'assets/popups/icons/arrow-icon.png', 
    iconSize: [1.5*1152/32, 1.5*963/32], 
    iconAnchor: [1.5*1152/64, 1.5*963/64], 
    popupAnchor: [0, -30], 
});

var iconMapping = {
    "red": redIcon,
    "blue": blueIcon,
    "peach": peachIcon,
    "mario": marioIcon,
    "star": starIcon,
    "pipe": pipeIcon,
    "tennis": tennisIcon,
    "golf": golfIcon,
    "flower": flowerIcon,
    "vehicle": vehicleIcon
};

function addMarker({x, y, name, game, course, description, iconpic, imagesrc, tag}) {
    const marker = L.marker([y, x], { icon: iconpic }).addTo(map);
    const courseInfo = course ? `(${course})<br>` : '';

    const popupContent = `
        <div class="w-[29.3vw] max-w-[90vw] rounded-[20px] overflow-hidden bg-white font-[papermario] relative">
            <div class="relative w-full overflow-hidden image-container">
                <img src="assets/popups/images/${imagesrc}" alt="Image"
                    class="w-full h-auto block" />
                <div class="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
            </div>
            <div class="px-3 py-2 w-[27.3vw]">
                <div class="text-[1.2vw] mb-1">${name} ${courseInfo}</div>
                <div class="text-[0.975vw] leading-tight">
                    First appeared: ${game} <br><br>
                    ${description}
                </div>
            </div>
        </div>
    `;

    const customOptions = {
        className: 'popupCustom'
    };

    marker.bindPopup(popupContent, customOptions);
    waypoints[tag].push(marker);
    //map.removeLayer(marker); // as in your original
}


Papa.parse('assets/popups/Waypoints.csv', {
  download: true,
  header: true,
  complete: function(results) {
    console.log("Waypoints loaded successfully:", results.data.length, "entries found.");
    results.data.forEach(waypoint => {
        addMarker({
            x: waypoint.x,
            y: waypoint.y,
            name: waypoint.name,
            game: waypoint.game,
            course: waypoint.course,
            description: waypoint.description,
            iconpic: iconMapping[waypoint.icon] || redIcon,
            imagesrc: waypoint.src,
            tag: waypoint.tag
        });
    });
  }
});

