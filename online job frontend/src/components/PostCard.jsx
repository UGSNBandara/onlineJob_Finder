import { Link } from 'react-router-dom'

function PostCard({ post, onLike, onApply }) {
  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-company">
          <Link to={`/profile/company/${post.companyId}`}>
            <img src={post.companyLogo} alt={post.company} className="company-logo" />
          </Link>
          <div>
            <h3>{post.title}</h3>
            <Link to={`/profile/company/${post.companyId}`} className="company-name">
              {post.company}
            </Link>
          </div>
        </div>
      </div>
      <img src={post.image} alt={post.title} className="post-image" />
      <p className="post-content">{post.content}</p>
      <div className="post-actions">
        <button 
          className="action-btn"
          onClick={onLike}
        >
          👍 Like ({post.likes})
        </button>
        <button 
          className="action-btn apply-btn"
          onClick={onApply}
          disabled={post.applied}
        >
          {post.applied ? 'Applied ✓' : 'Apply Now'}
        </button>
      </div>
    </div>
  )
}

export default PostCard 