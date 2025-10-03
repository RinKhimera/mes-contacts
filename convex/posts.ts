import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// Créer un nouveau post
export const createPost = mutation({
  args: {
    businessName: v.string(),
    businessImageUrl: v.optional(v.string()),
    category: v.string(),
    description: v.optional(v.string()),
    phone: v.string(),
    email: v.string(),
    website: v.optional(v.string()),
    address: v.string(),
    city: v.string(),
    province: v.string(),
    postalCode: v.string(),
    longitude: v.optional(v.number()),
    latitude: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error(
        "Unauthorized. You need to be logged in to create a post.",
      )
    }

    // Trouver l'utilisateur dans la base de données
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique()

    if (!user) {
      throw new Error("User not found")
    }

    // Créer l'objet geo si longitude et latitude sont fournis
    const geo =
      args.longitude !== undefined && args.latitude !== undefined
        ? { longitude: args.longitude, latitude: args.latitude }
        : undefined

    const postId = await ctx.db.insert("posts", {
      authorId: user._id,
      businessName: args.businessName,
      businessImageUrl: args.businessImageUrl,
      category: args.category,
      description: args.description,
      phone: args.phone,
      email: args.email,
      website: args.website,
      address: args.address,
      city: args.city,
      province: args.province,
      postalCode: args.postalCode,
      geo,
      status: "DRAFT",
    })

    return postId
  },
})

// Obtenir un post par ID
export const getPostById = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId)
    return post
  },
})

// Obtenir tous les posts
export const getPosts = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").order("desc").collect()
    return posts
  },
})

// Obtenir les posts de l'utilisateur courant
export const getCurrentUserPosts = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Unauthorized")
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique()

    if (!user) {
      throw new Error("User not found")
    }

    const posts = await ctx.db
      .query("posts")
      .withIndex("by_authorId", (q) => q.eq("authorId", user._id))
      .order("desc")
      .collect()

    return posts
  },
})

// Mettre à jour un post
export const updatePost = mutation({
  args: {
    postId: v.id("posts"),
    businessName: v.string(),
    businessImageUrl: v.optional(v.string()),
    category: v.string(),
    description: v.optional(v.string()),
    phone: v.string(),
    email: v.string(),
    website: v.optional(v.string()),
    address: v.string(),
    city: v.string(),
    province: v.string(),
    postalCode: v.string(),
    longitude: v.optional(v.number()),
    latitude: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Unauthorized")
    }

    // Vérifier que le post existe et appartient à l'utilisateur
    const post = await ctx.db.get(args.postId)
    if (!post) {
      throw new Error("Post not found")
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique()

    if (!user || post.authorId !== user._id) {
      throw new Error("Unauthorized to update this post")
    }

    // Créer l'objet geo si longitude et latitude sont fournis
    const geo =
      args.longitude !== undefined && args.latitude !== undefined
        ? { longitude: args.longitude, latitude: args.latitude }
        : undefined

    await ctx.db.patch(args.postId, {
      businessName: args.businessName,
      businessImageUrl: args.businessImageUrl,
      category: args.category,
      description: args.description,
      phone: args.phone,
      email: args.email,
      website: args.website,
      address: args.address,
      city: args.city,
      province: args.province,
      postalCode: args.postalCode,
      geo,
    })

    return args.postId
  },
})

// Supprimer un post
export const deletePost = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Unauthorized")
    }

    // Vérifier que le post existe et appartient à l'utilisateur
    const post = await ctx.db.get(args.postId)
    if (!post) {
      throw new Error("Post not found")
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique()

    if (!user || post.authorId !== user._id) {
      throw new Error("Unauthorized to delete this post")
    }

    await ctx.db.delete(args.postId)
    return args.postId
  },
})

// Changer le statut d'un post
export const changePostStatus = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    // Vérifier que le post existe
    const post = await ctx.db.get(args.postId)
    if (!post) {
      throw new Error("Post not found")
    }

    // Pour les webhooks Stripe, on n'a pas d'authentification utilisateur
    // mais on veut quand même publier le post après paiement
    const identity = await ctx.auth.getUserIdentity()

    if (identity) {
      // Si authentifié, vérifier que le post appartient à l'utilisateur
      const user = await ctx.db
        .query("users")
        .withIndex("by_tokenIdentifier", (q) =>
          q.eq("tokenIdentifier", identity.tokenIdentifier),
        )
        .unique()

      if (!user || post.authorId !== user._id) {
        throw new Error("Unauthorized to change status of this post")
      }
    }

    let newStatus: "DRAFT" | "PUBLISHED" | "DISABLED"

    // Logique de changement de statut
    if (post.status === "DRAFT") {
      // DRAFT → PUBLISHED (après paiement)
      newStatus = "PUBLISHED"
    } else if (post.status === "DISABLED") {
      // DISABLED → PUBLISHED (réactivation)
      newStatus = "PUBLISHED"
    } else {
      // PUBLISHED → DISABLED (désactivation)
      newStatus = "DISABLED"
    }

    await ctx.db.patch(args.postId, {
      status: newStatus,
    })

    return args.postId
  },
})

