export function getProfilePath(params: {
  username?: string | null;
  emailAddress?: string | null;
}) {
  const identifier =
    params.username ?? params.emailAddress?.split("@")[0] ?? "profile";

  return `/profile/${identifier}`;
}
