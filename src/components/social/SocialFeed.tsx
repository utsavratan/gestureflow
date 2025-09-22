import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Trophy,
  Camera,
  Send,
  Loader2,
  Users,
  UserPlus,
  Medal,
  Target
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Post {
  id: string;
  user_id: string;
  content?: string;
  image_url?: string;
  post_type: string;
  achievement_data?: any;
  created_at: string;
  user_profiles: {
    display_name?: string;
    avatar_url?: string;
  };
  post_likes: any[];
  post_comments: any[];
  user_liked?: boolean;
}

interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  status: string;
  friend_profile: {
    display_name?: string;
    avatar_url?: string;
  };
}

const SocialFeed = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [searchUsername, setSearchUsername] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSocialData();
      subscribeToRealtime();
    }
  }, [user]);

  const fetchSocialData = async () => {
    try {
      // Fetch posts from friends
      const { data: postsData } = await supabase
        .from('posts')
        .select(`
          *,
          user_profiles(display_name, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      // Format posts data
      if (postsData) {
        const formattedPosts = postsData.map(post => ({
          ...post,
          user_profiles: post.user_profiles || { display_name: '', avatar_url: '' },
          post_likes: [],
          post_comments: [],
          user_liked: false
        }));
        setPosts(formattedPosts as Post[]);
      }

      // Fetch friends - simplified query for now
      const { data: friendsData } = await supabase
        .from('friendships')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'accepted');

      if (friendsData) {
        const formattedFriends = friendsData.map(friend => ({
          ...friend,
          friend_profile: { display_name: 'Friend', avatar_url: '' }
        }));
        setFriends(formattedFriends as Friend[]);
      }

    } catch (error) {
      console.error('Error fetching social data:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToRealtime = () => {
    const channel = supabase
      .channel('social-updates')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'posts'
      }, () => {
        fetchSocialData();
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'post_likes'
      }, () => {
        fetchSocialData();
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'post_comments'
      }, () => {
        fetchSocialData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const createPost = async () => {
    if (!newPost.trim() || !user) return;
    
    setIsPosting(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content: newPost,
          post_type: 'general'
        })
        .select(`
          *,
          user_profiles!posts_user_id_fkey(display_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      // Format the new post
      const formattedPost = {
        ...data,
        user_profiles: data.user_profiles || { display_name: user.email?.split('@')[0] || 'User', avatar_url: '' },
        post_likes: [],
        post_comments: [],
        user_liked: false
      };

      // Add to posts list at the beginning
      setPosts(prev => [formattedPost as Post, ...prev]);
      setNewPost('');

      toast({
        title: "Posted! 🎉",
        description: "Your post has been shared with friends.",
      });
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post.",
        variant: "destructive"
      });
    } finally {
      setIsPosting(false);
    }
  };

  const toggleLike = async (postId: string, currentlyLiked: boolean) => {
    if (!user) return;

    try {
      if (currentlyLiked) {
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('post_likes')
          .insert({
            post_id: postId,
            user_id: user.id
          });
      }
      
      fetchSocialData();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const searchUsers = async () => {
    if (!searchUsername.trim()) return;

    try {
      const { data } = await supabase
        .from('user_profiles')
        .select('user_id, display_name, avatar_url')
        .ilike('display_name', `%${searchUsername}%`)
        .neq('user_id', user?.id)
        .limit(5);

      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const sendFriendRequest = async (friendId: string, friendName: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('friendships')
        .insert({
          user_id: user.id,
          friend_id: friendId,
          status: 'pending'
        });

      if (error) throw error;

      // Create notification
      await supabase
        .from('notifications')
        .insert({
          user_id: friendId,
          type: 'friend_request',
          title: 'New Friend Request',
          message: `${user.user_metadata?.display_name || user.email} sent you a friend request`,
          data: { from_user_id: user.id }
        });

      toast({
        title: "Friend Request Sent",
        description: `Sent friend request to ${friendName}`,
      });
      
      setSearchResults([]);
      setSearchUsername('');
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast({
        title: "Error",
        description: "Failed to send friend request.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
          <p className="mt-2 text-muted-foreground">Loading social feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create Post */}
      <Card className="module-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Share your sign language learning journey..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="min-h-[80px]"
          />
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Camera className="w-4 h-4 mr-2" />
                Photo
              </Button>
              <Button variant="outline" size="sm">
                <Trophy className="w-4 h-4 mr-2" />
                Achievement
              </Button>
            </div>
            <Button 
              onClick={createPost}
              disabled={!newPost.trim() || isPosting}
              className="btn-hero"
            >
              {isPosting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Post
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Find Friends */}
      <Card className="module-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Find Friends
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search by username..."
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
            />
            <Button onClick={searchUsers} variant="outline">
              Search
            </Button>
          </div>
          
          {searchResults.length > 0 && (
            <div className="space-y-2">
              {searchResults.map((result) => (
                <div key={result.user_id} className="flex items-center justify-between p-2 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={result.avatar_url} />
                      <AvatarFallback>{result.display_name?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{result.display_name}</span>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => sendFriendRequest(result.user_id, result.display_name)}
                  >
                    <UserPlus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Friends List */}
      {friends.length > 0 && (
        <Card className="module-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Friends ({friends.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {friends.map((friend) => (
                <div key={friend.id} className="flex items-center gap-2 p-2 border rounded-lg">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={friend.friend_profile.avatar_url} />
                    <AvatarFallback>
                      {friend.friend_profile.display_name?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium truncate">
                    {friend.friend_profile.display_name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card className="module-card">
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground">
                Add friends to see their posts, or create your first post!
              </p>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="module-card">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={post.user_profiles.avatar_url} />
                    <AvatarFallback>
                      {post.user_profiles.display_name?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{post.user_profiles.display_name}</h4>
                      {post.post_type === 'achievement' && (
                        <Badge variant="outline" className="bg-warning text-warning-foreground">
                          <Medal className="w-3 h-3 mr-1" />
                          Achievement
                        </Badge>
                      )}
                      {post.post_type === 'practice' && (
                        <Badge variant="outline" className="bg-success text-success-foreground">
                          <Target className="w-3 h-3 mr-1" />
                          Practice
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>{post.content}</p>
                
                {post.image_url && (
                  <img 
                    src={post.image_url} 
                    alt="Post image"
                    className="w-full rounded-lg max-h-96 object-cover"
                  />
                )}
                
                {post.achievement_data && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-warning" />
                      <span className="font-semibold">{post.achievement_data.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {post.achievement_data.description}
                    </p>
                  </div>
                )}
                
                <div className="flex items-center gap-4 pt-2 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleLike(post.id, post.user_liked)}
                    className={post.user_liked ? 'text-red-500' : ''}
                  >
                    <Heart className={`w-4 h-4 mr-1 ${post.user_liked ? 'fill-current' : ''}`} />
                    {post.post_likes[0]?.count || 0}
                  </Button>
                  
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    {post.post_comments[0]?.count || 0}
                  </Button>
                  
                  <Button variant="ghost" size="sm">
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default SocialFeed;