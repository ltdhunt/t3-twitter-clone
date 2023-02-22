import React from "react";

export default function Avatar({
  size = 56,
  avatarImage,
}: {
  size?: number;
  avatarImage?: string;
}) {
  return (
    <div style={{ width: size, height: size }}>
      <img
        className="h-full w-full rounded-full"
        src={
          avatarImage ||
          "https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg"
        }
        alt="avatar"
      />
    </div>
  );
}
