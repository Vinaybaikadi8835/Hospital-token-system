# OPD Token Allocation Engine

## 📌 Overview

The OPD Token Allocation Engine is a backend system designed to manage patient tokens for hospital Out Patient Departments (OPD). The system allocates patients into doctor-specific time slots while enforcing hard capacity limits and handling real-world scenarios such as emergency patients, paid priority patients, cancellations, and no-shows.

This project is implemented using **Node.js, Express.js, and MongoDB Atlas** and follows a service-based architecture.

---

## 🎯 Problem Statement

Doctors operate in fixed time slots (e.g., 9–10 AM). Each slot has a limited capacity. Patients can arrive from different sources:

* Walk-in
* Follow-up
* Paid priority
* Emergency

The system must:

* Enforce per-slot hard limits
* Allocate tokens based on priority
* Dynamically handle cancellations, no-shows, and emergencies
* Avoid overbooking

---

## 🏗️ Tech Stack

* **Node.js** – Backend runtime
* **Express.js** – REST API framework
* **MongoDB Atlas** – Database
* **Mongoose** – ODM
* **UUID** – Token ID generation

---

## 🧠 Core Concepts

### Token Priority

Higher number = higher priority

| Source    | Priority |
| --------- | -------- |
| Emergency | 4        |
| Paid      | 3        |
| Follow-up | 2        |
| Walk-in   | 1        |

---

## 🔄 Allocation Algorithm (High Level)

1. Validate doctor and slot
2. Check current active token count for the slot
3. If capacity is available → allocate token
4. If slot is full:

   * Find the lowest priority token
   * If new token has higher priority → displace the lowest priority token
   * Displaced token is marked as `CANCELLED`
5. If new token has lower or equal priority → reject allocation

---

## 📦 Data Models

### Doctor

* Name
* Specialization
* Active status

### Slot

* Doctor reference
* Time window
* Capacity
* Current active count

### Token

* Token ID
* Patient name
* Doctor & Slot reference
* Source & Priority
* Status (ACTIVE, CANCELLED, NO_SHOW, COMPLETED)

---

## 🌐 API Endpoints

### Doctor APIs

* `POST /doctors` → Create doctor
* `POST /doctors/:doctorId/slots` → Create slot
* `GET /doctors/:doctorId/slots` → View slot status

### Token APIs

* `POST /tokens` → Allocate token
* `POST /tokens/:tokenId/cancel` → Cancel token
* `POST /tokens/:tokenId/no-show` → Mark no-show

### Simulation

* `POST /simulate/day` → Simulate one OPD day

---

## 🧪 OPD Day Simulation

The simulation mimics a real OPD day with multiple doctors:

1. Walk-in patients fill ~70% of slot capacity
2. Paid priority patients arrive
3. Emergency patients are inserted
4. Displacement occurs based on priority rules

This demonstrates dynamic allocation under real-world conditions.

---

## ⚠️ Edge Case Handling

| Scenario      | Handling                                |
| ------------- | --------------------------------------- |
| Slot full     | Priority-based displacement             |
| Cancellation  | Slot capacity released                  |
| No-show       | Token marked NO_SHOW, capacity released |
| Emergency     | Always allocated                        |
| Same priority | FIFO fairness                           |

---

## ❗ Design Decisions & Trade-offs

* Displaced patients are currently marked as `CANCELLED` for simplicity
* Cross-slot auto reallocation is intentionally avoided
* System prioritizes predictability over aggressive optimization

---

## 🚀 Future Enhancements

* Introduce `DISPLACED` and `WAITLIST` states
* Automatic reallocation to next available slot
* Redis-based locking for concurrency
* WebSocket-based live token updates
* Admin dashboard

---

## ▶️ How to Run

```bash
npm install
npx nodemon src/app.js
```

Server runs on:

```
http://localhost:5000
```

---

## ✅ Conclusion

This project demonstrates a realistic and scalable approach to OPD token management. It balances fairness, priority handling, and real-world hospital constraints while remaining extensible for production-grade systems.

---

**Author:** Vinay
