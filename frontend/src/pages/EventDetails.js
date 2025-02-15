import { Await, redirect, useRouteLoaderData } from "react-router-dom";
import EventItem from "../components/EventItem";
import EventsList from "../components/EventsList";
import StyledSuspense from "../components/StyledSuspense";
import { getAuthToken } from "../util/auth";

function EventDetailsPage() {
  const { event, events } = useRouteLoaderData("event-detail");

  return (
    <>
      <StyledSuspense>
        <Await resolve={event}>
          {(loadEvent) => <EventItem event={loadEvent} />}
        </Await>
      </StyledSuspense>
      <StyledSuspense>
        <Await resolve={events}>
          {(loadEvents) => <EventsList events={loadEvents} />}
        </Await>
      </StyledSuspense>
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

  const token = getAuthToken();
  const response = await fetch(`http://localhost:8080/events/${eventId}`, {
    method: request.method,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Response(null, {
      statusText: "Could not delete event.",
      status: 500,
    });
  }

  return redirect("/events");
}
