
# 💬 Finance Assistance Chatbot

This project is a **Finance Assistance Chatbot** built using **React**, **Firebase Authentication**, **MongoDB**, and **Llama 3** to provide users with answers to their finance-related queries. The chatbot uses predefined responses stored in a CSV and falls back on Llama 3 AI for more complex queries.

---

## 📂 Table of Contents
- [Project Setup](#1-project-setup)
- [Installing Dependencies](#2-installing-dependencies)
- [Firebase Authentication Setup](#3-firebase-authentication-setup)
- [MongoDB Setup](#4-mongodb-setup)
- [Backend Implementation](#5-backend-implementation)
- [Frontend Implementation](#6-frontend-implementation)
- [Llama 3 Integration](#7-llama-3-integration)
- [Predefined Dataset Integration](#8-predefined-dataset-integration)
- [Deployment Instructions](#9-deployment-instructions)
- [Common Mistakes](#10-common-mistakes)
- [Possible Improvements & Future Goals](#11-possible-improvements--future-goals)

---

## 1. Project Setup

Clone the repository (or initialize your own project):

```bash
git clone <your-repo-url>
# OR if creating a new project:
git init <project-name>
```

Navigate to the project directory:

```bash
cd <project-name>
```

---

## 2. Installing Dependencies

### Backend Dependencies
Install necessary backend libraries:

```bash
npm install express mongoose firebase-admin dotenv cors axios
```

### Frontend Dependencies
Install frontend dependencies:

```bash
npm install react-router-dom axios firebase
```

### Llama 3 Integration (Optional)
If using Llama 3 (through Ollama or API), install Axios:

```bash
npm install axios
```

---

## 3. Firebase Authentication Setup

Firebase is used to handle user authentication for login and registration.

### Steps:

1. **Create a Firebase Project:**
   - Visit Firebase Console and create a new project (or use an existing one).

2. **Enable Authentication:**
   - In Firebase Console, go to Authentication → Sign-in method.
   - Enable **Email/Password** authentication.

3. **Download Firebase Config:**
   - Go to Project Settings → Service Accounts → Generate New Private Key.
   - This will download a `firebaseConfig.json` file. Do not expose this file in the public repository.

4. **Environment Variables:**
   Add the Firebase config values to your `.env` file:

   ```plaintext
   FIREBASE_API_KEY=your-api-key
   FIREBASE_AUTH_DOMAIN=your-auth-domain
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_STORAGE_BUCKET=your-storage-bucket
   FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   FIREBASE_APP_ID=your-app-id
   ```

### Integrating Firebase:
In your `firebaseConfig.js`, initialize Firebase with the provided config:

```javascript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth };
```

---

## 4. MongoDB Setup

### Steps:

1. **Create a MongoDB Account:**
   - Visit MongoDB Atlas and create an account if you don’t have one.

2. **Create a Cluster:**
   - Follow the instructions on MongoDB Atlas to create a cluster (choose the free tier).

3. **Get MongoDB URI:**
   - Once your cluster is ready, get the MongoDB URI under **Connect → Connect your application**.
   - The URI format should look like this:

   ```plaintext
   mongodb+srv://<username>:<password>@cluster.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
   ```

4. **Add MongoDB URI to `.env`:**

   ```plaintext
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/myDatabase?retryWrites=true&w=majority
   ```

5. **Test MongoDB Connection:**
   In the backend, use **Mongoose** to connect to MongoDB:

   ```javascript
   mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
   ```

---

## 5. Backend Implementation

The backend uses **Express** to handle API routes.

1. **Create a `server.js` file** in the root directory and configure routes for authentication and chatbot queries.
2. **Save the chat history** in MongoDB using **Mongoose models**.

---

## 6. Frontend Implementation

The frontend is a **React** app where users can log in/register, and query the chatbot for financial assistance.

- **Firebase Authentication** handles user login/registration.
- **Axios** is used to send user queries to the backend for processing.

---

## 7. Llama 3 Integration

To integrate Llama 3, follow these steps:

1. **Use Axios or an API client** to send requests to Llama's endpoint.
2. If Llama 3 is running locally (using **Ollama**), make sure to use the correct API endpoint:

```javascript
const getLlamaResponse = async (query) => {
  const response = await axios.post('Llama_API_URL', { query });
  return response.data.answer;
};
```

---

## 8. Predefined Dataset Integration

1. Store predefined responses (CSV or JSON).
2. If a query is not matched with the predefined dataset, use **Llama 3** for fallback.
3. Implement a function to query the dataset for matching answers.

---

## 9. Deployment Instructions

### Backend (Express API):
- Use **Heroku** or **Render** (Free Tier) for backend deployment.
- Set environment variables (MongoDB URI, Firebase Config) in the deployment platform's dashboard.

### Frontend (React):
- Use **Vercel** or **Netlify** to deploy the frontend.
- Link your GitHub repository for CI/CD pipeline.

---

## 10. Common Mistakes

### Incorrect Firebase credentials:
- Ensure the **API key** and other details in `.env` are correct.

### CORS issues:
- Ensure **CORS** is set up properly in the backend (`app.use(cors())`).

### MongoDB URI misconfiguration:
- Double-check the MongoDB URI. If the username/password are incorrect, the connection will fail.

### Backend not running:
- Make sure your backend server is running (`node server.js` or `npm start`).

---

## 11. Possible Improvements & Future Goals

### Advanced Query Processing:
- Integrate **Natural Language Processing (NLP)** models to improve chatbot responses.

### Voice Integration:
- Implement **Speech-to-Text** and **Text-to-Speech** for voice-based interactions.

### Enhanced User Interface:
- Improve the UI using **CSS frameworks** like Tailwind CSS or Material UI.

### Deploying on Cloud (AWS, GCP):
- For larger-scale production, consider migrating to cloud platforms like **AWS** or **GCP** for scalability.

### Adding More Datasets:
- Include more predefined datasets or integrate other **financial data sources**.

---

## 📜 License

This project is open-source and available under the **MIT License**.

---

## ⭐ Contribute

Feel free to fork this project and contribute! Any suggestions, bug reports, or pull requests are welcome.

---

**👨‍💻 Author:** Nanda Santosh  
**📌 GitHub:** [nandasantosh74](https://github.com/nandasantosh74)
