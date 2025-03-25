# Redocly Museum API - Getting Started Guide

## Introduction

Welcome to the Redocly Museum API! This guide will help you get started with using our API to interact with museum services, focusing on ticket purchases and management.

## Authentication

The API uses Basic Authentication. Include your API credentials with each request:

```bash
curl -u username:password https://redocly.com/_mock/docs/openapi/museum-api/tickets
```

## Purchasing Tickets

### General Admission Tickets

To purchase general admission tickets, send a POST request to the `/tickets` endpoint:

```bash
curl -X POST https://redocly.com/_mock/docs/openapi/museum-api/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "ticketType": "general",
    "ticketDate": "2023-09-07",
    "email": "visitor@example.com"
  }'
```

**Example Response:**

```json
{
  "message": "Museum general entry ticket purchased",
  "ticketId": "382c0820-0530-4f4b-99af-13811ad0f17a",
  "ticketType": "general",
  "ticketDate": "2023-09-07",
  "confirmationCode": "ticket-general-e5e5c6-dce78"
}
```

### Special Event Tickets

To purchase tickets for a special event, you'll need the event's ID. You can get this by querying the `/special-events` endpoint.

```bash
curl -X POST https://redocly.com/_mock/docs/openapi/museum-api/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "ticketType": "event",
    "eventId": "dad4bce8-f5cb-4078-a211-995864315e39",
    "ticketDate": "2023-09-05",
    "email": "visitor@example.com"
  }'
```

**Example Response:**

```json
{
  "message": "Museum special event ticket purchased",
  "ticketId": "b811f723-17b2-44f7-8952-24b03e43d8a9",
  "eventName": "Mermaid Treasure Identification and Analysis",
  "ticketType": "event",
  "ticketDate": "2023-09-05",
  "confirmationCode": "ticket-event-9c55eg-8v82a"
}
```

## Retrieving Ticket QR Codes

After purchasing a ticket, you can retrieve a QR code image for entry:

```bash
curl https://redocly.com/_mock/docs/openapi/museum-api/tickets/b811f723-17b2-44f7-8952-24b03e43d8a9/qr \
  -o ticket_qr.png
```

This will download a PNG image with the scannable QR code for museum entry.

## Finding Special Events

Before purchasing event tickets, you may want to browse available events:

```bash
curl https://redocly.com/_mock/docs/openapi/museum-api/special-events
```

You can filter events by date range:

```bash
curl https://redocly.com/_mock/docs/openapi/museum-api/special-events?startDate=2023-10-01&endDate=2023-10-31
```

## Best Practices

1. Always store the `ticketId` and `confirmationCode` returned from ticket purchases
2. Check museum hours before planning your visit using the `/museum-hours` endpoint
3. Events may have limited capacity, so purchase tickets early
4. Download the QR code before your visit for quicker entry

## Need Help?

Contact the API team at team@redocly.com or visit our documentation at https://redocly.com/docs/cli/ for more information. 