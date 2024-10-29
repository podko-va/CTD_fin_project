import {
    inputEnabled,
    setDiv,
    message,
    listAppMessage,
    setToken,
    token,
    isPsychologist,
    enableInput,
  } from "./index.js";
  import { showLoginRegister } from "./loginRegister.js";
  import { showAddEditAppointment } from "./addEditAppointment.js";
  import { deleteAppointment } from "./deleteAppointment.js";
  
  let appointmentsDiv = null;
  let appointmentsTable = null;
  let appointmentsTableHeader = null;
  let emptyappointmentsTable = null;
  let emptyappointmentsTableHeader = null;
    
  export const handleAppointments = () => {
    appointmentsDiv = document.getElementById("appointments");
    const logoff = document.getElementById("logoff");
    const addAppointment = document.getElementById("add-appointment");
    const appMessage = document.getElementById("appointments-message");
    appointmentsTable = document.getElementById("appointments-table");
    emptyappointmentsTable = document.getElementById("empty-appointments-table");
    appointmentsTableHeader = document.getElementById("appointments-table-header");
    emptyappointmentsTableHeader = document.getElementById("empty-appointments-table-header");
  
    appointmentsDiv.addEventListener("click", (e) => {
      if (inputEnabled && e.target.nodeName === "BUTTON") {
        if (e.target === addAppointment) {
          showAddEditAppointment(null);
        } else if (e.target === logoff) {
          setToken(null);
          message.textContent = "You have been logged off.";
          appointmentsTable.replaceChildren([appointmentsTableHeader]);
          emptyappointmentsTable.replaceChildren([emptyappointmentsTableHeader]);
          showLoginRegister();
        } else if (e.target.classList.contains("editButton") || e.target.classList.contains("editButtonEmpty")) {
          message.textContent = "";
          showAddEditAppointment(e.target.dataset.id);
        } else if (e.target.classList.contains("deleteButton")) {
          message.textContent = "You deleted one appointment.";
          //appMessage.textContent = "You deleted one appointment.";
          deleteAppointment(e.target.dataset.id);
          showAppointments();
        }
      }
    });
  };
  
  export const showAppointments = async () => {
    const addAppointment = document.getElementById("add-appointment");
    console.log("isPsychologist", isPsychologist);
    console.log("addAppointment-beg", addAppointment); 
    try {
      enableInput(false);
      const response = await fetch("/api/v1/appointments", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
      let children = [appointmentsTableHeader];
      if (response.status === 200) {


        if (data.count === 0) {
          appointmentsTable.replaceChildren(...children);
          appointmentsTable.style.display = 'none'; 
          message.textContent = "No appointments found."; 
          if (isPsychologist==false) {addAppointment.style.display = 'none';}
        } else {
          // var thirdHeader = appointmentsTableHeader.getElementsByTagName("th")[2];
          // if (isPsychologist) {
          // thirdHeader.textContent = "Patient";
          // } else {
          // thirdHeader.textContent = "Psychologist";
          // }
          console.log("isPsychologist", isPsychologist);
          if (isPsychologist==false) {
            appointmentsTableHeader.innerHTML = `
            <th>Date</th>
            <th>Time</th>
            <th>Psychologist</th>
            <th>Status</th>
            `;            
            children = [appointmentsTableHeader];
            addAppointment.style.display = 'none';
          }
          for (let i = 0; i < data.appointments.length; i++) {
            let rowEntry = document.createElement("tr");  
            let editButton = `<td><button type="button" class="editButton" data-id=${data.appointments[i]._id}>edit</button></td>`;
            let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.appointments[i]._id}>delete</button></td>`;
            let rowHTML = `
            <td>${new Date(data.appointments[i].date).toLocaleDateString()}</td>
            <td>${new Date(data.appointments[i].date).toTimeString().slice(0, 8)}</td>
            ${isPsychologist ? `<td>${data.appointments[i].patientEmail || ""}</td>` : ``} 
            ${isPsychologist ? `` : `<td>${data.appointments[i].psychologist.name || ""}</td>`}
            <td>${data.appointments[i].status || 'N/A'}</td>
            ${isPsychologist ? `<div>${editButton}${deleteButton}</div>` : `<div>${editButton}</div>`}`
            rowEntry.innerHTML = rowHTML;
            children.push(rowEntry);
          }          
          appointmentsTable.replaceChildren(...children);          
        }
      } else {
        message.textContent = data.msg;
      }
    } catch (err) {
      console.log(err);
      message.textContent = "A communication error occurred.";
    }


    try {
      enableInput(false);
      const response = await fetch("/api/v1/admin", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      });
      if (isPsychologist==false) {
        emptyappointmentsTable.style.display = 'none';
        emptyappointmentsTableHeader = 'none';
      }
      else{
        const data = await response.json();
        let children = [emptyappointmentsTableHeader];
        if (response.status === 200) {
          if (data.count === 0) {
            emptyappointmentsTable.replaceChildren(...children);
            emptyappointmentsTable.style.display = 'none'; 
          } else {          
          for (let i = 0; i < data.appointments.length; i++) {
            let rowEntry = document.createElement("tr");  
            let editButton = `<td><button type="button" class="editButton" data-id=${data.appointments[i]._id}>edit</button></td>`;
            let rowHTML = `
            <td>${new Date(data.appointments[i].date).toLocaleDateString()}</td>
            <td>${new Date(data.appointments[i].date).toTimeString().slice(0, 8)}</td>
            <td>${data.appointments[i].patientEmail || ""}</td>
            <td>${""}</td>
            <td>${data.appointments[i].status || 'N/A'}</td>
            <div>${editButton}</div></div>`
            rowEntry.innerHTML = rowHTML;
            children.push(rowEntry);
          }          
          emptyappointmentsTable.replaceChildren(...children);          
        }
        } else {
          message.textContent = data.msg;
        }
      }
    } catch (err) {
      console.log(err);
      message.textContent = "A communication error occurred.";
    }
    enableInput(true);
    setDiv(appointmentsDiv);
  };
  