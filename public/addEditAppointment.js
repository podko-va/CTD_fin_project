import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showAppointments } from "./appointments.js";

let addEditDiv = null;
let appointmentDate = null;
let timezone = null;
let psychologist = null;
let patient = null;
let description = null;
let addingAppointment = null;

export const handleAddEditAppointment = () => {
  addEditDiv = document.getElementById("edit-appointment");
  appointmentDate = document.getElementById("date");
  timezone = document.getElementById("timezone");
  psychologist = document.getElementById("psychologist");
  patient = document.getElementById("patient");
  description = document.getElementById("description");
  addingAppointment = document.getElementById("adding-appointment");
  const editCancel = document.getElementById("edit-cancel");

  addEditDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addingAppointment) {
        enableInput(false);

        let method = "POST";
        let url = "/api/v1/appointments";

        if (addingAppointment.textContent === "update") {
          method = "PATCH";
          url = `/api/v1/appointments/${addEditDiv.dataset.id}`;
        }

        try {
          const response = await fetch(url, {
            method: method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              date: appointmentDate.value,
              timezone: timezone.value,
              psychologist: psychologist.value,
              patient: patient.value,
              description: description.value,
            }),
          });

          const data = await response.json();
          if (response.status === 200 || response.status === 201) {
            if (response.status === 200) {
              message.textContent = "The appointment entry was updated.";
            } else {
              message.textContent = "The appointment entry was created.";
            }

            appointmentDate.value = "";
            timezone.value = "UTC"; // Reset to default or your preferred timezone
            psychologist.value = "";
            patient.value = "";
            description.value = "";

            showAppointments();
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          console.log(err);
          message.textContent = "A communication error occurred.";
        }

        enableInput(true);
      } else if (e.target === editCancel) {
        message.textContent = "";
        showAppointments();
      }
    }
  });
};

export const showAddEditAppointment = async (appointmentId) => {
  if (!appointmentId) {
    appointmentDate.value = "";
    timezone.value = "UTC";
    psychologist.value = "";
    patient.value = "";
    description.value = "";
    addingAppointment.textContent = "add";
    message.textContent = "";

    setDiv(addEditDiv);
  } else {
    enableInput(false);

    try {
      const response = await fetch(`/api/v1/appointments/${appointmentId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        appointmentDate.value = new Date(data.appointment.date).toISOString().substring(0, 16); // Convert to a datetime-local input
        timezone.value = data.appointment.timezone;
        psychologist.value = data.appointment.psychologist._id;
        patient.value = data.appointment.patient._id;
        description.value = data.appointment.description || "";
        addingAppointment.textContent = "update";
        message.textContent = "";
        addEditDiv.dataset.id = appointmentId;

        setDiv(addEditDiv);
      } else {
        message.textContent = "The appointment entry was not found.";
        showAppointments();
      }
    } catch (err) {
      console.log(err);
      message.textContent = "A communication error has occurred.";
      showAppointments();
    }

    enableInput(true);
  }
};
