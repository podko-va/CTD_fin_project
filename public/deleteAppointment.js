import { message, token } from "./index.js";
import { showAppointments } from "./appointments.js";

export const deleteAppointment = async (appointmentId) => {
  try {
    console.log(appointmentId);
    const response = await fetch(`/api/v1/appointments/${appointmentId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.status === 200) {
      message.textContent = `Appointment entry has been deleted.`;
      // Optionally refresh the appointments view
      showAppointments();
    } else {
      message.textContent = data.msg || `Failed to delete the appointment.`;
    }
  } catch (err) {
    console.log(err);
    message.textContent = `A communication error occurred while trying to delete the appointment.`;
  }
};
