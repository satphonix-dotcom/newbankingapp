
# Banking Application

This is a modern banking application built with React, TypeScript, and Supabase. It provides a comprehensive solution for managing bank accounts, transactions, and external transfers.

## Features

### User Features
- Account management
- Transaction history viewing
- Internal transfers between accounts
- External transfers to other banks
- Profile management
- KYC document submission

### Admin Features
- User management
- KYC verification
- External transfer review and approval
- Account oversight
- Fund management (add/deduct)

## Technologies Used

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (Authentication & Database)
- TanStack Query (React Query)
- React Router

## Project Structure

The project follows a modular structure with clearly separated concerns:

```
src/
  ├── components/
  │   ├── admin/           # Admin-specific components
  │   ├── dashboard/       # User dashboard components
  │   ├── profile/        # User profile components
  │   ├── transfers/      # Transfer-related components
  │   └── ui/             # Reusable UI components
  ├── hooks/              # Custom React hooks
  ├── integrations/       # External service integrations
  ├── lib/               # Utility functions
  └── pages/             # Main page components
```

## Security Features

- Row Level Security (RLS) policies for data protection
- Role-based access control
- Secure external transfer approval process
- KYC verification system

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## Development

This project uses several modern development tools and practices:

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- React Query for server state management
- Shadcn UI for consistent design system

## Build

To build the project for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deploy

You can deploy this project using any static site hosting service that supports single-page applications.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
