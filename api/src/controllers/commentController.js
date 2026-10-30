// Les commentaires d'une publication, et l'ajout simulé d'un commentaire
import { listResponse } from '../services/listService.js'
import { simulateAddComment } from '../services/writeService.js'
import { notFound } from '../utils/httpError.js'
import { findUser } from './resourceController.js'

export function createCommentController(store) {
  return {
    // /posts/:postId/comments et /comments/post/:postId
    byPost(req, res) {
      const postId = Number(req.params.postId)
      if (!store.posts.findById(postId)) throw notFound(`Post with id '${req.params.postId}' not found`)
      const items = store.comments.all().filter((comment) => comment.postId === postId)
      res.json(listResponse('comments', items, req.validated.query))
    },

    add(req, res) {
      const { body, postId, userId } = req.validated.body
      if (!store.posts.findById(postId)) throw notFound(`Post with id '${postId}' not found`)
      const user = findUser(store, userId)
      res.status(201).json(simulateAddComment(store.comments, user, { body, postId }))
    },
  }
}
