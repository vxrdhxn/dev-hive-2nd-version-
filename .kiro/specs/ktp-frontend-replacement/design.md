# Design Document: KTP Frontend Replacement

## Overview

This design describes a lightweight React-based single-page application (SPA) that replaces the existing Streamlit frontend for the Knowledge Transfer Platform (KTP). The frontend acts as a pure client, consuming existing Flask backend endpoints without any backend modifications. The architecture follows a strict separation: React SPA → Flask Backend → Pinecone/OpenAI.

The application provides four main pages:
1. **Dashboard** - System statistics and monitoring
2. **Search** - Semantic search across the knowledge base
3. **Ask** - AI-powered question answering with RAG
4. **Integrations** - Read-only status of data sources

The design emphasizes simplicity, maintainability, and strict adherence to the constraint of zero backend changes.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────┐
│     React SPA (Frontend)            │
│  ┌──────────┐  ┌──────────────┐    │
│  │  Pages   │  │  Components  │    │
│  └────┬─────┘  └──────────────┘    │
│       │                              │
│  ┌────▼──────────────────────┐     │
│  │   API Service Layer        │     │
│  │   (Fetch API)              │     │
│  └────────────┬───────────────┘     │
└───────────────┼─────────────────────┘
                │ HTTP/JSON
                │ http://localhost:5000
┌───────────────▼─────────────────────┐
│     Flask Backend (Existing)        │
│  ┌──────────────────────────────┐  │
│  │  Routes: /stats, /search,    │  │
│  │          /ask                │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

### Technology Stack

- **Build Tool**: Vite (fast development server, optimized builds)
- **Framework**: React 18+ (component-based UI)
- **Routing**: React Router v6 (client-side routing)
- **Styling**: TailwindCSS (utility-first CSS framework)
- **HTTP Client**: Fetch API (native browser API)
- **State Management**: React hooks (useState, useEffect)

### Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Search.jsx
│   │   ├── Ask.jsx
│   │   └── Integrations.jsx
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── ErrorMessage.jsx
│   │   ├── StatCard.jsx
│   │   ├── SearchResult.jsx
│   │   └── SourceBadge.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Components and Interfaces

### API Service Layer

The API service encapsulates all backend communication, providing a clean interface for pages to consume.

**File**: `src/services/api.js`

```javascript
const API_BASE_URL = 'http://localhost:5000';

// Fetch system statistics
async function getStats() {
  const response = await fetch(`${API_BASE_URL}/stats`);
  if (!response.ok) {
    throw new Error(`Failed to fetch stats: ${response.statusText}`);
  }
  return response.json();
}

// Perform semantic search
async function search(query) {
  const response = await fetch(`${API_BASE_URL}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  if (!response.ok) {
    throw new Error(`Search failed: ${response.statusText}`);
  }
  return response.json();
}

