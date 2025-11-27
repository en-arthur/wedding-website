'use client';

import { useState } from 'react';

export default function Home() {
  const [uploads, setUploads] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ name: '', message: '' });
  const [activeSection, setActiveSection] = useState('program');

  const program = [
    { time: '2:00 PM', event: 'Guest Arrival & Welcome', description: 'Join us as we gather to celebrate' },
    { time: '3:00 PM', event: 'Ceremony Begins', description: 'The exchange of vows' },
    { time: '4:00 PM', event: 'Cocktail Hour', description: 'Drinks and light refreshments' },
    { time: '5:30 PM', event: 'Reception & Dinner', description: 'Celebrate with food and music' },
    { time: '7:00 PM', event: 'First Dance', description: 'Our first dance as newlyweds' },
    { time: '7:30 PM', event: 'Dancing & Celebration', description: 'Party the night away' },
  ];

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newUploads = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video') ? 'video' : 'image',
      file: file
    }));
    setUploads([...uploads, ...newUploads]);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.name && newComment.message) {
      setComments([...comments, { ...newComment, id: Date.now(), date: new Date().toLocaleDateString() }]);
      setNewComment({ name: '', message: '' });
    }
  };

  const handleDownload = (upload) => {
    const link = document.createElement('a');
    link.href = upload.url;
    link.download = upload.name;
    link.click();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-burgundy text-beige py-12 px-6 text-center">
        <h1 className="text-5xl font-serif mb-3">Our Wedding Celebration</h1>
        <p className="text-xl opacity-90">Join us in celebrating our special day</p>
      </header>

      {/* Navigation */}
      <nav className="bg-sage sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-center gap-8 flex-wrap">
          {['program', 'gallery', 'upload', 'comments'].map(section => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeSection === section 
                  ? 'bg-burgundy text-beige' 
                  : 'bg-beige text-burgundy hover:bg-light-sage'
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Program Section */}
        {activeSection === 'program' && (
          <section className="animate-fadeIn">
            <h2 className="text-4xl font-serif text-burgundy mb-8 text-center">Event Schedule</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {program.map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-sage hover:shadow-xl transition-shadow">
                  <div className="text-burgundy font-bold text-xl mb-2">{item.time}</div>
                  <h3 className="text-2xl font-semibold text-foreground mb-2">{item.event}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Gallery Section */}
        {activeSection === 'gallery' && (
          <section className="animate-fadeIn">
            <h2 className="text-4xl font-serif text-burgundy mb-8 text-center">Photo & Video Gallery</h2>
            {uploads.length === 0 ? (
              <div className="text-center py-16 bg-beige rounded-lg">
                <p className="text-xl text-gray-600">No photos or videos yet. Be the first to share!</p>
                <button 
                  onClick={() => setActiveSection('upload')}
                  className="mt-4 px-8 py-3 bg-burgundy text-beige rounded-full hover:bg-dark-burgundy transition-colors"
                >
                  Upload Now
                </button>
              </div>
            ) : (
              <div className="gallery-grid">
                {uploads.map(upload => (
                  <div key={upload.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    {upload.type === 'image' ? (
                      <img src={upload.url} alt={upload.name} className="w-full h-64 object-cover" />
                    ) : (
                      <video src={upload.url} controls className="w-full h-64 object-cover bg-black" />
                    )}
                    <div className="p-4 flex justify-between items-center bg-beige">
                      <span className="text-sm text-gray-700 truncate flex-1">{upload.name}</span>
                      <button
                        onClick={() => handleDownload(upload)}
                        className="ml-2 px-4 py-2 bg-sage text-white rounded-full hover:bg-burgundy transition-colors text-sm"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Upload Section */}
        {activeSection === 'upload' && (
          <section className="animate-fadeIn">
            <h2 className="text-4xl font-serif text-burgundy mb-8 text-center">Share Your Memories</h2>
            <div className="max-w-2xl mx-auto">
              <div className="upload-area bg-white rounded-lg p-12 text-center">
                <input
                  type="file"
                  id="fileUpload"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="fileUpload" className="cursor-pointer">
                  <div className="text-6xl mb-4">📸</div>
                  <h3 className="text-2xl font-semibold text-burgundy mb-2">Upload Photos & Videos</h3>
                  <p className="text-gray-600 mb-4">Click to select files or drag and drop</p>
                  <div className="inline-block px-8 py-3 bg-burgundy text-beige rounded-full hover:bg-dark-burgundy transition-colors">
                    Choose Files
                  </div>
                </label>
              </div>
              {uploads.length > 0 && (
                <div className="mt-6 p-6 bg-sage/20 rounded-lg">
                  <p className="text-center text-lg font-medium text-burgundy">
                    ✓ {uploads.length} file{uploads.length !== 1 ? 's' : ''} uploaded successfully!
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Comments Section */}
        {activeSection === 'comments' && (
          <section className="animate-fadeIn">
            <h2 className="text-4xl font-serif text-burgundy mb-8 text-center">Guest Messages</h2>
            
            {/* Comment Form */}
            <div className="max-w-2xl mx-auto mb-12 bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-semibold text-burgundy mb-6">Leave a Message</h3>
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    value={newComment.name}
                    onChange={(e) => setNewComment({...newComment, name: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-sage rounded-lg focus:outline-none focus:border-burgundy"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                  <textarea
                    value={newComment.message}
                    onChange={(e) => setNewComment({...newComment, message: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-sage rounded-lg focus:outline-none focus:border-burgundy h-32 resize-none"
                    placeholder="Share your wishes and memories..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-8 py-3 bg-burgundy text-beige rounded-full hover:bg-dark-burgundy transition-colors font-medium text-lg"
                >
                  Post Message
                </button>
              </form>
            </div>

            {/* Comments Display */}
            <div className="max-w-4xl mx-auto space-y-6">
              {comments.length === 0 ? (
                <div className="text-center py-12 bg-beige rounded-lg">
                  <p className="text-xl text-gray-600">No messages yet. Be the first to share your wishes!</p>
                </div>
              ) : (
                comments.map(comment => (
                  <div key={comment.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-sage">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-xl font-semibold text-burgundy">{comment.name}</h4>
                      <span className="text-sm text-gray-500">{comment.date}</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{comment.message}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-burgundy text-beige py-8 mt-16 text-center">
        <p className="text-lg">Thank you for celebrating with us! 💕</p>
        <p className="text-sm opacity-75 mt-2">With love and gratitude</p>
      </footer>
    </div>
  );
}
