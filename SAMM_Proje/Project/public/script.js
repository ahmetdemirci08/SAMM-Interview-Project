document.addEventListener("DOMContentLoaded", function () {
    var mymap = L.map('map').setView([37.05612, 29.10999], 13); //
   
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mymap);
  

    var markers = [];
    var pointList = document.getElementById('point-list');
    var saveBtn = document.getElementById('save-btn');
    var downloadBtn = document.getElementById('download-btn');
    
    saveBtn.addEventListener('click', function () {
        var center = mymap.getCenter();
        var dateTime = new Date().toISOString();

        var marker = L.marker([center.lat, center.lng]).addTo(mymap);
        marker.bindPopup(dateTime).openPopup();

        var point = {
            id: markers.length,
            lat: center.lat,
            lng: center.lng,
            datetime: dateTime,
            marker: marker // Marker'ı sakla
        };

        markers.push(point);
        updatePointList();
    });

    function updatePointList() {
        pointList.innerHTML = '';
        markers.forEach(function (point) {
            var li = document.createElement('li');
            var deleteBtn = document.createElement('button');
            deleteBtn.textContent = '×';
            deleteBtn.className = 'delete-btn';
            li.textContent = point.datetime;
            li.appendChild(deleteBtn);
            li.addEventListener('click', function () {
                // Konumun haritada gösterilmesi
                mymap.setView([point.lat, point.lng], 13);
            });
            deleteBtn.addEventListener('click', function (event) {
                event.stopPropagation(); // Tıklamayı durdur
                markers = markers.filter(function (marker) {
                    return marker.id !== point.id;
                });
                mymap.removeLayer(point.marker); // Marker'ı kaldır
                updatePointList();
            });
            pointList.appendChild(li);
        });
    }
    downloadBtn.addEventListener('click', function () {
        // Dairesel referansları temizle ve temizlenmiş marker nesnelerini oluştur
        var cleanMarkers = markers.map(function(point) {
            // Marker nesnesini kopyala ve dairesel referansları temizle
            var cleanMarker = Object.assign({}, point);
            delete cleanMarker.marker; // marker özelliğini kaldır
            return cleanMarker;
        });
    
        var data = JSON.stringify(cleanMarkers);
        var blob = new Blob([data], { type: 'application/json' });
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'points.json';
        a.click();
        document.body.appendChild(a);
        document.body.removeChild(a);
    });

    updatePointList();
});
