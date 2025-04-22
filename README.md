# PrepWise: AI-Powered Mock Interview Platform

PrepWise is a full-stack, real-time AI-powered platform designed to simulate mock interviews. It leverages cutting-edge technologies like Next.js, Tailwind CSS, and AI voice agents to provide a lifelike interview experience. This README provides instructions for setting up and running the application.

## Features

- **Secure Authentication**: Firebase Authentication ensures secure user login and signup.
- **AI-Powered Interview Generation**: Google Gemini AI customizes mock interviews based on user input (e.g., role, type, level, tech stack, number of questions).
- **Real-time Mock Interviews**: VAPI Voice API enables real-time, lifelike interview simulations.
- **Personalized Feedback**: Detailed feedback is provided after each interview, analyzing conversation transcripts and offering insights on strengths and areas for improvement.
- **Responsive Design**: Tailwind CSS ensures a visually appealing and responsive user interface across all devices.
- **Database Management**: Firebase Firestore stores user data, interviews, and feedback.

## Technologies Used

### Frontend
- **Next.js**: Framework for building the application.
- **React**: Component-based UI library.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Shadcn UI**: Prebuilt UI components.
- **React Hook Form**: Form management library.
- **Zod**: Schema validation library.
- **Next Font**: Font optimization.

### Backend
- **Next.js API Routes**: Backend logic and API endpoints.
- **Firebase**: Authentication and Firestore for database management.
- **VAPI (Voice API)**: Real-time voice interaction.
- **Google Gemini AI**: AI for generating interviews and feedback.

### Other
- **@vapi/ai-web**: VAPI client library.
- **Node.js**: JavaScript runtime.

## Setup

### Clone the Repository
```bash
git clone https://github.com/Tharanitharan-M/PrepInterview
```

### Install Dependencies
```bash
npm install
```

### Set Up Environment Variables
Create a `.env.local` file in the root directory and add your Firebase project credentials and VAPI web token. Example:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_VAPI_WEB_TOKEN=your_vapi_web_token
# Add other required environment variables here
```

### Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Deployment

This project is designed to deploy on [Vercel](https://vercel.com). Follow the Vercel deployment instructions to get started.

## Contributing

Contributions are welcome! If you encounter bugs or have ideas for new features, feel free to open issues or submit pull requests.

## License

[Specify your license here, e.g., MIT License]

## Further Information

Refer to the original project walkthrough video for detailed instructions on setting up APIs, implementing AI logic, designing the UI, and deploying the application.
