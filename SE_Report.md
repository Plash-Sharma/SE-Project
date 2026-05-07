# FILE UPLOADER — SOFTWARE ENGINEERING REPORT

---

## 1. INTRODUCTION

### 1.1 Background and Context

The digital age has fundamentally transformed how individuals create, consume, and distribute digital content. Within academic institutions like NIT Jalandhar, students and faculty routinely generate a diverse range of digital artifacts — lecture notes, assignment submissions, project documentation, research images, and collaborative resources. Despite this, the mechanisms available for storing, organizing, and sharing these files remain fragmented and often reliant on third-party commercial platforms that raise concerns regarding data privacy, storage quotas, and institutional control.

Commercial cloud storage solutions such as Google Drive and Dropbox, while feature-rich, operate under external governance. Students are subject to opaque terms of service, limited free-tier storage, and an interface designed for a general consumer audience rather than the specific, streamlined needs of an academic community. Furthermore, the reliance on these platforms creates a dependency on external infrastructure, meaning that any service disruption, policy change, or account termination directly impacts the student's ability to access their own academic work.

The **Uploader** platform addresses this gap by providing a self-hosted, lightweight, and institutionally deployable file hosting solution. Built on a modern server-side rendering stack, it offers a focused set of features — user authentication, hierarchical folder management, multi-format file uploading, and public link sharing — wrapped in a premium, responsive dark-themed interface. The system is designed to be operationally self-contained, requiring only a Node.js runtime and no external database server, making it ideal for rapid deployment on free-tier cloud platforms commonly used in academic project demonstrations.

### 1.2 Need for the System

The necessity for a dedicated, self-hosted file management platform arises from several converging factors observed in the academic and personal digital workflows of students.

First, the fragmentation of file storage across multiple personal devices, email attachments, and disparate cloud accounts leads to a significant organizational overhead. A student working on a semester-long project may have related files scattered across a phone gallery, a laptop's download folder, and an email thread, with no single point of access or organizational hierarchy.

Second, the act of sharing files in an academic context is often cumbersome. Sending a large PDF via email involves attachment size limits. Sharing a link from a commercial platform requires the recipient to have an account on the same platform or navigate through intrusive sign-up prompts. A system that generates simple, direct public links for designated files eliminates this friction entirely.

Third, for students studying software engineering, the construction of such a system serves as a comprehensive educational exercise. It requires the practical application of core principles including database schema design, user authentication and session management, server-side rendering, RESTful API architecture, file system operations, and responsive UI/UX design — all within a single, cohesive project.

**Strategic Technical Requirements**

The Uploader platform addresses these challenges by providing a unified digital workspace featuring a hierarchical folder system with unlimited nesting depth, a batch file upload engine, granular visibility controls for public sharing, and a secure authentication layer backed by industry-standard password hashing.

### 1.3 Overview of File Management Issues

Digital file management in a personal or small-team context is a multi-dimensional problem encompassing storage, organization, retrieval, and distribution. Research in personal information management demonstrates that users who have access to well-structured digital filing systems exhibit higher productivity and lower cognitive load when searching for specific documents.

Despite this, the tools readily available to students are either too complex (enterprise content management systems) or too simplistic (basic OS file explorers with no sharing capability). The absence of a middle-ground solution means that students often resort to ad-hoc methods — renaming files with date prefixes, creating deeply nested local folders with no remote backup, or sharing files via messaging apps where they are quickly buried in chat history.

Furthermore, the lack of a visibility control mechanism in most simple file-sharing methods means that a file shared for a specific purpose can be inadvertently accessed by unintended recipients. The Uploader platform directly confronts each of these issues by providing a structured, access-controlled, and easily deployable alternative.

**Structural Barriers in Personal File Management**

By identifying these barriers, the system focuses on creating a "digital filing cabinet" for the user. The platform ensures that uploaded content is not only stored but is also organized into a navigable hierarchy with descriptive metadata, turning a chaotic collection of downloads into a structured, shareable digital asset library.


---

## 2. PROBLEM STATEMENT

Despite the ubiquity of digital files in academic life, the current landscape of file management tools available to students presents a persistent set of organizational, accessibility, and sharing deficiencies that negatively affect productivity and collaboration. The core problems are enumerated and analyzed below.

### 2.1 Fragmented Storage and Lack of a Centralized Repository

