import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";

function SaveUserToDB() {
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    try {
      const userData = {
        clerkId: user.id,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        email: user.primaryEmailAddress?.emailAddress,
        image: user.imageUrl,
      };

      // خزن المستخدم في localStorage
      localStorage.setItem("userData", JSON.stringify(userData));

      console.log("✅ User saved locally!");
    } catch (error) {
      console.error("❌ Error saving user locally:", error);
    }
  }, [user]);

  return null; // مفيش واجهة، بس بيشتغل تلقائي
}

export default SaveUserToDB;
