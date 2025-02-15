import { Await, useLoaderData } from "react-router-dom";
import EventsList from "../components/EventsList";
import StyledSuspense from "../components/StyledSuspense";

function EventsPage() {
  const { events } = useLoaderData();
  return (
    <StyledSuspense>
      <Await resolve={events}>
        {(loadEvents) => <EventsList events={loadEvents} />}
      </Await>
    </StyledSuspense>
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