Students typically store their academic and personal files across a multitude of disconnected locations — local hard drives, phone storage, email attachments, and multiple cloud service accounts. This fragmentation means that locating a specific file requires the user to recall not just the file's name but also the device and platform where it was last saved.

There is no single, self-controlled digital space where a student can aggregate all their important documents into a browsable, searchable hierarchy. The Uploader platform solves this by acting as a centralized, web-accessible repository where all files reside within a user-controlled folder structure.

**Challenges of Decentralized File Storage**

The reliance on multiple platforms means that data is not only difficult to locate but also governed by different privacy policies and storage limits. Without a single self-hosted repository, the student lacks a unified view of their digital assets, leading to duplication, version confusion, and the eventual loss of important files.

### 2.2 Cumbersome File Sharing Workflows

The process of sharing a file in a typical academic workflow involves multiple friction points. Email attachments are limited by file size. Commercial cloud links require the recipient to navigate through platform-specific interfaces, often prompting account creation. Messaging apps compress media and bury files within long chat histories, making retrieval difficult.

There is no simple, lightweight mechanism for a student to make a file publicly accessible via a direct, clean URL without requiring the recipient to install any application or create an account.

**Impact on Academic Collaboration**

The lack of a frictionless sharing mechanism means students often resort to lowest-common-denominator methods like WhatsApp forwards, which degrade file quality and provide no organizational structure. A platform that offers one-click public link generation for any file eliminates this entire class of sharing problems.

### 2.3 Absence of Hierarchical Organization

Most simple file-sharing tools (such as anonymous upload sites) provide a flat storage model where files are dumped into a single list with no concept of folders or sub-categorization. This model fails entirely when a user needs to manage files across multiple projects, courses, or semesters.

**Barriers to Structured File Management**

Without a hierarchical folder system — and specifically, the ability to nest folders within folders to arbitrary depth — the user is forced to encode organizational context into file names (e.g., `SE_Lab_Project_Final_v3_UPDATED.pdf`). This is error-prone, does not scale, and makes browsing a large collection of files an unpleasant experience. The Uploader platform provides unlimited-depth nested folders to mirror any organizational mental model the user may have.

### 2.4 Lack of Batch Operations and Upload Efficiency

Many simple file management interfaces require the user to upload files one at a time, each requiring manual metadata entry. When a user needs to upload a set of 15 images from a field trip or 10 documents for a project submission, this one-by-one process becomes a significant time sink.

**Inefficiency of Sequential Single-File Uploads**

The absence of a batch upload feature forces users to repeat the same sequence of actions (select file, enter name, choose visibility, submit) for every single file. The Uploader platform addresses this by allowing multi-file selection in a single operation, automatically adapting its interface to hide irrelevant per-file metadata fields during batch uploads.


---

## 3. OBJECTIVES

### 3.1 Secure User Authentication and Account Isolation

To implement a robust registration and authentication system that restricts platform access exclusively to registered users. This is achieved by binding accounts to unique usernames with passwords hashed using the Bcrypt algorithm, ensuring that each user's file space is completely isolated from every other user on the platform.

### 3.2 Hierarchical Folder Management with Unlimited Nesting

To provide a comprehensive folder management system that allows users to create, edit, and delete folders at the root level and to create subfolders within any existing folder to an arbitrary depth. This objective focuses on enabling users to mirror any organizational structure they require, from a simple flat list to a deeply nested project hierarchy.

**Breadcrumb Navigation** The system will provide a dynamic breadcrumb trail within any nested folder, allowing the user to instantly navigate to any ancestor folder or back to the home directory without using the browser's back button.

### 3.3 Multi-Format File Upload with Batch Processing

To provide a versatile file upload engine that supports a wide range of common file formats — including images (JPEG, PNG, GIF, WebP, SVG, BMP), documents (PDF, TXT, DOC, DOCX) — with a per-file size limit of 10 MB. The engine must support the simultaneous selection and upload of up to 20 files in a single operation.

**Adaptive Interface Logic** When a user selects multiple files, the system shall automatically suppress the optional per-file naming and description fields, as these are impractical for batch operations. When a single file is selected, these fields shall reappear, preserving the full metadata entry workflow.

### 3.4 Granular Visibility Controls and Public Sharing

To implement a two-tier visibility model — "Private" and "Public" — for individual files. Private files are accessible only to the authenticated owner. Public files are accessible to anyone via a shareable URL, enabling frictionless distribution of content without requiring the recipient to have an account on the platform.

