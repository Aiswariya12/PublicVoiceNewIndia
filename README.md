# PublicVoice - NewIndia 🇮🇳

> **Every Location Matters. Every Issue Counts. Every Action Is Accountable.**

**PublicVoice - NewIndia** (formerly *BharatFix*) is an open, data-driven civic governance platform built to bridge the gap between Indian citizens, local municipal authorities, and community groups. It provides transparent tracking of public infrastructure issues (broken roads, drainage failures, water leaks, garbage dumps, dark streetlights) with verifiable proof and distinct accountability.

---

## 🌟 Why PublicVoice?

In most traditional grievance portals, complaints disappear into a black box. Citizens rarely know:
- Which department is actually responsible.
- Whether a reported issue is genuine or a duplicate.
- Who resolved it: **government authorities** or **local community volunteers** taking matters into their own hands.

PublicVoice solves this with:
1. **Duplication-Free Location Detection:** Uses canonical naming and spelling aliases (e.g. *Brahmapur* vs *Berhampur*) to prevent duplicate village/ward entries in the database.
2. **Transparent Resolution Source:** Distinguishes between **Government-Resolved**, **Community-Resolved**, and **Pending** work, instead of lumping all completed tasks together.
3. **Audit Trail & Timelines:** Every issue maintains an immutable timeline log detailing when it was reported, verified by an authorized officer, and resolved.

---

## 🛠️ Tech Stack

### Backend
- **Language & Framework:** Java 17, Spring Boot 3.3.4
- **Security:** Spring Security 6 with stateless JWT authentication (jjwt 0.12.6)
- **Data & Persistence:** Spring Data JPA, Hibernate ORM
- **Database:** PostgreSQL (ready for PostGIS spatial extensions)
- **Build Tool:** Apache Maven (configured with Maven Wrapper `mvnw`)

### Frontend
- **Framework & Tooling:** React 18, Vite
- **Styling:** Modular CSS / Tailwind-ready
- **API Client:** Fetch / Axios with Bearer token authentication

---

## 📂 Project Structure

```text
PublicVoice_NewIndia/
├── src/
│   ├── main/
│   │   ├── java/com/newindia/
│   │   │   ├── auth/           # User signup, login, JWT issuance
│   │   │   ├── user/           # User entity, roles (CITIZEN, OFFICER, VERIFIER, etc.)
│   │   │   ├── security/       # JwtAuthFilter, JwtService, SecurityConfig
│   │   │   ├── issue/          # Issue reporting, timeline, status updates
│   │   │   ├── location/       # Hierarchical location & canonical search
│   │   │   ├── department/     # Public departments (PWD, Sanitation, Water, etc.)
│   │   │   ├── community/      # Community group adoption workflows
│   │   │   ├── analytics/      # Village & town level performance metrics
│   │   │   ├── media/          # Issue before/after photo evidence
│   │   │   └── config/         # CORS and Jackson configurations
│   │   └── resources/
│   │       └── application.properties
│   └── test/                   # Spring Boot integration tests
├── frontend/                   # React + Vite client application
│   ├── src/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── pom.xml                     # Maven project configuration
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have installed:
- **JDK 17+** (`java -version`)
- **Node.js 18+** & npm (`node -v`, `npm -v`)
- **PostgreSQL 15+** running locally on port `5432`

---

### 1. Database Setup
Open **SQL Shell (psql)** or **pgAdmin** and create the database:

```sql
CREATE DATABASE publicvoice_db;
```

Configure your PostgreSQL credentials in `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/publicvoice_db
spring.datasource.username=postgres
spring.datasource.password=YOUR_POSTGRES_PASSWORD
server.port=8081
```

---

### 2. Run Backend (Spring Boot)

#### Option A: Terminal / Command Prompt
```bash
# Clone the repository
git clone https://github.com/Aiswariya12/PublicVoiceNewIndia.git
cd PublicVoiceNewIndia

# Run with Maven Wrapper
./mvnw spring-boot:run
```

#### Option B: Eclipse IDE
1. Open Eclipse &rarr; **File** &rarr; **Import...** &rarr; **Existing Maven Projects**.
2. Select `PublicVoice_NewIndia`.
3. Right-click `PublicVoiceNewIndiaApplication.java` &rarr; **Run As** &rarr; **Spring Boot App**.

> The backend runs at: **`http://localhost:8081`**

---

### 3. Run Frontend (React + Vite)

In a separate terminal window:

```bash
cd frontend
npm install
npm run dev
```

> The frontend development server runs at: **`http://localhost:5173`**

---

## 📡 API Endpoints Overview

### Authentication (Public)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new citizen account & receive JWT |
| `POST` | `/api/auth/login` | Login with email/password to get token |

### User Profile (Protected)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/users/me` | Fetch logged-in user details & role |

### Issues & Tracking (Protected)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/issues` | Report a new public issue |
| `GET` | `/api/issues` | List all reported issues |
| `PUT` | `/api/issues/{id}/status` | Update issue progress status |

### Locations (Protected)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/locations/search?q={query}` | Search locations by name or PIN code |

> **Header for Protected Endpoints:**
> ```http
> Authorization: Bearer <your_jwt_token>
> ```

---

## 🗺️ Roadmap & Upcoming Features

- [ ] **LGD Directory Integration:** Hierarchical State &rarr; District &rarr; Block &rarr; Village/Panchayat mapping.
- [ ] **Photo Evidence & Media Storage:** Upload before-and-after photographs for verified resolution proof.
- [ ] **Community Issue Adoption:** Registered community/NGO groups can adopt unresolved issues after government SLA timeouts.
- [ ] **Performance Dashboards:** 5-year historical resolution rate analytics and department comparisons.
- [ ] **AI-Powered Deduplication:** Flagging duplicate complaints using semantic text similarity and image matching.

---

## 🤝 Contributing
Contributions, feedback, and issue submissions are welcome! Feel free to fork the repository, create a feature branch, and submit a Pull Request.

---

## 📄 License
This project is open-source and developed for public civic governance empowerment.
