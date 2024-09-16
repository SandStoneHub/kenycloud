import { ConvexError, v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const createFile = mutation({
    args: {
        name: v.string(),
        orgId: v.string()
    },
    async handler(ctx, args) {
        const identify = await ctx.auth.getUserIdentity()
        
        console.log(identify)

        if(!identify) {
            throw new ConvexError("Вы должны быть авторизованы, чтобы загрузить файл!")
        }

        await ctx.db.insert("files", {
            name: args.name,
            orgId: args.orgId
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

        return ctx.db
        .query("files")
        .withIndex("by_orgId", q => 
            q.eq("orgId", args.orgId)
        )
        .collect()
    }
})