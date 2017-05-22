//create firebase reference
var dbRef = new Firebase("https://el2017-30cf0.firebaseio.com/");
var contactsRef = dbRef.child('contacts')
var longitude = [];
var latitude = [];
var cars = [];
var j = 0;
//load older conatcts as well as any newly added one...
contactsRef.on("child_added", function(snap) {
  console.log("added", snap.key(), snap.val());
    cars[j] = snap.val();
    j++;
  document.querySelector('#contacts').innerHTML += (contactHtmlFromObject(snap.val()));
});

//save contact
document.querySelector('.addValue').addEventListener("click", function( event ) {  
  event.preventDefault();
  if( document.querySelector('#name').value != '' ){
    contactsRef
       .push({
           name: document.querySelector('#name').value,
           speed: document.querySelector('#speed').value,
           load: (document.querySelector('#load').value)*100/255,
           mil: 256*(document.querySelector('#mil').value),
           maf: 256*(document.querySelector('#maf').value),
           temperature: ((256+document.querySelector('#temperature').value)/10)-40,
           rpm: document.querySelector('#rpm').value,
           os: document.querySelector('#os').value/200,
           aap: document.querySelector('#aap').value,
           lat: document.querySelector('#lat').value,
           lon: document.querySelector('#lon').value
       })
      location.replace("map.html")
  }
}, false);

//prepare conatct object's HTML
function contactHtmlFromObject(contact){
  var html = '';
  html += '<li class="list-group-item contact" style="background-color: inherit;border-radius: 25px;' +
      'border: 2px solid #73AD21;border-color: black;margin: 5px 0px;">';
    html += '<div>';
      html += '<p class="lead"><b>Car Name:</b> '+contact.name+'</p>';
      html += '<p><b>Vehicle Speed: </b>'+contact.speed+'</p>';
      html += '<p><b>Engine Load: </b>'+contact.load+'</p>';
      html += '<p><b>Distance with MIL on: </b>'+contact.mil+'</p>';
      html += '<p><b>MAF: </b>'+contact.maf+'</p>';
      html += '<p><b>Catalyst Temperature: </b>'+contact.temperature+'</p>';
      html += '<p><b>RPM: </b>'+contact.rpm+'</p>';
      html += '<p><b>Oxygen Sensor: </b>'+contact.os+'</p>';
      html += '<p><b>Ambient Air Pressure: </b>'+contact.aap+'</p>';
      html += '<p><b>Latitude: </b>'+contact.lat+'</p>';
      html += '<p><b>Longitude: </b>'+contact.lon+'</p>';
    html += '</div>';
  html += '</li>';
  return html;
}

function init()
{
    console.log(cars);
    var mapDiv = document.getElementById("mymap");
    var mapOptions = {
        center: new google.maps.LatLng (37.09024, -119.4179324),
        zoom: 5,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(mapDiv, mapOptions);
    var locations = [];

    for(var i = 0 ; i < j ; i++) {
        locations.push({name: "Car name: "+cars[i].name+"\nVehicle Speed: "+cars[i].speed+"\nEngine Load: "+cars[i].load+"\nDistance with MIL on: "+cars[i].mil+"\nMAF: "+cars[i].maf+"\nCatalyst Temperature: "+cars[i].temperature+"\nRPM: "+cars[i].rpm+"\nOxygen Sensor: "+cars[i].os+"\nAmbient Air Pressure: "+cars[i].aap+"\nLatitude: "+cars[i].lat+"\nLongitude: "+cars[i].lon, latlng: new google.maps.LatLng(cars[i].lat, cars[i].lon)});
        console.log(cars[i].latitude);
    }

    var bounds = new google.maps.LatLngBounds ();
    for(var i = 0; i < locations.length;i++)
    {
        var marker = new google.maps.Marker({position: locations[i].latlng, map:map, title:locations[i].name});
        bounds.extend(locations[i].latlng);
    }
    map.fitBounds (bounds);
}
