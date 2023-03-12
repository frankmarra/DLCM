import Login from "@/components/Login";
import Alert from "@/components/Alert/Alert";

export default function NotLoggedInUserScreen({ actionText }) {
  return (
    <div className="stack max-inline">
      {actionText ? (
        <Alert
          state="error"
          className="max-inline"
          style={{ "--max-inline-size": "var(--input-screen-max-inline-size)" }}>
          {actionText}
        </Alert>
      ) : null}
      <Login />
    </div>
  );
}
