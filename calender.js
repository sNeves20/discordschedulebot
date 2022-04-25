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

function datePadding(value){
    if (value < 10)  return `0${value}`;
    return value
}

// these are predefined variables for the events
const eventData = {
    "year": "2022",
    "month": "04",
    "day": "23",
    "hour": "15",
    "minute": "00",
    "summary": "DnD Campaign",
    "description": "Campagin featuring 6 dumb people doing dumb stuff",
    "eventDuration": 3
};
const searchDays = 30;

const weekDays = {
    "MONDAY": 1,
    "TUESDAY": 2,
    "WEDNESDAY": 3,
    "THURSDAY": 4,
    "FRIDAY": 5,
    "SATURDAY": 6,
    "SUNDAY": 7
}

module.exports = {

    createEvent: async function (appointmentInfo){
            // Setting event date and time
        let Year = appointmentInfo.year;
        let Month = appointmentInfo.month;
        let Day = appointmentInfo.day;
        let Hour = appointmentInfo.hour;
        let Minute = appointmentInfo.minute;
        let Duration = appointmentInfo.eventDuration;
        let eventSummary = appointmentInfo.summary;
        let eventDescription = appointmentInfo.description;
        

        let dateTime = dateTimeForCalendar(Year, Month, Day, Hour, Minute, Duration);
        console.log(dateTime);
        return {
            'summary': eventSummary,
            'description': eventDescription,
            'start': {
                'dateTime': dateTime['start']
            },
            'end': {
                'dateTime': dateTime['end']
            }
        }
    },

    insertEvent: async function (event){
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
    },

    createEvent: async function (dateTimeStart, dateTimeEnd) {
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
    },

    getNextAvailableDates: async function (scheduledDay, dayTimeFrame){
        let nextAvailableDays = [];
        for(i=1; i < dayTimeFrame; i++){

            var day = new Date(new Date().setDate(new Date().getDate() + i));

            if (day.getDay() == scheduledDay){
                nextAvailableDays.push(`${day.getFullYear()}-${datePadding(day.getMonth()+1)}-${datePadding(day.getDate())}`);
            }
        }
        return nextAvailableDays;
    },

    dateTimeForCalendar: function (year, month, day, hour, minute, timeAmountHours){
        let newDateTime = `${year}-${month}-${day}T${hour}:${minute}:00.000${TIMEOFFSET}`

        let startDate = new Date(Date.parse(newDateTime));
    
        let endDate = new Date(new Date(startDate).setHours(startDate.getHours()+ timeAmountHours));

        return {
            'start': startDate,
            'end': endDate
        }
    },

    weekDays,
}