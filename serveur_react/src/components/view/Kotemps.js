import React from "react";
import {Calendar,momentLocalizer, Views} from 'react-big-calendar';
import moment from 'moment'
import ApiCalendar from 'react-google-calendar-api';
import {MDBBtn, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader} from "mdbreact";
import 'react-big-calendar/lib/css/react-big-calendar.css'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'

let allViews = Object.keys(Views).map(k => Views[k]);

const ColoredDateCellWrapper = ({ children }) =>
    React.cloneElement(React.Children.only(children), {
        style: {
            backgroundColor: 'lightblue',
        }
    });

const DragAndDropCalendar = withDragAndDrop(Calendar)

class Kotemps extends React.Component {

    constructor(props){
        super(props);

        this.state = {
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

        ApiCalendar.handleAuthClick();
        ApiCalendar.setCalendar('primary');

        this.getItem();

        this.createOrUpdateEvent = this.createOrUpdateEvent.bind(this);
        this.moveEvent = this.moveEvent.bind(this);
        this.getItem = this.getItem.bind(this)
        this.modifyDateEvent = this.modifyDateEvent.bind(this);
        this.toggle = this.toggle.bind(this);
    };

    handleDragStart(event){
        this.setState({ draggedEvent: event})
    };

    dragFromOutsideItem = () => {
        return this.state.draggedEvent
    };

    onDropFromOutside(start, end){
        const { draggedEvent } = this.state;

        const event = {
            id: draggedEvent.id,
            title: draggedEvent.title,
            start,
            end,
        };

        this.setState({ draggedEvent : null});
        this.moveEvent({ event, start, end});
    };


    moveEvent(event, start, end){
        const {events} = this.state;
        this.modifyDateEvent(event);

        const nextEvents = events.map(existingEvent => {
            return existingEvent.id === event.id
                ? { ...existingEvent, start, end}
                : existingEvent
        });

        this.setState({
            events: nextEvents,
        })
    };

    resizeEvent(event, start, end){
        const {events} = this.state;
        this.modifyDateEvent(event);

        const nextEvents = events.map(existingEvent => {
            return existingEvent.id === event.id
                ? { ...existingEvent, start, end}
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
            attendees.forEach(element => emails.concat({email : element}));
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
        console.log(event.id);
        let that = this;
        that.toggle(event);
        let obj = JSON.parse(this.state.eventsGoogle[event.id]);
        that.setState({
            idEventToEdit: event.id,
            summary: obj.summary,
            location: obj.location,
            description: obj.description,
            attendees: obj.attendees,
        });
    }

    toggle (event){
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

    getItem(){
        let Ids = 0;
        if (ApiCalendar.sign){
            ApiCalendar.listUpcomingEvents(null)
                .then(({result}: any) => {
                   this.state.setState({eventsGoogle :this.state.eventsGoogle.concat(result)});
                   let ev = JSON.parse(result);
                   let event = {
                       id: Ids,
                       title: ev.summary,
                       start: Date.parse(ev.start.dateTime),
                       end: Date.parse(ev.end.dateTime),
                   };
                   this.state.setState({eventsCalendar : this.state.eventsCalendar.concat(event)});
                   Ids = Ids + 1;
                });
        }
    };

    createOrUpdateEvent() {

        let eventCalendar;
        let attendees = this.state.attendees.split(',');
        let emails = [];
        attendees.forEach(element => emails.concat({email : element}));

        if (this.state.idEventToEdit !== null) {
            const eventGoogle = {
                id: this.state.eventsGoogle[this.state.idEventToEdit].id,
                summary : this.state.summary,
                location : this.state.location,
                description : this.state.description,
                attendees : emails,
                start : {dateTime : this.state.start},
                end : {dateTime : this.state.end},
            };
            eventCalendar = {
                id: this.state.idEventToEdit,
                title: this.state.summary,
                start: this.state.start,
                end: this.state.end,
            };

            let ev1 = this.state.eventsCalendar;
            ev1[this.state.idEventToEdit] = eventCalendar;
            this.state.setState({eventsCalendar : ev1});
            let ev2 = this.state.eventGoogle;
            ev2[this.state.idEventToEdit] = eventGoogle;
            this.state.setState({eventsGoogle : ev2});

            ApiCalendar.updateEvent(eventGoogle, eventGoogle.id);
        } else {
            let newId;
            if(this.state.eventsCalendar.length > 0){
                let idList = this.state.eventsCalendar.map(a => a.id);
                newId = Math.max(...idList) + 1;
            }
            else {
                newId = 0;
            }


            const eventGoogle = {
                summary : this.state.summary,
                location : this.state.location,
                description : this.state.description,
                attendees : emails,
                start : {dateTime : this.state.start},
                end : {dateTime : this.state.end},
            };
            eventCalendar = {
                id: newId,
                title: this.state.summary,
                start: this.state.start,
                end: this.state.end,
            };

            let ev1 = this.state.eventsCalendar;
            ev1 = ev1.concat(eventCalendar)
            this.state.setState({eventsCalendar : ev1});
            let ev2 = this.state.eventGoogle;
            ev2 = ev2.concat(eventGoogle);
            this.state.setState({eventsGoogle : ev2});

            ApiCalendar.createEvent(eventCalendar);
        }

        this.getItem();
        this.toggle(eventCalendar);
    };

    modifyDateEvent(event){
        let eventGoogle = this.state.eventsGoogle[event.id];
        eventGoogle.start = {dateTime : event.start};
        eventGoogle.end = {dateTime : event.end};

        let eventCalendar = this.state.eventsCalendar[event.id];
        eventCalendar.start = {dateTime : event.start};
        eventCalendar.end = {dateTime : event.end};

        let ev1 = this.state.eventsCalendar;
        ev1[event.id] = eventCalendar;
        this.state.setState({eventsCalendar : ev1});
        let ev2 = this.state.eventGoogle;
        ev2[event.id] = eventGoogle;
        this.state.setState({eventsGoogle : ev2});

        ApiCalendar.updateEvent(eventGoogle, eventGoogle.id);
    };

    render() {
        const localizer = this.props;
        let that = this;
        return (
            <>
                <MDBModal isOpen={that.state.modal} toggle={that.toggle}>
                    <MDBModalHeader toggle={that.toggle}>
                        {that.state.idEventToEdit===null ? "Ajouter un nouvel Event" : "Modifier un Event"}
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
                        <MDBBtn color="secondary" onClick={that.toggle}>
                            Annuler
                        </MDBBtn>
                        <MDBBtn color="primary" onClick={that.createOrUpdateEvent}>
                            {that.state.idEventToEdit===null ? "Ajouter" : "Modifier"}
                        </MDBBtn>
                    </MDBModalFooter>
                </MDBModal>
                <div className="rbc-calendar">
                    <DragAndDropCalendar
                        localizer={momentLocalizer(moment)}
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
            </>
        );
    }
}

export default Kotemps;
