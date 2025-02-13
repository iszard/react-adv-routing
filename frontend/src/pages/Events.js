/*
import { Link } from "react-router-dom";

const DUMMY_EVENTS = [
  { id: "e1", title: "Some Event" },
  { id: "e2", title: "Another Event" },
];

function EventsPage() {
  return (
    <>
      <h1>Events Page</h1>
      <ul>
        {DUMMY_EVENTS.map((event) => (
          <li key={event.id}>
            <Link to={event.id}>{event.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export default EventsPage;
*/

import { Suspense } from "react";
import { Await, useLoaderData } from "react-router-dom";
import EventsList from "../components/EventsList";

function EventsPage() {
  const { events } = useLoaderData();
  //   const data = useLoaderData();

  //   if (data.isError) {
  //     return <p>{data.message}</p>;
  //   }

  //   const events = data.events;

  //   return <EventsList events={events} />;

  return (
    <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
      <Await resolve={events}>
        {(loadEvents) => <EventsList events={loadEvents} />}
      </Await>
    </Suspense>
  );
}

export default EventsPage;

async function loadEvents() {
  const response = await fetch("http://localhost:8080/events");

  if (!response.ok) {
    throw new Response(null, {
      statusText: "Failed to fetch events.",
      status: 500,
    });
  }

  const resData = await response.json();
  return resData.events;
}

export function loader() {
  const events = loadEvents(); // returns a Promise

  return {
    events,
  };
}
