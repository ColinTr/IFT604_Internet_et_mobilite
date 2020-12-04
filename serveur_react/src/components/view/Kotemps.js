import React from "react";
import {Calendar, momentLocalizer, Views} from 'react-big-calendar';
import moment from 'moment'
import ApiCalendar from 'react-google-calendar-api/src/ApiCalendar';
import {MDBBtn, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader} from "mdbreact";
import 'react-big-calendar/lib/css/react-big-calendar.css'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import SwalHelper from "../../config/SwalHelper";
import * as $ from "jquery";

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
            start: new Date(),
            end: new Date(),
            attendees: "",
            idEventToEdit: null,
            displayDragItemInCell: true,
        };

        ApiCalendar.setCalendar('primary');

        this.createOrUpdateEvent = this.createOrUpdateEvent.bind(this);
        this.moveEvent = this.moveEvent.bind(this);
        this.getItem = this.getItem.bind(this);
        this.btnClickDeleteEvent = this.btnClickDeleteEvent.bind(this);
        this.modifyDateEvent = this.modifyDateEvent.bind(this);
        this.toggle = this.toggle.bind(this);

        this.handleItemClick = this.handleItemClick.bind(this);

        this.signUpdate = this.signUpdate.bind(this);
        ApiCalendar.onLoad(() => {
            ApiCalendar.listenSign(this.signUpdate);
            this.getItem();
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
        this.setState({
            sign: sign
        });
        if (sign) {
            this.getItem();
            SwalHelper.createSmallSuccessPopUp("Connexion réussie");
        } else {
            this.setState({
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
            start,
            end,
        };

        this.setState({draggedEvent: null});
        this.moveEvent({event, start, end});
    };


    moveEvent(event, start, end) {
        const {events} = this.state;
        this.modifyDateEvent(event);

        const nextEvents = events.map(existingEvent => {
            return existingEvent.id === event.id
                ? {...existingEvent, start, end}
                : existingEvent
        });

        this.setState({
            events: nextEvents,
        })
    };

    resizeEvent(event, start, end) {
        const {events} = this.state;
        this.modifyDateEvent(event);

        const nextEvents = events.map(existingEvent => {
            return existingEvent.id === event.id
                ? {...existingEvent, start, end}
                : existingEvent
        });

        this.setState({
            events: nextEvents,
        })
    };

    handleChangeNewEvent = (event) => {
        const {name, value} = event.target;
        this.setState({
            [name]: value,
        });
    };

    handleChangeNewEventAttendees = (event) => {
        const {name, value} = event.target;
        try {
            let attendees = value.split(',');
            let emails = [];
            attendees.forEach(element => emails.push({email: element}));
            this.setState({
                [name]: emails,
            });
        } catch (e) {
            this.setState({
                [name]: [{email: value}]
            })
        }
    };

    onSelectEvent(event) {
        let that = this;
        that.toggle(event);

        let obj = this.findGoogleEvent(event.id);

        // On parse la liste des emails afin de l'afficher dans le champ attendees :
        let attendees = "";
        for (let i = 0; i < obj.attendees.length; i++) {
            attendees = attendees + obj.attendees[i].email + ","
        }
        // On enlève la dernière virgule
        if (attendees.length > 0) {
            attendees = attendees.substring(0, attendees.length - 1);
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
            start: event.start,
            end: event.end
        });
    };

    getItem() {
        let that = this;
        if (ApiCalendar.sign) {
            ApiCalendar.listUpcomingEvents(999)
                .then(result => {
                    result.result.items.map(function (upcomingEvent) {
                        if (!that.findGoogleEvent(upcomingEvent)) {
                            that.setState({eventsGoogle: that.state.eventsGoogle.concat(upcomingEvent)});
                        }
                        if (!that.findCalendarEvent(upcomingEvent)) {
                            let event = {
                                id: upcomingEvent.id,
                                title: upcomingEvent.summary,
                                start: Date.parse(upcomingEvent.start.dateTime),
                                end: Date.parse(upcomingEvent.end.dateTime),
                            };
                            that.setState({eventsCalendar: that.state.eventsCalendar.concat(event)});
                        }
                        return null;
                    });

                });
        }
    };

    btnClickDeleteEvent() {
        this.deleteEvent(this.state.idEventToEdit);
        this.setState({ modal: !this.state.modal});
    }

    deleteEvent(eventId) {
        $.ajax({
            url: "https://www.googleapis.com/calendar/v3/calendars/" + ApiCalendar.calendar + "/events/" + eventId,
            type: "DELETE",
            headers: {"authorization": "Bearer " + ApiCalendar.gapi.auth.getToken().access_token},
            success: () => {
                let eventsGoogle = [];
                let eventsCalendar = [];
                this.state.eventsGoogle.map(function (ev) {
                    if (ev.id !== eventId) {
                        eventsGoogle.push(ev);
                    }
                    return null;
                });
                this.state.eventsCalendar.map(function (ev) {
                    if (ev.id !== eventId) {
                        eventsCalendar.push(ev);
                    }
                    return null;
                });
                this.setState({eventsCalendar: eventsCalendar});
                this.setState({eventsGoogle: eventsGoogle});
            },
            error: message => {
                console.log(message);
            }
        });
    }

    createOrUpdateEvent() {
        let eventCalendar;
        let attendees = this.state.attendees.split(',');
        let emails = [];
        attendees.forEach(element => {
            if (element.length > 0) {
                emails.push({email: element})
            }
        });
        if (emails.length === 0) {
            emails.push({email: localStorage['email'].replaceAll('"', '')});
        }

        if (this.state.idEventToEdit !== null) {
            this.deleteEvent(this.state.idEventToEdit);
        }

        const eventGoogle = {
            summary: this.state.summary,
            location: this.state.location,
            description: this.state.description,
            attendees: emails,
            start: {dateTime: this.state.start},
            end: {dateTime: this.state.end},
        };
        eventCalendar = {
            title: this.state.summary,
            start: this.state.start,
            end: this.state.end,
        };

        // On attend de récupérer l'id de l'event créé par google pour le set dans nos listes
        ApiCalendar.createEvent(eventGoogle)
            .then(response => {
                eventGoogle.id = response.result.id;
                eventCalendar.id = response.result.id;
                this.setState({eventsGoogle: this.state.eventsCalendar.concat(eventGoogle)});
                this.setState({eventsCalendar: this.state.eventsCalendar.concat(eventCalendar)});
            })
            .catch(error => {
                console.log(error);
                SwalHelper.createNoConnectionSmallPopUp(error.result.error.message, 5000);
            });

        this.getItem();
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
        console.log(event)
        let eventGoogle = this.findGoogleEvent(event.id);
        eventGoogle.start = {dateTime: event.start};
        eventGoogle.end = {dateTime: event.end};

        let eventCalendar = this.findCalendarEvent(event.id);
        eventCalendar.start = {dateTime: event.start};
        eventCalendar.end = {dateTime: event.end};

        this.deleteEvent(this.state.idEventToEdit);

        ApiCalendar.createEvent(eventGoogle)
            .then(response => {
                eventGoogle.id = response.result.id;
                eventCalendar.id = response.result.id;
                this.setState({eventsGoogle: this.state.eventsCalendar.concat(eventGoogle)});
                this.setState({eventsCalendar: this.state.eventsCalendar.concat(eventCalendar)});
            })
            .catch(error => {
                console.log(error);
                SwalHelper.createNoConnectionSmallPopUp(error.result.error.message, 5000);
            });
    };

    render() {
        let that = this;
        const localizer = momentLocalizer(moment);
        return (
            <div>
                <button onClick={(e) => this.handleItemClick(e, 'sign-in')}>sign-in</button>
                <button onClick={(e) => this.handleItemClick(e, 'sign-out')}>sign-out</button>
                <br/>Signed = {this.state.sign}

                <MDBModal isOpen={that.state.modal} toggle={that.toggle}>
                    <MDBModalHeader toggle={that.toggle}>
                        {that.state.idEventToEdit === null ? "Ajouter un nouvel Event" : "Modifier un Event"}
                    </MDBModalHeader>
                    <MDBModalBody>
                        <input
                            type="text"
                            className="form-control"
                            value={this.state.summary}
                            onChange={this.handleChangeNewEvent}
                            name="summary"
                            placeholder="Name of the Event"
                        />
                        <input
                            type="text"
                            className="form-control"
                            value={this.state.location}
                            onChange={this.handleChangeNewEvent}
                            name="location"
                            placeholder="Location of the event"
                        />
                        <input
                            type="text"
                            className="form-control"
                            value={this.state.description}
                            onChange={this.handleChangeNewEvent}
                            name="description"
                            placeholder="Description of the event"
                        />
                        <input
                            type="text"
                            className="form-control"
                            value={this.state.attendees}
                            onChange={this.handleChangeNewEvent}
                            name="attendees"
                            placeholder="Email of the different attendees of the event (separate with a ',')"
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
                    <DragAndDropCalendar
                        localizer={localizer}
                        selectable
                        popup
                        events={this.state.eventsCalendar}
                        views={allViews}
                        step={60}
                        showMultiDayTimes
                        defaultView={Views.MONTH}
                        defaultDate={new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate())}
                        components={{
                            timeSlotWrapper: ColoredDateCellWrapper,
                        }}
                        onEventDrop={event => this.moveEvent(event, event.start, event.end)}
                        resizable
                        onEventResize={event => this.resizeEvent(event, event.start, event.end)}
                        onSelectSlot={event => this.toggle(event)}
                        onSelectEvent={event => this.onSelectEvent(event)}
                        dragFromOutsideItem={
                            this.state.displayDragItemInCell ? this.dragFromOutsideItem : null
                        }
                        onDropFromOutside={event => this.onDropFromOutside(event.start, event.end)}
                        handleDragStart={event => this.handleDragStart(event)}
                    />
                </div>
            </div>
        );
    }
}

export default Kotemps;
