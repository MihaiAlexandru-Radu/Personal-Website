let events = [];
const categoryColors = {"academic":"Aqua","work":"Aquamarine","athletic":"GoldenRod","hobby":"DeepPink"};
let edittedEvent = null;

function updateLocationOptions(value) {
    if(value == "In-Person") {
        document.getElementById("event_location_div").style.display = "block"
        document.getElementById("event_remote_div").style.display = "none"
    } else {
        document.getElementById("event_location_div").style.display = "none"
        document.getElementById("event_remote_div").style.display = "block"
    }
}

function resetForm() {
    document.getElementById("event_form").reset();
}

function saveEvent() { 
    eventName = document.getElementById("event_name").value;
    eventWeekday = document.getElementById("event_weekday").value;
    eventTime = document.getElementById("event_time").value;
    eventModality = document.getElementById("event_modality").value;
    eventLocation = (eventModality == "In-Person") ? document.getElementById("event_location").value : null;
    eventRemoteURL = (eventModality == "Remote") ? document.getElementById("event_remote_url").value : null;
    eventAttendees = document.getElementById("event_attendees").value;
    eventCategory = document.getElementById("event_category").value;
    const eventDetails = {
        name: eventName, 
        weekday: eventWeekday, 
        time: eventTime, 
        modality: eventModality, 
        location: eventLocation, 
        url: eventRemoteURL, 
        attendees: eventAttendees,
        category: eventCategory
    };
    events.push(eventDetails);
    let valid = isValid(eventDetails);
    if(!valid) {
        return;
    }
    const modalElement = document.getElementById("event_modal");
    const modal = bootstrap.Modal.getInstance(modalElement);
    if(edittedEvent != null) {
        updateEvent(eventDetails);
        edittedEvent = null;
        modal.hide();
        document.getElementById("event_form").reset();
        return;
    }
    addEventToCalendarUI(eventDetails);
    document.getElementById("event_form").reset();
    modal.hide();
    console.log(events);
}

function isValid(eventDetails) {
    resetValidity();
    let valid = true;
    let eventName = eventDetails.name;
    if(eventName.trim().length == 0) {
        document.getElementById("event_name").className += " is-invalid";
        valid = false;
    }
    let timePattern = /\d{2}:\d{2}/;
    if(!timePattern.test(eventDetails.time)) {
        document.getElementById("event_time").className += " is-invalid";
        valid = false;
    }
    if(eventDetails.modality == "In-Person" && eventDetails.location.trim().length == 0) {
        document.getElementById("event_location").className += " is-invalid";
        valid = false;
    }
    let urlPattern = /(https?:\/\/)?(www[A-Za-z0-9]!@#\$%\^&\*)?.\..+/;
    if(eventDetails.modality == "Remote" && !urlPattern.test(eventDetails.url)) {
        document.getElementById("event_remote_url").className += " is-invalid";
        valid = false;
    }
    let attendeesPattern = /^((.(,)?( )?)+)*[^,]$/;
    if(!attendeesPattern.test(eventDetails.attendees.trim())) {
        document.getElementById("event_attendees").className += " is-invalid";
        valid = false;
    }
    return valid;
}

function resetValidity() {
    document.getElementById("event_name").className = "form-control";
    document.getElementById("event_time").className = "form-control";
    document.getElementById("event_location").className = "form-control";
    document.getElementById("event_remote_url").className = "form-control";
    document.getElementById("event_attendees").className = "form-control";
}

function addEventToCalendarUI(eventDetails) {
    let eventCard = createEventCard(eventDetails);
    eventCard.value = eventDetails;
    let calendarDay = document.getElementById(eventDetails.weekday);
    calendarDay.appendChild(eventCard);
}

function createEventCard(eventDetails) {
    let eventElement = document.createElement("div");
    eventElement.classList = "event row border rounded m-1 py-1";
    let info = document.createElement("div");
    info.innerHTML = `<b>Event Name:</b><br>
    ${eventDetails.name}<br>
    <b>Event Time:</b><br>
    ${eventDetails.time}<br>
    <b>Event Modality:</b><br>
    ${eventDetails.modality}<br>`;
    if(eventDetails.modality == "In-Person") {
        info.innerHTML += `<b>Event Location:</b><br>
        ${eventDetails.location}<br>`;
    } else {
        info.innerHTML += `<b>Remote URL:</b><br>
        ${eventDetails.url}<br>`;
    }
    info.innerHTML += `<b>Attendees:</b><br>
    ${eventDetails.attendees}<br>`;
    eventElement.appendChild(info);
    eventElement.setAttribute("onclick","editEvent(this);");
    eventElement.style.backgroundColor = categoryColors[eventDetails.category];
    return eventElement;
}

function editEvent(eventCard) {
    text = eventCard.innerHTML;
    modalElement = document.getElementById("event_modal");
    const modal = new bootstrap.Modal(modalElement);
    let eventDetails = eventCard.value;
    document.getElementById("event_name").value = eventDetails.name;
    document.getElementById("event_time").value = eventDetails.time;
    document.getElementById("event_weekday").value = eventDetails.weekday;
    document.getElementById("event_modality").value = eventDetails.modality;
    document.getElementById("event_remote_url").value = eventDetails.url;
    document.getElementById("event_attendees").value = eventDetails.attendees;
    document.getElementById("event_location").value = eventDetails.location;
    document.getElementById("event_category").value = eventDetails.category;
    modal.show();
    edittedEvent = eventCard;
}

function updateEvent(eventDetails) {
    if(edittedEvent.value.weekday != eventDetails.day) {
        document.getElementById(edittedEvent.value.weekday).removeChild(edittedEvent);
        addEventToCalendarUI(eventDetails);
    }
    edittedEvent.innerHTML = `<b>Event Name:</b>
    \u00A0\u00A0\u00A0${eventDetails.name}
    <b>Event Time:</b>
    \u00A0\u00A0\u00A0${eventDetails.time}
    <b>Event Modality:</b>
    \u00A0\u00A0\u00A0${eventDetails.modality}`;
    if(eventDetails.modality == "In-Person") {
        edittedEvent.innerHTML += `<b>Event Location:</b>
        \u00A0\u00A0\u00A0${eventDetails.location}`;
    } else {
        edittedEvent.innerHTML += `<b>Remote URL:</b>
        \u00A0\u00A0\u00A0${eventDetails.url}`;
    }
    edittedEvent.innerHTML += `<b>Attendees:</b>
    \u00A0\u00A0\u00A0${eventDetails.attendees}`;
    edittedEvent.style.backgroundColor = categoryColors[eventDetails.category];
    edittedEvent.value = eventDetails;
}