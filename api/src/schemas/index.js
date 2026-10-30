// Les contrôles d'entrée (zod), avec les messages d'erreur de DummyJSON
import { z } from 'zod'

const MAX_EXPIRES_IN_MINS = 43_200

const nonNegativeInteger = (name) =>
  z
    .string({ error: `Invalid '${name}' - should be a positive number` })
    .regex(/^\d+$/, { error: `Invalid '${name}' - should be a positive number` })
    .transform(Number)

// select=a,b (ou select=a&select=b) → ['a', 'b']
const fieldList = z
  .union([z.string(), z.array(z.string())])
  .transform((value) => [value].flat().join(',').split(',').filter(Boolean))

export const listQuery = z.object({
  limit: nonNegativeInteger('limit').optional(),
  skip: nonNegativeInteger('skip').optional(),
  select: fieldList.optional(),
  sortBy: z.string({ error: "Invalid 'sortBy'" }).optional(),
  order: z.enum(['asc', 'desc'], { error: "Invalid 'order' - should be either 'asc' or 'desc'" }).optional(),
  q: z.string({ error: "Invalid 'q'" }).optional(),
  key: z.string({ error: "Invalid 'key'" }).optional(),
  value: z.string({ error: "Invalid 'value'" }).optional(),
})

export const delayQuery = z.object({
  delay: z
    .string({ error: 'Delay should be a positive number in milliseconds' })
    .regex(/^\d+$/, { error: 'Delay should be a positive number in milliseconds' })
    .transform(Number)
    .refine((ms) => ms <= 5_000, { error: 'Delay should be less than 5 seconds (5000 milliseconds)' })
    .optional(),
})

// Durée de validité d'un jeton, en minutes : nombre ou texte numérique, 30 jours au plus
const expiresInMins = z
  .union([z.number(), z.string().regex(/^\d+$/).transform(Number)], {
    error: "Invalid 'expiresInMins' - should be a positive number",
  })
  .refine((minutes) => Number.isInteger(minutes) && minutes > 0, {
    error: "Invalid 'expiresInMins' - should be a positive number",
  })
  .refine((minutes) => minutes <= MAX_EXPIRES_IN_MINS, {
    error: `Maximum access token expire time can be ${MAX_EXPIRES_IN_MINS} minutes`,
  })

const required = (message) => z.string({ error: message }).min(1, { error: message })

export const loginBody = z.object({
  username: required('Username and password required'),
  password: required('Username and password required'),
  expiresInMins: expiresInMins.optional(),
})

export const refreshBody = z.object({
  refreshToken: z.string({ error: 'Invalid refresh token' }).optional(),
  expiresInMins: expiresInMins.optional(),
})

// Un identifiant d'utilisateur ou de publication : nombre ou texte numérique
const idOf = (message) =>
  z.union([z.number().int().positive(), z.string().regex(/^\d+$/).transform(Number)], { error: message })

const cartLines = z
  .unknown()
  .transform((value, ctx) => {
    if (value === undefined || value === null || (Array.isArray(value) && value.length === 0)) {
      ctx.addIssue({ code: 'custom', message: 'products can not be empty' })
      return z.NEVER
    }
    const line = z.object({ id: z.number().int().positive(), quantity: z.number().int().min(1).max(1_000).optional() })
    const lines = z.array(line).max(100).safeParse(value)
    if (!lines.success) {
      ctx.addIssue({ code: 'custom', message: 'products must be array of objects, containing product id and quantity' })
      return z.NEVER
    }
    return lines.data
  })

export const cartAddBody = z.object({
  userId: idOf('User id is required'),
  products: cartLines,
})

export const cartUpdateBody = z.object({
  merge: z.boolean().optional(),
  products: cartLines.optional(),
})

export const todoAddBody = z.looseObject({ userId: idOf('User id is required') })
export const postAddBody = z.looseObject({ userId: idOf('User id is required') })

export const commentAddBody = z.object({
  body: z.string({ error: 'Invalid comment body' }).trim().min(1, { error: 'Invalid comment body' }),
  postId: idOf('Post id is required'),
  userId: idOf('User id is required'),
})
