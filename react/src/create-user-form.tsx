import React, { useState, type CSSProperties, type Dispatch, type SetStateAction } from 'react';

// CreateUserForm component and its props
interface CreateUserFormProps {
  setUserWasCreated: Dispatch<SetStateAction<boolean>>;
  token: string;
}

function CreateUserForm({ setUserWasCreated, token }: CreateUserFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validatePassword(pwd: string): string[] {
    const errors: string[] = [];
    if (pwd.length < 10) errors.push('Password must be at least 10 characters long');
    if (pwd.length > 24) errors.push('Password must be at most 24 characters long');
    if (/\s/.test(pwd)) errors.push('Password cannot contain spaces');
    if (!/\d/.test(pwd)) errors.push('Password must contain at least one number');
    if (!/[A-Z]/.test(pwd)) errors.push('Password must contain at least one uppercase letter');
    if (!/[a-z]/.test(pwd)) errors.push('Password must contain at least one lowercase letter');
    return errors;
  }

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    setValidationErrors(validatePassword(val));
    setApiError(null);
  };

  const onUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setApiError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const pwdErrors = validatePassword(password);
    if (!username.trim()) {
      setValidationErrors([]);
      setApiError('Username is required');
      return;
    }
    if (pwdErrors.length > 0) {
      setValidationErrors(pwdErrors);
      setApiError(null);
      return;
    }

    setValidationErrors([]);
    setApiError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch(
        'https://api.challenge.hennge.com/password-validation-challenge-api/001/challenge-signup',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (res.ok) {
        setUserWasCreated(true);
      } else if (res.status === 401 || res.status === 403) {
        setApiError('Not authenticated to access this resource.');
      } else if (res.status === 500) {
        const err = await res.json().catch(() => null);
        if (
          err?.message ===
          'Sorry, the entered password is not allowed, please try a different one.'
        ) {
          setApiError('Sorry, the entered password is not allowed, please try a different one.');
        } else {
          setApiError('Something went wrong, please try again.');
        }
      } else {
        setApiError('Something went wrong, please try again.');
      }
    } catch {
      setApiError('Something went wrong, please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isUsernameInvalid = apiError === 'Username is required';
  const isPasswordInvalid =
    validationErrors.length > 0 || (apiError && apiError.startsWith('Sorry'));

  return (
    <div style={formWrapper}>
      <form style={form} onSubmit={handleSubmit} noValidate>
        <label htmlFor="username-input" style={formLabel}>
          Username
        </label>
        <input
          id="username-input"
          name="Username"
          type="text"
          value={username}
          onChange={onUsernameChange}
          style={formInput}
          aria-invalid={isUsernameInvalid}
          aria-describedby={isUsernameInvalid ? 'username-error' : undefined}
          required
        />
        {isUsernameInvalid && (
          <div id="username-error" style={errorText}>
            {apiError}
          </div>
        )}

        <label htmlFor="password-input" style={formLabel}>
          Password
        </label>
        <input
          id="password-input"
          name="Password"
          type="password"
          value={password}
          onChange={onPasswordChange}
          style={formInput}
          aria-invalid={isPasswordInvalid}
          aria-describedby={isPasswordInvalid ? 'password-errors' : undefined}
          required
        />

        {validationErrors.length > 0 && (
          <ul id="password-errors" style={errorList}>
            {validationErrors.map((err, i) => (
              <li key={i} style={errorText}>
                {err}
              </li>
            ))}
          </ul>
        )}

        {apiError && !isUsernameInvalid && (
          <div role="alert" style={apiErrorStyle}>
            {apiError}
          </div>
        )}

        <button
          type="submit"
          style={formButton}
          disabled={isSubmitting}
          aria-disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create User'}
        </button>
      </form>
    </div>
  );
}

// Export the form to use it in App
export { CreateUserForm };

// App component to use CreateUserForm with token
function App() {
  const [userWasCreated, setUserWasCreated] = useState(false);

  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsiYXNodXRvc2guY2hhdWRoYXJpX2NvbXAyMUBwY2NvZXIuaW4iXSwiaXNzIjoiaGVubmdlLWFkbWlzc2lvbi1jaGFsbGVuZ2UiLCJzdWIiOiJjaGFsbGVuZ2UifQ.wNk_h_L8DdeQ6-zKVO1Lxe-u_eCTdJM-1fELJMbARPM';

  if (userWasCreated) {
    return <div>User created successfully!</div>;
  }

  return <CreateUserForm setUserWasCreated={setUserWasCreated} token={token} />;
}

export default App;

// Styles for bright UI
const formWrapper: CSSProperties = {
  maxWidth: '500px',
  width: '80%',
  backgroundColor: '#ffffff',
  padding: '32px',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const form: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const formLabel: CSSProperties = {
  fontWeight: 700,
  fontSize: '16px',
  color: '#333',
};

const formInput: CSSProperties = {
  outline: 'none',
  padding: '10px 16px',
  height: '44px',
  fontSize: '16px',
  backgroundColor: '#f9f9f9',
  border: '1.5px solid #bbb',
  borderRadius: '6px',
  transition: 'border-color 0.3s',
};

const formButton: CSSProperties = {
  outline: 'none',
  borderRadius: '6px',
  border: 'none',
  backgroundColor: '#007bff',
  color: 'white',
  fontSize: '18px',
  fontWeight: 600,
  height: '48px',
  padding: '0 16px',
  marginTop: '16px',
  cursor: 'pointer',
  userSelect: 'none',
};

const errorText: CSSProperties = {
  color: '#d93025',
  fontSize: '14px',
  marginTop: '4px',
};

const errorList: CSSProperties = {
  paddingLeft: '20px',
  marginTop: '4px',
};

const apiErrorStyle: CSSProperties = {
  marginTop: '12px',
  color: '#b00020',
  fontWeight: '600',
  fontSize: '15px',
};
