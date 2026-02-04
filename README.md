# OnTheSpotX

## Description

OnTheSpotX is a comprehensive full-stack web application designed to revolutionize on-demand vehicle repair services by connecting customers with qualified mechanics in real-time. The platform addresses the common pain points in traditional automotive service booking, such as long wait times, lack of transparency, and difficulty finding reliable mechanics nearby.

### Problem Statement
Traditional vehicle repair services often involve:
- Customers calling multiple garages without knowing availability or proximity
- Mechanics missing service opportunities due to lack of real-time notifications
- No centralized platform for service tracking and management
- Manual coordination leading to inefficiencies

### Solution Overview
OnTheSpotX provides:
- **Location-based matching**: Automatically finds mechanics within a 5km radius using GPS coordinates
- **Real-time communication**: WhatsApp integration for instant notifications and responses
- **Role-based access control**: Separate interfaces for customers, mechanics, and administrators
- **Comprehensive dashboard**: Admin tools for managing users, services, and analytics

### System Architecture
The application follows a client-server architecture with:
- **Frontend**: Single-page application (SPA) built with React for responsive user interactions
- **Backend**: RESTful API server using Express.js for business logic and data management
- **Database**: MongoDB for flexible document storage of user profiles, service requests, and mechanic data
- **External Integrations**: WhatsApp API for notifications, geolocation services for distance calculations

## Features

### 1. User Authentication & Authorization
- **JWT-based authentication** with secure password hashing using bcrypt
- **Role-based access control** (RBAC) with three user types:
  - **Customers**: Can book services and view their request history
  - **Mechanics**: Can manage profiles, receive/respond to service requests
  - **Admins**: Full system access including user management and analytics
- **Session management** with automatic token refresh and logout

### 2. Mechanic Management System
- **Profile creation** with location, specialization, and experience details
- **Admin verification process** for quality control
- **Location tracking** using latitude/longitude coordinates
- **Specialization categories** (engine, transmission, electrical, etc.)

### 3. Service Booking & Matching
- **Intelligent matching algorithm**:
  1. Customer submits service request with location
  2. System calculates distances to all available mechanics
  3. Filters mechanics within 5km radius
  4. Sorts by proximity (nearest first)
  5. Sends WhatsApp notifications to top matches
- **Service categories**: Oil change, brake repair, battery replacement, etc.
- **Real-time status updates**: Waiting → Accepted → In Progress → Completed

### 4. WhatsApp Integration
- **Automated notifications** for new service requests
- **Mechanic responses** via WhatsApp (accept/reject)
- **Status updates** sent to customers
- **Webhook handling** for incoming WhatsApp messages

### 5. Admin Dashboard
- **Real-time statistics**: Total users, mechanics, service requests by status
- **User management**: View, search, and delete users
- **Service request monitoring**: Track all bookings with filtering
- **Mechanic verification**: Approve pending mechanic registrations

### 6. Responsive Design
- **Mobile-first approach** for on-the-go service booking
- **Cross-device compatibility** (desktop, tablet, mobile)
- **Intuitive UI/UX** with loading states and error handling

## Tech Stack & Rationale

### Backend Technologies
- **Node.js**: Chosen for its non-blocking I/O and extensive ecosystem, ideal for real-time applications
- **Express.js**: Lightweight framework for building REST APIs with middleware support
- **MongoDB with Mongoose**: NoSQL database for flexible schema design, perfect for user profiles and dynamic service data
- **JWT**: Stateless authentication tokens for secure API access
- **bcrypt**: Industry-standard password hashing for security
- **Geolib**: Specialized library for accurate geographic distance calculations
- **Axios**: Promise-based HTTP client for external API integrations

### Frontend Technologies
- **React**: Component-based architecture for maintainable, reusable UI elements
- **Redux Toolkit**: Simplified state management with built-in best practices
- **Vite**: Fast development server and optimized production builds
- **Tailwind CSS**: Utility-first CSS for rapid styling without CSS conflicts
- **React Router**: Declarative routing for single-page application navigation
- **Axios**: Consistent API communication across the frontend

### Development Tools
- **Nodemon**: Automatic server restarts during development
- **ESLint**: Code quality and consistency enforcement
- **Git**: Version control for collaborative development

## Installation & Setup

