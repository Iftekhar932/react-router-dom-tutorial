import React from "react";
import {
  Form,
  Link,
  NavLink,
  Outlet,
  redirect,
  useLoaderData,
  useNavigation,
} from "react-router-dom";

import { createContact, getContacts } from "../contacts";

export async function loader() {
  const contacts = await getContacts();
  return { contacts };
}

export async function action() {
  const contact = await createContact();
  // return { contacts };
  return redirect(`contacts/${contact.id}/edit`);
}

export const Root = () => {
  const { contacts } = useLoaderData();
  const navigation = useNavigation();
  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        {/* other code */}
        <Form method="post">
          <button type="submit">New</button>
        </Form>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : isPending ? "pending" : ""
                    }
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>

        {/* other code */}
      </div>
      <div
        id="detail"
        className={navigation.state == "loading" ? "loading" : ""}
      >
        <Outlet />
      </div>
    </>
  );
};

export default Root;
