import React from "react";

interface User {
  id: number;
  name: string;
}

const UsersPage = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users", {
    next: { revalidate: 1000 },
  });
  // use cache: 'no-store' to now cache the data, best data thats constantly updated, data is always fresh
  // revalidate: 1000, runs background job and gets fresh data after 1000 sec
  // this only works with fetch, can't work with other libs e.g. axios

  const users: User[] = await res.json();

  return (
    <div>
      UsersPage
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}> {user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default UsersPage;
