import { useParams } from 'react-router-dom'
import { useState } from 'react'
import PostCard from '../components/PostCard'

function CompanyProfilePage() {
  const { companyId } = useParams()

  const company = {
    id: companyId,
    name: 'Tech Corp',
    description: 'A leading technology company focused on innovation and excellence.',
    location: 'San Francisco, CA',
    industry: 'Technology',
    size: '500-1000 employees',
    founded: '2010',
    logo: '/temp_profile.jpg',
    coverImage: '/temp_post.jpg'
  }

  const [posts] = useState([
    {
      id: 1,
      company: company.name,
      companyId: company.id,
      companyLogo: company.logo,
      title: 'Senior Software Engineer',
      content: 'Looking for an experienced software engineer to join our team...',
      image: '/temp_post.jpg',
      likes: 15,
      applied: false
    },
    {
      id: 2,
      company: company.name,
      companyId: company.id,
      companyLogo: company.logo,
      title: 'Product Manager',
      content: 'Join our growing team as a Product Manager...',
      image: '/temp_post.jpg',
      likes: 25,
      applied: false
    }
  ])

  return (
    <div className="profile-page company-profile">
      <div className="profile-header">
        <div className="profile-cover" style={{ backgroundImage: `url(${company.coverImage})` }}></div>
        <div className="profile-main">
          <div className="profile-picture">
            <img src={company.logo} alt={company.name} />
          </div>
          <div className="profile-info">
            <h1>{company.name}</h1>
            <p className="industry">{company.industry}</p>
            <p className="location">📍 {company.location}</p>
            <div className="company-details">
              <span>Size: {company.size}</span>
              <span>Founded: {company.founded}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2>About</h2>
          <p>{company.description}</p>
        </div>

        <div className="profile-section">
          <h2>Open Positions</h2>
          <div className="posts">
            {posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onLike={() => {}}
                onApply={() => {}}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyProfilePage 