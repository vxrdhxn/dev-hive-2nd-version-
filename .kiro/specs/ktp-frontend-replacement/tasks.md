# Implementation Plan: KTP Frontend Replacement

## Overview

This implementation plan breaks down the React-based frontend replacement into discrete, incremental tasks. Each task builds on previous work, starting with project setup, then core infrastructure, followed by page implementations, and finally testing and integration.

## Tasks

- [ ] 1. Initialize React project with Vite and configure build tools
  - Create new Vite + React project in `frontend/` directory
  - Install dependencies: react, react-dom, react-router-dom, tailwindcss
  - Configure Tailwind CSS with PostCSS
  - Set up basic project structure (src/pages, src/components, src/services)
  - Configure Vite to proxy API requests to http://localhost:5000
  - _Requirements: 8.1, 8.4, 8.6, 9.1, 9.2, 9.3_

- [ ] 2. Implement API service layer
  - [ ] 2.1 Create api.js service module with fetch-based functions
    - Implement getStats() function for GET /stats
    - Implement search(query) function for POST /search
    - Implement ask(question) function for POST /ask
    - Configure API_BASE_URL constant
    - Add error handling for network failures and HTTP errors
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 8.2, 9.4_

  - [ ]* 2.2 Write unit tests for API service
    - Test successful API calls return expected data
    - Test failed API calls throw appropriate errors
    - Test correct HTTP methods and request formats
    - Mock fetch API for all tests
    - _Requirements: 6.2, 6.3, 6.4_

  - [ ]* 2.3 Write property test for API request format validation
    - **Property 4: Search API Request Format**
    - **Property 8: Ask API Request Format**
    - **Validates: Requirements 2.1, 3.1**

  - [ ]* 2.4 Write property test for API base URL consistency
    - **Property 14: API Base URL Consistency**
    - **Validates: Requirements 6.1**

  - [ ]* 2.5 Write property test for response data preservation
    - **Property 15: Response Data Preservation**
    - **Validates: Requirements 6.7**

- [ ] 3. Create reusable UI components
  - [ ] 3.1 Implement Navbar component with routing links
    - Create navigation bar with links to all pages
    - Use React Router NavLink for active state styling
    - Style with Tailwind CSS
    - _Requirements: 5.1, 5.4_

  - [ ] 3.2 Implement LoadingSpinner component
    - Create animated loading indicator
    - Use Tailwind CSS for styling
    - _Requirements: 1.7, 2.5, 3.4, 4.5_

  - [ ] 3.3 Implement ErrorMessage component
    - Accept message prop
    - Display error with consistent styling
    - _Requirements: 1.8, 2.6, 3.5, 4.6_

  - [ ] 3.4 Implement StatCard component
    - Accept title and value props
    - Create card layout for statistics display
    - _Requirements: 1.2, 1.3_

  - [ ] 3.5 Implement SearchResult component
    - Accept snippet, source, and optional score props
    - Display result with source badge
    - _Requirements: 2.2, 2.3, 2.4_

  - [ ] 3.6 Implement SourceBadge component
    - Accept source prop (github/notion/slack)
    - Display color-coded badge
    - _Requirements: 1.4, 1.5, 1.6, 2.3_

  - [ ]* 3.7 Write unit tests for reusable components
    - Test each component renders correctly with various props
    - Test edge cases (missing props, empty values)
    - _Requirements: Various_

- [ ] 4. Implement Dashboard page
  - [ ] 4.1 Create Dashboard page component with stats fetching
    - Set up component state (stats, loading, error)
    - Fetch stats on component mount using getStats()
    - Handle loading, success, and error states
    - Render stats using StatCard components
    - Display source breakdown with SourceBadge components
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8_

  - [ ]* 4.2 Write unit tests for Dashboard page
    - Test component renders loading state initially
    - Test successful stats display
    - Test error state display
    - Mock API service
    - _Requirements: 1.1, 1.7, 1.8_

  - [ ]* 4.3 Write property test for stats data display completeness
    - **Property 1: Stats Data Display Completeness**
    - **Validates: Requirements 1.2, 1.3, 1.4, 1.5, 1.6**

- [ ] 5. Implement Search page
  - [ ] 5.1 Create Search page component with query input and results display
    - Set up component state (query, results, loading, error)
    - Create input field with submit button
    - Implement form submission with validation (prevent empty queries)
    - Call search() function on submit
    - Handle loading, success, and error states
    - Render results using SearchResult components
    - Display empty state when no results
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_

  - [ ]* 5.2 Write unit tests for Search page
    - Test input validation prevents empty submissions
    - Test successful search displays results
    - Test error state display
    - Test empty results display
    - Mock API service
    - _Requirements: 2.1, 2.5, 2.6, 2.7, 2.8_

  - [ ]* 5.3 Write property test for search results display completeness
    - **Property 5: Search Results Display Completeness**
    - **Property 6: Optional Score Display**
    - **Validates: Requirements 2.2, 2.3, 2.4**

  - [ ]* 5.4 Write property test for empty input validation
    - **Property 7: Empty Input Validation**
    - **Validates: Requirements 2.8**

