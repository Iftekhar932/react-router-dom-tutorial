import React, { useEffect } from "react";
import {
  Form,
  Link,
  NavLink,
  Outlet,
  redirect,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "react-router-dom";

import { createContact, getContacts } from "../contacts";
/* 
export async function loader() {
  const contacts = await getContacts();
  return { contacts };
} */
export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return { contacts, q };
}

export async function action() {
  const contact = await createContact();
  // return { contacts };
  return redirect(`contacts/${contact.id}/edit`);
}

export const Root = () => {
  const { contacts, q } = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();
  /* The "navigation.location" will show up when the app is navigating to a new URL and loading the data for it. It then goes away when there is no pending navigation anymore. */
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  useEffect(() => {
    document.getElementById("q").value = q;
  }, [q]);

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <Form id="search-form" role="search">
          <input
            id="q"
            aria-label="Search contacts"
            className={searching ? "loading" : ""}
            placeholder="Search"
            type="search"
            name="q"
            defaultValue={q}
            onChange={(e) => {
              const isFirstSearch = q == null;
              submit(e.currentTarget.form, { replace: !isFirstSearch });
            }}
            /* "replace: !isFirstSearch" set  We only want to replace search results, not the page before we started searching, so we do a quick check if this is the first search or not and then decide to replace.
          Each key stroke no longer creates new entries, so the user can click back out of the search results without having to click it 7 times 😅. */
          />
          <div id="search-spinner" aria-hidden hidden={!searching} />
          <div className="sr-only" aria-live="polite"></div>
        </Form>
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