### Prerequisites
- **Node.js** (v16+ recommended): Download from [nodejs.org](https://nodejs.org/)
- **MongoDB**: Install locally or use [MongoDB Atlas](https://www.mongodb.com/atlas) for cloud hosting
- **Git**: Version control system
- **WhatsApp Business API**: For production notifications (Meta Developer account required)

### Backend Setup
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/OnTheSpotX.git
   cd OnTheSpotX/Backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment configuration**:
   Create a `.env` file in the Backend directory:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/onthespotx
   JWT_SECRET=your_super_secret_jwt_key_here_minimum_32_characters
   WHATSAPP_API_KEY=your_whatsapp_business_api_key
   WHATSAPP_PHONE_NUMBER_ID=your_whatsapp_phone_number_id
   ```

4. **Database setup**:
   - Start MongoDB service locally, or
   - Create a cluster on MongoDB Atlas and update MONGODB_URI

5. **Start the server**:
   ```bash
   npm start
   ```
   For development with auto-reload:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. **Navigate to frontend directory**:
   ```bash
   cd ../Frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure API endpoint**:
   Update `src/config/axios.js` with your backend URL:
   ```javascript
   const instance = axios.create({
     baseURL: 'http://localhost:3000', // Change for production
   });
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

## Usage Guide

### For Customers
1. **Register/Login**: Create account with email/phone verification
2. **Book Service**: Select service type, provide vehicle details and location
3. **Track Request**: Monitor status from "Waiting" to "Completed"
4. **Rate Service**: Provide feedback after completion

### For Mechanics
1. **Complete Profile**: Add location, specialization, and experience
2. **Receive Notifications**: Get WhatsApp alerts for nearby service requests
3. **Accept/Reject**: Respond via WhatsApp or dashboard
4. **Update Status**: Mark services as completed

### For Administrators
1. **Dashboard Overview**: View system statistics and recent activity
2. **User Management**: Search, view, and manage user accounts
3. **Mechanic Verification**: Approve pending mechanic registrations
4. **Service Monitoring**: Track all service requests and their statuses

## API Documentation

### Authentication Endpoints

#### POST /register
Register a new user account.

**Request Body**:
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "securepassword123",
  "role": "customer"
}
```

**Response** (201):
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

#### POST /login
Authenticate user and return JWT token.

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response** (200):
```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "fullName": "John Doe",
    "role": "customer"
  }
}
```

### Service Request Endpoints

#### POST /service-request
Create a new service request (Customer only).

**Headers**: `Authorization: Bearer <jwt_token>`

**Request Body**:
```json
{
  "serviceType": "Oil Change",
  "vehicleDetails": {
    "make": "Toyota",
    "model": "Camry",
    "year": 2020
  },
  "userLocation": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "address": "New York, NY"
  },
  "description": "Need oil change and filter replacement"
}
```

**Response** (201):
```json
{
  "message": "Service request created successfully",
  "request": {
    "_id": "request_id",
    "status": "waiting",
    "nearbyMechanics": [
      {
        "mechanicId": "mechanic_id",
        "name": "Jane Smith",
        "phone": "+1987654321",
        "distanceMeters": 1200
      }
    ]
  }
}
```

#### GET /service-requests/listStats
Get service request statistics (Admin only).

**Headers**: `Authorization: Bearer <jwt_token>`

**Response** (200):
```json
{
  "totalRequests": 150,
  "pendingRequests": 25,
  "acceptedRequests": 30,
  "completedRequests": 85,
  "cancelledRequests": 10
}
```

## Database Schema

### User Model
```javascript
{
  fullName: String (required),
  email: String (required, unique),
  phone: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['customer', 'mechanic', 'admin']),
  status: String (enum: ['active', 'pending', 'inactive']),
  createdAt: Date,
  updatedAt: Date
}
```

### Mechanic Model
```javascript
{
  userId: ObjectId (ref: User),
  fullName: String,
  email: String,
  phone: String,
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  specialization: String,
  experience: Number,
  status: String (enum: ['active', 'pending', 'inactive'])
}
```

### ServiceRequest Model
```javascript
{
  customerId: ObjectId (ref: User),
  serviceType: String,
  vehicleDetails: Object,
  userLocation: Object,
  description: String,
  status: String (enum: ['waiting', 'accepted', 'in_progress', 'completed', 'cancelled']),
  nearbyMechanics: [{
    mechanicId: ObjectId,
    name: String,
    phone: String,
    distanceMeters: Number
  }],
  assignedMechanic: ObjectId (ref: Mechanic),
  createdAt: Date,
  updatedAt: Date
}
```

## Security Considerations

- **Password Security**: bcrypt hashing with salt rounds
- **JWT Tokens**: Short expiration times with refresh token pattern
- **Input Validation**: Joi schemas for all API inputs
- **Rate Limiting**: Implemented on authentication endpoints
- **CORS Configuration**: Restricted to allowed origins
- **Environment Variables**: Sensitive data stored securely

## Deployment

### Backend Deployment (Railway/Render)
1. Connect GitHub repository
2. Set environment variables in dashboard
3. Configure build command: `npm install`
4. Set start command: `npm start`
5. Add MongoDB connection string

### Frontend Deployment (Vercel/Netlify)
1. Connect repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables for API URLs

### Production Considerations
- **Database**: Use MongoDB Atlas for scalability
- **Caching**: Implement Redis for session storage
- **Monitoring**: Add logging and error tracking
- **SSL**: Enable HTTPS certificates
- **Backup**: Regular database backups

## Challenges & Solutions

### 1. Real-time Notifications
**Challenge**: Implementing instant WhatsApp notifications for time-sensitive service requests.

**Solution**: Integrated WhatsApp Business API with webhook handlers for bidirectional communication.

### 2. Location-based Matching
**Challenge**: Accurate distance calculations and efficient querying of nearby mechanics.

**Solution**: Used Geolib library for precise calculations and MongoDB geospatial queries for performance.

### 3. State Management
**Challenge**: Complex state management across multiple user roles and real-time updates.

**Solution**: Redux Toolkit for predictable state updates and React Context for global search/filter state.

### 4. Mobile Responsiveness
**Challenge**: Ensuring usability across devices for on-the-go service booking.

**Solution**: Mobile-first Tailwind CSS approach with responsive grid layouts.

## Future Improvements

- **Push Notifications**: Native mobile app with Firebase Cloud Messaging
- **Payment Integration**: Stripe/PayPal for service payments
- **Rating System**: Customer reviews and mechanic reputation scores
- **AI Matching**: Machine learning for better mechanic-service matching
- **Multi-language Support**: Internationalization for broader markets
- **Analytics Dashboard**: Advanced reporting with charts and trends
- **Service History**: Detailed maintenance records for vehicles

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow ESLint configuration
- Write descriptive commit messages
- Add tests for new features
- Update documentation for API changes
- Ensure mobile responsiveness

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact & Support

- **GitHub Issues**: Report bugs and request features
- **Email**: [your-email@example.com]
- **LinkedIn**: [Your LinkedIn Profile]

---

*Built with ❤️ using modern web technologies*