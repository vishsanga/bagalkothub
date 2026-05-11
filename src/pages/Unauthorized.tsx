import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const Unauthorized = () => {
  const { signOut } = useAuth();
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
          <ShieldAlert className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="font-display text-3xl mb-2">Access denied</h1>
        <p className="text-muted-foreground mb-6">
          Your account doesn't have admin permissions. Contact a super admin to request access.
        </p>
        <div className="flex gap-3 justify-center">
          <Button asChild variant="outline"><Link to="/">Back to site</Link></Button>
          <Button onClick={() => signOut()}>Sign out</Button>
        </div>
      </div>
    </main>
  );
};

export default Unauthorized;
