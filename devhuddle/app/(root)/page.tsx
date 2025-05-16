import { auth, signOut } from "@/auth"
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";

const Home = async () => {
  const session = await auth();
  console.log(session);

  return (
    <div className="card">
      <h1 className="h1-bold">
        Tailwind CSS is FUN
      </h1>

      <form className="px-10 pt-[100px]" action={async () => {
        "use server"
        await signOut({redirectTo: ROUTES.SIGN_IN})
      }}>
        <Button type="submit">
          Sign Out
        </Button>

      </form>
    </div>
  );
}

export default Home