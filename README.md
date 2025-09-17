# PropKub - Property Discovery Platform

> **PropKub** is a property discovery platform for Thailand, helping users find their perfect home, condominium, land, and commercial property.

## 🏠 About PropKub

PropKub is a full-stack property platform built with modern technologies. The platform connects property seekers with real estate opportunities across Thailand, featuring:

- **Property Listings** - Browse homes, condominiums, land, and commercial properties
- **Advanced Search** - Filter by location, price, property type, and more
- **User Profiles** - Manage your property preferences and saved listings
- **Interactive Maps** - Visualize property locations with Google Maps integration
- **Agent Management System** - Connect with real estate agents and property professionals

## 🚀 Live Demo

- **Frontend:** [https://propkub.com](https://propkub.com)
- **API Documentation:** [https://dev-api.propkub.com/api](https://dev-api.propkub.com/api)

## 🛠️ Tech Stack

### Frontend

- **Next.js 13** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **React Hook Form** - Form handling

### Backend

- **NestJS** - Node.js framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Swagger** - API documentation
- **SendGrid** - Email services
- **LogRocket** - Logging solution

> **Note:** The backend is currently private but will be open-sourced in the future as part of our roadmap.

## 🏗️ Project Structure

```
propkub-web/          # Frontend (Next.js)
├── components/       # Reusable UI components
├── pages/           # Next.js pages
├── libs/            # Utility functions
├── contexts/        # React contexts
└── styles/          # Global styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Yarn package manager

### Frontend Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/goffxnca/propkub-web.git
   cd propkub-web
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Configure environment**

   ```bash
   # Create dev environment file
   cp .env.example .env.development

   # No need to edit any values for now - all basic required values
   # are ready for contributors to start working and connecting to dev API
   ```

4. **Start development server**

   ```bash
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:65432](http://localhost:65432)

### API Integration

The frontend connects to our development API:

- **Base URL:** `https://dev-api.propkub.com`
- **Documentation:** [Swagger UI](https://dev-api.propkub.com/api)
- **Authentication:** JWT-based with Google/Facebook OAuth

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for detailed information on how to get started.

## 🎯 Roadmap

### Short Term

- [ ] Multi-language support
- [ ] Enhanced property search filters
- [ ] User dashboard improvements
- [ ] Advanced analytics

### Big Vision

- [ ] **Mobile App** - Native iOS and Android applications for better user experience
- [ ] **AI-Powered Matching** - Integrate AI to help property seekers and owners/agents find perfect matches more easily
- [ ] **Southeast Asia Expansion** - Scale as an open-source property platform across Southeast Asia
- [ ] **Free Marketplace** - Create a truly free platform for home seekers, owners, and agents (no fees, unlike traditional property marketplace companies)
- [ ] **Developer Community** - Build a welcoming place where developers of all skill levels can contribute to products that reach real end users

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Goff Patt** - [@goffxnca](https://github.com/goffxnca)

## 🙏 Acknowledgments

- Built with ❤️ for the Thailand property market
- Special thanks to all contributors
- Powered by the open source community

---

**Ready to contribute?** Check out our [open issues](https://github.com/goffxnca/propkub-web/issues) and join the community! 🚀
