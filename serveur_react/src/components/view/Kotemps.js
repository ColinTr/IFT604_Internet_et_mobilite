import React from "react";
import {Calendar, momentLocalizer, Views} from 'react-big-calendar';
import moment from 'moment'
import ApiCalendar from 'react-google-calendar-api/src/ApiCalendar';
import {MDBBtn, MDBCol, MDBContainer, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader, MDBRow} from "mdbreact";
import '../../assets/CustomBigCalendarStyling.css'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import SwalHelper from "../../config/SwalHelper";
import * as $ from "jquery";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

let allViews = Object.keys(Views).map(k => Views[k]);

const ColoredDateCellWrapper = ({children}) =>
    React.cloneElement(React.Children.only(children), {
        style: {
            backgroundColor: 'lightblue',
        }
    });

const DragAndDropCalendar = withDragAndDrop(Calendar);

class Kotemps extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            sign: false,
            eventsCalendar: [],
            eventsGoogle: [],
            modal: false,
            summary: "",
            location: "",
            description: "",
            start: moment().toDate(),
            end: moment().toDate(),
            attendees: "",
            idEventToEdit: null,
            displayDragItemInCell: true,
            draggedEvent: null
        };

        ApiCalendar.setCalendar('primary');

        this.createOrUpdateEvent = this.createOrUpdateEvent.bind(this);
        this.setStartDate = this.setStartDate.bind(this);
        this.setEndDate = this.setEndDate.bind(this);
        this.moveEvent = this.moveEvent.bind(this);
        this.refreshCalendarEvents = this.refreshCalendarEvents.bind(this);
        this.btnClickDeleteEvent = this.btnClickDeleteEvent.bind(this);
        this.modifyDateEvent = this.modifyDateEvent.bind(this);
        this.toggle = this.toggle.bind(this);

        this.handleItemClick = this.handleItemClick.bind(this);

        this.signUpdate = this.signUpdate.bind(this);
        ApiCalendar.onLoad(() => {
            ApiCalendar.listenSign(this.signUpdate);
            this.refreshCalendarEvents();
        });
    };

    handleItemClick(event, name) {
        if (name === 'sign-in') {
            ApiCalendar.handleAuthClick();
        } else if (name === 'sign-out') {
            ApiCalendar.handleSignoutClick();
        }
    }

    signUpdate(sign) {
        if (sign) {
            this.setState({
                sign: sign
            });
            this.refreshCalendarEvents();
            SwalHelper.createSmallSuccessPopUp("Connexion réussie");
        } else {
            this.setState({
                sign: sign,
                eventsCalendar: [],
                eventsGoogle: []
            });
            SwalHelper.createSmallSuccessPopUp("Déconnexion réussie");
        }
    }

    handleDragStart(event) {
        this.setState({draggedEvent: event})
    };

    dragFromOutsideItem = () => {
        return this.state.draggedEvent
    };

    onDropFromOutside(start, end) {
        const {draggedEvent} = this.state;
        const event = {
            id: draggedEvent.id,
            title: draggedEvent.title,
            start: start,
            end: end,
        };

        this.setState({draggedEvent: null});
        this.moveEvent({event, start, end});
    };


    moveEvent(bigCalendarEvent) {
        this.modifyDateEvent(bigCalendarEvent);
    };

    handleChangeNewEvent = (event) => {
        const {name, value} = event.target;
        this.setState({
            [name]: value,
        });
    };

    onSelectEvent(event) {
        let that = this;
        that.toggle(event);

        let obj = this.findGoogleEvent(event.id);

        // On parse la liste des emails afin de l'afficher dans le champ attendees :
        let attendees = "";
        for (let i = 0; i < obj.attendees.length; i++) {
            attendees = attendees + obj.attendees[i].email + ", "
        }
        // On enlève la dernière virgule et l'espace
        if (attendees.length > 0) {
            attendees = attendees.substring(0, attendees.length - 2);
        }

        that.setState({
            idEventToEdit: event.id,
            summary: obj.summary,
            location: obj.location,
            description: obj.description,
            attendees: attendees,
        });
    }

    toggle(event) {
        this.setState({
            modal: !this.state.modal,
            idEventToEdit: null,
            summary: "",
            location: "",
            description: "",
            attendees: "",
            start: event === undefined ? moment().toDate() : event.start,
            end: event === undefined ? moment().toDate() : event.end
        });
    };

    refreshCalendarEvents() {
        let that = this;
        if (ApiCalendar.sign) {
            ApiCalendar.listUpcomingEvents(999)
                .then(result => {
                    let googleEventsList = [];
                    let calendarEventsList = [];
                    result.result.items.map(function (upcomingEvent) {
                        googleEventsList.push(upcomingEvent);
                        let event = {
                            id: upcomingEvent.id,
                            title: upcomingEvent.summary,
                            start: moment(upcomingEvent.start.dateTime).toDate(),
                            end: moment(upcomingEvent.end.dateTime).toDate(),
                        };
                        calendarEventsList.push(event);
                        return null;
                    });
                    that.setState({eventsCalendar: calendarEventsList, eventsGoogle: googleEventsList});
                });
        } else {
            SwalHelper.createNoConnectionSmallPopUp("Connectez vous pour utiliser le calendrier", 5000);
        }
    };

    btnClickDeleteEvent() {
        this.toggle(undefined);
        this.deleteEvent(this.state.idEventToEdit)
            .then(() => {
                this.refreshCalendarEvents();
            });
    }

    deleteEvent(eventId) {
        return new Promise(((resolve, reject) => {
            $.ajax({
                url: "https://www.googleapis.com/calendar/v3/calendars/" + ApiCalendar.calendar + "/events/" + eventId,
                type: "DELETE",
                headers: {"authorization": "Bearer " + ApiCalendar.gapi.auth.getToken().access_token},
                success: (response) => {
                    resolve(response);
                },
                error: message => {
                    reject(message);
                }
            });
        }));
    }

    updateEvent(eventId, newEvent) {
        return new Promise(((resolve, reject) => {
            $.ajax({
                url: "https://www.googleapis.com/calendar/v3/calendars/" + ApiCalendar.calendar + "/events/" + eventId,
                type: "PUT",
                contentType: 'application/json',
                data: JSON.stringify(newEvent),
                headers: {"authorization": "Bearer " + ApiCalendar.gapi.auth.getToken().access_token},
                success: (response) => {
                    resolve(response);
                },
                error: message => {
                    reject(message);
                }
            });
        }));
    }

    createOrUpdateEvent() {
        // On ajoute 23h à la création pour que l'évènement s'étale sur toute la journée (inutile lors de la modification)
        let endDateTime = this.state.idEventToEdit === null ? moment(this.state.end).add(23, 'hours').toDate() : this.state.end;
        let eventCalendar;
        let attendees = this.state.attendees.replaceAll(' ', '').split(',');
        let emails = [];
        attendees.forEach(element => {
            if (element.length > 0) {
                emails.push({email: element})
            }
        });
        if (emails.length === 0) {
            emails.push({email: localStorage['email'].replaceAll('"', '')});
        }

        const eventGoogle = {
            id: '',
            summary: this.state.summary === "" ? '∅' : this.state.summary,
            location: this.state.location,
            description: this.state.description,
            attendees: emails,
            start: {dateTime: this.state.start},
            end: {dateTime: endDateTime},
        };
        eventCalendar = {
            id: '',
            title: this.state.summary === "" ? '∅' : this.state.summary,
            start: this.state.start,
            end: endDateTime,
        };

        if (this.state.idEventToEdit !== null) {
            this.updateEvent(this.state.idEventToEdit, eventGoogle)
                .then(() => {
                    this.refreshCalendarEvents();
                })
                .catch(error => {
                    console.log(error);
                    SwalHelper.createNoConnectionSmallPopUp(error.responseJSON.error.message, 5000);
                });
        } else {
            // On attend de récupérer l'id de l'event créé par google pour le set dans nos listes
            ApiCalendar.createEvent(eventGoogle)
                .then(response => {
                    eventGoogle.id = response.result.id;
                    eventCalendar.id = response.result.id;
                    this.setState({
                        eventsGoogle: this.state.eventsGoogle.concat(eventGoogle),
                        eventsCalendar: this.state.eventsCalendar.concat(eventCalendar)
                    });
                    this.refreshCalendarEvents();
                })
                .catch(error => {
                    console.log(error);
                    SwalHelper.createNoConnectionSmallPopUp(error.result.error.message, 5000);
                });
        }

        this.toggle(eventCalendar);
    };

    findGoogleEvent(eventId) {
        let event = null;
        this.state.eventsGoogle.map(function (ev) {
            if (ev.id === eventId) {
                event = ev;
            }
            return null;
        });
        return event;
    }

    findCalendarEvent(eventId) {
        let event = null;
        this.state.eventsCalendar.map(function (ev) {
            if (ev.id === eventId) {
                event = ev;
            }
            return null;
        });
        return event;
    }

    modifyDateEvent(event) {
        let eventGoogle = this.findGoogleEvent(event.event.id);

        const newEventGoogle = {
            id: '',
            summary: eventGoogle.summary,
            location: eventGoogle.location,
            description: eventGoogle.description,
            attendees: eventGoogle.attendees,
            start: {dateTime: event.start},
            end: {dateTime: event.end},
        };

        let eventCalendar = this.findCalendarEvent(event.event.id);
        eventCalendar.start = {dateTime: event.start};
        eventCalendar.end = {dateTime: event.end};

        this.updateEvent(event.event.id, newEventGoogle)
            .then(() => {
                this.refreshCalendarEvents();
            })
            .catch(error => {
                console.log(error);
                SwalHelper.createNoConnectionSmallPopUp(error.responseJSON.error.message, 5000);
            });
    };

    setStartDate(date) {
        this.setState({start: date});
    }

    setEndDate(date) {
        this.setState({end: date});
    }

    render() {
        let that = this;
        const localizer = momentLocalizer(moment);
        return (
            <div>
                <MDBModal isOpen={that.state.modal} toggle={that.toggle}>
                    <MDBModalHeader toggle={that.toggle}>
                        {that.state.idEventToEdit === null ? "Ajouter un nouvel évènement" : "Modifier un évènement"}
                    </MDBModalHeader>
                    <MDBModalBody>
                        <h5>Intitulé</h5>
                        <input
                            type="text"
                            className="form-control"
                            value={this.state.summary || ''}
                            onChange={this.handleChangeNewEvent}
                            name="summary"
                            placeholder="Intitulé de l'évènement"
                        />
                        <br/>
                        <MDBContainer fluid style={{padding: 0}}>
                            <MDBRow>
                                <MDBCol>
                                    <h5>Début</h5>
                                    <DatePicker
                                        onChange={date => this.setStartDate(date)}
                                        selected={this.state.start}
                                        dateFormat='dd/MM/yyyy'
                                        name="start"/>
                                </MDBCol>
                                <MDBCol>
                                    <h5>Fin</h5>
                                    <DatePicker
                                        onChange={date => this.setEndDate(date)}
                                        selected={this.state.end}
                                        dateFormat='dd/MM/yyyy'
                                        name="end"/>
                                </MDBCol>
                            </MDBRow>
                        </MDBContainer>
                        <br/>
                        <h5>Lieu</h5>
                        <input
                            type="text"
                            className="form-control"
                            value={this.state.location || ''}
                            onChange={this.handleChangeNewEvent}
                            name="location"
                            placeholder="Lieu de l'évènement"
                        />
                        <br/>
                        <h5>Description</h5>
                        <input
                            type="text"
                            className="form-control"
                            value={this.state.description || ''}
                            onChange={this.handleChangeNewEvent}
                            name="description"
                            placeholder="Description de l'évènement"
                        />
                        <br/>
                        <h5>Emails des participants</h5>
                        <input
                            type="text"
                            className="form-control"
                            value={this.state.attendees || ''}
                            onChange={this.handleChangeNewEvent}
                            name="attendees"
                            placeholder="Emails (separés par une ',')"
                        />
                    </MDBModalBody>
                    <MDBModalFooter>
                        {that.state.idEventToEdit &&
                        <MDBBtn color="danger" onClick={that.btnClickDeleteEvent}>
                            Supprimer
                        </MDBBtn>
                        }
                        <MDBBtn color="secondary" onClick={that.toggle}>
                            Annuler
                        </MDBBtn>
                        <MDBBtn color="primary" onClick={that.createOrUpdateEvent}>
                            {that.state.idEventToEdit === null ? "Ajouter" : "Modifier"}
                        </MDBBtn>
                    </MDBModalFooter>
                </MDBModal>
                <div className="rbc-calendar">
                    {!ApiCalendar.sign &&
                    <MDBContainer className="container-fluid mt-5">
                        <MDBCol>
                            <MDBRow className="justify-content-center">
                                <MDBBtn outline color="info" onClick={(e) => this.handleItemClick(e, 'sign-in')}>
                                    Se connecter avec Google
                                </MDBBtn>
                            </MDBRow>
                        </MDBCol>
                    </MDBContainer>
                    }
                    {ApiCalendar.sign &&
                    <DragAndDropCalendar
                        localizer={localizer}
                        selectable
                        popup
                        events={that.state.eventsCalendar}
                        views={allViews}
                        step={60}
                        showMultiDayTimes
                        defaultView={Views.MONTH}
                        defaultDate={new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate())}
                        components={{
                            timeSlotWrapper: ColoredDateCellWrapper,
                        }}
                        onEventDrop={bigCalendarEvent => this.moveEvent(bigCalendarEvent)}
                        resizable
                        onSelectSlot={event => this.toggle(event)}
                        onSelectEvent={event => this.onSelectEvent(event)}
                        dragFromOutsideItem={
                            this.state.displayDragItemInCell ? this.dragFromOutsideItem : null
                        }
                        onDropFromOutside={event => this.onDropFromOutside(event.start, event.end)}
                        handleDragStart={event => this.handleDragStart(event)}
                    />
                    }

                </div>
                {ApiCalendar.sign &&
                <MDBBtn outline color="info" onClick={(e) => this.handleItemClick(e, 'sign-out')}>
                    Se déconnecter
                </MDBBtn>
                }
            </div>
        );
    }
}

export default Kotemps;
