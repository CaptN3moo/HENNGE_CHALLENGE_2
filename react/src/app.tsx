import { useState } from 'react';
import { CreateUserForm } from './create-user-form';

function App() {
  const [userWasCreated, setUserWasCreated] = useState(false);
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsiYXNodXRvc2guY2hhdWRoYXJpX2NvbXAyMUBwY2NvZXIuaW4iXSwiaXNzIjoiaGVubmdlLWFkbWlzc2lvbi1jaGFsbGVuZ2UiLCJzdWIiOiJjaGFsbGVuZ2UifQ.wNk_h_L8DdeQ6-zKVO1Lxe-u_eCTdJM-1fELJMbARPM'; // add your actual token here

  if (userWasCreated) {
    return <p>User was successfully created!</p>;
  }

  return <CreateUserForm setUserWasCreated={setUserWasCreated} token={token} />;
}

export default App;
