import { Comment, CreateCommentDto, CommentQuery } from '../types/Comment'

const commentsStore = new Map<string, Comment>()

export class CommentService {
  async createComment(articleId: string, dto: CreateCommentDto): Promise<Comment> {
    const comment: Comment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      articleId,
      authorName: dto.authorName.trim(),
      authorEmail: dto.authorEmail.trim().toLowerCase(),
      authorUrl: dto.authorUrl?.trim(),
      content: dto.content.trim(),
      status: 'pending',
      parentId: dto.parentId,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    commentsStore.set(comment.id, comment)
    return comment
  }

  async getComments(articleId: string, status: string = 'approved'): Promise<Comment[]> {
    return Array.from(commentsStore.values())
      .filter(c => c.articleId === articleId && c.status === status)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  async deleteComment(id: string): Promise<void> {
    const comment = commentsStore.get(id)
    if (comment) {
      comment.status = 'deleted'
      comment.updatedAt = new Date()
    }
  }
}
