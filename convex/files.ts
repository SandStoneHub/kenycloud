import { ConvexError, v } from "convex/values"
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server"
import { getUser } from "./users"
import { fileTypes } from "./schema";
import { Id } from "./_generated/dataModel";

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
        orgId: v.string(),
        type: fileTypes
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
            type: args.type
        })
    }
})

export const getFiles = query({
    args: {
        orgId: v.string(),
        query: v.optional(v.string())
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

        const files = await ctx.db
            .query("files")
            .withIndex("by_orgId", q => 
                q.eq("orgId", args.orgId)
            )
            .collect()
        
        const query = args.query

        if(!query){
            return files
        } else{
            return files.filter(file => file.name.toLowerCase().includes(query.toLowerCase()    ))
        }
    }
})

export const deleteFile = mutation({
    args: { fileId: v.id("files") },
    async handler(ctx, args){
        const access = await hasAccessToFile(ctx, args.fileId)

        if(!access){
            throw new ConvexError("no access to file")
        }

        await ctx.db.delete(args.fileId)
        
    }
})

export const toggleFavorite = mutation({
    args: { fileId: v.id("files") },
    async handler(ctx, args){
        const access = await hasAccessToFile(ctx, args.fileId)

        if(!access){
            throw new ConvexError("no access to file")
        }

        const favorite = await ctx.db.query("favorites").withIndex("by_userId_orgId_fileId", 
            q => q.eq("userId", access.user._id).eq("orgId", access.file.orgId).eq("fileId", access.file._id)).first()

        if(!favorite){
            await ctx.db.insert("favorites", {
                fileId: access.file._id,
                userId: access.user._id,
                orgId: access.file.orgId
            })
        } else {
            await ctx.db.delete(favorite._id)
        }
    }
})

async function hasAccessToFile(ctx: QueryCtx |  MutationCtx, fileId: Id<"files">){
    const identify = await ctx.auth.getUserIdentity()

    if(!identify) return null

    const file = await ctx.db.get(fileId)

    if(!file) return null

    const hasAccess = await hasAccessToOrg(ctx, identify.tokenIdentifier, file.orgId)

    if(!hasAccess) return null

    const user = await ctx.db.query("users").withIndex("by_tokenIdentifier", 
        q => q.eq("tokenIdentifier", identify.tokenIdentifier)).first()

    if(!user) return null

    return {user, file}

}