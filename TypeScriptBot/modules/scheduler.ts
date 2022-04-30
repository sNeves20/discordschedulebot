import {google} from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

// Provide the required configuration
const json = process.env.CREDENTIALS
var CREDENTIALS = null;
if(json){
    CREDENTIALS = JSON.parse(json);
} else {
    throw new Error(`Invalid configuration, check your configuration `)
}
const calendarId = process.env.CALENDAR_ID;

// Google Calendar API Settings
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({version: 'v3'});

// Timeoffset
const TIMEOFFSET = '+01:00';

const auth = new google.auth.JWT(
    CREDENTIALS.client_email,
    undefined,
    CREDENTIALS.private_key,
    SCOPES
);

function datePadding(value: number){
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

export enum weekDays {
    "MONDAY" = 1,
    "TUESDAY" = 2,
    "WEDNESDAY" = 3,
    "THURSDAY" = 4,
    "FRIDAY" = 5,
    "SATURDAY" = 6,
    "SUNDAY" = 7
}


async function createEvent (appointmentInfo: any){
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
}

export async function insertEvent (event: any){
    try {
        console.log("Requesting response")
        let response = await calendar.events.insert({
            auth: auth,
            calendarId: calendarId,
            requestBody: event
        })
        if (response['status'] == 200 && response['statusText'] === 'OK') {
            return 1;
        } else {
            return 0;
        }
    } catch (error) {
        console.log(`Error at insertEvent --> ${error}`);
        return 0;
    }
}

export async function getEvents (dateTimeStart: string, dateTimeEnd: string) {
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
}

export  async function getNextAvailableDates (scheduledDay: any, dayTimeFrame: any){

    let nextAvailableDays = [];
    for(let i=1; i < dayTimeFrame; i++){

        var day = new Date(new Date().setDate(new Date().getDate() + i));

        
        if (day.getDay() == parseInt(weekDays[scheduledDay])){
            nextAvailableDays.push(`${datePadding(day.getDate())}-${datePadding(day.getMonth()+1)}-${day.getFullYear()}`);
        }
    }

    return nextAvailableDays;
}

function dateTimeForCalendar (year: any, month: any, day: any, hour: any, minute: any, timeAmountHours: any){

    let newDateTime = `${year}-${month}-${day}T${hour}:${minute}:00.000${TIMEOFFSET}`

    let startDate = new Date(Date.parse(newDateTime));

    let endDate = new Date(new Date(startDate).setHours(startDate.getHours()+ timeAmountHours));

    return {
        'start': startDate,
        'end': endDate
    }
}