### 3.5 Responsive and Accessible User Interface

To deliver a premium, dark-themed user interface that is fully responsive across screen widths from 320px (smartphones) to 1920px+ (desktop monitors). The interface must utilize modern web design principles including glassmorphism, micro-animations, and a curated color palette to create a visually engaging experience that encourages regular use.

### 3.6 Self-Contained and Easily Deployable Architecture

To architect the system as a single, self-contained Node.js application with an embedded SQLite database, requiring no external database server installation. This objective ensures that the platform can be deployed to free-tier cloud services (such as Render, Glitch, or Koyeb) with minimal configuration, making it accessible for academic project demonstrations and personal use.


---

## 4. SYSTEM OVERVIEW

### 4.1 Platform Description

The Uploader is a single-role, web-based file hosting and management platform built for individual users who require a centralized, self-controlled space for storing and sharing digital files. It functions as a personal cloud storage system where authenticated users can create hierarchical folder structures, upload files in various formats, manage file metadata, and generate public sharing links.

The system is built on a server-side rendering (SSR) stack comprising Node.js as the runtime, Express as the web framework, EJS as the templating engine, and SQLite as the embedded relational database. This architecture prioritizes simplicity and deployability — the entire application, including its database, is contained within a single project directory with no external service dependencies.

### 4.2 Key Modules

**User Authentication Module**
This module governs all aspects of user identity and session management. It handles new user registration with unique username validation, secure password hashing using Bcrypt (salt factor 10), and session-based authentication via Passport.js with the Local Strategy. User sessions are persisted in a separate SQLite store (`connect-sqlite3`), ensuring that login state survives server restarts. The module injects authenticated user context into all rendered views via a global middleware (`attachUserToLocals`).

**Hierarchical Folder Management Module**
The core organizational engine of the platform. This module manages the full CRUD (Create, Read, Update, Delete) lifecycle of folders. Folders are stored in the database with a self-referential `parentFolderId` foreign key, enabling unlimited nesting depth. The module provides functions for retrieving root-level folders, fetching subfolders of a given parent, and computing breadcrumb navigation paths by walking the parent chain. Folder deletion is recursive — deleting a parent folder automatically cascades to all descendant subfolders and their contained files, both in the database (via `ON DELETE CASCADE`) and on the physical disk.

**File Upload and Management Module**
Responsible for all file ingestion, storage, and metadata management. It uses the Multer middleware for handling `multipart/form-data` uploads, storing files on disk with unique timestamped filenames to prevent collisions. The module supports batch uploads of up to 20 files simultaneously. For single-file uploads, users may optionally provide a custom display name and description; for multi-file uploads, these fields are automatically suppressed. File metadata — including original filename, MIME type, size, storage path, visibility, and parent folder — is persisted in the database.

**Public Sharing Module**
This module enables the distribution of content to unauthenticated users. When a file's visibility is set to "Public," the system generates a shareable URL (`/share/file/:fileId`). Accessing this URL renders a dedicated public view of the file, including an inline image preview (for image types), an "Open in Browser" action, and a direct download link. The module validates that the requested resource is indeed public before rendering, returning a 403 Forbidden error for private assets.

**View Rendering and UI Module**
A collection of 16+ EJS templates and 4 reusable partials that compose the user interface. This module implements a consistent layout structure (head partial with meta tags, Google Fonts, and Lucide icons; footer partial with navigation and a copy-to-clipboard toast notification system). All views are styled with a custom dark theme CSS design system featuring fluid typography, CSS custom properties, and responsive grid layouts.

### 4.3 Technical Architecture

The Uploader follows a monolithic, three-tier architecture optimized for simplicity and rapid deployment.

**Presentation Layer (EJS + Vanilla CSS)**
The UI is rendered server-side using the EJS templating engine. This approach eliminates the need for a separate frontend build step or a client-side JavaScript framework. Interactivity (such as the multi-file upload field toggling and the share-link copy-to-clipboard function) is handled by minimal inline JavaScript. Styling is implemented via a comprehensive custom CSS design system (`styles.css`, 1200+ lines) using CSS Custom Properties for theming and `clamp()` functions for fluid, responsive typography.

