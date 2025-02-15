import { Suspense } from "react";

function StyledSuspense({ children }) {
  return (
    <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
      {children}
    </Suspense>
  );
}

export default StyledSuspense;