// Rechercher des posts par catégories
export const searchPostsByCategories = query({
  args: { categories: v.array(v.string()) },
  handler: async (ctx, args) => {
    if (args.categories.length === 0) {
      return await ctx.db.query("posts").order("desc").collect()
    }

    const posts = await ctx.db
      .query("posts")
      .filter((q) =>
        q.or(...args.categories.map((cat) => q.eq(q.field("category"), cat))),
      )
      .order("desc")
      .collect()

    return posts
  },
})

// Rechercher des posts par terme de recherche
export const searchPosts = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    if (!args.searchTerm || args.searchTerm.trim() === "") {
      return await ctx.db.query("posts").order("desc").collect()
    }

    const allPosts = await ctx.db.query("posts").order("desc").collect()

    const normalizedTerm = args.searchTerm.trim().toLowerCase()

    const filteredPosts = allPosts.filter(
      (post) =>
        post.businessName.toLowerCase().includes(normalizedTerm) ||
        post.city.toLowerCase().includes(normalizedTerm) ||
        post.province.toLowerCase().includes(normalizedTerm),
    )

    return filteredPosts
  },
})

// Recherche combinée (terme + catégories)
export const searchPostsCombined = query({
  args: {
    searchTerm: v.string(),
    categories: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // Si aucun filtre, retourner tous les posts
    if (
      (!args.searchTerm || args.searchTerm.trim() === "") &&
      args.categories.length === 0
    ) {
      return await ctx.db.query("posts").order("desc").collect()
    }

    const allPosts = await ctx.db.query("posts").order("desc").collect()

    const normalizedTerm = args.searchTerm
      ? args.searchTerm.trim().toLowerCase()
      : ""

    const filteredPosts = allPosts.filter((post) => {
      // Vérifier le terme de recherche
      const matchesSearchTerm =
        !normalizedTerm ||
        post.businessName.toLowerCase().includes(normalizedTerm) ||
        post.city.toLowerCase().includes(normalizedTerm) ||
        post.province.toLowerCase().includes(normalizedTerm)

      // Vérifier les catégories
      const matchesCategory =
        args.categories.length === 0 || args.categories.includes(post.category)

      return matchesSearchTerm && matchesCategory
    })

    return filteredPosts
  },
})

// Recherche avancée avec filtres multiples
export const searchPostsAdvanced = query({
  args: {
    searchTerm: v.optional(v.string()),
    category: v.optional(v.string()),
    province: v.optional(v.string()),
    city: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("DRAFT"),
        v.literal("PUBLISHED"),
        v.literal("DISABLED"),
      ),
    ),
  },
  handler: async (ctx, args) => {
    let posts = await ctx.db.query("posts").order("desc").collect()

    // Filtrer par statut (par défaut uniquement PUBLISHED)
    if (args.status) {
      posts = posts.filter((post) => post.status === args.status)
    } else {
      posts = posts.filter((post) => post.status === "PUBLISHED")
    }

    // Filtrer par catégorie
    if (args.category && args.category !== "all") {
      posts = posts.filter((post) => post.category === args.category)
    }

    // Filtrer par province
    if (args.province && args.province !== "all") {
      posts = posts.filter((post) => post.province === args.province)
    }

    // Filtrer par ville
    if (args.city && args.city.trim() !== "") {
      const normalizedCity = args.city.trim().toLowerCase()
      posts = posts.filter((post) =>
        post.city.toLowerCase().includes(normalizedCity),
      )
    }

    // Filtrer par terme de recherche
    if (args.searchTerm && args.searchTerm.trim() !== "") {
      const normalizedTerm = args.searchTerm.trim().toLowerCase()
      posts = posts.filter(
        (post) =>
          post.businessName.toLowerCase().includes(normalizedTerm) ||
          post.description?.toLowerCase().includes(normalizedTerm) ||
          post.city.toLowerCase().includes(normalizedTerm) ||
          post.address.toLowerCase().includes(normalizedTerm),
      )
    }

    return posts
  },
})
