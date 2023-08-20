# MyCV - Used Car Pricing API

-   Users sign up with email/password
-   Users get an estimate for how much their car is worth based on the make/model/year/mileage
-   Users can report what they sold their vehicles for
-   Admins have to approve reported sales

<br>

## Routes

### POST /auth/signup

-   Body : { email, password }
-   Description : Create a new user and sign in

### POST /auth/signin

-   Body : { email, password }
-   Description : Sign in as an existing user

### GET /reports

-   QueryString : make, model, year, mileage, longitude, latitude
-   Description : Get an estimate for the cars value

### POST /reports

-   Body : { make, model, year, mileage, longitude, latitude, price }
-   Description : Report how much a vehicle sold for

### PATCH /reports/:id

-   Body : { approved }
-   Description : Approve or reject a report submitted by a user

<br>
<br>

## Modules

-   Create a module for each separate resource
-   and each module can have a controller, a service and a repository to manage that kind of data or that resource

### Users Module

-   Users Controller
-   Users Service
-   Users Repository

### Reports Module

-   Reports Controller
-   Reports Service
-   Reports Repository
