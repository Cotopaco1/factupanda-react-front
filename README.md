# FactuPanda - React Quotation System

A modern React application for generating PDF quotations with customization options.

## Key Concepts Learned

### Error Handling Patterns

- **Blob to JSON Conversion**: When using `responseType: 'blob'` in Axios, error responses are also Blobs. Must convert to JSON to access error messages:
  ```javascript
  const text = await errorData.text();
  const jsonError = JSON.parse(text);
  ```

- **Global Error Interceptor**: Centralized error handling using Axios interceptors to show toast notifications for critical errors (401, 403, 500+) while skipping validation errors (422).

- **Error Service Layer**: Separating error handling logic from components using `MergeServerErrorsToForm` to automatically map backend validation errors to React Hook Form fields.

- **Async Error Handling**: Using `async/await` in catch blocks to ensure error processing completes before continuing execution.

### TypeScript Advanced Features

- **Module Augmentation**: Extending third-party library types without modifying their source code:
  ```typescript
  declare module 'axios' {
    export interface AxiosRequestConfig {
      skipGlobalError?: boolean;
    }
  }
  ```

- **Type-Safe Props**: Extending component props with `Omit` to inherit all properties except specific ones:
  ```typescript
  interface Props extends Omit<ButtonProps, 'disabled'> {
    loading: boolean;
  }
  ```

### Service Layer Architecture

- **Custom Hooks for API Calls**: Encapsulating API logic in reusable hooks (`useQuotationService`, `useTemporaryFileService`) that manage loading states and error handling.

- **Separation of Concerns**: Moving API logic out of components into dedicated service files for better maintainability and testing.

### React Hook Form Integration

- **Server-Side Validation**: Mapping Laravel validation errors to form fields dynamically.

- **Root Error Handling**: Using `form.setError('root', ...)` for general error messages not tied to specific fields.

- **Controller Pattern**: Using React Hook Form's `Controller` component for custom input components like file uploads.

### Code Quality Principles

- **DRY (Don't Repeat Yourself)**: Refactoring repetitive error handling logic into reusable functions and components.

- **Single Responsibility**: Each service/component has one clear purpose (e.g., `ButtonLoader` only handles button loading states).

- **Simplification**: Reducing complex conditional logic to its simplest form (e.g., consolidating multiple if statements into `status !== 422`).

### State Management

- **Loading States**: Managing loading indicators at the service level and passing them to components.

- **Blob URL Management**: Properly creating and revoking object URLs to prevent memory leaks:
  ```javascript
  useEffect(() => {
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [blobUrl]);
  ```

### User Experience Patterns

- **Toast Notifications**: Providing immediate feedback for critical errors without disrupting form context.

- **Contextual Error Display**: Showing validation errors inline on form fields while displaying general errors as toast messages.

- **Loading Indicators**: Using spinners in buttons to indicate ongoing operations and prevent duplicate submissions.

### API Communication

- **Conditional Error Handling**: Using `skipGlobalError` flag to control which requests should trigger global error notifications.

- **Response Type Handling**: Managing different response types (JSON vs Blob) in the same application.

- **Request Interceptors**: Adding authentication tokens automatically to all requests using Axios interceptors.

## Tech Stack

- React + TypeScript
- TanStack Router
- React Hook Form + Zod
- Axios
- Sonner (Toast notifications)
- Tailwind CSS

## Development Patterns

- Service-oriented architecture
- Type-safe development
- Centralized error handling
- Reusable component design
- Proper TypeScript module augmentation
