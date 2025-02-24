document.getElementById('bookingForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Collect form data
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const checkinDate = new Date(document.getElementById('checkin').value);
    const checkoutDate = new Date(document.getElementById('checkout').value);
    const checkin = checkinDate.toISOString().split(".")[0] + "Z";
    const checkout = checkoutDate.toISOString().split(".")[0] + "Z";
    const guests = parseInt(document.getElementById('guests').value);
    const roomType = document.getElementById('room').value;
    const rateId = "e0f22b71-2e25-49a7-9dce-b26d00d2cde9"; // Fully Flexible

    // Map room type to RoomCategoryId
    const roomCategoryIds = {
        "single": "b1fda14e-2a26-4e2c-9b4d-b27200bd2f8f",
        "double": "96d36c59-98d7-44bc-9bd5-b26d00d2d06a"
    };

    const roomCategoryId = roomCategoryIds[roomType];
    
    // API Request Payload
    const reservationData = {
        "Client": "My Client 1.0.0",
        "ConfigurationId": "6feda065-62b7-4276-b192-b26d00d2ce98",
        "HotelId": "a5e73d2e-5313-4393-a5f4-b26d00d2c904",
        "Customer": {
            "Email": email,
            "FirstName": firstName,
            "LastName": lastName,
            "Telephone": "",
            "NationalityCode": "",
            "SendMarketingEmails": false
        },
      
        "Reservations": [
            {
                "RoomCategoryId": roomCategoryId,
                "StartUtc": checkin,
                "EndUtc": checkout,
                "RateId": rateId,
                "AdultCount": guests,
                "ChildCount": 0
            }
        ]
    };

    try {
        // Step 1: Create Reservation
        const reservationResponse = await fetch("https://api.mews-demo.com/api/distributor/v1/reservationGroups/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reservationData)
        });

        const reservationResult = await reservationResponse.json();
        console.log("API Response:", reservationResult);

        if (!reservationResult.Reservations) throw new Error("Reservation failed");

        alert("Booking successfully created!");
    } catch (error) {
        console.error("Error:", error);
        alert("Error: " + error.message);
    }
});
