import { Suspense } from "react";
import { Await, redirect, useRouteLoaderData } from "react-router-dom";
import EventItem from "../components/EventItem";
import EventsList from "../components/EventsList";

function EventDetailsPage() {
  //   const params = useParams();

  const { event, events } = useRouteLoaderData("event-detail");

  return (
    <>
      <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
        <Await resolve={event}>
          {(loadEvent) => <EventItem event={loadEvent} />}
        </Await>
      </Suspense>
      <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
        <Await resolve={events}>
          {(loadEvents) => <EventsList events={loadEvents} />}
        </Await>
      </Suspense>
    </>
  );
}

export default EventDetailsPage;

async function loadEvent(id) {
  const response = await fetch(`http://localhost:8080/events/${id}`);

  if (!response.ok) {
    throw new Response(null, {
      statusText: "Failed to fetch event.",
      status: 500,
    });
  }

  const resData = await response.json();
  return resData.event;

  //   return response;
}

async function loadEvents() {
  const response = await fetch("http://localhost:8080/events");

  if (!response.ok) {
    // return { isError: true, message: "Failed to fetch events" };

    // throw { message: "Failed to fetch events" };

    throw new Response(null, {
      statusText: "Failed to fetch events.",
      status: 500,
    });
  }

  const resData = await response.json();
  return resData.events;
}

export async function loader({ request, params }) {
  const id = params.eventId;

  return {
    event: await loadEvent(id),
    events: loadEvents(),
  };
}

export async function action({ request, params }) {
  const eventId = params.eventId;

  const response = await fetch(`http://localhost:8080/events/${eventId}`, {
    method: request.method,
  });

  console.log(response);

  if (!response.ok) {
    throw new Response(null, {
      statusText: "Could not delete event.",
      status: 500,
    });
  }

  return redirect("/events");
}
