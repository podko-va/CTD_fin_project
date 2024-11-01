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
  let emptyappointmentsTableSection = null;

  export const handleAppointments = () => {
    appointmentsDiv = document.getElementById("appointments");
    const logoff = document.getElementById("logoff");
    const addAppointment = document.getElementById("add-appointment");
    const appMessage = document.getElementById("appointments-message");
    appointmentsTable = document.getElementById("appointments-table");
    emptyappointmentsTable = document.getElementById("empty-appointments-table");
    appointmentsTableHeader = document.getElementById("appointments-table-header");
    emptyappointmentsTableHeader = document.getElementById("empty-appointments-table-header");
    emptyappointmentsTableSection = document.getElementById("empty-appointments");
  
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
    let children = [appointmentsTableHeader];
  
    try {
      enableInput(false);
  
      // Выполняем оба запроса параллельно
      const [appointmentsResponse, adminResponse] = await Promise.all([
        fetch("/api/v1/appointments", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
        isPsychologist === "true"
          ? fetch("/api/v1/admin", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            })
          : Promise.resolve(null), // Заглушка для отсутствия запроса
      ]);
  
      // Проверяем ответы по каждому из запросов
      if (appointmentsResponse.ok) {
        const appointmentsData = await appointmentsResponse.json();
  
        // Параметры интерфейса, когда данные назначений получены
        if (appointmentsData.count === 0) {
          appointmentsTable.replaceChildren(...children);
          appointmentsTable.style.display = "none";
          message.textContent = "No appointments found.";
          if (isPsychologist === "false") {
            addAppointment.textContent = "Request for consultation";
          }
        } else {
          if (isPsychologist === "false") {
            appointmentsTableHeader.innerHTML = `
              <th>Date</th>
              <th>Time</th>
              <th>Psychologist</th>
              <th>Status</th>
              <th colspan="2"></th>
              <th colspan="3"></th>`;
            addAppointment.textContent = "Request for consultation";
          }
  
          appointmentsData.appointments.forEach((appointment) => {
            let rowEntry = document.createElement("tr");
            let editButton = `<td><button type="button" class="editButton" data-id=${appointment._id}>edit</button></td>`;
            let deleteButton = `<td><button type="button" class="deleteButton" data-id=${appointment._id}>delete</button></td>`;
            let rowHTML = `
              <td>${new Date(appointment.date).toLocaleDateString()}</td>
              <td>${new Date(appointment.date).toTimeString().slice(0, 8)}</td>
              ${isPsychologist === "true" ? `<td>${appointment.patientEmail || ""}</td>` : `<td>${appointment.psychologistName || ""}</td>`}
              <td>${appointment.status || "N/A"}</td>
              <div>${editButton}${deleteButton}</div>`;
            rowEntry.innerHTML = rowHTML;
            children.push(rowEntry);
          });
          appointmentsTable.replaceChildren(...children);
        }
      } else {
        message.textContent = "Error fetching appointments.";
      }
  
      // Обрабатываем данные администратора, если пользователь - психолог
      if (isPsychologist === "true" && adminResponse && adminResponse.ok) {
        const adminData = await adminResponse.json();
        let emptyChildren = [emptyappointmentsTableHeader];
  
        if (adminData.count === 0) {
          emptyappointmentsTable.replaceChildren(...emptyChildren);
          emptyappointmentsTable.style.display = "none";
          emptyappointmentsTableSection.style.display = "none";
        } else {
          adminData.appointments.forEach((appointment) => {
            let rowEntry = document.createElement("tr");
            let editButton = `<td><button type="button" class="editButton" data-id=${appointment._id}>accept</button></td>`;
            let rowHTML = `
              <td>${new Date(appointment.date).toLocaleDateString()}</td>
              <td>${new Date(appointment.date).toTimeString().slice(0, 8)}</td>
              <td>${appointment.patientEmail || ""}</td>
              <td>${appointment.status || "N/A"}</td>
              <div>${editButton}</div>`;
            rowEntry.innerHTML = rowHTML;
            emptyChildren.push(rowEntry);
          });
          emptyappointmentsTable.replaceChildren(...emptyChildren);
        }
      }
      else{
        if (isPsychologist === "false") {
          emptyappointmentsTable.style.display = 'none';
          emptyappointmentsTableHeader.style.display = 'none';
          emptyappointmentsTableSection.style.display = "none";
        };
      };
  
    } catch (err) {
      console.log("Error:", err);
      message.textContent = "A communication error occurred.";
    } finally {
      enableInput(true);
      setDiv(appointmentsDiv); // Обновляем отображаемый div только после завершения всех запросов
    }
  };
  