- [ ] 6. Implement Ask page
  - [ ] 6.1 Create Ask page component with question input and answer display
    - Set up component state (question, answer, sources, loading, error)
    - Create input field with submit button
    - Implement form submission with validation (prevent empty questions)
    - Call ask() function on submit
    - Handle loading, success, and error states
    - Display AI-generated answer
    - Display sources list with SourceBadge components
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

  - [ ]* 6.2 Write unit tests for Ask page
    - Test input validation prevents empty submissions
    - Test successful ask displays answer and sources
    - Test error state display
    - Mock API service
    - _Requirements: 3.1, 3.4, 3.5, 3.6_

  - [ ]* 6.3 Write property test for ask response display completeness
    - **Property 9: Ask Response Display Completeness**
    - **Validates: Requirements 3.2, 3.3**

  - [ ]* 6.4 Write property test for no chat history persistence
    - **Property 10: No Chat History Persistence**
    - **Validates: Requirements 3.7**

  - [ ]* 6.5 Write property test for empty input validation (Ask page)
    - **Property 7: Empty Input Validation** (Ask variant)
    - **Validates: Requirements 3.6**

- [ ] 7. Implement Integrations page
  - [ ] 7.1 Create Integrations page component with source status display
    - Set up component state (stats, loading, error)
    - Fetch stats on component mount using getStats()
    - Handle loading, success, and error states
    - Display source breakdown (GitHub, Notion, Slack counts)
    - Ensure no interactive controls are present (read-only)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

  - [ ]* 7.2 Write unit tests for Integrations page
    - Test component renders loading state initially
    - Test successful source status display
    - Test error state display
    - Test no interactive controls present
    - Mock API service
    - _Requirements: 4.1, 4.5, 4.6, 4.7_

  - [ ]* 7.3 Write property test for read-only integration display
    - **Property 18: Read-Only Integration Display**
    - **Validates: Requirements 4.7**

- [ ] 8. Set up routing and main App component
  - [ ] 8.1 Configure React Router with all page routes
    - Create App.jsx with Router setup
    - Define routes: / (Dashboard), /search, /ask, /integrations
    - Include Navbar in layout
    - Set up 404 fallback route
    - _Requirements: 5.1, 5.2, 8.4_

  - [ ]* 8.2 Write unit tests for routing configuration
    - Test all routes render correct components
    - Test navigation links route correctly
    - Test 404 fallback
    - _Requirements: 5.2_

  - [ ]* 8.3 Write property test for navigation routing correctness
    - **Property 11: Navigation Routing Correctness**
    - **Validates: Requirements 5.2**

  - [ ]* 8.4 Write property test for navigation persistence
    - **Property 12: Navigation Persistence Across Routes**
    - **Validates: Requirements 5.3, 5.5**

  - [ ]* 8.5 Write property test for active route visual feedback
    - **Property 13: Active Route Visual Feedback**
    - **Validates: Requirements 5.4**

- [ ] 9. Implement cross-cutting property tests
  - [ ]* 9.1 Write property test for loading state during async operations
    - **Property 2: Loading State During Async Operations**
    - Test across all pages (Dashboard, Search, Ask, Integrations)
    - **Validates: Requirements 1.7, 2.5, 3.4, 4.5, 7.1**

  - [ ]* 9.2 Write property test for error display on API failure
    - **Property 3: Error Display on API Failure**
    - Test across all API calls
    - **Validates: Requirements 1.8, 2.6, 3.5, 4.6, 7.2, 7.4**

  - [ ]* 9.3 Write property test for no authentication headers
    - **Property 16: No Authentication Headers**
    - **Validates: Requirements 6.8**

  - [ ]* 9.4 Write property test for Fetch API usage
    - **Property 17: Fetch API Usage**
    - Verify no third-party HTTP libraries in codebase
    - **Validates: Requirements 9.4**

- [ ] 10. Final integration and verification
  - [ ] 10.1 Test complete application flow end-to-end
    - Start backend server at http://localhost:5000
    - Start frontend development server
    - Manually verify all pages load correctly
    - Verify all API calls work with real backend
    - Test navigation between all pages
    - Test error scenarios (backend down, invalid responses)
    - _Requirements: All_

  - [ ] 10.2 Verify no backend modifications were made
    - Confirm no changes to Flask backend code
    - Confirm no new API endpoints added
    - Confirm request/response structures unchanged
    - _Requirements: 6.6, 6.7_

  - [ ] 10.3 Create production build and verify bundle size
    - Run `npm run build`
    - Verify build completes successfully
    - Check bundle size is reasonable (lightweight)
    - _Requirements: 9.7_

  - [ ] 10.4 Update project documentation
    - Create README for frontend directory
    - Document how to run development server
    - Document how to build for production
    - Document environment variables (API base URL)
    - _Requirements: Various_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests should run with minimum 100 iterations
- All API calls should be mocked in tests to avoid backend dependency
- The frontend must work with the existing backend without any modifications
