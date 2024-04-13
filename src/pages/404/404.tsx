import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function RouteError() {
  const error = useRouteError();
  console.error(error);
  if (isRouteErrorResponse(error)) {
    return (
      // TODO: Needs styling
      <div id="error-page" className="error-page">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error.statusText}</i>
        </p>
      </div>
    );
  }
  return <p>Unknown error</p>;
}
