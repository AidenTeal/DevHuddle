import { auth, signOut } from "@/auth"
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";

const Home = async () => {
  const session = await auth();
  console.log(session);

  return (
    <div className="card h-full w-full flex flex-col items-center justify-center">
      <h1 className="h1-bold">
        Tailwind CSS is FUN
      </h1>

      {session && (
        <form className="px-10 pt-[100px]" action={async () => {
          "use server"
          await signOut({redirectTo: ROUTES.SIGN_IN})
        }}>
          <Button>
            Sign Out

          </Button>
        </form>
      )}
    </div>
  );
}

export default Home