import { enableInput, inputEnabled, message, setDiv, token, isPsychologist } from "./index.js";
import { showAppointments } from "./appointments.js";

let addEditDiv = null;
let appointmentDate = null;
let appointmentTime = null;
let timezone = null;
let psychologist = null;
let patientEmail = null;
let description = null;
let addingAppointment = null;

export const handleAddEditAppointment = () => {
  addEditDiv = document.getElementById("edit-appointment");
  appointmentDate = document.getElementById("date");
  appointmentDate.addEventListener("blur", function() {
    const errorMessage = validateDate(this.value);
    if (errorMessage) {
        message.textContent = errorMessage;
        console.log(errorMessage);
        this.value = "";
    } 
  });
  appointmentTime = document.getElementById("time");
  timezone = document.getElementById("timezone");
  psychologist = document.getElementById("psychologist");
  patientEmail = document.getElementById("patient");
  description = document.getElementById("description");
  addingAppointment = document.getElementById("adding-appointment");
  const editCancel = document.getElementById("edit-cancel");
  
    
  addEditDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addingAppointment) {
        enableInput(false);
        //get user data
        const response = await fetch('/api/v1/auth/decode', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            token:{ token }
        })});
        const decodedUser = await response.json();
        if (decodedUser) {
            console.log(`User ID: ${decodedUser.userId}, Name: ${decodedUser.name}`);
          } else {
            console.log('Invalid or expired token.');
          }
        
        let method = "POST";
        let url = "/api/v1/appointments";

        if (addingAppointment.textContent === "Update") {
          method = "PATCH";
          url = `/api/v1/appointments/${addEditDiv.dataset.id}`;
        }
        try {
          const bodyContent = {
              date: combineDateAndTime(appointmentDate.value, appointmentTime.value),
              timezone: timezone.value,
              description: description.value,
              patientEmail: patientEmail.value || null,
          };      
          
          if (isPsychologist === "true") {
              bodyContent.psychologist = decodedUser.userId;
              bodyContent.psychologistName = decodedUser.name;
          } else {
              bodyContent.patient = decodedUser.userId;
              bodyContent.psychologist = null;
          }; 
          
          const response = await fetch(url, {
              method: method,
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(bodyContent)
          });          
          
          const data = await response.json();
          if (response.status === 200 || response.status === 201) {
            if (response.status === 200) {
              message.textContent = "The appointment entry was updated.";
            } else {
              message.textContent = "The appointment entry was created.";
            }

            appointmentDate.value = "";
            appointmentTime.value = "";
            timezone.value = "UTC"; // Reset to default 
            psychologist.value = "";
            patientEmail.value = "";
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
    appointmentTime.value = "";
    timezone.value = "UTC";
    psychologist.value = "";
    patientEmail.value = "";
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
        appointmentDate.value = new Date(data.appointment.date).toISOString().slice(0, 10);
        appointmentTime.value = new Date(data.appointment.date).toTimeString().slice(0,5);
        timezone.value = data.appointment.timezone;
        psychologist.value = data.appointment.psychologistName == null && isPsychologist === "true" ? "you" : (data.appointment.psychologist || "");
        patientEmail.value = data.appointment.patientEmail || "";
        description.value = data.appointment.description || "";
        addingAppointment.textContent = "Update";
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

function combineDateAndTime(dateValue, timeValue) {
  
  const dateTimeString = `${dateValue}T${timeValue}:00`;

  const dateObj  = new Date(`${dateTimeString}-08:00`);
  
  console.log(dateObj);
  const options = {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };  
  return dateObj.toLocaleString('en-US', options);  
};

//валидация
function validateDate(date) {
  console.log("date",date);
  const currentDate = new Date();
  const selectedDate = new Date(date);
  const twoYearsFromNow = new Date();
  twoYearsFromNow.setFullYear(currentDate.getFullYear() + 2);

  if (selectedDate < currentDate) {
      console.log("selectedDate:",selectedDate);
      return "Error: The selected date is in the past. Please choose a future date.";
  } else if (selectedDate > twoYearsFromNow) {
      return "Error: The selected date is more than 2 years in the future. Please choose a more realistic date.";
  }
  return "";
  }


