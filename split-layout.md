---
template: './@theme/Templates/SideBySide.tsx'
seo:
  title: Step-by-step guide to special museum events.
  description: Learn how to find, purchase, and retrieve QR code for entry to special events at the museum using the API.
  image: ./images/image.png
---

# Museum Special Event Ticket Guide

This guide walks you through finding a special event at the Redocly Museum, purchasing a ticket, and getting your digital ticket with QR code for entry.

## Step 1: Find Available Special Events

{% split %}

To find available special events at the museum, send a GET request to the `/special-events` endpoint.

You can optionally filter events by date range using the `startDate` and `endDate` query parameters.

---

```javascript
// List all upcoming special events
fetch('https://redocly.com/_mock/docs/openapi/museum-api/special-events', {
  method: 'GET',
  headers: {
    Accept: 'application/json',
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

Response example:

```json
[
  {
    "eventId": "3be6453c-03eb-4357-ae5a-984a0e574a54",
    "name": "Pirate Coding Workshop",
    "location": "Computer Room",
    "eventDescription": "Captain Blackbeard shares his love of the C...language. And possibly Arrrrr (R lang).",
    "dates": ["2023-10-29", "2023-10-30", "2023-10-31"],
    "price": 45
  }
  // Additional events...
]
```

{% /split %}

## Step 2: Get Event Details

{% split %}

Once you've found an event that interests you, you can get more details by sending a GET request to the `/special-events/{eventId}` endpoint with the specific event ID.

This will return comprehensive information about the event, including available dates, price, location, and description.

---

```javascript
// Get details for a specific event
const eventId = '3be6453c-03eb-4357-ae5a-984a0e574a54';

fetch(`https://redocly.com/_mock/docs/openapi/museum-api/special-events/${eventId}`, {
  method: 'GET',
  headers: {
    Accept: 'application/json',
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

Response example:

```json
{
  "eventId": "3be6453c-03eb-4357-ae5a-984a0e574a54",
  "name": "Pirate Coding Workshop",
  "location": "Computer Room",
  "eventDescription": "Captain Blackbeard shares his love of the C...language. And possibly Arrrrr (R lang).",
  "dates": ["2023-10-29", "2023-10-30", "2023-10-31"],
  "price": 45
}
```

{% /split %}

## Step 3: Buy Event Tickets

{% split %}

To purchase tickets for the event, send a POST request to the `/tickets` endpoint with information about the ticket you want to buy.

You'll need to specify:

- The ticket type (`event`)
- The event ID for the special event
- The date you want to attend
- Your email address for confirmation

---

```javascript
// Buy tickets for a special event
fetch('https://redocly.com/_mock/docs/openapi/museum-api/tickets', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  body: JSON.stringify({
    ticketType: 'event',
    eventId: '3be6453c-03eb-4357-ae5a-984a0e574a54',
    ticketDate: '2023-10-29',
    email: 'your-email@example.com',
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

Response example:

```json
{
  "message": "Museum special event ticket purchased",
  "ticketId": "b811f723-17b2-44f7-8952-24b03e43d8a9",
  "eventName": "Pirate Coding Workshop",
  "ticketType": "event",
  "ticketDate": "2023-10-29",
  "confirmationCode": "ticket-event-9c55eg-8v82a"
}
```

{% /split %}

## Step 4: Get Digital Ticket with QR Code

{% split %}

After purchasing your ticket, you can get a digital version with a QR code that's compatible with Apple Wallet and Google Pay.

To get the digital ticket, send a GET request to the `/tickets/{ticketId}/pkpass` endpoint with the ticket ID you received from your purchase.

This will return a binary file containing your digital ticket that can be saved and used for entry to the event.

---

```javascript
// Get digital ticket with QR code
const ticketId = 'b811f723-17b2-44f7-8952-24b03e43d8a9';

fetch(`https://redocly.com/_mock/docs/openapi/museum-api/tickets/${ticketId}/pkpass`, {
  method: 'GET',
  headers: {
    Accept: 'application/vnd.apple.pkpass',
  },
})
  .then((response) => response.blob())
  .then((blob) => {
    // Create a link to download the pkpass file
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'museum-ticket.pkpass';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  });
```

The response will be a binary file containing your digital ticket with a QR code. This can be added to your Apple Wallet or Google Pay.

{% /split %}
