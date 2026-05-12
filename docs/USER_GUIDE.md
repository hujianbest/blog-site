# User Guide

## Welcome to the Personal Writing Platform

A modern, full-stack blog platform with multi-platform publishing capabilities, SEO optimization, and community engagement features.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Writing Articles](#writing-articles)
3. [Managing Articles](#managing-articles)
4. [Categories & Tags](#categories--tags)
5. [Comments](#comments)
6. [Multi-Platform Publishing](#multi-platform-publishing)
7. [SEO Best Practices](#seo-best-practices)

## Getting Started

### First Time Setup

1. **Register an Account**
   - Click "Sign Up" in the header
   - Enter your email and password
   - Verify your email (if enabled)

2. **Complete Your Profile**
   - Add your display name
   - Upload a profile picture (optional)
   - Write a short bio

3. **Create Your First Article**
   - Click "New Article" in the dashboard
   - Start writing in Markdown
   - Save as draft or publish

## Writing Articles

### Using the Markdown Editor

#### Basic Formatting

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*
~~Strikethrough~~

`Inline code`

```
Code block
```

[Link text](https://example.com)

![Image alt text](image-url.jpg)
```

#### Lists

```markdown
- Unordered list item 1
- Unordered list item 2
  - Nested item

1. Ordered list item 1
2. Ordered list item 2
```

#### Blockquotes

```markdown
> This is a blockquote
> It can span multiple lines
```

#### Tables

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
```

#### Code Highlighting

````markdown
```javascript
function hello() {
  console.log("Hello, World!");
}
```
````

### Editor Toolbar Features

- **Bold**: Ctrl/Cmd + B
- **Italic**: Ctrl/Cmd + I
- **Heading**: Ctrl/Cmd + H
- **Code**: Ctrl/Cmd + K
- **Link**: Ctrl/Cmd + L
- **Image**: Ctrl/Cmd + G
- **Preview**: Toggle live preview
- **Full Screen**: Focus on writing

### Auto-Save

Your articles are automatically saved every 30 seconds. Look for the auto-save indicator in the bottom right corner of the editor.

**Manual Save**: Press Ctrl/Cmd + S

## Managing Articles

### Creating Articles

1. **From Dashboard**:
   - Click "New Article"
   - Enter title and content
   - Choose category and tags
   - Add cover image (optional)
   - Save as draft or publish

2. **Article Settings**:
   - **Title**: Required, max 500 characters
   - **Content**: Markdown format
   - **Excerpt**: Auto-generated or custom (max 500 characters)
   - **Cover Image**: Optional, displayed on article cards
   - **Category**: Choose from existing or create new
   - **Tags**: Add multiple tags for better organization

### Editing Articles

1. Navigate to "My Articles" in the dashboard
2. Click the edit icon on any article
3. Make your changes
4. Save or update

### Publishing Articles

**Draft → Publish**:
1. Open the article
2. Click "Publish"
3. Review the preview
4. Confirm publication

**Scheduled Publishing** (Coming Soon):
- Set a future publish date
- Article auto-publishes at scheduled time

### Deleting Articles

1. Open the article
2. Click "Delete"
3. Confirm deletion

**Note**: Deleted articles are moved to trash and can be recovered within 30 days.

## Categories & Tags

### Categories

**Purpose**: Broad content organization (e.g., "Technology", "Travel", "Recipes")

**Creating Categories**:
1. Go to Dashboard → Categories
2. Click "New Category"
3. Enter name and optional parent category
4. Save

**Best Practices**:
- Limit to 5-10 main categories
- Use hierarchical structure for subcategories
- Keep category names short and descriptive

### Tags

**Purpose**: Specific content labeling (e.g., "Vue.js", "tutorial", "quick-tip")

**Adding Tags**:
1. While editing an article
2. Type in the tags field
3. Press Enter to add each tag
4. Tags are auto-created if they don't exist

**Best Practices**:
- Use 3-5 tags per article
- Be specific with tag names
- Use consistent naming (lowercase, hyphens for spaces)

## Comments

### Reading Comments

Comments are displayed at the bottom of each article in chronological order. Only approved comments are visible to public visitors.

### Writing Comments

1. **Required Information**:
   - Name: Your display name
   - Email: Valid email address (not displayed publicly)
   - Comment: Your message

2. **Comment Guidelines**:
   - Be respectful and constructive
   - Stay on topic
   - No spam or self-promotion
   - Maximum 5,000 characters

3. **Comment Moderation**:
   - All comments are reviewed before publication
   - Approval typically within 24 hours
   - You'll receive email notification when approved

### Replying to Comments

1. Click "Reply" on any comment
2. Write your response
3. Submit for moderation

**Note**: Replies are nested under the parent comment.

### Managing Your Comments

**As a Reader**:
- Edit your comments within 15 minutes of posting
- Delete your own comments at any time

**As an Author**:
- Approve, reject, or delete any comment
- Reply to reader comments
- Flag spam for automatic filtering

## Multi-Platform Publishing

### Supported Platforms

Currently supported:
- **Zhihu**: 中国最大的问答社区
- **Twitter/X**: Global microblogging platform

More platforms coming soon!

### Setting Up Platform Connections

#### Step 1: Authorize Platform

1. Go to Dashboard → Connected Platforms
2. Click "Connect" next to your desired platform
3. You'll be redirected to the platform's authorization page
4. Log in and grant permissions
5. You'll be redirected back with confirmation

#### Step 2: Verify Connection

1. Check the connection status
2. Should show "Connected" with username
3. Disconnect anytime by clicking "Disconnect"

### Publishing to Platforms

#### Single Article Publishing

1. Open your published article
2. Click "Publish to Platforms"
3. Select platforms to publish to
4. Click "Publish"

**What Gets Published**:
- Article title
- Article content (formatted for platform)
- Cover image (if supported)
- Tags (if supported)

#### Bulk Publishing

1. Go to Dashboard → My Articles
2. Select multiple articles using checkboxes
3. Click "Publish Selected"
4. Choose platforms
5. Confirm

### Monitoring Publication Status

**Check Status**:
1. Go to Dashboard → Publication History
2. View status for each platform:
   - **Pending**: Awaiting processing
   - **Success**: Published successfully
   - **Failed**: Error occurred (view error details)

**Troubleshooting Failed Publications**:
- Verify platform connection is active
- Check article meets platform requirements
- Re-authorize if token expired
- Contact support if issue persists

### Platform-Specific Tips

#### Zhihu
- Articles are published as "回答" or "文章"
- Markdown formatting is preserved
- Images are automatically uploaded
- Maximum article length: 10,000 characters

#### Twitter/X
- Articles are truncated to fit tweet length
- Link to full article is included
- Images are attached as media
- Hashtags from article tags are included

## SEO Best Practices

### Title Optimization

**Best Practices**:
- Keep titles under 60 characters
- Include primary keywords naturally
- Make titles descriptive and engaging
- Avoid clickbait or misleading titles

**Examples**:
- ✅ "How to Build a REST API with Spring Boot"
- ❌ "You Won't Believe This Amazing Tutorial!!!"

### Meta Descriptions

**What They Are**: Brief summaries that appear in search results

**Best Practices**:
- Keep under 160 characters
- Include target keywords
- Accurately describe the content
- Include a call-to-action when appropriate

**Auto-Generated**: The platform auto-generates descriptions from your article excerpt

### Headings Structure

**Best Practices**:
- Use only one H1 (article title)
- Use H2 for main sections
- Use H3-H6 for subsections
- Maintain logical hierarchy

**Example Structure**:
```markdown
# Article Title (H1 - Auto)
## Introduction (H2)
### Background (H3)
## Main Content (H2)
### Key Points (H3)
## Conclusion (H2)
```

### Image Optimization

**Best Practices**:
- Use descriptive file names (e.g., `spring-boot-tutorial.jpg`)
- Add alt text for accessibility
- Compress images for faster loading
- Use appropriate dimensions (recommended: 1200x630px for cover images)

**Alt Text Examples**:
- ✅ "Screenshot of Spring Boot application configuration"
- ❌ "image1.jpg" or "img_12345"

### Internal Linking

**Why It Matters**:
- Helps readers discover related content
- Improves SEO through site structure
- Increases page views and engagement

**Best Practices**:
- Link to relevant articles naturally
- Use descriptive anchor text
- Don't overdo it (2-5 internal links per article)
- Open external links in new tabs

### URL Structure

**Format**: Articles use clean, readable URLs
```
https://yourdomain.com/articles/article-title-here
```

**Best Practices**:
- URLs are auto-generated from titles
- Use short, descriptive titles
- Avoid special characters
- Hyphens separate words

## Tips & Tricks

### Keyboard Shortcuts

**Global**:
- `Ctrl/Cmd + K`: Quick search
- `Ctrl/Cmd + /`: Command palette

**Editor**:
- `Ctrl/Cmd + S`: Save
- `Ctrl/Cmd + B`: Bold
- `Ctrl/Cmd + I`: Italic
- `Ctrl/Cmd + K`: Insert code
- `Ctrl/Cmd + Shift + P`: Toggle preview

### Productivity Tips

1. **Use Article Templates**: Create reusable templates for common article types
2. **Batch Editing**: Edit multiple articles' tags/categories at once
3. **Scheduled Publishing**: Plan content calendar (coming soon)
4. **Analytics Dashboard**: Track your most popular articles

### Getting Help

**Documentation**:
- API Docs: `/docs/API.md`
- Deployment Guide: `/docs/DEPLOYMENT.md`
- Troubleshooting: Check `/docs/TROUBLESHOOTING.md`

**Support**:
- GitHub Issues: Report bugs and feature requests
- Community Forum: Connect with other users
- Email Support: support@example.com

## FAQ

**Q: Can I import articles from other platforms?**
A: Yes, we support importing from WordPress, Medium, and Ghost. Go to Dashboard → Import.

**Q: Is there a mobile app?**
A: Not yet, but the platform is mobile-responsive and works great on mobile browsers.

**Q: Can I collaborate with co-authors?**
A: Team features are coming soon! You'll be able to invite collaborators with different permissions.

**Q: How do I customize my blog's appearance?**
A: Go to Settings → Appearance. You can choose themes, colors, and layouts.

**Q: Can I export my articles?**
A: Yes, go to Dashboard → Export to download all your articles in Markdown or JSON format.

---

**Last Updated**: 2026-05-12

**Version**: 0.0.1-SNAPSHOT

For more information, visit our GitHub repository or contact support.
