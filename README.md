# Gemini AI Mock Frontend

A modern React frontend application that simulates the Gemini AI interface with OTP-based authentication and country selection features.

## 🚀 Features

- **OTP Authentication**: Secure login system using one-time passwords
- **Country Integration**: Fetches country data from REST Countries API with flags and calling codes
- **Chat Interface**: Mock chat functionality with thread management
- **Theme Management**: Dark/light theme support
- **Responsive Design**: Built with modern UI components using shadcn/ui
- **State Management**: Efficient state handling with Zustand
- **Search Functionality**: Debounced search for better performance

## 🛠 Tech Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Authentication**: Context-based auth management
- **API**: [REST Countries API](https://restcountries.com/v3.1/all?fields=name,flags,idd,cca2)

## 📁 Project Structure

```
src/
├── api/
│   ├── services/
│   ├── externalApiClient.ts    # Axios instance configuration
│   └── endpoints.ts            # API endpoint definitions
├── components/
│   ├── common/                 # Shared components
│   └── ui/                     # shadcn/ui components
├── contexts/
│   ├── auth-context.tsx        # Authentication management
│   └── theme-provider.tsx      # Theme management
├── hooks/
│   ├── useApi.ts              # API calling hook
│   └── useDebounce.ts         # Search debouncing hook
├── pages/
│   ├── auth/
│   │   └── login.tsx          # Login page
│   └── feature/
│       ├── Chat.tsx           # Main chat component
│       ├── ThreadSidebar.tsx  # Thread navigation
│       └── ChatInterface.tsx  # Chat interface
├── store/                     # Zustand store for threads
├── styles/
│   └── global.css            # Global styles
└── types/                    # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd gemini-ai-mock-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000` (or the port shown in your terminal).

## 🔧 How It Works

### Authentication
- The app uses **AuthContext** for managing authentication state
- OTP-based login system for secure access
- Authentication state persists across app sessions

### State Management
- **Zustand** is used for managing threads and chat data
- On app mount, mock thread data is loaded into the store
- Thread operations (create, update, delete) are handled through Zustand actions

### API Integration
- **External API Client**: Configured Axios instance for API calls
- **Country Data**: Fetches country information including names, flags, and international dialing codes
- **useApi Hook**: Custom hook for handling API requests with loading states

### UI Components
- Built with **shadcn/ui** components for consistent design
- **Theme Provider**: Supports dark/light mode switching
- **Responsive Design**: Optimized for various screen sizes

### Performance Optimizations
- **Debounced Search**: Implemented with useDebounce hook for efficient searching
- **Component-based Loading**: Loading states are handled at the component level
- **Optimized Rendering**: Efficient state updates with Zustand

## 🎨 Styling

The project uses:
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for pre-built, accessible components
- **Global CSS** for custom styles and overrides

## 📱 Pages & Components

### Authentication
- **Login Page**: OTP-based authentication interface

### Main Features
- **Chat Interface**: Main chat area with message handling
- **Thread Sidebar**: Navigation and management of chat threads
- **Country Selection**: Integration with REST Countries API

## 🔌 API Endpoints

The app integrates with:
- **REST Countries API**: `https://restcountries.com/v3.1/all?fields=name,flags,idd,cca2`
  - Fetches country names, flags, and international dialing data

## 🧰 Custom Hooks

- **useApi**: Handles API requests with loading and error states
- **useDebounce**: Optimizes search functionality with debouncing

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [REST Countries API](https://restcountries.com/) for country data
- [Zustand](https://github.com/pmndrs/zustand) for state management
- [Tailwind CSS](https://tailwindcss.com/) for styling utilities
```