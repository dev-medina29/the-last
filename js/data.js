document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#form2");
  const form1 = document.querySelector("#form1");

  async function postJson(url, data) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Server error");
    }

    return response.json();
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form from submitting normally

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const date = document.getElementById("date").value;
    const tickets = document.getElementById("tickets").value;
    const type = document.getElementById("type").value;

    const visitData = {
      name,
      email,
      date,
      tickets,
      type,
    };

    localStorage.setItem("visitBooking", JSON.stringify(visitData));

    try {
      await postJson("/api/visit-booking", visitData);
      alert(
        "Your visit details have been sent successfully. Check your email for confirmation.",
      );
      form.reset();
    } catch (error) {
      console.error(error);
      alert(
        "Unable to submit your visit booking right now. Please try again later.",
      );
    }
  });

  form1.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form from submitting normally

    const resName = document.getElementById("res-name").value.trim();
    const resEmail = document.getElementById("res-email").value.trim();
    const resDate = document.getElementById("res-date").value;
    const resTime = document.getElementById("res-time").value;
    const guests = document.getElementById("guests").value;

    const reservationData = {
      resName,
      resEmail,
      resDate,
      resTime,
      guests,
    };

    localStorage.setItem("tableReservation", JSON.stringify(reservationData));

    try {
      await postJson("/api/table-reservation", reservationData);
      alert(
        "Your table reservation has been sent successfully. Check your email for confirmation.",
      );
      form1.reset();
    } catch (error) {
      console.error(error);
      alert(
        "Unable to submit your table reservation right now. Please try again later.",
      );
    }
  });
});
