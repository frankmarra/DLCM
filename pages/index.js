
import Login from "@/components/login";
import Link from "next/link";
import IconRecord from "@/icons/vinyl-record.svg";

export default function Home() {
  return (
    <div>
      <h1>
        <IconRecord aria-hidden="true" /> Download Code Manager
      </h1>
      <Login />
      <p>
        Not a member?{" "}
        <span>
          <Link href="/signup">Sign up!</Link>
        </span>
      </p>
    </div>
  );
}
