import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Settings,
  Shield,
  LogOut,
  Bell,
  Key,
  Database,
  Globe,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AuthContext } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const ProfileDetails = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile, deleteAccount } =
    useContext(AuthContext);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState("general");

  const [formData, setFormData] = React.useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Update local state if user context changes
  React.useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    toast({
      title: "Logged out successfully",
      description: "You have been logged out successfully",
      variant: "default",
    });
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This will permanently remove all your collections, requests, and environments. This action cannot be undone.",
      )
    )
      return;

    setIsDeleting(true);
    try {
      await deleteAccount();
      navigate("/");
      toast({
        title: "Account Deleted",
        description:
          "Your account and all associated data have been permanently removed.",
        variant: "destructive",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.response?.data?.message || "Failed to delete account",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await updateProfile(formData);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Premium Header */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="rounded-full hover:bg-primary/10 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Profile Settings
          </h1>
        </div>
        {user ? (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        ) : (
          <div>
            <Button>
              <LogIn />
              Login
            </Button>
          </div>
        )}
      </header>

      <main className="flex-1 overflow-y-auto p-6 md:p-10 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card className="border-border bg-card/50 backdrop-blur-sm overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-primary/20 via-purple-500/10 to-pink-500/20" />
              <CardContent className="pt-0 -mt-16 flex flex-col items-center">
                <div className="h-32 w-32 rounded-full border-4 border-background bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold shadow-xl mb-4">
                  {user.firstName?.charAt(0)}
                  {user.lastName?.charAt(0)}
                </div>
                <h2 className="text-2xl font-bold">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-muted-foreground text-sm">{user.email}</p>

                <div className="flex gap-2 mt-6 w-full">
                  <Button
                    variant={activeTab === "settings" ? "secondary" : "outline"}
                    className={`flex-1 text-xs h-8 ${activeTab === "settings" ? "bg-primary/20 text-primary hover:bg-primary/30" : ""}`}
                    onClick={() => setActiveTab("settings")}
                  >
                    <Settings className="h-3 w-3 mr-2" />
                    Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            <nav className="space-y-1">
              {[
                { icon: User, label: "General", id: "general" },
                { icon: Shield, label: "Advanced", id: "settings" },
              ].map((item, i) => (
                <Button
                  key={i}
                  variant={activeTab === item.id ? "secondary" : "ghost"}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full justify-start gap-3 h-11 ${activeTab === item.id ? "bg-primary/10 text-primary hover:bg-primary/20" : ""}`}
                >
                  <item.icon
                    className={`h-4 w-4 ${activeTab === item.id ? "text-primary" : "text-muted-foreground"}`}
                  />
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-6">
            {activeTab === "general" && (
              <Card className="border-border bg-card shadow-sm">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your name and primary contact email.
                  </CardDescription>
                </CardHeader>
                <Separator className="bg-border" />
                <CardContent className="space-y-6 pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input
                        id="first-name"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        className="bg-background/50 border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input
                        id="last-name"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        className="bg-background/50 border-border"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="bg-background/50 border-border pl-10"
                      />
                      <Mail className="h-4 w-4 text-muted-foreground absolute left-3 top-3" />
                    </div>
                    <p className="text-[10px] text-muted-foreground italic mt-1 px-1">
                      Updating your email will change your login credentials.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="bg-secondary/20 flex justify-end gap-3 py-4 border-t border-border">
                  <Button variant="ghost" onClick={() => navigate("/")}>
                    Back
                  </Button>
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={handleUpdate}
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            )}

            {activeTab === "settings" && (
              <Card className="border-destructive/20 bg-card shadow-sm overflow-hidden">
                <CardHeader className="bg-destructive/5 border-b border-destructive/10">
                  <CardTitle className="text-destructive flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Danger Zone
                  </CardTitle>
                  <CardDescription>
                    Irreversible actions related to your account and data.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border">
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium">Delete Account</p>
                        <p className="text-xs text-muted-foreground max-w-sm">
                          Permanently remove your account and all its data. This
                          includes all your collections, requests, and
                          environments.
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Delete Permanently"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileDetails;
