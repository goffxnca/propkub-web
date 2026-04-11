# PropKub - Property Discovery Platform

Open-source monorepo for PropKub.com — 🇹🇭 Thailand's property marketplace. Built with Next.js and NestJS, featuring:

- **Property Listings** - Browse homes, condominiums, land, and commercial properties
- **Advanced Search** - Filter by location, price, property type, and more
- **User Profiles** - Manage your property preferences and saved listings
- **Interactive Maps** - Visualize property locations with Google Maps integration
- **Agent Management System** - Connect with real estate agents and property professionals

## 🚀 Live App

[https://propkub.com](https://propkub.com)

## 🛠️ Tech Stack

### Frontend

- **Next.js 14** - React framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form handling

### Backend

- **NestJS** - Node.js framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Swagger** - API documentation
- **SendGrid** - Email services

> **Note:** The API was previously maintained in a separate repository [propkub-api](https://github.com/goffxnca/propkub-api) and has since been migrated into this monorepo. The original repo is archived and preserved for historical reference.

## 🏗️ Project Structure

```
propkub/
├── apps/
│   ├── web/          # Frontend (Next.js)
│   └── api/          # Backend (NestJS)
├── package.json      # Workspace root
└── package-lock.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 24+
- npm

1. **Clone the repository**

   ```bash
   git clone https://github.com/goffxnca/propkub.git
   cd propkub
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   ```bash
   cp apps/web/.env.example apps/web/.env.development
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:65432](http://localhost:65432)

### API Integration

The frontend connects to our development API:

- **Base URL:** `https://dev-api.propkub.com/v1`
- **Documentation:** [Swagger UI](https://dev-api.propkub.com/v1/docs)
- **Authentication:** JWT-based with Google/Facebook OAuth

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for detailed information on how to get started.

## 🎯 Roadmap

### Short Term

- [x] Multi-language support
- [ ] Enhanced property search filters
- [ ] User dashboard improvements
- [ ] Advanced analytics

### Big Vision

- [ ] **Mobile App** - Native iOS and Android applications for better user experience
- [ ] **AI-Powered Matching** - Integrate AI to help property seekers and owners/agents find perfect matches more easily
- [ ] **Free Marketplace** - Create a truly free platform for home seekers, owners, and agents (no fees, unlike traditional property marketplace companies)
- [ ] **Developer Community** - Build a welcoming place where developers of all skill levels can contribute to products that reach real end users

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Goff Phatt** - [@goffxnca](https://github.com/goffxnca)

---

**Ready to contribute?** Check out our [open issues](https://github.com/goffxnca/propkub/issues) and join the community! 🚀
