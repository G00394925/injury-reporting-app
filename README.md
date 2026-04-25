# Surveillence Doc

## Overview
A cross-platform mobile application that acts as an **injury reporting application** and a lite **athlete management system**. This provides user interfaces for athletes and coaches so as to monitor athlete health status and submit injury reports. 
This application is intended for recreational multi-sport settings, rather than professional settings, and it is hoped that this system will help address the current research gaps that exist for injury surveillance of recreational teams. 

The system is built using a React-Native/Python-Flask tech stack, with React-Native allowing for the writing of JSX code and bridging to the device's native components, and Python utilising the Flask framework to create a RESTful API that facilitates CRUD authentication operations with the database.

## Demo
A demo video can be found in this repository's **Wiki**, which features a narrated demonstration of the application's core features and the design and interface. The wiki can also be viewed at https://github.com/G00394925/injury-reporting-app/wiki.

## Installation
### Prerequisites
- Node.js
- Python
- pip

If you wish to clone this repository, take note of the following steps:

- Clone Repository
```bash
git clone https://github.com/G00394925/injury-reporting-app.git
```

### Frontend setup
1. Navigate to frontend directory
```bash
cd frontend
```

2. Install Expo CLI
```bash
npm install -g expo-cli
```

3. Install node packages
```bash
npm install
```

4. Run Expo client
```bash
npx expo start --lan
```

### Backend setup
1. Navigate to backend directory
```bash
cd backend
```

2. Install Python packages
```bash
pip install -r requirements.txt
```

3. Run development server
```bash
python server.py
```

A development server would then be running for preview. Please note that in order to access Supabase services, a <code>.env</code> containing Supabase access keys is required.
The easiest method of running the development server is to download **Expo Go** from app stores and scan the QR code that appears on the Expo console. However, the application would be limited, and certain features (such as Push Notifications) may not be available.

## Limitations
There is currently an issue when trying to launch the application via Expo Go - this could be attributed to certain features/packages not being supported. This may result in the complete abandonment of using Expo Go to test the application, so a development build is required.

There are a number of features that are yet to be fully implemented, which are listed in this repository's **Issues** tab.

The application could do with more testing and more robust error handling, as there still exists some minor unintended behaviour with certain UI components.
