document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    // Get form values
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    // Create an object to store the message
    const contactMessage = {
      name,
      email,
      subject,
      message,
    };

    // Save to localStorage
    localStorage.setItem("contactMessage", JSON.stringify(contactMessage));

    // Optional: show confirmation
    alert("Your message has been saved locally. We'll get back to you soon!");

    // Optional: clear the form
    form.reset();
  });
});

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
