# How to Add New Blog Posts

## Quick Steps

1. **Create a new markdown file** in `blog/posts/`
   
   Example: `blog/posts/my-new-article.md`
   
   ```markdown
   # My New Article Title
   
   Your content here. Use **bold**, *italics*, [links](https://example.com), etc.
   
   ## Subheading
   
   More content...
   ```

2. **Add entry to `blog/posts.json`**
   
   ```json
   [
     {
       "slug": "us-election",
       "title": "US Election",
       "date": "",
       "excerpt": ""
     },
     {
       "slug": "my-new-article",
       "title": "My New Article Title",
       "date": "",
       "excerpt": "Optional short description"
     }
   ]
   ```

3. **Add card to `index.html`** (in the blog-grid section)
   
   ```html
   <article class="blog-card reveal">
       <span class="blog-date"></span>
       <h3 class="blog-card-title">My New Article Title</h3>
       <p class="blog-excerpt">Optional excerpt</p>
       <a href="blog/post.html?slug=my-new-article" class="blog-link">Read →</a>
   </article>
   ```

## That's it!

The `slug` must match:
- The filename (without `.md`)
- The `?slug=` in the URL
