import { Link, useRouteLoaderData, useSubmit } from "react-router-dom";
import classes from "./EventItem.module.css";

function EventItem({ event }) {
  const token = useRouteLoaderData("root");
  const submid = useSubmit();

  function startDeleteHandler() {
    const proceed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (proceed) {
      submid(null, { method: "DELETE" });
    }
  }

  return (
    <article className={classes.event}>
      <img src={event.image} alt={event.title} />
      <h1>{event.title}</h1>
      <time>{event.date}</time>
      <p>{event.description}</p>
      {token && (
        <menu className={classes.actions}>
          <Link to="edit">Edit</Link>
          <button onClick={startDeleteHandler}>Delete</button>
        </menu>
      )}
    </article>
  );
}

export default EventItem;
