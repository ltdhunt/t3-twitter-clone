import { z } from "zod";
import { protectedProcedure } from "../../trpc/trpc";

export const followUser = protectedProcedure
  .input(z.object({ id: z.string().uuid() }))
  .mutation(async ({ ctx, input }) => {
    const existingFollow = await ctx.prisma.userFollow.findFirst({
      where: {
        AND: [
          { followingId: { equals: input.id } },
          { followerId: { equals: ctx.session.id } },
        ],
      },
    });
    let updatedUser;

    if (!existingFollow) {
        console.log("incccccccccc")
      // User is not following, add new row in UserFollow and increment following count of the user and increment the followers count of the other user
      let createRecord = await ctx.prisma.userFollow.create({
        data: {
          followingId: input.id,
          followerId: ctx.session.id,
        },
      });
      updatedUser = await ctx.prisma.user.update({
        where: { id: ctx.session.id },
        data: {
          followingCount: {
            increment: 1,
          },
        },
        include: {
          followers: true,
        },
      });
      await ctx.prisma.user.update({
        where: { id: input.id },
        data: {
          followersCount: {
            increment: 1,
          },
        },
      });
    } else {
      // User is already following, remove the row and decrement both
      let deleteRecord = await ctx.prisma.userFollow.delete({
        where: { id: existingFollow.id },
      });
        console.log("del",deleteRecord,existingFollow.id)
      updatedUser = await ctx.prisma.user.update({
        where: { id: ctx.session.id },
        data: {
          followingCount: {
            decrement: 1,
          },
        },
      });
      await ctx.prisma.user.update({
        where: { id: input.id },
        data: {
          followersCount: {
            decrement: 1,
          },
        },
      });
    }
    return { success: true };
  });
