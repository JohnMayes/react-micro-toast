# react-micro-toast
Tinsy tiny toast, in React.

## Features
- Accessible by default
- TypeScript support
- Zero dependencies
- Extend as you see fit, use only what you need

## Installation
This doesn't need to be a dependency, seriously. Just copy the code provided in `ToastContext.tsx` and start using it in your React project.

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

## Extending the component
To add features to this component, simply extend the ToastOptions interface. Want to add custom style options? You can do that:

```tsx
interface ToastOptions {
  duration?: number;
  style?: CSSProperties
}
```

Want to make the toast dismissible and add a callback? You can do that too:

```tsx
interface ToastOptions {
  duration?: number;
  style?: CSSProperties
  dismissible?: boolean;
  onDismiss?: () => void;
}

// -- update Toast return statement --

return (
    <div
      style={options.style}
      role="alert"
    >
      {message}
      {options.dismissible && (
        <button onClick={handleDismiss}>
          Dismiss
        </button>
      )}
    </div>
  );

// -- usage --

toast.success(`Dismiss me please`, {
  dismissible: true,
  onDismiss: () => toast.warn("Another toast!"),
  style: {
    fontSize: "18px",
    background: "rebeccapurple",
    borderRadius: "900px",
  },
});
```

Examples of how to implement these features and more can be found in `ExtendedToastContext.tsx`

## A note on styles
I have included some basic inline styles just to get you started. They work fine, but you are likely going to want to add your own style sheets for both the toast and the context provider.

The examples provided in `ExtendedToastContext.tsx` use [styled-jsx](https://github.com/vercel/styled-jsx). If your are using NextJS you already have it bundled. If not, the styles can be placed anywhere you want them!

## License
MIT
