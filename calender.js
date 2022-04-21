const {google} = require('googleapis');
require('dotenv').config();


// Provide the required configuration
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
const calendarId = process.env.CALENDAR_ID;

// Google Calendar API Settings
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({version: 'v3'});

// Timeoffset
const TIMEOFFSET = '+01:00';

const auth = new google.auth.JWT(
    CREDENTIALS.client_email,
    null,
    CREDENTIALS.private_key,
    SCOPES
);

const dateTimeForCalendar = () => {

    let date = new Date();

    let year = date.getFullYear();
    let month = datePadding(date.getMonth() + 1);
    let day = datePadding(date.getDate());
    let hour = datePadding(date.getHours());
    let minute = datePadding(date.getMinutes());

    let newDateTime = `${year}-${month}-${day}T${hour}:${minute}:00.000${TIMEOFFSET}`

    let startDate = new Date(Date.parse(newDateTime));

    let endDate = new Date(new Date(startDate).setHours(startDate.getHours()+3));

    return {
        'start': startDate,
        'end': endDate
    }
};

function datePadding(value){
    if (value < 10)  return `0${value}`;
    return value
}

function getNextSaturdaysDates(days) {

    let nextSaturdays = [];

    for(i=1; i < days; i++){

        var day = new Date(new Date().setDate(new Date().getDate() + i));

        if (day.getDay() == 6){
            nextSaturdays.push(day);
        }
    }
    console.log(nextSaturdays);
    return nextSaturdays;
}

const insertEvent = async (event) => {

    try {
        console.log("Requesting response")
        let response = await calendar.events.insert({
            auth: auth,
            calendarId: calendarId,
            resource: event
        });
        console.log("Got response")
        if (response['status'] == 200 && response['statusText'] === 'OK') {
            return 1;
        } else {
            return 0;
        }
    } catch (error) {
        console.log(`Error at insertEvent --> ${error}`);
        return 0;
    }
};

const getEvents = async (dateTimeStart, dateTimeEnd) => {

    calendar.events.list({
        auth: auth,
        calendarId: calendarId,
        timeMin: dateTimeStart,
        timeMax: dateTimeEnd,
    }).then( (response) => {
        console.log(response['data']['items']);
        return response['data']['items'];
    }).catch( error =>{
        console.log(`ERROR: Located at 'getEvents ---> ${error}'`);
        return -1;
    });
};


let dateTime = dateTimeForCalendar();

// Event for Google Calendar
let event = {
    'summary': `This is the summary.`,
    'description': `This is the description.`,
    'start': {
        'dateTime': dateTime['start'],
        'timeZone': 'Asia/Kolkata'
    },
    'end': {
        'dateTime': dateTime['end'],
        'timeZone': 'Asia/Kolkata'
    }
};

getNextSaturdaysDates(365);
