import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Root from "./routes/root";
import ErrorPage from "./ErrorPage";
import Contact, { loader as contactLoader } from "./routes/contact";
import { loader as rootLoader, action as rootAction } from "./routes/root";
import EditContact, { action as editAction } from "./routes/edit";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
      {
        path: "/contacts/:contactId",
        element: <Contact />,
        loader: contactLoader,
      },
      {
        path: "/contacts/:contactId/edit",
        element: <EditContact />,
        loader: contactLoader,
        action: editAction,
      },
    ],
  },
  // { path: "/contacts/:contactID", element: <Contact /> },
]);

function App() {
  return <RouterProvider className="App" router={router}></RouterProvider>;
}

export default App;