**Application Layer (Node.js + Express 5)**
The server-side logic is organized into a clear MVC-like pattern: Routes define URL endpoints and map them to Controllers, which contain the business logic and interact with the Database query layer. Express middleware handles session management, authentication, body parsing, and static file serving. Input validation is performed by `express-validator` to sanitize all user-submitted data.

**Data Layer (SQLite via better-sqlite3)**
The database is an embedded SQLite file (`data/uploader.db`) accessed synchronously via the `better-sqlite3` driver. The schema consists of five tables: `User`, `Folder`, `File`, `Visibility`, and `Session`. The `Folder` table uses a self-referential foreign key (`parentFolderId`) to model the hierarchical tree structure. Foreign key constraints with `ON DELETE CASCADE` ensure referential integrity during deletion operations. The database is auto-initialized on first run, and schema migrations (such as adding the `parentFolderId` column) are handled gracefully via `ALTER TABLE` with error suppression for idempotency.

### 4.4 Core Operational Workflows

**The Registration and Authentication Flow**
A new user provides a unique username, display name, and password. The password is hashed with Bcrypt before storage. Upon successful registration, the user is automatically logged in via Passport's `req.login()`. Subsequent visits require the user to authenticate with their username and password, which is verified against the stored hash. A signed session cookie is issued, and the session data is persisted in the SQLite session store.

**The File Organization and Upload Flow**
An authenticated user creates a root-level folder from the home page. Within any folder, the user can create subfolders (to any depth) or upload files. For single uploads, the user may provide an optional display name and description. For batch uploads (selecting 2+ files), the interface automatically hides these fields, and each file is stored with its original filename. All files are physically stored in the `uploads/` directory with unique generated names, while their metadata is recorded in the `File` table.

**The Public Sharing Flow**
When creating or editing a file, the user may set its visibility to "Public." This makes the file accessible via a shareable URL (`/share/file/:fileId`). The owner can copy this link using the "Share" button, which uses the Clipboard API. Any person with the link can view and download the file without authentication.

### 4.5 Security and Integrity Protocols

**Password Hashing (Bcrypt)**
User passwords are never stored in plain text. The system employs the Bcrypt algorithm with a salt factor of 10 to generate a one-way hash before the password enters the database. During login, the submitted password is compared against the stored hash using `bcrypt.compare()`, ensuring that the original password cannot be reverse-engineered from the stored data.

**Session-Based Authentication (Passport.js)**
The system uses Passport.js with the Local Strategy for authentication. After successful login, the user's ID is serialized into a session cookie. The session data itself is stored server-side in a dedicated SQLite database (`data/sessions.sqlite`), not in the cookie. This prevents client-side tampering with session data. The cookie secret is configurable via the `COOKIE_SECRET` environment variable. In production, cookies are flagged as `secure` (HTTPS only).

**Input Validation and Sanitization**
All user-submitted form data is validated using `express-validator` middleware before reaching the controller logic. Username length, password strength, folder/file name lengths, and description lengths are all constrained. File uploads are filtered by MIME type against an explicit allowlist, and file sizes are capped at 10 MB to prevent abuse.

**Referential Integrity and Cascading Deletion**
The SQLite schema enforces foreign key constraints (`PRAGMA foreign_keys = ON`). Deleting a folder triggers `ON DELETE CASCADE` on associated files. The application layer further ensures that physical files are deleted from the disk during folder removal, using a Breadth-First Search (BFS) algorithm to discover all descendant folders before issuing delete operations.

### 4.6 Interface and Experience Design

The platform is designed with a "Mobile-First" philosophy, acknowledging that users frequently access their files from smartphones.

**Responsive Grid Layout**
The folder and file card grids adapt to the available screen width: 1 column on mobile (<640px), 2 columns on tablets (768px+), 3 columns on desktops (1024px+), and 4 columns on ultra-wide displays (1536px+). This is achieved using CSS `min()` functions and media queries.

**Premium Dark Theme**
The interface uses a carefully curated dark color palette with an indigo accent (`#6c7bf5`), subtle background gradients, glassmorphism effects (`backdrop-filter: blur`), and smooth micro-animations (`fadeInUp`, `shake` for error states). Typography uses the Inter font family from Google Fonts with a fluid type scale based on `clamp()`.

**Iconography**
The interface uses the Lucide icon library loaded from a CDN, providing consistent, lightweight SVG icons across all UI components.


---

