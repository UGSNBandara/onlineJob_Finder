import { useState } from 'react'
import PostCard from '../components/PostCard'

function HomePage() {
  const [posts] = useState([
    {
      id: 1,
      title: 'Software Developer',
      company: 'Tech Corp',
      location: 'New York',
      type: 'Full-time',
      description: 'Looking for an experienced software developer...',
      salary: '$80,000 - $100,000',
      postedAt: '2024-03-15'
    },
    {
      id: 2,
      title: 'UX Designer',
      company: 'Design Studio',
      location: 'Remote',
      type: 'Contract',
      description: 'Join our creative team as a UX designer...',
      salary: '$70,000 - $90,000',
      postedAt: '2024-03-14'
    }
  ])

  return (
    <div className="home-page">
      <div className="posts-container">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}

export default HomePage 