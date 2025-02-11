# react-micro-toast
Tinsy tiny toast, in React.

## Features
- Accessible by default
- TypeScript support
- Zero dependencies

## Installation
Copy the provided code and use it in your React project.

## Usage

Wrap your application with `ToastProvider` to provide access to the toast functions throughout your component tree. Then use the useToast hook in your components.

### Example

```tsx
import React from 'react';
import { ToastProvider, useToast } from './ToastContext';

const ExampleComponent = () => {
  const toast = useToast();

  const handleLogin = async (formData) => {
    try {
      await loginUser(formData);
      toast.success('Successfully logged in!');
    } catch (error) {
      toast.error('Invalid credentials');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {/* Form fields */}
    </form>
  );
};

const App = () => (
  <ToastProvider>
    <ExampleComponent />
  </ToastProvider>
);

export default App;
```

### ToastOptions
- `duration?: number`: Duration in milliseconds for how long the toast should be visible. Default is 5000ms.

## License
MIT