## 5. FUNCTIONAL REQUIREMENTS

The functional requirements represent the complete expected behaviors of the platform from the perspective of its two primary actors: the authenticated User and the unauthenticated Visitor.

### 5.1 Core System Requirements Table

| REQ ID | Requirement Description | Actor(s) | Priority |
|--------|------------------------|-----------|----------|
| FR-01 | The system shall allow new users to register with a unique username (3–30 alphanumeric chars), display name, and password (min 6 chars). | Visitor | High |
| FR-02 | The system shall authenticate users via username and password using Bcrypt hashing and Passport.js session management. | All Users | High |
| FR-03 | The system shall display all root-level folders belonging to the authenticated user on the home page, showing file and subfolder counts. | User | High |
| FR-04 | The system shall allow users to create new root-level folders with a name (1–100 chars), optional description (max 500 chars), and default private visibility. | User | High |
| FR-05 | The system shall allow users to create subfolders within any existing folder to an unlimited nesting depth. | User | High |
| FR-06 | The system shall display a breadcrumb navigation trail when viewing any nested folder, with clickable links to all ancestor folders. | User | High |
| FR-07 | The system shall allow users to upload up to 20 files simultaneously, supporting JPEG, PNG, GIF, WebP, SVG, BMP, PDF, TXT, DOC, and DOCX formats, with a 10 MB per-file limit. | User | High |
| FR-08 | The system shall automatically hide the optional file name and description fields when the user selects more than one file for upload. | User | High |
| FR-09 | The system shall allow users to edit file metadata (display name, description, visibility) after upload. | User | Medium |
| FR-10 | The system shall allow users to set file visibility to "Public" or "Private," controlling access for unauthenticated visitors. | User | High |
| FR-11 | The system shall generate a shareable public URL (`/share/file/:fileId`) for any file marked as "Public." | User | High |
| FR-12 | The system shall provide "Open in Browser" and "Download" actions for file viewing, both for owners and public visitors. | User, Visitor | High |
| FR-13 | The system shall recursively delete all subfolders and their contained files (from both database and disk) when a parent folder is deleted. | User | High |
| FR-14 | The system shall provide inline image preview for image-type files on the file detail and shared file views. | User, Visitor | Medium |
| FR-15 | The system shall provide a copy-to-clipboard toast notification when a user copies a share link. | User | Low |
| FR-16 | The system shall expose a `/health` endpoint returning a JSON status object for platform monitoring by cloud hosting services. | System | Medium |

### 5.2 User Management and Security

**Account Integrity**
The system must ensure that each unique username corresponds to exactly one account. The registration process validates username uniqueness against the database before account creation, returning a clear error message if the username is already taken.

**Session Lifecycle**
User sessions are managed via signed cookies with a 24-hour expiration (`maxAge: 86400000 ms`). Session data is stored server-side in a dedicated SQLite database, ensuring that session state persists across server restarts. The logout action destroys the session and clears the cookie.

### 5.3 Folder and File Engine

**Hierarchical Data Model**
The folder system uses a self-referential adjacency list model (`parentFolderId` FK on the `Folder` table). Root folders have `parentFolderId = NULL`. This model supports unlimited nesting depth and efficient querying of direct children via a simple `WHERE parentFolderId = ?` clause.

**Breadcrumb Computation**
The breadcrumb trail is computed by iteratively querying the parent of the current folder until `parentFolderId` is `NULL` (root reached). The resulting array is reversed to produce a top-down path from the root to the current folder.

**Recursive Deletion Algorithm**
Folder deletion uses a Breadth-First Search (BFS) to collect all descendant folder IDs, then iterates through each to delete associated files from disk, and finally deletes database records in reverse (bottom-up) order to respect foreign key constraints.

### 5.4 Upload and Batch Processing

**Multer Configuration**
Files are stored on disk using `multer.diskStorage` with a unique filename generated from `Date.now()` + a random integer + the original file extension. This prevents filename collisions even during batch uploads.

**Adaptive Form Behavior**
Client-side JavaScript listens for the `change` event on the file input. When `fileInput.files.length > 1`, the display name and description form rows are hidden via `style.display = 'none'`, and a hint showing the selected file count is displayed. When the user re-selects a single file, the fields are restored.


---

## 6. NON-FUNCTIONAL REQUIREMENTS

