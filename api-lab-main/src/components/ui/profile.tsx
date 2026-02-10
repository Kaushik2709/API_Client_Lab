import React, { useContext } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";

export default function Profile() {
  const navigate = useNavigate();
  const context = useContext(AuthContext);
  const user = context?.user;

  return (
    <Button
      variant="outline"
      className="gap-2"
      onClick={() => navigate("/profileDetails")}
    >
      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-semibold">
        {user
          ? `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase() ||
            "U"
          : "U"}
      </div>
    </Button>
  );
}
