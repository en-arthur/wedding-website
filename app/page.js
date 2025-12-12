'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Heart, Calendar, Camera, MessageCircle, Upload, Download, Clock } from 'lucide-react';

export default function Home() {
  const [uploads, setUploads] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ name: '', message: '' });
  const [activeSection, setActiveSection] = useState('program');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const program = [
    { time: '2:00 PM', event: 'Guest Arrival & Welcome', description: 'Join us as we gather to celebrate' },
    { time: '3:00 PM', event: 'Ceremony Begins', description: 'The exchange of vows' },
    { time: '4:00 PM', event: 'Cocktail Hour', description: 'Drinks and light refreshments' },
    { time: '5:30 PM', event: 'Reception & Dinner', description: 'Celebrate with food and music' },
    { time: '7:00 PM', event: 'First Dance', description: 'Our first dance as newlyweds' },
    { time: '7:30 PM', event: 'Dancing & Celebration', description: 'Party the night away' },
  ];

  // Load comments and uploads on mount
  useEffect(() => {
    fetchComments();
    fetchUploads();
  }, []);

  const fetchComments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching comments:', error);
    } else {
      setComments(data || []);
    }
    setLoading(false);
  };

  const fetchUploads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('uploads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching uploads:', error);
    } else {
      const uploadsWithUrls = data?.map(upload => ({
        ...upload,
        url: supabase.storage.from('wedding-media').getPublicUrl(upload.file_path).data.publicUrl,
        type: upload.file_type.startsWith('video') ? 'video' : 'image'
      })) || [];
      setUploads(uploadsWithUrls);
    }
    setLoading(false);
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);

    for (const file of files) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload file to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('wedding-media')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Save metadata to database
        const { error: dbError } = await supabase
          .from('uploads')
          .insert([
            {
              name: file.name,
              file_path: filePath,
              file_type: file.type
            }
          ]);

        if (dbError) throw dbError;
      } catch (error) {
        console.error('Error uploading file:', error);
        alert(`Failed to upload ${file.name}. Please try again.`);
      }
    }

    setUploading(false);
    fetchUploads(); // Refresh the gallery
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.name || !newComment.message) return;

    setLoading(true);

    const { error } = await supabase
      .from('comments')
      .insert([
        {
          name: newComment.name,
          message: newComment.message
        }
      ]);

    if (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment. Please try again.');
    } else {
      setNewComment({ name: '', message: '' });
      fetchComments(); // Refresh comments
    }

    setLoading(false);
  };

  const handleDownload = async (upload) => {
    try {
      const { data, error } = await supabase.storage
        .from('wedding-media')
        .download(upload.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = upload.name;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  const sectionIcons = {
    program: Calendar,
    gallery: Camera,
    upload: Upload,
    comments: MessageCircle
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-beige/30 to-sage/10">
      {/* Hero Header */}
      <header className="relative bg-gradient-to-r from-burgundy via-dark-burgundy to-burgundy text-beige py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <Heart className="w-16 h-16 text-beige/80 animate-pulse" />
          </div>
          <h1 className="text-6xl md:text-7xl font-serif mb-4 tracking-wide">
            Our Wedding Celebration
          </h1>
          <p className="text-xl md:text-2xl opacity-90 font-light">
            Join us in celebrating our special day
          </p>
          <div className="mt-8 flex justify-center">
            <Badge variant="secondary" className="text-lg px-6 py-2">
              <Heart className="w-4 h-4 mr-2" />
              Together Forever
            </Badge>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-sage via-beige to-sage"></div>
      </header>

      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-lg border-b border-sage/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-center gap-2 md:gap-4 flex-wrap">
            {['program', 'gallery', 'upload', 'comments'].map(section => {
              const Icon = sectionIcons[section];
              return (
                <Button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  variant={activeSection === section ? "default" : "outline"}
                  size="lg"
                  className="flex items-center gap-2 font-medium"
                >
                  <Icon className="w-4 h-4" />
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </Button>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Program Section */}
        {activeSection === 'program' && (
          <section className="animate-fadeIn">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-serif text-burgundy mb-4">Event Schedule</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                A timeline of our special day filled with love, joy, and celebration
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {program.map((item, index) => (
                <Card key={index} className="group hover:scale-105 transition-all duration-300 border-sage/20">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.time}
                      </Badge>
                      <div className="w-8 h-8 rounded-full bg-sage/20 flex items-center justify-center">
                        <Heart className="w-4 h-4 text-burgundy" />
                      </div>
                    </div>
                    <CardTitle className="text-xl group-hover:text-dark-burgundy transition-colors">
                      {item.event}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Gallery Section */}
        {activeSection === 'gallery' && (
          <section className="animate-fadeIn">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-serif text-burgundy mb-4">Photo & Video Gallery</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Capturing precious moments and memories from our celebration
              </p>
            </div>
            {uploads.length === 0 ? (
              <Card className="max-w-2xl mx-auto text-center py-16 border-dashed border-2 border-sage/50">
                <CardContent className="pt-6">
                  <Camera className="w-16 h-16 text-sage mx-auto mb-6" />
                  <CardTitle className="mb-4">No memories shared yet</CardTitle>
                  <CardDescription className="text-lg mb-6">
                    Be the first to share your beautiful photos and videos from our special day!
                  </CardDescription>
                  <Button 
                    onClick={() => setActiveSection('upload')}
                    size="lg"
                    className="gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Now
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="gallery-grid">
                {uploads.map(upload => (
                  <Card key={upload.id} className="group overflow-hidden hover:scale-105 transition-all duration-300">
                    <div className="relative overflow-hidden">
                      {upload.type === 'image' ? (
                        <img 
                          src={upload.url} 
                          alt={upload.name} 
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300" 
                        />
                      ) : (
                        <video 
                          src={upload.url} 
                          controls 
                          className="w-full h-64 object-cover bg-black" 
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <CardContent className="p-4 bg-gradient-to-r from-beige/50 to-sage/20">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700 truncate flex-1 font-medium">
                          {upload.name}
                        </span>
                        <Button
                          onClick={() => handleDownload(upload)}
                          variant="outline"
                          size="sm"
                          className="ml-2 gap-1"
                        >
                          <Download className="w-3 h-3" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Upload Section */}
        {activeSection === 'upload' && (
          <section className="animate-fadeIn">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-serif text-burgundy mb-4">Share Your Memories</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Help us preserve the magic by sharing your photos and videos from our celebration
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="upload-area bg-gradient-to-br from-beige/50 to-sage/20 p-12 text-center border-2 border-dashed border-sage/50 hover:border-burgundy/50 transition-all duration-300">
                    <input
                      type="file"
                      id="fileUpload"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    <label htmlFor="fileUpload" className={uploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}>
                      <div className="mb-6">
                        {uploading ? (
                          <div className="w-20 h-20 mx-auto bg-burgundy/10 rounded-full flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy"></div>
                          </div>
                        ) : (
                          <div className="w-20 h-20 mx-auto bg-burgundy/10 rounded-full flex items-center justify-center hover:bg-burgundy/20 transition-colors">
                            <Camera className="w-10 h-10 text-burgundy" />
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-2xl mb-2">
                        {uploading ? 'Uploading Your Memories...' : 'Upload Photos & Videos'}
                      </CardTitle>
                      <CardDescription className="text-base mb-6">
                        {uploading ? 'Please wait while we securely upload your files' : 'Click to select files or drag and drop them here'}
                      </CardDescription>
                      {!uploading && (
                        <Button size="lg" className="gap-2">
                          <Upload className="w-4 h-4" />
                          Choose Files
                        </Button>
                      )}
                    </label>
                  </div>
                </CardContent>
              </Card>
              {uploads.length > 0 && !uploading && (
                <Card className="mt-6 border-sage/30">
                  <CardContent className="p-6 text-center bg-gradient-to-r from-sage/10 to-burgundy/10">
                    <div className="flex items-center justify-center gap-2 text-lg font-medium text-burgundy">
                      <Heart className="w-5 h-5" />
                      <span>{uploads.length} precious memor{uploads.length !== 1 ? 'ies' : 'y'} in gallery</span>
                      <Heart className="w-5 h-5" />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>
        )}

        {/* Comments Section */}
        {activeSection === 'comments' && (
          <section className="animate-fadeIn">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-serif text-burgundy mb-4">Guest Messages</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Share your love, wishes, and memories with us
              </p>
            </div>
            
            {/* Comment Form */}
            <Card className="max-w-2xl mx-auto mb-12 border-sage/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-6 h-6" />
                  Leave a Message
                </CardTitle>
                <CardDescription>
                  Your words mean the world to us. Share your thoughts and wishes for our journey together.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCommentSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Your Name</label>
                    <Input
                      type="text"
                      value={newComment.name}
                      onChange={(e) => setNewComment({...newComment, name: e.target.value})}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Your Message</label>
                    <Textarea
                      value={newComment.message}
                      onChange={(e) => setNewComment({...newComment, message: e.target.value})}
                      placeholder="Share your wishes, memories, or advice for our journey together..."
                      className="min-h-[120px]"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="w-full gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-beige"></div>
                        Posting...
                      </>
                    ) : (
                      <>
                        <Heart className="w-4 h-4" />
                        Post Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Comments Display */}
            <div className="max-w-4xl mx-auto space-y-6">
              {comments.length === 0 ? (
                <Card className="text-center py-12 border-dashed border-2 border-sage/50">
                  <CardContent className="pt-6">
                    <MessageCircle className="w-16 h-16 text-sage mx-auto mb-4" />
                    <CardTitle className="mb-2">No messages yet</CardTitle>
                    <CardDescription className="text-lg">
                      Be the first to share your wishes and make our day even more special!
                    </CardDescription>
                  </CardContent>
                </Card>
              ) : (
                comments.map(comment => (
                  <Card key={comment.id} className="group hover:shadow-lg transition-all duration-300 border-l-4 border-sage">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-burgundy to-sage flex items-center justify-center">
                            <Heart className="w-5 h-5 text-white" />
                          </div>
                          <CardTitle className="text-lg">{comment.name}</CardTitle>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed text-base">{comment.message}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-burgundy via-dark-burgundy to-burgundy text-beige py-12 mt-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2">
              <Heart className="w-8 h-8 text-beige animate-pulse" />
              <Heart className="w-6 h-6 text-beige/80" />
              <Heart className="w-4 h-4 text-beige/60" />
            </div>
          </div>
          <h3 className="text-2xl font-serif mb-4">Thank you for celebrating with us!</h3>
          <p className="text-lg opacity-90 mb-2">Your presence and love make our day complete</p>
          <p className="text-sm opacity-75 font-light">With endless love and gratitude</p>
          <div className="mt-8 pt-6 border-t border-beige/20">
            <p className="text-xs opacity-60">
              Made with ❤️ for our special day
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
