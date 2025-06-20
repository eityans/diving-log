import { useAtomValue, useSetAtom } from "jotai";
import { userInfoAtom } from "@/lib/jotai/userAtoms";
import { useUser, getAccessToken } from "@auth0/nextjs-auth0";
import { useEffect } from "react";

export function useCurrentUser() {
  const currentUser = useAtomValue(userInfoAtom);
  const setUserInfo = useSetAtom(userInfoAtom);
  const { user, isLoading: isAuthLoading } = useUser();

  useEffect(() => {
    if (!currentUser && !isAuthLoading && user) {
      fetchUserInfo();
    }
  }, [currentUser, isAuthLoading, user]);

  const fetchUserInfo = async (forceUpdate = false) => {
    try {
      // 強制更新でない場合かつデータがあればキャッシュを返す
      if (!forceUpdate && currentUser) {
        return currentUser;
      }

      const token = await getAccessToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch user info");

      const data = await response.json();
      setUserInfo({ ...data, token });
      return data;
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      throw error;
    }
  };

  return {
    currentUser,
    fetchUserInfo,
    refreshUserInfo: () => fetchUserInfo(true),
    isLoading: isAuthLoading || (user && !currentUser),
  };
}
