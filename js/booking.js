document.getElementById('bookingForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Collect form data
    const name = document.getElementById('name').value.split(" ");
    const firstName = name[0] || "";
    const lastName = name.slice(1).join(" ") || "";
    const email = document.getElementById('email').value;
    const checkin = document.getElementById('checkin').value + "T14:00:00Z";
    const checkout = document.getElementById('checkout').value + "T12:00:00Z";
    const guests = parseInt(document.getElementById('guests').value);
    const roomType = document.getElementById('room').value;
    const rateId = "e0f22b71-2e25-49a7-9dce-b26d00d2cde9"; // Fully Flexible

    // Map room type to RequestedCategoryId
    const roomCategoryIds = {
        "single": "b1fda14e-2a26-4e2c-9b4d-b27200bd2f8f",
        "double": "96d36c59-98d7-44bc-9bd5-b26d00d2d06a"
    };

    const requestedCategoryId = roomCategoryIds[roomType];
    
    // Define age categories
    const personCounts = [{
        "AgeCategoryId": "5129a8c0-3e63-468f-8f27-b26d00d2cd95",
        "Count": guests
    }];

    try {
        // Step 1: Create Customer
        const customerResponse = await fetch("https://sandbox.mews-demo.com/api/connector/v1/customers/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "ClientToken": "E0D439EE522F44368DC78E1BFB03710C-D24FB11DBE31D4621C4817E028D9E1D",
                "AccessToken": "381F1DD27E44487699BAB27400AAF224-3FC59278EBB61547F7A4A5DB4587E16",
                "ServiceId": "d1b115a8-f5be-4921-865f-b26d00d2ccf5",
                "FirstName": firstName,
                "LastName": lastName,
                "Email": email
            })
        });
        
        const customerData = await customerResponse.json();
        if (!customerData.Id) throw new Error("Customer creation failed");

        const customerId = customerData.Id;

        // Step 2: Create Reservation
        const reservationResponse = await fetch("https://sandbox.mews-demo.com/api/connector/v1/reservations/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "ClientToken": "E0D439EE522F44368DC78E1BFB03710C-D24FB11DBE31D4621C4817E028D9E1D",
                "AccessToken": "381F1DD27E44487699BAB27400AAF224-3FC59278EBB61547F7A4A5DB4587E16",
                "ServiceId": "d1b115a8-f5be-4921-865f-b26d00d2ccf5",
                "Reservations": [{
                    "StartUtc": checkin,
                    "EndUtc": checkout,
                    "RequestedCategoryId": requestedCategoryId,
                    "PersonCounts": personCounts,
                    "CustomerId": customerId,
                    "RateId": rateId
                }]
            })
        });

        const reservationData = await reservationResponse.json();
        if (!reservationData.Reservations) throw new Error("Reservation failed");

        alert("Booking successfully created!");
    } catch (error) {
        alert("Error: " + error.message);
    }
});
