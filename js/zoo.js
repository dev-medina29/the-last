coordinate = {
  lat: -4.271667229260911,
  lng: 15.260030653062937,
};
function myMap() {
  var map = new google.maps.Map(document.getElementById("googleMap"), {
    zoom: 15,
    center: coordinate,
  });
  new google.maps.Marker({
    position: coordinate,
    map: map,
    title: "Zoolandia Park",
  });
}
