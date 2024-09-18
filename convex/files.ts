import { ConvexError, v } from "convex/values"
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server"
import { getUser } from "./users"

export const generateUploadUrl = mutation(async (ctx) => {
    const identify = await ctx.auth.getUserIdentity()

    if(!identify) {
        throw new ConvexError("Вы должны быть авторизованы, чтобы загрузить файл!")
    }

    return await ctx.storage.generateUploadUrl();
});

async function hasAccessToOrg(ctx: QueryCtx | MutationCtx, tokenIdentifier: string, orgId: string) {
    const user = await getUser(ctx, tokenIdentifier)

    const hasAccess = user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId)

    return hasAccess
}

export const createFile = mutation({
    args: {
        name: v.string(),
        fileId: v.id("_storage"),
        orgId: v.string()
    },
    async handler(ctx, args) {
        // throw new Error("you have no access")
        const identify = await ctx.auth.getUserIdentity()
        
        console.log(identify)

        if(!identify) {
            throw new ConvexError("Вы должны быть авторизованы, чтобы загрузить файл!")
        }
    
        const hasAccess = await hasAccessToOrg(ctx, identify.tokenIdentifier, args.orgId)

        if (!hasAccess){
            throw new ConvexError("you do not have access to this org")
        }

        await ctx.db.insert("files", {
            name: args.name,
            orgId: args.orgId,
            fileId: args.fileId,
        })
    }
})

export const getFiles = query({
    args: {
        orgId: v.string(),
    },
    async handler(ctx, args){
        const identify = await ctx.auth.getUserIdentity()

        if(!identify) {
            return []
        }

        const hasAccess = await hasAccessToOrg(ctx, identify.tokenIdentifier, args.orgId)
        
        if(!hasAccess) {
            return []
        }

        return ctx.db
        .query("files")
        .withIndex("by_orgId", q => 
            q.eq("orgId", args.orgId)
        )
        .collect()
    }
})

export const deleteFile = mutation({
    args: { fileId: v.id("files") },
    async handler(ctx, args){
        const identify = await ctx.auth.getUserIdentity()

        if(!identify) {
            throw new ConvexError("you do not have access to this org")
        }

        const file = await ctx.db.get(args.fileId)

        if(!file){
            throw new ConvexError("this file does not exist")
        }

        const hasAccess = await hasAccessToOrg(ctx, identify.tokenIdentifier, file.orgId)

        if(!hasAccess){
            throw new ConvexError("you do not have access to delete this file")
        }

        await ctx.db.delete(args.fileId)
        
    }
})