Non-functional requirements define the quality attributes of the system and establish the criteria against which its overall fitness for purpose is evaluated beyond its explicit behavioral specifications.

### 6.1 Performance

The system shall deliver a page load time of no greater than two seconds under standard network conditions for all primary user-facing views, including the folder listing and file detail pages. Database query execution is optimized through SQLite's WAL (Write-Ahead Logging) journal mode (`PRAGMA journal_mode = WAL`), which allows concurrent reads during write operations. The synchronous nature of the `better-sqlite3` driver eliminates the overhead of asynchronous callback management, ensuring predictable query latency. File uploads are streamed directly to disk by Multer, avoiding in-memory buffering of large files.

### 6.2 Security

The system shall employ rigorous security measures to protect user data. User passwords shall be hashed using the Bcrypt algorithm with a salt factor of 10 and shall never be stored in plain text. Authentication is managed via Passport.js with server-side session storage, ensuring that sensitive session data is never exposed in client-side cookies. All form inputs are validated and sanitized using `express-validator` to prevent injection attacks. File uploads are filtered by MIME type against an explicit allowlist, and file sizes are capped at 10 MB. In production mode (`NODE_ENV=production`), session cookies are flagged as `secure`, ensuring they are only transmitted over HTTPS. The reverse proxy trust setting (`app.set('trust proxy', 1)`) is enabled in production to correctly handle headers from load balancers.

### 6.3 Scalability

The system architecture is designed for simplicity rather than horizontal scaling, reflecting its target deployment as a personal or small-group tool. However, several design decisions support future growth. The modular MVC architecture allows individual components (e.g., the file storage engine) to be replaced without affecting the rest of the application. The SQLite database can be migrated to PostgreSQL or MySQL by updating the query layer, as the SQL used is standard and compatible. The Multer file storage destination can be redirected to cloud object storage (e.g., AWS S3) by replacing the `diskStorage` configuration with a compatible storage engine. The Node.js runtime supports containerization via Docker for consistent deployment across environments.

### 6.4 Usability

The user interface shall adhere to principles of mobile-first responsive web design, rendering correctly on screen widths ranging from 320px (smartphones) to 1920px+ (desktop monitors) using a custom CSS design system with fluid typography (`clamp()`) and responsive grid layouts. The interaction paradigm for folder navigation shall be intuitive, with breadcrumb trails providing constant spatial context. File uploads can be completed in a maximum of three interactions (select files, choose visibility, click upload). Error messages shall be clear and user-friendly, displayed inline above the relevant form. The premium dark theme with glassmorphism effects and micro-animations is designed to create a visually engaging experience that minimizes eye strain during extended use.

### 6.5 Reliability

The system shall maintain data integrity through SQLite's ACID-compliant transaction model and enforced foreign key constraints (`PRAGMA foreign_keys = ON`). The `ON DELETE CASCADE` constraint ensures that orphaned records cannot exist in the `File` table when a parent `Folder` is deleted. The application-level recursive deletion algorithm further guarantees that physical files on disk are cleaned up in sync with database deletions. The embedded SQLite database with WAL journaling provides crash recovery — incomplete write transactions are automatically rolled back on the next database open. The `/health` endpoint enables external monitoring services to detect and restart the application in case of failure.

### 6.6 Maintainability

The codebase follows a strict MVC-like separation of concerns: Routes map URLs to Controllers, Controllers contain business logic and call Database query functions, and Views render the HTML output. This three-layer architecture ensures that changes to the UI (EJS templates) do not require modifications to the business logic, and vice versa. The database query layer is centralized in a single `queries.js` file, providing a single point of change for all SQL operations. The CSS design system uses CSS Custom Properties (variables) for all colors, spacings, and type scales, enabling global theme changes by modifying a handful of root-level variables. The schema initialization includes idempotent migration logic (try/catch `ALTER TABLE`), ensuring that the application can be updated without requiring manual database manipulation.

### 6.7 Deployability

The system is designed for zero-friction deployment on free-tier cloud platforms. The entire application — including its database — is contained within a single project directory. The only required environment variable is `COOKIE_SECRET`. The `package.json` includes both `start` (production) and `dev` (development with `--watch`) scripts. The application binds to `0.0.0.0` on a configurable port, compatible with the requirements of platforms like Render, Glitch, and Koyeb. Graceful shutdown handling (`SIGTERM`) ensures clean database closure when the hosting platform terminates the process.
