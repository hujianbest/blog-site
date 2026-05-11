export interface Comment {
  id: string
  articleId: string
  authorName: string
  authorEmail: string
  authorUrl?: string
  content: string
  status: 'pending' | 'approved' | 'spam' | 'deleted'
  parentId?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateCommentDto {
  authorName: string
  authorEmail: string
  authorUrl?: string
  content: string
  parentId?: string
}