// Ask AI-powered question
async function ask(question) {
  const response = await fetch(`${API_BASE_URL}/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question })
  });
  if (!response.ok) {
    throw new Error(`Ask failed: ${response.statusText}`);
  }
  return response.json();
}

export { getStats, search, ask };
```

**Interface Contracts**:

- `getStats()`: Returns `Promise<StatsResponse>`
- `search(query: string)`: Returns `Promise<SearchResponse>`
- `ask(question: string)`: Returns `Promise<AskResponse>`

All functions throw errors on HTTP failures, which pages handle appropriately.

### Page Components

#### Dashboard Page

**Route**: `/`

**Responsibilities**:
- Fetch statistics on mount
- Display loading state during fetch
- Display error state on failure
- Render statistics in card layout

**State**:
- `stats`: Object containing statistics data
- `loading`: Boolean indicating fetch in progress
- `error`: String containing error message or null

**Lifecycle**:
1. Component mounts → set loading=true
2. Call `getStats()` from API service
3. On success → set stats, loading=false
4. On error → set error message, loading=false

#### Search Page

**Route**: `/search`

**Responsibilities**:
- Provide input field for search query
- Submit search request on button click or Enter key
- Display loading state during search
- Display error state on failure
- Render search results with snippets and sources
- Display empty state when no results

**State**:
- `query`: String containing user input
- `results`: Array of search result objects
- `loading`: Boolean indicating search in progress
- `error`: String containing error message or null

**Lifecycle**:
1. User types query → update query state
2. User submits → validate non-empty, set loading=true
3. Call `search(query)` from API service
4. On success → set results, loading=false
5. On error → set error message, loading=false

#### Ask Page

**Route**: `/ask`

**Responsibilities**:
- Provide input field for question
- Submit question on button click or Enter key
- Display loading state during processing
- Display error state on failure
- Render AI-generated answer
- Display list of sources used

**State**:
- `question`: String containing user input
- `answer`: String containing AI response
- `sources`: Array of source objects
- `loading`: Boolean indicating processing in progress
- `error`: String containing error message or null

**Lifecycle**:
1. User types question → update question state
2. User submits → validate non-empty, set loading=true
3. Call `ask(question)` from API service
4. On success → set answer and sources, loading=false
5. On error → set error message, loading=false

#### Integrations Page

**Route**: `/integrations`

**Responsibilities**:
- Fetch statistics on mount
- Display loading state during fetch
- Display error state on failure
- Render source breakdown (GitHub, Notion, Slack counts)

**State**:
- `stats`: Object containing statistics data
- `loading`: Boolean indicating fetch in progress
- `error`: String containing error message or null

**Lifecycle**:
Same as Dashboard page (both use `/stats` endpoint)

### Reusable Components

#### Navbar

**Props**: None

**Responsibilities**:
- Render navigation links for all pages
- Highlight active route
- Provide consistent navigation across application

**Implementation**:
Uses React Router's `NavLink` component with `activeClassName` for styling.

#### LoadingSpinner

**Props**: None

**Responsibilities**:
- Display animated loading indicator
- Provide visual feedback during async operations

**Implementation**:
Simple CSS spinner or Tailwind-based animation.

#### ErrorMessage

**Props**:
- `message`: String containing error text

**Responsibilities**:
- Display error message in consistent styling
- Provide visual indication of error state

#### StatCard

**Props**:
- `title`: String for card title
- `value`: Number or string for statistic value
- `icon`: Optional icon component

**Responsibilities**:
- Display single statistic in card format
- Provide consistent styling across dashboard

#### SearchResult

**Props**:
- `snippet`: String containing result text
- `source`: String indicating source type (GitHub/Notion/Slack)
- `score`: Optional number for similarity score

**Responsibilities**:
- Display single search result
- Show source badge
- Optionally display similarity score

#### SourceBadge

**Props**:
- `source`: String indicating source type

**Responsibilities**:
- Display color-coded badge for source type
- Provide visual distinction between sources

## Data Models

### StatsResponse

Response from `GET /stats`:

```typescript
interface StatsResponse {
  total_vectors: number;
  total_documents: number;
  sources: {
    github: number;
    notion: number;
    slack: number;
  };
}
```

### SearchResponse

Response from `POST /search`:

```typescript
interface SearchResult {
  text: string;
  source: 'github' | 'notion' | 'slack';
  score?: number;
}

interface SearchResponse {
  results: SearchResult[];
}
```

### AskResponse

Response from `POST /ask`:

```typescript
interface Source {
  text: string;
  source: 'github' | 'notion' | 'slack';
}

interface AskResponse {
  answer: string;
  sources: Source[];
}
```

**Note**: These TypeScript interfaces are for documentation. The actual implementation uses JavaScript with runtime validation.

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Stats Data Display Completeness

*For any* valid stats response containing total_vectors, total_documents, and source counts (github, notion, slack), when rendered by the Dashboard or Integrations page, all fields should be present in the displayed output.

**Validates: Requirements 1.2, 1.3, 1.4, 1.5, 1.6, 4.2, 4.3, 4.4**

### Property 2: Loading State During Async Operations

*For any* page component that performs an async API call (Dashboard, Search, Ask, Integrations), while the request is in progress, a loading indicator should be visible to the user.

**Validates: Requirements 1.7, 2.5, 3.4, 4.5, 7.1**

### Property 3: Error Display on API Failure

*For any* API request that fails (getStats, search, ask), the component should display an error message and maintain application stability, allowing the user to retry the operation.

**Validates: Requirements 1.8, 2.6, 3.5, 4.6, 7.2, 7.4**

### Property 4: Search API Request Format

*For any* non-empty search query string, the search function should send a POST request to /search with a JSON body containing the query in the format {"query": "<query_string>"}.

**Validates: Requirements 2.1**

### Property 5: Search Results Display Completeness

*For any* search response containing a results array, each result should be rendered with its text snippet and source type visible in the output.

**Validates: Requirements 2.2, 2.3**

### Property 6: Optional Score Display

*For any* search result that includes a score field, the score should be displayed alongside the result; for results without a score field, no score should be shown.

**Validates: Requirements 2.4**

### Property 7: Empty Input Validation

*For any* input field that accepts user queries or questions (Search, Ask), attempting to submit an empty string or whitespace-only string should prevent the API call and maintain the current application state.

**Validates: Requirements 2.8, 3.6**

### Property 8: Ask API Request Format

*For any* non-empty question string, the ask function should send a POST request to /ask with a JSON body containing the question in the format {"question": "<question_string>"}.

**Validates: Requirements 3.1**

### Property 9: Ask Response Display Completeness

*For any* ask response containing an answer string and sources array, both the answer and all sources should be rendered and visible in the output.

**Validates: Requirements 3.2, 3.3**

### Property 10: No Chat History Persistence

*For any* sequence of ask operations, the application should not store or display previous question-answer pairs; each interaction should be independent.

**Validates: Requirements 3.7**

### Property 11: Navigation Routing Correctness

*For any* navigation link (Dashboard, Search, Ask, Integrations), clicking the link should route to the corresponding page path and update the browser URL accordingly.

**Validates: Requirements 5.2**

### Property 12: Navigation Persistence Across Routes

*For any* page transition, the navigation bar should remain visible and functional, maintaining its structure and links.

**Validates: Requirements 5.3, 5.5**

### Property 13: Active Route Visual Feedback

*For any* currently active route, the corresponding navigation link should have distinct styling to indicate it is the active page.

**Validates: Requirements 5.4**

### Property 14: API Base URL Consistency

*For all* API calls (getStats, search, ask), the request URL should use the base URL http://localhost:5000 with the appropriate endpoint path.

**Validates: Requirements 6.1**

### Property 15: Response Data Preservation

*For any* API response, the data should be used as-is without transformation or modification of the response structure.

**Validates: Requirements 6.7**

### Property 16: No Authentication Headers

*For all* API requests, no authentication headers, tokens, or credentials should be included in the request.

**Validates: Requirements 6.8**

### Property 17: Fetch API Usage

*For all* HTTP requests in the application, the native Fetch API should be used; no third-party HTTP client libraries (axios, etc.) should be present in the codebase.

**Validates: Requirements 9.4**

### Property 18: Read-Only Integration Display

*For the* Integrations page, no interactive controls (buttons, forms, inputs) for managing integrations should be present; only read-only status information should be displayed.

**Validates: Requirements 4.7**

## Error Handling

### Error Categories

1. **Network Errors**: Failed to connect to backend
2. **HTTP Errors**: Backend returns 4xx or 5xx status codes
3. **Parsing Errors**: Invalid JSON response from backend
4. **Validation Errors**: User input fails client-side validation

### Error Handling Strategy

**Network and HTTP Errors**:
- Catch errors in API service layer
- Throw descriptive error messages
- Pages catch errors and update error state
- Display user-friendly error messages
- Maintain application stability (no crashes)
- Allow user to retry operation

**Parsing Errors**:
- Catch JSON parsing errors in API service
- Throw error with message indicating invalid response
- Handle same as network errors in UI

**Validation Errors**:
- Prevent invalid submissions (empty inputs)
- Provide immediate feedback (disable submit button or show validation message)
- No API call made for invalid input

### Error Message Guidelines

- Use clear, non-technical language
- Avoid exposing internal error details
- Provide actionable guidance when possible
- Examples:
  - "Failed to load statistics. Please try again."
  - "Search request failed. Please check your connection and try again."
  - "Unable to process your question. Please try again later."

### Error Recovery

- Errors should not crash the application
- After an error, user should be able to:
  - Retry the same operation
  - Navigate to other pages
  - Perform other operations
- Error state should be clearable (e.g., by submitting a new request)

## Testing Strategy

### Overview

The testing strategy employs both unit tests and property-based tests to ensure comprehensive coverage of functional requirements and correctness properties.

**Unit Tests**: Verify specific examples, edge cases, and error conditions
**Property Tests**: Verify universal properties across all inputs

Both testing approaches are complementary and necessary for comprehensive validation.

### Testing Framework

- **Test Runner**: Vitest (fast, Vite-native test runner)
- **Testing Library**: React Testing Library (component testing)
- **Property-Based Testing**: fast-check (JavaScript property-based testing library)
- **Mocking**: Vitest's built-in mocking capabilities for API calls

### Property-Based Testing Configuration

- Each property test must run a minimum of 100 iterations
- Each test must reference its design document property using a comment tag
- Tag format: `// Feature: ktp-frontend-replacement, Property N: <property_text>`
- Each correctness property must be implemented by a single property-based test

### Test Organization

```
src/
├── pages/
│   ├── Dashboard.jsx
│   ├── Dashboard.test.jsx
│   ├── Search.jsx
│   ├── Search.test.jsx
│   ├── Ask.jsx
│   ├── Ask.test.jsx
│   ├── Integrations.jsx
│   └── Integrations.test.jsx
├── components/
│   ├── Navbar.jsx
│   ├── Navbar.test.jsx
│   └── [other components with tests]
├── services/
│   ├── api.js
│   └── api.test.js
```

### Unit Test Coverage

**API Service Tests**:
- Test successful API calls return expected data
- Test failed API calls throw errors
- Test correct HTTP methods and URLs
- Test correct request body formats
- Mock fetch API for all tests

**Component Tests**:
- Test components render without crashing
- Test loading states display correctly
- Test error states display correctly
- Test empty states display correctly
- Test user interactions (button clicks, form submissions)
- Test navigation links work correctly
- Mock API service for all tests

**Edge Cases**:
- Empty search results
- Empty ask sources
- Missing optional fields (e.g., similarity scores)
- Very long text snippets
- Special characters in queries

### Property-Based Test Coverage

**Property 1 - Stats Data Display Completeness**:
- Generate random stats objects with varying values
- Render Dashboard/Integrations with mocked API
- Assert all fields present in rendered output

**Property 2 - Loading State During Async Operations**:
- For each page component, delay API response
- Assert loading indicator visible during delay
- Assert loading indicator hidden after response

**Property 3 - Error Display on API Failure**:
- For each API call, simulate random error
- Assert error message displayed
- Assert component remains functional

**Property 4 - Search API Request Format**:
- Generate random non-empty query strings
- Call search function
- Assert POST request to /search with correct body format

**Property 7 - Empty Input Validation**:
- Generate random whitespace strings (spaces, tabs, newlines)
- Attempt submission
- Assert no API call made, state unchanged

**Property 10 - No Chat History Persistence**:
- Generate sequence of random questions
- Submit each question
- Assert previous Q&A pairs not stored or displayed

**Property 11 - Navigation Routing Correctness**:
- For each navigation link, simulate click
- Assert correct route path in URL
- Assert correct page component rendered

**Property 14 - API Base URL Consistency**:
- For each API function, intercept fetch call
- Assert URL starts with http://localhost:5000

**Property 15 - Response Data Preservation**:
- Generate random API responses
- Call API functions
- Assert returned data matches original response (no transformation)

**Property 17 - Fetch API Usage**:
- Inspect all API service code
- Assert only native fetch used
- Assert no axios or other HTTP libraries imported

### Test Execution

- Run tests with: `npm test`
- Run tests in watch mode: `npm test -- --watch`
- Run tests with coverage: `npm test -- --coverage`
- Target: >80% code coverage for all components and services

### Continuous Integration

- Tests should run on every commit
- All tests must pass before merging
- Property tests with 100+ iterations ensure robust validation
- Failed property tests should report the failing input for debugging
