import React, { ReactNode, useEffect, useState } from "react";
import cn from "clsx";
import { trpc } from "@utils/trpc";
import { useSession } from "next-auth/react";
import ReplyModal from "@components/modals/ReplyModal";
import { TweetProps } from "@types";
import ReplyIcon from "@icons/tweet/ReplyIcon";
import RetweetIcon from "@icons/tweet/RetweetIcon";
import LikeIcon from "@icons/tweet/LikeIcon";
import ShareIcon from "@icons/tweet/ShareIcon";
import NextLink from "@components/NextLink";

export function TweetActions(props: TweetProps) {
  let [isOpen, setIsOpen] = useState(false);
  function closeModal() {
    setIsOpen(false);
  }

  let { data } = useSession();
  let likeTweet = trpc.tweet.likeTweet.useMutation();
  let replyTweet = trpc.tweet.replyTweet.useMutation();
  let reTweet0 = trpc.tweet.reTweet.useMutation();
  function like() {
    let result = likeTweet.mutate({ id: props.id });
    console.log("like", result);
  }
  function reply() {
    setIsOpen(!isOpen);
    // let result = replyTweet.mutate({ id: props.id, body: "test" });
    console.log("open", isOpen);
  }
  function reTweet() {
    let result = reTweet0.mutate({ id: props.id });
    console.log("reTweet", result);
  }
  const [interactionState, setInteractionState] = useState({
    liked: false,
    retweeted: false,
    replied: false,
  });

  useEffect(() => {
    const isLiked = props.likes.some((l) => l.userId === data?.userData.id);
    const isRetweeted = props.retweets.some(
      (r) => r.userId === data?.userData.id
    );
    const isReplied = props.replies.some((r) => r.userId === data?.userData.id);
    console.log("isr", isReplied);

    setInteractionState({
      liked: isLiked,
      retweeted: isRetweeted,
      replied: isReplied,
    });
  }, []);
  let buttons: ActionButtonProps[] = [
    { icon: <ReplyIcon />, count: props.replyCount, onClick: reply },
    {
      icon: <RetweetIcon />,
      count: props.retweetCount,
      className: "dark:hover:text-green-400",
      onClick: reTweet,
    },
    {
      icon: <LikeIcon />,
      count: props.likeCount,
      className: "dark:hover:text-red-600",
      onClick: like,
    },
    { icon: <ShareIcon /> },
  ];
  return (
    <>

      <NextLink href="">
      <ReplyModal tweet={props} isOpen={isOpen} closeModal={closeModal} />
        <div className="my-1 flex  w-full justify-around">
          {buttons.map((p) => (
            <ActionButton {...p} />
          ))}
        </div>
      </NextLink>
    </>
  );
}
function ActionButton({ icon, count, className,onClick }: ActionButtonProps) {
  return (
    <div
            onClick={onClick}
      className={cn(
        "duration-350 flex grow items-center justify-center p-3 text-xs text-gray-800  transition ease-in-out hover:text-blue-400 dark:text-white dark:hover:text-blue-400",
        className
      )}
    >
      {icon}
      {count}
    </div>
  );
}
type ActionButtonProps = {
  onClick?: () => any;
  text?: string;
  count?: number;
  icon: ReactNode;
  className?: string;
};
