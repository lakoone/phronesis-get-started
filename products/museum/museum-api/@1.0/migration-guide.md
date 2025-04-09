# Digital Wallet Migration Guide for Developers

This technical guide provides a comprehensive walkthrough for transitioning the Redocly Museum API from QR code ticketing to a digital wallet-based system. This document is intended for developers implementing these changes.

## Overview of Changes

The current system uses QR code images (`/tickets/{ticketId}/qr`) for ticket validation. The new digital wallet system will:

1. Generate wallet pass files (`.pkpass` for Apple, `.gpay` for Google)
2. Allow users to add tickets directly to their smartphone wallets
3. Support dynamic updates to existing wallet tickets

## API Endpoint Changes

### New Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/tickets/{ticketId}/wallet` | GET | Retrieve a digital wallet pass file |
| `/tickets/{ticketId}/wallet/{walletType}` | GET | Retrieve a wallet pass file for a specific platform (apple, google, etc.) |
| `/tickets/update/{confirmationCode}` | POST | Update an existing wallet ticket with new information |

### Modified Endpoints

| Endpoint | Method | Changes |
|----------|--------|---------|
| `/tickets` | POST | Response will include wallet pass URLs in addition to existing fields |

### Deprecated Endpoints

| Endpoint | Method | Replacement |
|----------|--------|-------------|
| `/tickets/{ticketId}/qr` | GET | `/tickets/{ticketId}/wallet` |

## Schema Changes

### New Schemas

```yaml
WalletTicket:
  type: object
  properties:
    ticketId:
      $ref: "#/components/schemas/TicketId"
    walletPassUrl:
      type: string
      format: uri
      description: URL to download the wallet pass file
      example: "https://redocly.com/api/tickets/a54a57ca/wallet"
    appleWalletUrl:
      type: string
      format: uri
      description: URL for Apple Wallet (.pkpass)
      example: "https://redocly.com/api/tickets/a54a57ca/wallet/apple"
    googleWalletUrl:
      type: string
      format: uri
      description: URL for Google Wallet (.gpay)
      example: "https://redocly.com/api/tickets/a54a57ca/wallet/google"
```

### Modified Schemas

```yaml
MuseumTicketsConfirmation:
  description: Details for a museum ticket after a successful purchase.
  allOf:
    - $ref: "#/components/schemas/Ticket"
    - type: object
      properties:
        message:
          $ref: "#/components/schemas/TicketMessage"
        confirmationCode:
          $ref: "#/components/schemas/TicketConfirmation"
        walletTicket:
          $ref: "#/components/schemas/WalletTicket"
      required:
        - message
        - confirmationCode
```

## Implementation Guide

### 1. Set Up Wallet Pass Generation Libraries

Install the required libraries for generating wallet passes:

```bash
# For Apple Wallet
npm install @walletpass/pass-js

# For Google Wallet
npm install @google-pay/passes-nodejs
```

### 2. Configure Pass Templates

Create templates for different types of wallet passes:

- General admission pass template
- Special event pass template

Each template should include:
- Museum logo and branding
- Fields for date, time, confirmation code, etc.
- Location information for geofencing features

### 3. Implement Pass Generation

```javascript
// Example code for generating Apple Wallet pass
const { Template, Pass } = require('@walletpass/pass-js');

async function generateAppleWalletPass(ticket) {
  // Load template
  const template = await Template.load('./templates/museum-ticket');
  
  // Create pass from template
  const pass = template.createPass({
    serialNumber: ticket.ticketId,
    description: `Redocly Museum ${ticket.ticketType} Ticket`
  });
  
  // Set primary fields
  pass.primaryFields.add({
    key: 'date',
    label: 'DATE',
    value: formatDate(ticket.ticketDate)
  });
  
  if (ticket.ticketType === 'event') {
    pass.primaryFields.add({
      key: 'event',
      label: 'EVENT',
      value: ticket.eventName
    });
  }
  
  // Set barcode (for backward compatibility)
  pass.barcodes = [{
    message: ticket.confirmationCode,
    format: 'PKBarcodeFormatQR',
    messageEncoding: 'iso-8859-1'
  }];
  
  // Generate and return .pkpass file
  return await pass.asBuffer();
}
```

### 4. Update API to Return Wallet URLs

Modify the ticket purchase response to include wallet pass URLs:

```javascript
app.post('/tickets', async (req, res) => {
  // Existing ticket creation logic
  const ticket = await createTicket(req.body);
  
  // Add wallet pass URLs
  ticket.walletTicket = {
    ticketId: ticket.ticketId,
    walletPassUrl: `https://redocly.com/api/tickets/${ticket.ticketId}/wallet`,
    appleWalletUrl: `https://redocly.com/api/tickets/${ticket.ticketId}/wallet/apple`,
    googleWalletUrl: `https://redocly.com/api/tickets/${ticket.ticketId}/wallet/google`
  };
  
  res.status(201).json(ticket);
});
```

### 5. Implement Pass Update Mechanism

Create an endpoint for updating pass information:

```javascript
app.post('/tickets/update/:confirmationCode', async (req, res) => {
  // Find ticket by confirmation code
  const ticket = await findTicketByConfirmationCode(req.params.confirmationCode);
  
  // Update ticket information
  await updateTicket(ticket.ticketId, req.body);
  
  // Push updates to wallet passes
  await pushWalletUpdates(ticket.ticketId, req.body);
  
  res.status(200).json({ message: 'Ticket updated successfully' });
});
```

### 6. Testing Wallet Passes

To test your implementation:

1. Use Apple's Wallet Tester app during development
2. Test Google Pay passes using the Google Pay API test environment
3. Verify that geolocation features work correctly at museum coordinates
4. Ensure that updates to passes are properly pushed to devices

## Rollout Strategy

We recommend a phased rollout approach:

1. **Alpha Phase (Internal)**: Test with museum staff and developers
2. **Beta Phase (Limited)**: Offer to select museum members
3. **Parallel Phase**: Offer both QR and wallet options
4. **Full Transition**: Make wallet tickets the default, with QR as fallback
5. **Legacy Support**: Maintain QR endpoint for older clients for 6 months

## Security Considerations

- Implement proper signature validation for all wallet passes
- Use HTTPS for all pass-related endpoints
- Encrypt sensitive data stored in wallet passes
- Implement rate limiting on pass generation endpoints

## Backward Compatibility

To ensure backward compatibility:

- Continue supporting the QR code endpoint during transition
- Include a scannable barcode in the wallet pass
- Add step-by-step instructions for users unfamiliar with wallet passes

## Additional Resources

- [Apple Wallet Developer Guide](https://developer.apple.com/documentation/walletpasses)
- [Google Wallet Developer Documentation](https://developers.google.com/wallet)
- [Pass Validation Testing Tools](https://github.com/walletpass/pass-js) 