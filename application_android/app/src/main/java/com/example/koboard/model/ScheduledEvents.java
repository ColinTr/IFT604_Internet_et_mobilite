package com.example.koboard.model;

public class ScheduledEvents {
    private String eventId;
    private String eventSummery;
    private String description;
    private String attendees;
    private String location;

    private String startDate;
    private String endDate;

    public ScheduledEvents(String eventSummery, String description, String attendees, String location, String startDate, String endDate) {
        this.eventSummery = eventSummery;
        this.description = description;
        this.attendees = attendees;
        this.location = location;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public ScheduledEvents() {
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getEventId() {
        return eventId;
    }

    public void setEventId(String eventId) {
        this.eventId = eventId;
    }

    public String getEventSummery() {
        return eventSummery;
    }

    public void setEventSummery(String eventSummery) {
        this.eventSummery = eventSummery;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAttendees() {
        return attendees;
    }

    public void setAttendees(String attendees) {
        this.attendees = attendees;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }
}
