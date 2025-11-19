import * as postService from '../services/post.service.js';

export const createPost = async (req, res) => {
  try {
    await postService.createPost(req.body);

    return res.status(201).json({
      message: 'Created post sucessfully',
    });
  } catch (err) {
    console.error('Error creating post:', err);

    return res.status(500).json({
      message: 'Server could not create post because database connection',
    });
  }
};

export const getAllPosts = async (req, res) => {
    try {
      const { page, limit, category, keyword } = req.query;
  
      const data = await postService.getAllPosts({
        page,
        limit,
        category,
        keyword,
      });
  
      return res.status(200).json(data);
    } catch (error) {
      console.error("Error reading posts:", error);
  
      return res.status(500).json({
        message: "Server could not read post because database connection",
      });
    }
  };

export const getPostById = async (req, res) => {
    try {
      const { postId } = req.params;
  
      const post = await postService.getPostById(postId);
  
      if (!post) {
        return res.status(404).json({
          message: "Server could not find a requested post",
        });
      }
  
      return res.status(200).json(post);
    } catch (error) {
      console.error("Error reading post:", error);
  
      return res.status(500).json({
        message: "Server could not read post because database connection",
      });
    }
  };